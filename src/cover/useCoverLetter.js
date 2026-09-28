import { useState, useRef, useEffect, useCallback } from 'react';
import { trackEvent } from '../analytics';
import { blankCover, normalizeCoverData, extractCoverData } from './coverLatex';

const STORAGE_KEY = 'bobalabs-cover-v1';

const loadStored = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return normalizeCoverData(JSON.parse(raw));
    } catch { /* fall through to blank */ }
    return null;
};

/**
 * useCoverLetter — form state + persistence for the cover-letter builder.
 * Mirrors the useResume API shape (data + importTexText).
 */
export function useCoverLetter(resumePersonal) {
    const [coverData, setCoverData] = useState(() => loadStored() || blankCover(resumePersonal));
    const skipSave = useRef(true);

    // If there's no saved letter but resume personal info exists, seed it.
    useEffect(() => {
        if (!loadStored() && resumePersonal && resumePersonal.name) {
            setCoverData((prev) => ({
                ...prev,
                personal: { ...prev.personal, ...resumePersonal },
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (skipSave.current) {
            skipSave.current = false;
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(coverData));
        } catch { /* storage full/blocked — non-fatal */ }
    }, [coverData]);

    const setField = useCallback((field, value) => {
        setCoverData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const setPersonalField = useCallback((field, value) => {
        setCoverData((prev) => ({
            ...prev,
            personal: { ...prev.personal, [field]: value },
        }));
    }, []);

    const setParagraph = useCallback((index, value) => {
        setCoverData((prev) => {
            const paragraphs = [...prev.paragraphs];
            paragraphs[index] = value;
            return { ...prev, paragraphs };
        });
    }, []);

    const addParagraph = useCallback(() => {
        setCoverData((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, ''] }));
    }, []);

    const removeParagraph = useCallback((index) => {
        setCoverData((prev) => ({
            ...prev,
            paragraphs: prev.paragraphs.filter((_, i) => i !== index),
        }));
    }, []);

    const moveParagraph = useCallback((index, dir) => {
        setCoverData((prev) => {
            const j = index + dir;
            if (j < 0 || j >= prev.paragraphs.length) return prev;
            const paragraphs = [...prev.paragraphs];
            [paragraphs[index], paragraphs[j]] = [paragraphs[j], paragraphs[index]];
            return { ...prev, paragraphs };
        });
    }, []);

    const clearCover = useCallback(() => {
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
        skipSave.current = true;
        setCoverData(blankCover(resumePersonal));
    }, [resumePersonal]);

    /**
     * Restore from a cover-letter .tex previously downloaded here.
     * Returns null on success, error string when the file has no marker.
     */
    const importTexText = useCallback((texText) => {
        const parsed = extractCoverData(texText);
        if (!parsed) {
            return 'Could not read this file — only cover-letter .tex files downloaded from Boba Labs can be re-uploaded.';
        }
        skipSave.current = true;
        setCoverData(normalizeCoverData(parsed.data));
        trackEvent('cover_letter_imported');
        return null;
    }, []);

    return {
        coverData,
        setField,
        setPersonalField,
        setParagraph,
        addParagraph,
        removeParagraph,
        moveParagraph,
        clearCover,
        importTexText,
    };
}
