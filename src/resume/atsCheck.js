/**
 * ATS / resume-score checker — honest, verifiable signals only.
 *
 * Runs against the actual compiled PDF bytes (the same bytes the user
 * downloads): extracts real text with pdf.js and checks what applicant
 * tracking parsers actually care about. Never sends content anywhere.
 */

let workerReady = false;

async function loadPdfJs() {
    const pdfjs = await import('pdfjs-dist');
    if (!workerReady) {
        const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        workerReady = true;
    }
    return pdfjs;
}

/** Extract plain text per page from compiled PDF bytes. */
export async function extractPdfText(bytes) {
    const pdfjs = await loadPdfJs();
    const doc = await pdfjs.getDocument({ data: bytes }).promise;
    const pages = [];
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        pages.push(content.items.map((it) => it.str).join(' '));
    }
    await doc.destroy();
    return pages;
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
        push('pages', 'One page', 'warn', 'Compile the resume first to verify the page count.');
    } else {
        push('pages', 'One page', 'fail', `The compiled PDF is ${pageCount} pages — most parsers and recruiters prefer one.`);
    }

    // 2. Text extraction — the make-or-break ATS signal.
    let text = '';
    try {
        const pages = await extractPdfText(bytes);
        text = pages.join('\n');
    } catch {
        push('extractable', 'Text is extractable', 'fail', 'Could not read any text from the PDF.');
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
