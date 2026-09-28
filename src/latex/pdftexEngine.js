/**
 * PdfTeXEngine — thin promise wrapper around the SwiftLaTeX pdfTeX worker.
 *
 * Adapted from SwiftLaTeX's PdfTeXEngine.js for Vite bundling:
 *  - worker + wasm + format + vendored TeX tree live under
 *    `${BASE_URL}latex-engine/` (same origin, no CORS issues)
 *  - texlive endpoint points at our own static tree, not swiftlatex.com
 *
 * The worker speaks the same message protocol as upstream:
 *   {cmd:'settexliveurl'|'setmainfile'|'writefile'|'mkdir'|'compileformat'|'compilelatex'|'flushcache'}
 * and answers with {cmd, result, status, log, pdf}.
 */

const BASE = import.meta.env.BASE_URL || '/';
const ENGINE_DIR = `${BASE}latex-engine/`;

export class PdfTeXEngine {
    constructor() {
        this.worker = null;
        this.loaded = false;
        this._pending = new Map();
        this._seq = 0;
    }

    async loadEngine() {
        if (this.loaded) return;
        if (this._loading) return this._loading;
        this._loading = new Promise((resolve, reject) => {
            const worker = new Worker(`${ENGINE_DIR}swiftlatexpdftex.worker.js`);
            this.worker = worker;
            const timeout = setTimeout(() => reject(new Error('LaTeX engine load timed out')), 120000);
            worker.onmessage = (ev) => {
                const data = ev.data;
                if (data.result === 'ok' && !data.cmd) {
                    // engine boot signal (Module postRun)
                    clearTimeout(timeout);
                    this.loaded = true;
                    resolve();
                    return;
                }
                const pending = data.cmd && this._pending.get(data.cmd);
                if (pending) {
                    this._pending.delete(data.cmd);
                    if (data.result === 'ok') pending.resolve(data);
                    else pending.reject(new Error(data.log || `engine command failed: ${data.cmd}`));
                }
            };
            worker.onerror = (e) => {
                clearTimeout(timeout);
                reject(new Error(`LaTeX worker error: ${e.message || e}`));
            };
        });
        return this._loading;
    }

    _send(cmd, payload = {}) {
        return new Promise((resolve, reject) => {
            if (!this.worker) return reject(new Error('engine not loaded'));
            this._pending.set(payload.expectCmd || cmd, { resolve, reject });
            this.worker.postMessage({ cmd, ...payload });
            setTimeout(() => {
                if (this._pending.has(payload.expectCmd || cmd)) {
                    this._pending.delete(payload.expectCmd || cmd);
                    reject(new Error(`engine command timed out: ${cmd}`));
                }
            }, payload.timeoutMs || 300000);
        });
    }

    async setTexliveEndpoint(url) {
        await this.loadEngine();
        this.worker.postMessage({ cmd: 'settexliveurl', url });
    }

    async writeMemFSFile(path, content) {
        await this.loadEngine();
        return this._send('writefile', { url: path, src: content, expectCmd: 'writefile', timeoutMs: 60000 });
    }

    async setEngineMainFile(path) {
        await this.loadEngine();
        this.worker.postMessage({ cmd: 'setmainfile', url: path });
    }

    async compileLaTeX() {
        await this.loadEngine();
        const data = await this._send('compilelatex', { expectCmd: 'compile', timeoutMs: 300000 });
        return { pdf: data.pdf, log: data.log, status: data.status };
    }

    async flushCache() {
        await this.loadEngine();
        this.worker.postMessage({ cmd: 'flushcache' });
    }
}

/** Module singleton — one engine per page load. */
let _engine = null;
export function getPdfTeXEngine() {
    if (!_engine) _engine = new PdfTeXEngine();
    return _engine;
}

export { ENGINE_DIR };
