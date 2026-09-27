import React from 'react';
import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';
import { sanitizeUrl, withoutSpokenPrefix } from './model';

/**
 * ResumePdf — a @react-pdf/renderer <Document> that renders the same resume
 * model the on-screen preview uses. Mirrors the preview's look (Times,
 * centered header, uppercase rule-off section titles, two-column rows) as
 * closely as the library allows, and suppresses empty bullets, empty entries,
 * and empty sections so a half-filled resume still exports cleanly.
 */

const nonEmpty = (v) => (v || '').trim().length > 0;
const visibleBullets = (bullets) => (bullets || []).filter(nonEmpty);
const entryHasContent = (entry, fields) =>
    fields.some((f) => nonEmpty(entry[f])) || visibleBullets(entry.bullets).length > 0;

const styles = StyleSheet.create({
    page: {
        paddingTop: 28,
        paddingBottom: 28,
        paddingLeft: 36,
        paddingRight: 36,
        fontFamily: 'Times-Roman',
        fontSize: 10.5,
        lineHeight: 1.2,
        color: '#000000'
    },
    header: { textAlign: 'center', marginBottom: 6 },
    name: { fontSize: 22, fontFamily: 'Times-Bold', marginBottom: 4 },
    contactLine: { fontSize: 10.5, marginBottom: 2 },
    link: { color: '#000000', textDecoration: 'none' },
    section: { marginTop: 6 },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        marginBottom: 3,
        paddingBottom: 1
    },
    entry: { marginBottom: 4 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    left: { flex: 1, paddingRight: 8 },
    right: { textAlign: 'right' },
    bold: { fontFamily: 'Times-Bold' },
    italic: { fontFamily: 'Times-Italic' },
    description: { marginTop: 2, marginBottom: 2 },
    coursework: { marginTop: 2 },
    bulletRow: { flexDirection: 'row', marginBottom: 1.5 },
    bulletChar: { width: 10 },
    bulletText: { flex: 1 },
    skillLine: { marginBottom: 1.5 }
});

const Separator = () => <Text> | </Text>;

const PdfHeader = ({ personal }) => {
    const line1 = [personal.email, personal.phone, personal.location].filter(nonEmpty);
    const links = [
        personal.website
            ? <Link key="site" src={sanitizeUrl(personal.website)} style={styles.link}>{personal.website}</Link>
            : null,
        personal.linkedin
            ? <Link key="li" src={sanitizeUrl(personal.linkedin)} style={styles.link}>{personal.linkedin}</Link>
            : null
    ].filter(Boolean);

    return (
        <View style={styles.header}>
            {nonEmpty(personal.name) && <Text style={styles.name}>{personal.name}</Text>}
            {line1.length > 0 && (
                <Text style={styles.contactLine}>
                    {line1.map((part, i) => (
                        <Text key={i}>{i > 0 && ' | '}{part}</Text>
                    ))}
                </Text>
            )}
            {links.length > 0 && (
                <Text style={styles.contactLine}>
                    {links.map((link, i) => (
                        <Text key={i}>{i > 0 && <Separator />}{link}</Text>
                    ))}
                </Text>
            )}
        </View>
    );
};

const PdfBullets = ({ bullets }) => {
    const items = visibleBullets(bullets);
    if (items.length === 0) return null;
    return (
        <View>
            {items.map((bullet, i) => (
                <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletChar}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                </View>
            ))}
        </View>
    );
};

const PdfDescription = ({ text }) =>
    nonEmpty(text) ? <Text style={styles.description}>{text}</Text> : null;

const EducationSection = ({ entries }) => {
    const visible = entries.filter((edu) =>
        entryHasContent(edu, ['school', 'degree', 'location', 'date', 'coursework']));
    if (visible.length === 0) return null;
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {visible.map((edu, idx) => (
                <View key={idx} style={styles.entry}>
                    <View style={styles.row}>
                        <Text style={[styles.left, styles.bold]}>{edu.school || ''}</Text>
                        <Text style={styles.right}>{edu.date || ''}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.left, styles.italic]}>{edu.degree || ''}</Text>
                        <Text style={styles.right}>{edu.location || ''}</Text>
                    </View>
                    {nonEmpty(edu.coursework) && (
                        <Text style={styles.coursework}>
                            <Text style={styles.italic}>Relevant Coursework</Text>
                            <Text>: {edu.coursework}</Text>
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );
};

const ExperienceSection = ({ entries }) => {
    const visible = entries.filter((exp) =>
        entryHasContent(exp, ['company', 'role', 'location', 'date', 'description']));
    if (visible.length === 0) return null;
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {visible.map((exp, idx) => (
                <View key={idx} style={styles.entry}>
                    <View style={styles.row}>
                        <Text style={[styles.left, styles.bold]}>{exp.company || ''}</Text>
                        <Text style={styles.right}>{exp.location || ''}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.left, styles.italic]}>{exp.role || ''}</Text>
                        <Text style={styles.right}>{exp.date || ''}</Text>
                    </View>
                    <PdfDescription text={exp.description} />
                    <PdfBullets bullets={exp.bullets} />
                </View>
            ))}
        </View>
    );
};

const ProjectsSection = ({ entries }) => {
    const visible = entries.filter((proj) =>
        entryHasContent(proj, ['name', 'link', 'techStack', 'date', 'description']));
    if (visible.length === 0) return null;
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {visible.map((proj, idx) => (
                <View key={idx} style={styles.entry}>
                    <View style={styles.row}>
                        <Text style={styles.left}>
                            <Text style={styles.bold}>{proj.name || ''}</Text>
                            {nonEmpty(proj.techStack) && (
                                <Text><Text> | </Text><Text style={styles.italic}>{proj.techStack}</Text></Text>
                            )}
                        </Text>
                        <Text style={styles.right}>{proj.date || ''}</Text>
                    </View>
                    <PdfDescription text={proj.description} />
                    <PdfBullets bullets={proj.bullets} />
                </View>
            ))}
        </View>
    );
};

const SkillsSection = ({ skills }) => {
    const rows = [
        ['Programming Languages', skills.languages],
        ['Technologies', skills.technologies],
        ['Software Development', skills.development],
        ['Affiliations', skills.affiliations],
        ['Spoken Languages', withoutSpokenPrefix(skills.spokenLanguages)]
    ].filter(([, value]) => nonEmpty(value));
    if (rows.length === 0) return null;
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {rows.map(([label, value], i) => (
                <Text key={i} style={styles.skillLine}>
                    <Text style={styles.bold}>{label}</Text>
                    <Text>: {value}</Text>
                </Text>
            ))}
        </View>
    );
};

/**
 * <ResumePdf resumeData sectionOrder /> — the printable document.
 * Renders sections in the user's chosen order; empty sections are omitted.
 */
const ResumePdf = ({ resumeData, sectionOrder }) => {
    const sections = {
        education: <EducationSection entries={resumeData.education} />,
        experience: <ExperienceSection entries={resumeData.experience} />,
        projects: <ProjectsSection entries={resumeData.projects} />,
        skills: <SkillsSection skills={resumeData.skills} />
    };
    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <PdfHeader personal={resumeData.personal} />
                {sectionOrder.map((key) => (
                    <React.Fragment key={key}>{sections[key]}</React.Fragment>
                ))}
            </Page>
        </Document>
    );
};

export default ResumePdf;
