import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    TabStopType,
    BorderStyle,
    ExternalHyperlink,
    Tab
} from 'docx';
import { sanitizeUrl, withoutSpokenPrefix } from './model';

/**
 * buildResumeDocx — the same resume content as ResumePdf, as a .docx Blob.
 * Mirrors the on-screen preview's look (Times New Roman, centered header,
 * rule-off section titles) and suppresses empty bullets, entries, and sections.
 */

const FONT = 'Times New Roman';
const BODY = 21; // 10.5pt in half-points

const nonEmpty = (v) => (v || '').trim().length > 0;
const visibleBullets = (bullets) => (bullets || []).filter(nonEmpty);
const entryHasContent = (entry, fields) =>
    fields.some((f) => nonEmpty(entry[f])) || visibleBullets(entry.bullets).length > 0;

const run = (text, opts = {}) => new TextRun({ text, font: FONT, size: BODY, ...opts });

const sectionTitle = (text) =>
    new Paragraph({
        children: [run(text.toUpperCase(), { bold: true, size: 24 })],
        spacing: { before: 160, after: 80 },
        border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 1 }
        }
    });

/** Two-column row: left text, right-aligned date/location. Content width is
 *  7.5in (letter page, 0.5in margins) = 10800 twips. Uses a real <w:tab/>
 *  element — a tab *character* inside a TextRun gets escaped to literal "\t"
 *  text by the docx serializer and renders visibly broken. */
const tabRun = () => new TextRun({ children: [new Tab()], font: FONT, size: BODY });

const twoColRow = (leftRuns, rightText) =>
    new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: 10800 }],
        spacing: { after: 20 },
        children: [...leftRuns, tabRun(), run(rightText || '')]
    });

const descriptionPara = (text) =>
    nonEmpty(text)
        ? new Paragraph({ children: [run(text)], spacing: { before: 40, after: 40 } })
        : null;

const bulletParas = (bullets) =>
    visibleBullets(bullets).map(
        (b) =>
            new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [run(b)]
            })
    );

const buildHeader = (personal) => {
    const paras = [];
    if (nonEmpty(personal.name)) {
        paras.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 },
                children: [run(personal.name, { bold: true, size: 44 })]
            })
        );
    }
    const line1 = [personal.email, personal.phone, personal.location].filter(nonEmpty);
    if (line1.length > 0) {
        paras.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
                children: [run(line1.join(' | '))]
            })
        );
    }
    const links = [];
    if (nonEmpty(personal.website)) {
        links.push(
            new ExternalHyperlink({
                link: sanitizeUrl(personal.website),
                children: [run(personal.website)]
            })
        );
    }
    if (nonEmpty(personal.linkedin)) {
        links.push(
            new ExternalHyperlink({
                link: sanitizeUrl(personal.linkedin),
                children: [run(personal.linkedin)]
            })
        );
    }
    if (links.length > 0) {
        const children = [];
        links.forEach((link, i) => {
            if (i > 0) children.push(run(' | '));
            children.push(link);
        });
        paras.push(
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children })
        );
    }
    return paras;
};

const buildEducation = (entries) => {
    const visible = entries.filter((e) =>
        entryHasContent(e, ['school', 'degree', 'location', 'date', 'coursework']));
    if (visible.length === 0) return [];
    const paras = [sectionTitle('Education')];
    visible.forEach((edu) => {
        paras.push(twoColRow([run(edu.school || '', { bold: true })], edu.date));
        paras.push(twoColRow([run(edu.degree || '', { italics: true })], edu.location));
        if (nonEmpty(edu.coursework)) {
            paras.push(
                new Paragraph({
                    spacing: { before: 40, after: 60 },
                    children: [
                        run('Relevant Coursework', { italics: true }),
                        run(`: ${edu.coursework}`)
                    ]
                })
            );
        }
    });
    return paras;
};

const buildExperience = (entries) => {
    const visible = entries.filter((e) =>
        entryHasContent(e, ['company', 'role', 'location', 'date', 'description']));
    if (visible.length === 0) return [];
    const paras = [sectionTitle('Experience')];
    visible.forEach((exp) => {
        paras.push(twoColRow([run(exp.company || '', { bold: true })], exp.location));
        paras.push(twoColRow([run(exp.role || '', { italics: true })], exp.date));
        const desc = descriptionPara(exp.description);
        if (desc) paras.push(desc);
        paras.push(...bulletParas(exp.bullets));
    });
    return paras;
};

const buildProjects = (entries) => {
    const visible = entries.filter((e) =>
        entryHasContent(e, ['name', 'link', 'techStack', 'date', 'description']));
    if (visible.length === 0) return [];
    const paras = [sectionTitle('Projects')];
    visible.forEach((proj) => {
        const left = [run(proj.name || '', { bold: true })];
        if (nonEmpty(proj.techStack)) {
            left.push(run(' | '), run(proj.techStack, { italics: true }));
        }
        paras.push(twoColRow(left, proj.date));
        const desc = descriptionPara(proj.description);
        if (desc) paras.push(desc);
        paras.push(...bulletParas(proj.bullets));
    });
    return paras;
};

const buildSkills = (skills) => {
    const rows = [
        ['Programming Languages', skills.languages],
        ['Technologies', skills.technologies],
        ['Software Development', skills.development],
        ['Affiliations', skills.affiliations],
        ['Spoken Languages', withoutSpokenPrefix(skills.spokenLanguages)]
    ].filter(([, value]) => nonEmpty(value));
    if (rows.length === 0) return [];
    const paras = [sectionTitle('Skills')];
    rows.forEach(([label, value]) => {
        paras.push(
            new Paragraph({
                spacing: { after: 30 },
                children: [run(label, { bold: true }), run(`: ${value}`)]
            })
        );
    });
    return paras;
};

/** Build the .docx file and return it as a Blob. */
export const buildResumeDocx = async (resumeData, sectionOrder) => {
    const sections = {
        education: buildEducation(resumeData.education),
        experience: buildExperience(resumeData.experience),
        projects: buildProjects(resumeData.projects),
        skills: buildSkills(resumeData.skills)
    };
    const children = [
        ...buildHeader(resumeData.personal),
        ...sectionOrder.flatMap((key) => sections[key] || [])
    ];
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        size: { width: 12240, height: 15840 }, // US Letter
                        margin: { top: 720, right: 720, bottom: 720, left: 720 } // 0.5in
                    }
                },
                children
            }
        ]
    });
    return Packer.toBlob(doc);
};
