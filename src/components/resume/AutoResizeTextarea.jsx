import React, { useRef, useEffect } from 'react';

/**
 * Textarea that grows vertically to fit its content.
 * Controlled: `value` always comes from the resume model.
 */
const AutoResizeTextarea = ({ value, onChange, placeholder, className }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`auto-resize-textarea ${className || ''}`}
        />
    );
};

export default AutoResizeTextarea;
