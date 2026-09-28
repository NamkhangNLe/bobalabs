/**
 * Boba Labs cover-letter .tex generator — form data -> real LaTeX source.
 *
 * Matches the resume's visual identity (centered name + contact header) and
 * compiles with the same real pdfTeX engine via \input{preamble}.
 * Like the resume, the form data rides in a comment on the first line so a
 * downloaded .tex can be re-uploaded to keep editing.
 */
import { escapeLatex } from '../resume/latexGen';

export const COVER_DATA_MARKER = '% bobalabs-cover-v1:';

/**
 * Extract embedded form data from a cover-letter .tex we generated.
 * Returns { data } or null when the marker is missing/invalid.
 */
export function extractCoverData(texText) {
    if (!texText) return null;
    const line = String(texText).split('\n').find((l) => l.startsWith(COVER_DATA_MARKER));
    if (!line) return null;
    try {
        const parsed = JSON.parse(line.slice(COVER_DATA_MARKER.length));
        if (!parsed || typeof parsed !== 'object' || !parsed.data) return null;
        return parsed;
    } catch {
        return null;
    }
}

const nonEmpty = (s) => s != null && String(s).trim() !== '';

const hrefFor = (url) => {
    const u = String(url).trim();
    if (!u) return '';
    const full = /^https?:\/\//i.test(u) ? u : `https://${u}`;
    return `\\href{${full}}{${escapeLatex(u.replace(/^https?:\/\//i, ''))}}`;
};

function headerBlock(personal) {
    const p = personal || {};
    const lines = [];
    lines.push('\\begin{center}');
    lines.push(`    \\textbf{\\LARGE ${escapeLatex(p.name)}} \\\\`);
    const contact = [p.email, p.phone, p.location]
        .filter(nonEmpty)
        .map(escapeLatex)
        .join(' $|$ ');
    if (contact) lines.push(`    ${contact} \\\\`);
    const links = [p.website, p.linkedin]
        .filter(nonEmpty)
        .map(hrefFor)
        .join(' $|$ ');
    if (links) lines.push(`    ${links}`);
    lines.push('\\end{center}');
    return lines.join('\n');
}

export function coverToLatex(c) {
    const d = c || {};
    const paras = (d.paragraphs || []).filter(nonEmpty);
    const recipient = [d.recipientName, d.recipientTitle, d.company, d.address]
        .filter(nonEmpty)
        .map(escapeLatex);

    const parts = [
        `${COVER_DATA_MARKER}${JSON.stringify({ data: d })}`,
        '\\documentclass{article}',
        '',
        '\\input{preamble}',
        '',
        '\\begin{document}',
        '',
        '\\thispagestyle{empty}',
        '',
        headerBlock(d.personal),
        '',
        '\\vspace{12pt}',
        '',
        escapeLatex(d.date),
        '',
        ...recipient,
        '',
        escapeLatex(d.greeting),
        '',
        ...paras.flatMap((p) => [escapeLatex(p), '']),
        escapeLatex(d.closing),
        '',
        escapeLatex((d.personal || {}).name),
        '',
        '\\end{document}',
        '',
    ];
    return parts.join('\n');
}

/** Blank cover-letter form state. Personal details default empty (user fills). */
export function blankCover(personal = {}) {
    return {
        personal: {
            name: personal.name || '',
            email: personal.email || '',
            phone: personal.phone || '',
            location: personal.location || '',
            website: personal.website || '',
            linkedin: personal.linkedin || '',
        },
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        recipientName: '',
        recipientTitle: '',
        company: '',
        address: '',
        greeting: 'Dear Hiring Manager,',
        paragraphs: ['', '', ''],
        closing: 'Sincerely,',
    };
}

/** Normalize imported/loaded data so the editor never sees a ragged shape. */
export function normalizeCoverData(d) {
    const base = blankCover();
    if (!d || typeof d !== 'object') return base;
    return {
        ...base,
        ...d,
        personal: { ...base.personal, ...(d.personal || {}) },
        paragraphs: Array.isArray(d.paragraphs) && d.paragraphs.length
            ? d.paragraphs.map(String)
            : [''],
    };
}
