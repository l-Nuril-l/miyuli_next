"use client";
import classNames from 'classnames';
import { useCallback, useRef, useState } from 'react';
import useClickOutside from "../../hooks/useClickOutside";
import NavigationButtons from '../NavigationButtons';
import './Navigation.scss';




const Navigation = () => {

    const [open, setOpen] = useState(false);
    const dropdown = useRef();

    const clickOutside = useClickOutside(() => setOpen(false))

    const click = useCallback((e) => {
        if (dropdown.current.contains(e.target))
            return
        setOpen(!open);
    }, [open])

    return (
        <div ref={clickOutside} id="top_navigation_btn" className={classNames('top_btn', open && "active")} onMouseDown={(e) => click(e)}>
            {open ? <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M30 18l-12 12 M30 30l-12-12" fill="none" stroke="#818c99" strokeWidth="2" strokeLinecap="round" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M15 17h18m-18 7h18m-18 7h18" fill="none" stroke="#818c99" strokeWidth="2" strokeLinecap="round" /></svg>}

            <div ref={dropdown} onClick={() => setOpen(false)}
                className={`top_dropdown navigation_dropdown ${open ? "show" : ""}`}>
                <ul>
                    <NavigationButtons></NavigationButtons>
                </ul>
            </div>
        </div>
    );
}

export default Navigation;
