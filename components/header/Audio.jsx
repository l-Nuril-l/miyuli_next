"use client";
import { pause, play, previous, skip } from '@/lib/features/audio';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useCallback, useRef, useState } from 'react';
import useClickOutside from "../../hooks/useClickOutside";
import AudioCard from "../AudioCard";
import AudioPlayer from "../AudioPlayer";
import "./Audio.scss";




export default function Audio() {
    const [open, setOpen] = useState(false);
    const dropdown = useRef();
    const audioStore = useAppSelector(s => s.audio)
    const dispatch = useAppDispatch();

    const clickOutside = useClickOutside(() => setOpen(false))

    const blocker = useRef(false);

    const click = useCallback((e) => {
        const contains = dropdown.current.contains(e.target);
        if (blocker.current || contains) {
            if (!contains) setOpen(false);
            blocker.current = false
            return
        }
        setOpen(!open);
    }, [open, blocker])

    const isAuthorized = useAppSelector(s => s.auth.session) !== null;

    return (
        <div ref={clickOutside} id="top_audio_btn" href="/music" className={`top_btn ${open ? "active" : ""}`} onMouseDown={(e) => click(e)}>
            <div className='top_audio_btn_in'>
                {!audioStore.audio ? <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M16.72 4.1a17.3 17.3 0 011.31-.24c.3-.04.41-.01.46 0 .2.07.38.21.49.4.02.04.07.14.1.44.02.3.02.7.02 1.32L8.9 8.14V7.6c0-.47 0-.78.02-1.02.01-.23.04-.33.07-.4.08-.18.21-.33.38-.45.05-.04.14-.09.36-.15.23-.07.53-.13 1-.23zm-9.62 11h-.2c-1.8 0-3.12.45-4.02 1.21a3.54 3.54 0 00-1.28 2.71 3.38 3.38 0 003.38 3.38c.92 0 1.94-.38 2.7-1.28.77-.9 1.22-2.23 1.22-4.02V9.98l10.2-2.12v5.24h-.2c-1.8 0-3.12.45-4.02 1.21a3.54 3.54 0 00-1.28 2.71 3.38 3.38 0 003.38 3.38c.92 0 1.94-.38 2.7-1.28.77-.9 1.22-2.23 1.22-4.02V6c0-.57 0-1.06-.03-1.45a2.79 2.79 0 00-.34-1.2 2.7 2.7 0 00-1.46-1.2 2.79 2.79 0 00-1.25-.08c-.4.05-.87.15-1.43.26l-.04.01-5.99 1.25h-.03c-.42.1-.8.17-1.1.26-.31.09-.62.2-.9.4-.44.32-.78.74-.99 1.22-.14.32-.2.64-.22.98-.02.3-.02.68-.02 1.12v.03zm8.95.59c-.48.4-.65.9-.65 1.34 0 .86.7 1.57 1.57 1.57.44 0 .94-.17 1.34-.65.41-.47.79-1.34.79-2.85v-.2h-.2c-1.5 0-2.38.38-2.85.79zM3.4 19.03c0-.44.17-.94.65-1.34.47-.41 1.34-.79 2.85-.79h.2v.2c0 1.5-.38 2.38-.79 2.85-.4.48-.9.65-1.33.65-.87 0-1.58-.7-1.58-1.58z" fill="currentColor" fillRule="evenodd"></path></svg>
                    :
                    <>
                        <button aria-label="Previous" onMouseDown={() => blocker.current = true} onClick={() => dispatch(previous())} className="rhap_button-clear rhap_main-controls-button rhap_skip-button" type="button">
                            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 13.17v3.33a1 1 0 1 1-2 0v-9a1 1 0 0 1 2 0v3.33l8.15-4.66c.82-.48 1.85.11 1.85 1.06v9.54c0 .95-1.03 1.54-1.85 1.06z" fill="currentColor" fillRule="evenodd"></path></svg>
                        </button>
                        <button aria-label="Play/Pause" onMouseDown={() => blocker.current = true} onClick={(e) => { dispatch(!audioStore.isPlaying ? play() : pause()) }} className="rhap_button-clear rhap_main-controls-button rhap_play-pause-button" type="button">
                            {audioStore.isPlaying ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6.6c0-.56 0-.84.1-1.05a1 1 0 0 1 .45-.44C6.76 5 7.04 5 7.6 5h.8c.56 0 .84 0 1.05.1a1 1 0 0 1 .44.45c.11.21.11.49.11 1.05v10.8c0 .56 0 .84-.1 1.05a1 1 0 0 1-.45.44c-.21.11-.49.11-1.05.11h-.8c-.56 0-.84 0-1.05-.1a1 1 0 0 1-.44-.45C6 18.24 6 17.96 6 17.4V6.6Zm8 0c0-.56 0-.84.1-1.05a1 1 0 0 1 .45-.44C14.76 5 15.04 5 15.6 5h.8c.56 0 .84 0 1.05.1a1 1 0 0 1 .44.45c.11.21.11.49.11 1.05v10.8c0 .56 0 .84-.1 1.05a1 1 0 0 1-.45.44c-.21.11-.49.11-1.05.11h-.8c-.56 0-.84 0-1.05-.1a1 1 0 0 1-.44-.45c-.11-.21-.11-.49-.11-1.05V6.6Z"></path></svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18.5 11.13a1 1 0 0 1 0 1.74l-9 5.2A1 1 0 0 1 8 17.2V6.8a1 1 0 0 1 1.5-.86l9 5.2Z"></path></svg>
                            }
                        </button>

                        <button aria-label="Skip" onMouseDown={() => blocker.current = true} onClick={() => dispatch(skip())} className="rhap_button-clear rhap_main-controls-button rhap_skip-button" type="button">
                            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14 10.83V7.5a1 1 0 1 1 2 0v9a1 1 0 0 1-2 0v-3.33l-8.15 4.66A1.23 1.23 0 0 1 4 16.77V7.23c0-.95 1.03-1.54 1.85-1.06z" fill="currentColor" fillRule="evenodd"></path></svg>
                        </button>
                        <span className='text'>{audioStore.audio.artist} - {audioStore.audio.name}</span>
                    </>
                }
            </div>

            <div ref={dropdown}
                className={`top_dropdown audio_dropdown ${open ? "show" : ""}`}>
                <div>
                    {audioStore.audio && <AudioCard off={!isAuthorized} audio={audioStore.audio}></AudioCard>}
                    <AudioPlayer></AudioPlayer>
                </div>
            </div>
        </div >
    )
}
