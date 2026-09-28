/**
 * Boba Labs .tex generator — data model -> real LaTeX source.
 *
 * Generates resume.tex from the structured form data, parameterized on
 * Namkhang's own working resume template (preamble.tex ships separately).
 * The output is compiled by the real pdfTeX engine (SwiftLaTeX WASM), so the
 * preview and the download are byte-identical genuine LaTeX output.
 */

// ---------------------------------------------------------------------------
// LaTeX escaping (single pass — order-safe)
// ---------------------------------------------------------------------------

const ESCAPES = {
    '\\': '\\textbackslash{}',
    '&': '\\&',
    '%': '\\%',
    '$': '\\$',
    '#': '\\#',
    '_': '\\_',
    '{': '\\{',
    '}': '\\}',
    '~': '\\textasciitilde{}',
    '^': '\\textasciicircum{}'
};

/** Escape user text for LaTeX. URLs must NOT go through this. */
export const escapeLatex = (s) =>
    (s == null ? '' : String(s)).replace(/[\\&%$#_{}~^]/g, (ch) => ESCAPES[ch]);

// ---------------------------------------------------------------------------
// Round-trip marker
// ---------------------------------------------------------------------------

/**
 * Generated .tex files carry the form data as a JSON blob in a LaTeX comment
 * on the first line. Re-uploading reads this comment back, so we never have
 * to parse LaTeX itself (and never compile untrusted .tex).
 */
export const TEX_DATA_MARKER = '% bobalabs-data-v1:';

/**
 * Extract embedded Boba Labs form data from a .tex file we generated.
 * Returns { data, sectionOrder } or null when the marker is missing/invalid.
 */
export function extractBobalabsData(texText) {
    if (!texText) return null;
    const line = String(texText).split('\n').find((l) => l.startsWith(TEX_DATA_MARKER));
    if (!line) return null;
    try {
        const parsed = JSON.parse(line.slice(TEX_DATA_MARKER.length));
        if (!parsed || typeof parsed !== 'object' || !parsed.data || !Array.isArray(parsed.sectionOrder)) return null;
        return parsed;
    } catch {
        return null;
    }
}

/** "May 2024 - August 2024" -> "May 2024 -- August 2024" (proper en-dash). */
export const texDate = (s) => escapeLatex(s).replace(/ - /g, ' -- ');

/** Strip scheme for display, keep full https URL for the \href target. */
const hrefFor = (value) => {
    const raw = (value || '').trim();
    if (!raw) return '';
    const target = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const display = raw.replace(/^https?:\/\//i, '').replace(/\/$/, '');
    return `\\href{${target}}{${escapeLatex(display)}}`;
};

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

const nonEmpty = (s) => s != null && String(s).trim() !== '';

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

function experienceBlock(entries) {
    const out = ['\\sectitle{Experience}', ''];
    for (const e of entries || []) {
        const bullets = (e.bullets || []).filter(nonEmpty);
        if (!nonEmpty(e.company) && !nonEmpty(e.role) && !nonEmpty(e.description) && bullets.length === 0) continue;
        out.push(`\\begin{experience}{${escapeLatex(e.company)}}{${escapeLatex(e.location)}}{${escapeLatex(e.role)}}{${texDate(e.date)}}`);
        if (nonEmpty(e.description)) out.push(`    \\item[] ${escapeLatex(e.description)}`);
        for (const b of bullets) out.push(`    \\item ${escapeLatex(b)}`);
        out.push('\\end{experience}');
        out.push('');
    }
    return out.join('\n').trimEnd();
}

function projectsBlock(entries) {
    const out = ['\\sectitle{Projects}', '', '    \\vspace{3pt}', ''];
    for (const e of entries || []) {
        const bullets = (e.bullets || []).filter(nonEmpty);
        if (!nonEmpty(e.name) && bullets.length === 0) continue;
        // Empty URL: hyperref tolerates \href{}{text}; verified in engine tests.
        const url = nonEmpty(e.link) ? (/^https?:\/\//i.test(e.link.trim()) ? e.link.trim() : `https://${e.link.trim()}`) : '';
        out.push(`\\begin{project}{${escapeLatex(e.name)}}{${url}}{${escapeLatex(e.techStack)}}{${texDate(e.date)}}`);
        if (nonEmpty(e.description)) out.push(`    \\item[] ${escapeLatex(e.description)}`);
        for (const b of bullets) out.push(`    \\item ${escapeLatex(b)}`);
        out.push('\\end{project}');
        out.push('');
    }
    return out.join('\n').trimEnd();
}

function educationBlock(entries) {
    const out = ['\\sectitle{Education}', ''];
    for (const e of entries || []) {
        if (!nonEmpty(e.school)) continue;
        // Right-aligned slot: date first, else location (matches \hfill pattern).
        const right = nonEmpty(e.date) ? texDate(e.date) : escapeLatex(e.location);
        let body = '';
        if (nonEmpty(e.degree)) body += `{\\textbf{\\textit{${escapeLatex(e.degree)}}}}`;
        if (nonEmpty(e.coursework)) {
            if (body) body += ' \\\\ ';
            body += `{\\textit{Relevant Coursework}: ${escapeLatex(e.coursework)}}`;
        }
        // \school{school}{right}{body} — body already braced above when present.
        const bodyArg = body.startsWith('{') ? body : `{${body}}`;
        out.push(`\\school{${escapeLatex(e.school)}} {${right}}`);
        out.push(bodyArg);
        out.push('');
    }
    return out.join('\n').trimEnd();
}

const SKILL_LABELS = [
    ['languages', 'Programming Languages'],
    ['technologies', 'Technologies'],
    ['development', 'Software Development'],
    ['spokenLanguages', 'Spoken Languages'],
    ['affiliations', 'Affiliations']
];

function skillsBlock(skills) {
    const s = skills || {};
    const rows = SKILL_LABELS
        .filter(([key]) => nonEmpty(s[key]))
        .map(([key, label]) => `    \\skill{${label}}{${escapeLatex(s[key]).replace(/^spoken languages:\s*/i, '')}}`);
    if (rows.length === 0) return '';
    return ['\\sectitle{Skills}', '', '    \\vspace{3pt}', '', rows.join(' \\\\\n')].join('\n');
}

// ---------------------------------------------------------------------------
// Document assembly
// ---------------------------------------------------------------------------

const SECTION_BUILDERS = {
    experience: (d) => experienceBlock(d.experience),
    projects: (d) => projectsBlock(d.projects),
    education: (d) => educationBlock(d.education),
    skills: (d) => skillsBlock(d.skills)
};

/**
 * Build the full resume.tex source from resume data + section order.
 * Empty sections are omitted entirely (no orphan headers).
 */
export function resumeToLatex(data, sectionOrder) {
    const d = data || {};
    const order = sectionOrder || [];
    const parts = [
        // Round-trip marker (see TEX_DATA_MARKER): re-upload restores the form.
        `${TEX_DATA_MARKER}${JSON.stringify({ data: d, sectionOrder: order })}`,
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
        '\\begin{flushleft}',
        ''
    ];
    for (const section of order) {
        const build = SECTION_BUILDERS[section];
        if (!build) continue;
        const tex = build(d);
        if (tex) {
            parts.push(tex);
            parts.push('');
        }
    }
    parts.push('\\end{flushleft}');
    parts.push('');
    parts.push('\\end{document}');
    parts.push('');
    return parts.join('\n');
}
