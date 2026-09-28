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
import preambleTex from '../resume/preamble.tex?raw';

/** Count pages in a compiled PDF by scanning for page objects. */
export function countPdfPages(bytes) {
    try {
        const text = new TextDecoder('latin1').decode(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
        const matches = text.match(/\/Type\s*\/Page[^s]/g);
        return matches ? matches.length : null;
    } catch {
        return null;
    }
}

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
    const { debounceMs = 900 } = options;
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
            await engine.setTexliveEndpoint(`${ENGINE_DIR}texlive/`);
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
            const tex = resumeToLatex(resumeData, sectionOrder);
            // Encode explicitly: the engine's FS.writeFile takes bytes, and the
            // proven node harness wrote these files as UTF-8 byte arrays.
            const enc = new TextEncoder();
            await engine.writeMemFSFile('resume.tex', enc.encode(tex));
            await engine.writeMemFSFile('preamble.tex', enc.encode(preambleTex));
            await engine.setEngineMainFile('resume.tex');
            const { pdf } = await engine.compileLaTeX();
            if (seq !== compileSeq.current) return; // superseded
            const bytes = new Uint8Array(pdf);
            const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
            if (urlRef.current) URL.revokeObjectURL(urlRef.current);
            urlRef.current = url;
            bytesRef.current = bytes;
            setPdfUrl(url);
            setPageCount(countPdfPages(bytes));
            setStatus('ready');
        } catch (e) {
            if (seq !== compileSeq.current) return;
            setError(firstLatexError(e.message));
            setStatus('error');
        }
    }, [boot, resumeData, sectionOrder]);

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
