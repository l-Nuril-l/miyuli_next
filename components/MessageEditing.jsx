"use client";
import { editMessage } from '@/lib/features/messenger';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker from './EmojiPicker';

const MessageEditing = ({ onAction, message }) => {
    const [text, setText] = useState(message.text);
    const t = useTranslations()
    const dispatch = useAppDispatch();

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSave()
        }
        if (event.key === 'Escape') {
            onAction()
        }
    }

    const onSave = () => {
        dispatch(editMessage({ id: message.id, text: text }))
        onAction()
    }

    return (
        <div className='message_input_wrap'>
            <TextareaAutosize className='input input_message' type="text" value={text} placeholder={t("writeMsg")}
                onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} />
            <EmojiPicker absolute value={text} onChange={setText} />
            <div>esc {t('for')} <a href="/#" onClick={(e) => { e.preventDefault(); onAction() }}>{t('cancel')}</a> • enter {t('for')} <a href="/#" onClick={(e) => { e.preventDefault(); onSave() }}>{t('save')}</a></div>
        </div>
    );
}

export default MessageEditing;
