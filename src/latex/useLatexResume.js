/**
 * useLatexResume — drive the real pdfTeX engine from resume form data.
 *
 * Lifecycle:
 *   mount -> load engine + format -> compile -> show PDF
 *   data/order change -> debounce -> regenerate .tex -> recompile
 * While recompiling the last good PDF stays on screen. On error the last
 * good PDF stays and the error (with the LaTeX log excerpt) is exposed.
 * The bytes used for preview are exactly the bytes handed to download.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { getPdfTeXEngine, ENGINE_DIR } from './pdftexEngine';
import { resumeToLatex } from '../resume/latexGen';
import { countPdfPages } from '../resume/atsCheck';
import { trackEvent } from '../analytics';
import preambleTex from '../resume/preamble.tex?raw';

/** Reject if the promise doesn't settle within ms — a hung engine shouldn't hang the UI. */
const withTimeout = (promise, ms, message) =>
    Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
    ]);

const COMPILE_TIMEOUT_MS = 60000;

/** Pull the first LaTeX error line out of a compile log. */
export function firstLatexError(log) {
    if (!log) return 'Compilation failed.';
    const lines = String(log).split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('! ')) {
            return [lines[i], lines[i + 1] || ''].join('\n').trim();
        }
    }
    return 'Compilation failed.';
}

export function useLatexResume(resumeData, sectionOrder, options = {}) {
    const {
        debounceMs = 900,
        // Document type overrides: cover letters pass their own generator
        // and main file. Defaults compile the resume.
        toLatex = resumeToLatex,
        mainFile = 'resume.tex',
        // Analytics event fired on each successful compile (null = silent).
        compiledEvent = null,
    } = options;
    const [status, setStatus] = useState('loading'); // loading | ready | compiling | error
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pageCount, setPageCount] = useState(null);
    const [error, setError] = useState(null);

    const bytesRef = useRef(null);       // last good compiled bytes (download source)
    const urlRef = useRef(null);         // object URL for bytesRef
    const compileSeq = useRef(0);
    const engineReady = useRef(null);

    // Boot the engine once: worker + endpoint + format file.
    const boot = useCallback(() => {
        if (engineReady.current) return engineReady.current;
        engineReady.current = (async () => {
            const engine = getPdfTeXEngine();
            await engine.loadEngine();
            // The worker fetches TeX files with sync XHR, where relative URLs
            // resolve against the *worker script's* location, not the page.
            // Anchor the endpoint to the worker script directory as an absolute
            // URL — a relative endpoint silently 404s every fetch and the
            // compile fails with no usable error.
            const workerUrl = new URL(`${ENGINE_DIR}swiftlatexpdftex.worker.js`, document.baseURI).href;
            await engine.setTexliveEndpoint(new URL('texlive/', workerUrl).href);
            const res = await fetch(`${ENGINE_DIR}pdflatex.fmt`);
            if (!res.ok) throw new Error('Could not load the LaTeX format file.');
            const fmt = new Uint8Array(await res.arrayBuffer());
            await engine.writeMemFSFile('pdflatex.fmt', fmt);
            return engine;
        })();
        return engineReady.current;
    }, []);

    const compile = useCallback(async () => {
        const seq = ++compileSeq.current;
        setStatus((s) => (s === 'ready' || s === 'error' ? 'compiling' : s));
        setError(null);
        try {
            const engine = await boot();
            if (seq !== compileSeq.current) return; // superseded
            const tex = toLatex(resumeData, sectionOrder);
            // Encode explicitly: the engine's FS.writeFile takes bytes, and the
            // proven node harness wrote these files as UTF-8 byte arrays.
            const enc = new TextEncoder();
            await engine.writeMemFSFile(mainFile, enc.encode(tex));
            await engine.writeMemFSFile('preamble.tex', enc.encode(preambleTex));
            await engine.setEngineMainFile(mainFile);
            const { pdf } = await withTimeout(
                engine.compileLaTeX(),
                COMPILE_TIMEOUT_MS,
                'Compilation timed out — try again.'
            );
            if (seq !== compileSeq.current) return; // superseded
            const bytes = new Uint8Array(pdf);
            const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
            if (urlRef.current) URL.revokeObjectURL(urlRef.current);
            urlRef.current = url;
            bytesRef.current = bytes;
            const pages = await countPdfPages(bytes);
            setPdfUrl(url);
            setPageCount(pages);
            setStatus('ready');
            // Analytics: what compiled and how many pages — never content.
            if (compiledEvent) trackEvent(compiledEvent, { pages });
        } catch (e) {
            if (seq !== compileSeq.current) return;
            setError(firstLatexError(e.message));
            setStatus('error');
        }
    }, [boot, resumeData, sectionOrder, toLatex, mainFile, compiledEvent]);

    // Initial compile after boot.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                await boot();
                if (!cancelled) compile();
            } catch (e) {
                if (!cancelled) {
                    setError(e.message || String(e));
                    setStatus('error');
                }
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Debounced recompile on edits (skips the very first run — the boot
    // effect above already compiles once the engine is ready).
    const firstRun = useRef(true);
    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        const t = setTimeout(compile, debounceMs);
        return () => clearTimeout(t);
    }, [compile, debounceMs]);

    // Revoke the object URL on unmount.
    useEffect(() => () => {
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    }, []);

    const downloadPdf = useCallback((filename = 'resume.pdf') => {
        if (!bytesRef.current) return false;
        const blob = new Blob([bytesRef.current], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        return true;
    }, []);

    const getPdfBytes = useCallback(() => bytesRef.current, []);

    return {
        status,          // loading | ready | compiling | error
        pdfUrl,          // object URL of last good compile (null until first success)
        pdfBytes: bytesRef.current,
        pageCount,       // real page count of the compiled PDF
        error,           // error message / log excerpt
        errorDetail: error,
        downloadPdf,
        getPdfBytes,
        recompile: compile,
    };
}
