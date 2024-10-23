"use client";
import { loop, mute, pause, play, shuffle, volume } from '@/lib/features/audio';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import '@/styles/H5Player.scss';
import classNames from 'classnames';
import { useContext, useEffect, useRef, useState } from 'react';
import { RiPlayMiniFill, RiRewindMiniFill, RiSkipBackMiniFill, RiSkipForwardMiniFill } from "react-icons/ri";
import ShuffleSvg from '../assets/ShuffleSvg';
import { AudioPlayerContext } from '../contexts';
import "./AudioPlayer.scss";

const AudioPlayer = () => {
    const audio = useAppSelector((s) => s.audio)
    const ref = useRef()
    const dispatch = useAppDispatch()
    const { currentTime, rewindToPercent, rewind, skip, previous } = useContext(AudioPlayerContext);

    const percent = audio.duration ? currentTime * 100 / audio.duration : 0

    const [isRewinding, setIsRewinding] = useState(false);
    const [localSliderPercent, setLocalSliderPercent] = useState(null);

    const eventToPercent = (e) => {
        var bounds = ref.current.getBoundingClientRect();
        var x = (e.changedTouches ? e.changedTouches[0]?.clientX : e.clientX) - bounds.left;
        var percent = x * 100 / bounds.width;
        percent > 100 && (percent = 100)
        percent < 0 && (percent = 0)
        return percent;
    }

    useEffect(() => {
        if (isRewinding === false) return;

        const moveHandler = (e) => {
            setLocalSliderPercent(eventToPercent(e));
        }
        const upHandler = (e) => {
            rewindToPercent(eventToPercent(e))
            setIsRewinding(false);
        }
        window.addEventListener("mousemove", moveHandler)
        window.addEventListener("touchmove", moveHandler)
        window.addEventListener("mouseup", upHandler)
        window.addEventListener("touchend", upHandler)
        return () => {
            window.removeEventListener("mousemove", moveHandler)
            window.removeEventListener("touchmove", moveHandler)
            window.removeEventListener("mouseup", upHandler)
            window.removeEventListener("touchend", upHandler)
            setLocalSliderPercent(null);
        };
    }, [dispatch, isRewinding, rewindToPercent]);

    const startRewind = (e) => {
        setLocalSliderPercent(eventToPercent(e));
        setIsRewinding(true);
    }

    return (
        <div role="group" tabIndex="0" aria-label="Audio player" className="rhap_container rhap_loop--off rhap_play-status--paused ">
            <div className="rhap_main rhap_stacked">
                <div className="rhap_progress-section">
                    <div id="rhap_current-time" className="rhap_time rhap_current-time">{(currentTime && `${`${Math.floor((currentTime / 60))}`.padStart(2, 0)}:${`${Math.floor((currentTime % 60))}`.padStart(2, 0)}`) || (audio.audio?.id ? '00:00' : '--:--')}</div>
                    <div ref={ref} onTouchStart={startRewind} onMouseDown={startRewind} className="rhap_progress-container" aria-label="Audio progress control" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="23" tabIndex="0">
                        <div className="rhap_progress-bar rhap_progress-bar-show-download">
                            <div className="rhap_progress-indicator" style={{ left: (isRewinding ? localSliderPercent : percent) + '%' }}></div>
                            <div className="rhap_progress-filled" style={{ width: (isRewinding ? localSliderPercent : percent) + '%' }}></div>
                            <div className="rhap_download-progress" style={{ left: '0%', width: `${audio.downloadProgress}%`, transitionDuration: '0s' }}></div>
                        </div>
                    </div>
                    <div className="rhap_time rhap_total-time">{audio.audio?.duration.padStart(5, 0) || '--:--'}</div>
                </div>
                <div className="rhap_controls-section">
                    <div className="rhap_additional-controls">
                        <button onClick={() => dispatch(loop())} aria-label="Switch loop" className="rhap_button-clear rhap_repeat-button" type="button">
                            {audio.loop ?
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><path d="M17 17H7v-3l-4 4l4 4v-3h12v-6h-2M7 7h10v3l4-4l-4-4v3H5v6h2V7z" fill="currentColor"></path></svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><path d="M2 5.27L3.28 4L20 20.72L18.73 22l-3-3H7v3l-4-4l4-4v3h6.73L7 10.27V11H5V8.27l-3-3M17 13h2v4.18l-2-2V13m0-8V2l4 4l-4 4V7H8.82l-2-2H17z" fill="currentColor"></path></svg>
                            }</button>
                        <button onClick={() => dispatch(shuffle())} aria-label="Shuffle" className={classNames(audio.shuffle && 'active', "rhap_button-clear rhap_shuffle-button")} type="button">
                            <ShuffleSvg /></button>
                    </div>
                    <div className="rhap_main-controls">
                        <button aria-label="Previous" onClick={() => { previous() }} className="rhap_button-clear rhap_main-controls-button rhap_skip-button" type="button">
                            <RiSkipBackMiniFill />
                        </button>
                        <button aria-label="Rewind" onClick={() => rewind(currentTime - 5)} className="rhap_button-clear rhap_main-controls-button rhap_rewind-button" type="button">
                            <RiRewindMiniFill />
                        </button>
                        <button aria-label="Play/Pause" onClick={() => dispatch(!audio.isPlaying ? play() : pause())} className="rhap_button-clear rhap_main-controls-button rhap_play-pause-button" type="button">

                            {audio.isPlaying ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6.6c0-.56 0-.84.1-1.05a1 1 0 0 1 .45-.44C6.76 5 7.04 5 7.6 5h.8c.56 0 .84 0 1.05.1a1 1 0 0 1 .44.45c.11.21.11.49.11 1.05v10.8c0 .56 0 .84-.1 1.05a1 1 0 0 1-.45.44c-.21.11-.49.11-1.05.11h-.8c-.56 0-.84 0-1.05-.1a1 1 0 0 1-.44-.45C6 18.24 6 17.96 6 17.4V6.6Zm8 0c0-.56 0-.84.1-1.05a1 1 0 0 1 .45-.44C14.76 5 15.04 5 15.6 5h.8c.56 0 .84 0 1.05.1a1 1 0 0 1 .44.45c.11.21.11.49.11 1.05v10.8c0 .56 0 .84-.1 1.05a1 1 0 0 1-.45.44c-.21.11-.49.11-1.05.11h-.8c-.56 0-.84 0-1.05-.1a1 1 0 0 1-.44-.45c-.11-.21-.11-.49-.11-1.05V6.6Z"></path></svg>

                                :
                                <RiPlayMiniFill />
                            }

                        </button>
                        <button aria-label="Forward" onClick={() => rewind(currentTime + 5)} className="rhap_button-clear rhap_main-controls-button rhap_forward-button" type="button">
                            <RiRewindMiniFill style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <button aria-label="Skip" onClick={() => { skip() }} className="rhap_button-clear rhap_main-controls-button rhap_skip-button" type="button">
                            <RiSkipForwardMiniFill />
                        </button>
                    </div>
                    <div className="rhap_volume-controls">
                        <div className="rhap_volume-container">
                            <button onClick={() => dispatch(mute())} aria-label="Muting" type="button" className="rhap_button-clear rhap_volume-button">
                                {audio.muted ?
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M3 9h4l5-5v16l-5-5H3V9m13.59 3L14 9.41L15.41 8L18 10.59L20.59 8L22 9.41L19.41 12L22 14.59L20.59 16L18 13.41L15.41 16L14 14.59L16.59 12z" fill="currentColor"></path></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77c0-4.28-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"></path></svg>
                                }</button>
                            <div aria-label="Volume control" className="rhap_volume-bar-area">
                                <input type="range" value={audio.volume} onChange={(e) => dispatch(volume(e.target.valueAsNumber))} className="rhap_volume-bar" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AudioPlayer;
