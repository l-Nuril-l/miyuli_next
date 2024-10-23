"use client";
import { useCallback, useRef, useState } from 'react';
import useClickOutside from '../hooks/useClickOutside';

import data from '@emoji-mart/data';
import en from '@emoji-mart/data/i18n/en.json';
import ru from '@emoji-mart/data/i18n/ru.json';
import uk from '@emoji-mart/data/i18n/uk.json';
import Picker from '@emoji-mart/react';
import { useLocale } from 'next-intl';
import { useMediaQuery } from 'react-responsive';
import "./EmojiPicker.scss";

const EmojiPicker = ({ value, onChange, absolute }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdown = useRef();
    const clickOutsideStatusEmoji = useClickOutside(() => setIsOpen(false))
    const isMobile = useMediaQuery({ query: '(max-width: 400px)' })
    const locale = useLocale();


    const clickEmoji = useCallback((e) => {
        if (dropdown.current.contains(e.target))
            return
        setIsOpen(!isOpen);
    }, [isOpen])

    const onEmojiSelect = (x) => {
        onChange(value + x.native)
    }

    return (
        <>
            <div ref={clickOutsideStatusEmoji} className={`emoji_icon${absolute ? "_absolute" : ""}`}>
                <svg role="button" onClick={(e) => clickEmoji(e)} className='cursor_pointer' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.44 14.3a.9.9 0 011.26.13c.01.02.2.22.53.43.38.24.97.49 1.77.49s1.39-.25 1.77-.49c.2-.12.39-.26.53-.43a.9.9 0 011.4 1.13c-.27.33-.61.6-.97.83a5.1 5.1 0 01-2.73.76 5.1 5.1 0 01-2.73-.76 3.99 3.99 0 01-.97-.83.9.9 0 01.14-1.26zm1.81-4.05a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM15 11.5A1.25 1.25 0 1015 9a1.25 1.25 0 000 2.5z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M12 2.1a9.9 9.9 0 100 19.8 9.9 9.9 0 000-19.8zM3.9 12a8.1 8.1 0 1116.2 0 8.1 8.1 0 01-16.2 0z" fill="currentColor"></path></svg>
                <div ref={dropdown} className={`emoji_picker ${isOpen ? "show" : ""}`}>
                    <Picker perLine={isMobile ? 7 : 9} data={data} i18n={locale === "ru" ? ru : locale === "uk" ? uk : en} onEmojiSelect={onEmojiSelect} />
                </div>
            </div>
        </>
    );
}

export default EmojiPicker;
