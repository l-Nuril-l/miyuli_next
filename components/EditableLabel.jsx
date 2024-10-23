"use client";
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import './EditableLabel.scss';

const EditableLabel = ({ text, onAction, disabled }) => {
    const [isEditing, seIsEditing] = useState(false);
    const [newText, setNewText] = useState(text);
    const t = useTranslations()
    const clickOutsideStatus = useClickOutside(() => seIsEditing(false))
    const inputRef = useRef();

    useEffect(() => {
        if (isEditing) inputRef.current.focus();
    })

    return (
        <div ref={clickOutsideStatus} className={`editable_label${disabled ? " disabled" : ""}`}>
            {!isEditing && text == newText ? <h3 onClick={() => seIsEditing(!disabled)} className='editable_area p-1'>{newText !== "" ? newText : t("enterName")}</h3>
                :
                <input ref={inputRef} disabled={disabled} className='editable_area input w-100 p-1' value={newText} onChange={(e) => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && onAction(newText)} />}
        </div >
    );
}

export default EditableLabel;
