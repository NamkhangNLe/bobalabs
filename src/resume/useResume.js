import { useState, useRef, useEffect, useCallback } from 'react';
import { trackEvent } from '../analytics';
import {
    INITIAL_STATE,
    DEFAULT_SECTION_ORDER,
    blankItem,
    loadStoredState,
    saveStoredState,
    clearStoredState,
    normalizeResumeData,
    normalizeSectionOrder,
    resumeFileName
} from './model';
import { extractBobalabsData } from './latexGen';

/**
 * useResume — all resume-builder state, persistence, and field operations.
 *
 * Returned api is passed straight into <ResumeEditor> and <ResumePreview>;
 * both views consume the same data model and the same handlers.
 */
export const useResume = () => {
    const previewRef = useRef(null);
    const previewContainerRef = useRef(null);

    // Overflow flag: true when the resume content is taller than one 11in page.
    const [isOverflowing, setIsOverflowing] = useState(false);

    // Lazy initializer: with no saved state, start from a deep copy of the
    // example resume (edits never mutate the constant); otherwise restore.
    // Single storage read shared by all three pieces of state.
    const [stored] = useState(loadStoredState);
    const [resumeData, setResumeData] = useState(stored.resumeData);
    // Tracks whether the resume still holds the untouched example data.
    const [isExample, setIsExample] = useState(stored.isExample);
    const [sectionOrder, setSectionOrder] = useState(stored.sectionOrder);
    const [previewScale, setPreviewScale] = useState(1);
    const [previewScaledHeight, setPreviewScaledHeight] = useState('auto');

    // --- overflow detection (wired to a visible one-page warning) ---
    useEffect(() => {
        const checkOverflow = () => {
            if (previewRef.current) {
                const { scrollHeight, clientHeight } = previewRef.current;
                setIsOverflowing(scrollHeight > clientHeight + 5);
            }
        };
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [resumeData]);

    // --- document title doubles as the PDF filename in the print dialog ---
    useEffect(() => {
        const originalTitle = document.title;
        document.title = resumeFileName(resumeData.personal.name);
        return () => { document.title = originalTitle; };
    }, [resumeData.personal.name]);

    // --- autosave: versioned payload, ~500ms after edits stop ---
    const autosaveTimeoutRef = useRef(null);
    const skipAutosave = useRef(true);
    useEffect(() => {
        if (skipAutosave.current) {
            skipAutosave.current = false;
            return;
        }
        if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = setTimeout(() => {
            saveStoredState({ resumeData, sectionOrder, isExample });
        }, 500);
        return () => clearTimeout(autosaveTimeoutRef.current);
    }, [resumeData, sectionOrder, isExample]);

    // --- debounced edit analytics ---
    const editTimeoutRef = useRef(null);
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
        editTimeoutRef.current = setTimeout(() => trackEvent('resume_edited'), 5000);
        return () => clearTimeout(editTimeoutRef.current);
    }, [resumeData]);

    // --- mobile preview: scale the fixed 816px-wide resume to fit narrow screens ---
    useEffect(() => {
        const updateScale = () => {
            const container = previewContainerRef.current;
            const preview = previewRef.current;
            if (!container || !preview) return;
            const nextScale = Math.min(1, container.clientWidth / 816);
            setPreviewScale(nextScale);
            setPreviewScaledHeight(preview.offsetHeight * nextScale);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [resumeData]);

    // All field edits go through here so the "example" badge clears on the
    // first edit. Add/remove/reorder operations use setResumeData directly and
    // keep the badge state they already had.
    const updateResumeData = useCallback((updater) => {
        setResumeData(updater);
        setIsExample(false);
    }, []);

    const handlePersonalInfoChange = useCallback((e) => {
        const { name, value } = e.target;
        updateResumeData((prev) => ({
            ...prev,
            personal: { ...prev.personal, [name]: value }
        }));
    }, [updateResumeData]);

    const handleListChange = useCallback((section, index, field, value) => {
        updateResumeData((prev) => {
            const newList = [...prev[section]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [section]: newList };
        });
    }, [updateResumeData]);

    const handleBulletChange = useCallback((section, index, bulletIndex, value) => {
        updateResumeData((prev) => {
            const newList = [...prev[section]];
            const newBullets = [...newList[index].bullets];
            newBullets[bulletIndex] = value;
            newList[index] = { ...newList[index], bullets: newBullets };
            return { ...prev, [section]: newList };
        });
    }, [updateResumeData]);

    const handleSkillChange = useCallback((field, value) => {
        updateResumeData((prev) => ({
            ...prev,
            skills: { ...prev.skills, [field]: value }
        }));
    }, [updateResumeData]);

    const addItem = useCallback((section) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: [...prev[section], blankItem(section)]
        }));
    }, []);

    const addBullet = useCallback((section, index) => {
        setResumeData((prev) => {
            const newList = [...prev[section]];
            newList[index] = { ...newList[index], bullets: [...newList[index].bullets, ''] };
            return { ...prev, [section]: newList };
        });
    }, []);

    const removeItem = useCallback((section, index) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    }, []);

    const removeBullet = useCallback((section, index, bulletIndex) => {
        setResumeData((prev) => {
            const newList = [...prev[section]];
            const filtered = newList[index].bullets.filter((_, i) => i !== bulletIndex);
            newList[index] = {
                ...newList[index],
                // Always keep at least one bullet row so the entry stays editable.
                bullets: filtered.length > 0 ? filtered : ['']
            };
            return { ...prev, [section]: newList };
        });
    }, []);

    /** Reorder bullets within an entry (direction: -1 up, +1 down). */
    const moveBullet = useCallback((section, index, bulletIndex, direction) => {
        setResumeData((prev) => {
            const newList = [...prev[section]];
            const bullets = [...newList[index].bullets];
            const next = bulletIndex + direction;
            if (bulletIndex < 0 || next < 0 || next >= bullets.length) return prev;
            [bullets[bulletIndex], bullets[next]] = [bullets[next], bullets[bulletIndex]];
            newList[index] = { ...newList[index], bullets };
            return { ...prev, [section]: newList };
        });
    }, []);

    /** Move a resume section up or down in the ordering. */
    const moveSection = useCallback((section, direction) => {
        setSectionOrder((prev) => {
            const idx = prev.indexOf(section);
            const next = idx + direction;
            if (idx < 0 || next < 0 || next >= prev.length) return prev;
            const copy = [...prev];
            [copy[idx], copy[next]] = [copy[next], copy[idx]];
            return copy;
        });
    }, []);

    /** Reset the builder to empty fields and delete the autosaved draft. */
    const clearResume = useCallback(() => {
        clearStoredState();
        // Skip the next autosave tick so the blank state isn't written back.
        skipAutosave.current = true;
        setResumeData(normalizeResumeData(INITIAL_STATE));
        setSectionOrder([...DEFAULT_SECTION_ORDER]);
        setIsExample(false);
    }, []);

    /**
     * Restore the editor from a .tex file previously downloaded from Boba Labs
     * (the form data rides in a comment on the first line — see TEX_DATA_MARKER).
     * Returns null on success, or an error string when the file has no marker.
     * The uploaded .tex is never compiled; only our own JSON comment is read.
     */
    const importTexText = useCallback((texText) => {
        const parsed = extractBobalabsData(texText);
        if (!parsed) {
            return 'Could not read this file — only resume.tex files downloaded from Boba Labs can be re-uploaded.';
        }
        skipAutosave.current = true;
        setResumeData(normalizeResumeData(parsed.data));
        setSectionOrder(normalizeSectionOrder(parsed.sectionOrder));
        setIsExample(false);
        return null;
    }, []);

    return {
        resumeData,
        sectionOrder,
        isExample,
        isOverflowing,
        previewScale,
        previewScaledHeight,
        previewRef,
        previewContainerRef,
        handlePersonalInfoChange,
        handleListChange,
        handleBulletChange,
        handleSkillChange,
        addItem,
        addBullet,
        removeItem,
        removeBullet,
        moveBullet,
        moveSection,
        clearResume,
        importTexText
    };
};
