"use client";
import "./Profile.scss";

import { useAsyncRouter } from '@/hooks/useAsyncRouter';
import { logout } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { handleSignOut } from "@/services/actions";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef, useState } from 'react';
import DropDownArrowSvg from '../../assets/DropDownArrowSvg';
import useClickOutside from "../../hooks/useClickOutside";
import Avatar from '../Avatar';
import ChangeLanguage from './ChangeLanguage';
import ChangeTheme from './ChangeTheme';

export const CustomToggle = (className) => {
    const res = React.forwardRef(({ children, onClick }, ref) => (
        <div
            className={className ?? "custom_toggle"}
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
            &#x25bc;
        </div>

    ))
    res.displayName = "CustomToggle"
    return res;
};


export default function Profile() {
    const t = useTranslations()
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const dropdown = useRef();
    const router = useRouter()
    const account = useAppSelector(s => s.auth.account)
    const { asyncPush } = useAsyncRouter()

    const clickOutside = useClickOutside(() => setOpen(false))

    const click = useCallback((e) => {
        if (dropdown.current.contains(e.target))
            return
        setOpen(!open);
    }, [open])

    async function handleLogout() {
        await handleSignOut();
        asyncPush("/login").then(() => {
            dispatch(logout());
        })
    }

    return (
        <div ref={clickOutside} id="top_profile_btn" href="profile" className={`top_btn ${open ? "active" : ""}`} onMouseDown={(e) => click(e)}>
            <Avatar crop={account?.avatarCrop} avatar={account?.avatar}></Avatar>
            <DropDownArrowSvg></DropDownArrowSvg>
            <div ref={dropdown} className={`top_dropdown profile_dropdown ${open ? "show" : ""}`}>
                <div className="top_profile_row" onClick={() => router.push('/settings')}>
                    <div className="menu_item_icon"><svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10.6 2c.98.03 1.63.58 1.96 1.6l.06.18.04.15.06.2.04.13.03.01.06-.02.1-.04.13-.06c1.16-.53 2.05-.43 2.78.36l.1.12.67.83c.6.8.58 1.63 0 2.54l-.1.15-.1.14-.12.16-.05.1-.03.04v.02l.08.05.1.06.13.07c1.13.58 1.6 1.35 1.42 2.4l-.03.16-.2.87c-.13.56-.23.82-.63 1.19-.39.35-.83.5-1.42.55h-.18l-.16.01-.2.01-.15.02.01.12.01.08.03.14c.26 1.25-.03 2.1-.97 2.62l-.14.08-.96.47c-.9.4-1.72.2-2.48-.58l-.12-.13-.11-.13-.14-.15-.08-.08-.04-.04-.07.08-.09.08-.1.11c-.78.93-1.6 1.27-2.6.88L7 17.49l-.86-.42-.26-.13c-.39-.22-.6-.42-.82-.87a2.38 2.38 0 01-.13-1.54l.03-.19.04-.2L5 14 4.93 14l-.12-.01h-.15c-1.27-.03-2.03-.51-2.33-1.55l-.04-.15-.24-1.04c-.2-.97.2-1.72 1.11-2.28l.16-.1.15-.07.17-.1.13-.08v-.02l-.05-.08-.06-.1-.09-.12c-.76-1.02-.85-1.92-.22-2.8l.1-.12.67-.83c.64-.75 1.47-.9 2.48-.52l.17.07.15.06.18.08.11.04.03-.01.03-.08.04-.11.03-.14c.3-1.17.9-1.83 1.96-1.92L9.46 2zm-.05 1.47h-1.1l-.1.01c-.24.03-.4.16-.54.68l-.04.13-.04.17c-.09.29-.22.61-.39.93a4.8 4.8 0 00-.94.46 5.28 5.28 0 01-.95-.29l-.28-.13c-.2-.08-.36-.13-.48-.14h-.07a.45.45 0 00-.33.16l-.06.06-.64.8-.08.1c-.15.21-.17.4.16.88l.18.25c.18.26.35.57.5.9-.11.32-.19.65-.23.99a5.3 5.3 0 01-.83.6l-.28.14c-.5.28-.57.46-.53.72l.01.06.23 1 .04.13c.07.25.21.39.79.41l.32.02c.3.01.65.07 1 .16.18.29.4.55.63.8.02.43-.02.85-.1 1.18-.16.78 0 .9.32 1.06l.92.45c.1.05.19.07.28.07h.05c.15-.02.32-.13.55-.4l.21-.24c.21-.23.48-.47.78-.68l.24.01h.5l.24-.02c.3.22.57.46.78.69l.21.24c.27.3.44.4.6.4h.06c.05 0 .1-.02.14-.04l.08-.03.92-.45.12-.06c.24-.14.34-.32.2-1a5.07 5.07 0 01-.1-1.18c.24-.25.45-.51.64-.8.34-.1.7-.15 1-.16l.31-.02c.67-.03.75-.2.83-.54l.22-.93c.07-.33.07-.53-.5-.85l-.29-.15a5.26 5.26 0 01-.83-.59 4.87 4.87 0 00-.22-.98c.14-.34.32-.65.49-.9l.19-.26c.33-.48.3-.67.16-.88l-.04-.06-.65-.8c-.11-.13-.2-.23-.37-.26h-.06c-.13 0-.3.04-.54.14l-.3.13c-.27.11-.6.22-.94.28-.3-.18-.61-.33-.94-.45-.16-.3-.29-.62-.37-.9l-.1-.33c-.15-.56-.32-.66-.58-.68zM10 6.9a3.11 3.11 0 110 6.23 3.11 3.11 0 010-6.23zm0 1.48a1.64 1.64 0 100 3.27 1.64 1.64 0 000-3.27z" fill="currentColor"></path></svg></div>
                    {t("settings")}
                </div>

                <ChangeTheme toggle={CustomToggle('top_profile_row')} />
                <ChangeLanguage toggle={CustomToggle('top_profile_row')} />

                <div onClick={() => { handleLogout() }} className="top_profile_row">
                    <div className='menu_item_icon'>
                        <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M9.25 2.1h.04a.75.75 0 110 1.5c-1.15 0-1.96 0-2.6.06-.62.05-1 .15-1.3.3-.62.31-1.12.81-1.43 1.42-.15.3-.25.69-.3 1.31-.05.63-.05 1.43-.05 2.57v1.48c0 1.14 0 1.94.05 2.57.05.62.15 1 .3 1.3.31.62.81 1.12 1.42 1.43.3.15.7.25 1.32.3.63.05 1.44.05 2.59.05a.75.75 0 010 1.5h-.04c-1.1 0-1.97 0-2.67-.05a4.9 4.9 0 01-1.88-.46 4.75 4.75 0 01-2.08-2.08 4.88 4.88 0 01-.46-1.87c-.05-.7-.05-1.56-.05-2.65V9.22c0-1.09 0-1.95.05-2.65.06-.71.18-1.32.46-1.87A4.75 4.75 0 014.7 2.62a4.9 4.9 0 011.88-.46c.7-.05 1.57-.05 2.67-.05zm4.5 4.51c.3-.29.77-.29 1.07 0l2.85 2.86c.3.3.3.77 0 1.06l-2.85 2.86a.75.75 0 11-1.06-1.06l1.57-1.58H8.57a.75.75 0 010-1.5h6.76l-1.57-1.58a.75.75 0 010-1.06z" fill="currentColor" fillRule="evenodd"></path></svg>
                    </div>
                    {t("logout")}
                </div>
            </div>
        </div>
    )
}
