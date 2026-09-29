/**
 * ATS / resume-score checker — honest, verifiable signals only.
 *
 * Runs against the actual compiled PDF bytes (the same bytes the user
 * downloads): extracts real text with pdf.js and checks what applicant
 * tracking parsers actually care about. Never sends content anywhere.
 */

import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

let workerReady = false;

/** Last pdf.js failure, surfaced in ATS details so a broken setup is diagnosable. */
let lastPdfError = null;
export function getLastPdfError() {
    return lastPdfError;
}

/**
 * Copy bytes for pdf.js. getDocument() transfers (detaches) the input
 * buffer to its worker via postMessage — handing over the caller's bytes
 * would neuter them, so every call gets its own copy.
 */
function copyForPdfJs(bytes) {
    if (bytes instanceof Uint8Array) return bytes.slice();
    if (bytes instanceof ArrayBuffer) return new Uint8Array(bytes.slice(0));
    return new Uint8Array(bytes);
}

export async function loadPdfJs() {
    const pdfjs = await import('pdfjs-dist');
    if (!workerReady) {
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        workerReady = true;
    }
    return pdfjs;
}

/**
 * Count pages in compiled PDF bytes. pdf.js first — it understands object
 * streams and compressed xref tables, which a raw text scan can't see
 * (pdfTeX packs page objects into /ObjStm, so the old /Type /Page regex
 * found nothing and the count came back null). Regex fallback for
 * plain-structure PDFs, null when nothing works.
 */
export async function countPdfPages(bytes) {
    try {
        const pdfjs = await loadPdfJs();
        // pdf.js v6 removed PDFDocumentProxy.destroy() — teardown belongs to
        // the loading task, so keep a reference to it.
        const loadingTask = pdfjs.getDocument({ data: copyForPdfJs(bytes) });
        try {
            const doc = await loadingTask.promise;
            const n = doc.numPages;
            if (Number.isInteger(n) && n > 0) return n;
        } finally {
            await loadingTask.destroy();
        }
    } catch (e) {
        lastPdfError = e;
        /* fall through to the text scan */
    }
    try {
        const text = new TextDecoder('latin1').decode(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
        const matches = text.match(/\/Type\s*\/Page[^s]/g);
        return matches ? matches.length : null;
    } catch {
        return null;
    }
}

/** Extract plain text per page from compiled PDF bytes. */
export async function extractPdfText(bytes) {
    const pdfjs = await loadPdfJs();
    // See countPdfPages: teardown belongs to the loading task in pdf.js v6.
    const loadingTask = pdfjs.getDocument({ data: copyForPdfJs(bytes) });
    try {
        const doc = await loadingTask.promise;
        const pages = [];
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            pages.push(content.items.map((it) => it.str).join(' '));
        }
        return pages;
    } finally {
        await loadingTask.destroy();
    }
}

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
const PHONE_RE = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

/**
 * Run the checks. Returns { score (0-100), checks: [{ id, label, status, detail }] }
 * where status is 'pass' | 'warn' | 'fail'.
 */
export async function runAtsChecks(bytes, pageCount) {
    const checks = [];
    const push = (id, label, status, detail) => checks.push({ id, label, status, detail });

    // 1. Page count — from the real compiled PDF, not the form.
    if (pageCount === 1) {
        push('pages', 'One page', 'pass', 'The compiled PDF is exactly one page.');
    } else if (pageCount == null) {
        const err = getLastPdfError();
        push('pages', 'One page', 'warn',
            err ? `Page count unavailable (${err.message || String(err)}).`
                : 'Compile the resume first to verify the page count.');
    } else {
        push('pages', 'One page', 'fail', `The compiled PDF is ${pageCount} pages — most parsers and recruiters prefer one.`);
    }

    // 2. Text extraction — the make-or-break ATS signal.
    let text = '';
    try {
        const pages = await extractPdfText(bytes);
        text = pages.join('\n');
    } catch (e) {
        push('extractable', 'Text is extractable', 'fail',
            `Could not read any text from the PDF. (${e?.message || String(e)})`);
        return finalize(checks);
    }
    const words = text.split(/\s+/).filter(Boolean);

    if (words.length >= 250) {
        push('extractable', 'Text is extractable', 'pass', `${words.length} words extracted — parsers can read this resume.`);
    } else if (words.length >= 50) {
        push('extractable', 'Text is extractable', 'warn', `Only ${words.length} words extracted — check for missing sections.`);
    } else {
        push('extractable', 'Text is extractable', 'fail', 'Almost no text extracted — to a parser this looks like a scanned image.');
    }

    // 3. Contact info.
    push('email', 'Email present', EMAIL_RE.test(text) ? 'pass' : 'fail',
        EMAIL_RE.test(text) ? 'An email address was found.' : 'No email address found in the PDF text.');
    push('phone', 'Phone present', PHONE_RE.test(text) ? 'pass' : 'warn',
        PHONE_RE.test(text) ? 'A phone number was found.' : 'No phone number found — most applications expect one.');

    // 4. Standard section headers parsers look for.
    push('experience', 'Experience section', /experience|work history|employment/i.test(text) ? 'pass' : 'warn',
        'Parsers look for an explicit Experience header.');
    push('education', 'Education section', /education/i.test(text) ? 'pass' : 'warn',
        'Parsers look for an explicit Education header.');
    push('skills', 'Skills section', /skills|technologies/i.test(text) ? 'pass' : 'warn',
        'Parsers look for a Skills header to match keywords.');

    // 5. Profile links (nice-to-have, not required).
    push('links', 'Profile links', /linkedin|github/i.test(text) ? 'pass' : 'warn',
        'LinkedIn/GitHub links help a human reviewer; parsers mostly ignore them.');

    // 6. Length sanity.
    if (words.length >= 300 && words.length <= 900) {
        push('length', 'Reasonable length', 'pass', `${words.length} words — a solid one-page density.`);
    } else if (words.length > 0) {
        push('length', 'Reasonable length', 'warn',
            words.length < 300
                ? `${words.length} words is light for a full resume — consider adding substance.`
                : `${words.length} words is dense for one page — check readability.`);
    }

    return finalize(checks);
}

function finalize(checks) {
    const value = { pass: 1, warn: 0.5, fail: 0 };
    const score = checks.length
        ? Math.round((100 * checks.reduce((s, c) => s + (value[c.status] ?? 0), 0)) / checks.length)
        : 0;
    return { score, checks };
}
