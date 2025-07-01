"use client";
import { formatTime } from '@/lib/functions';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { FaBackward, FaCompress, FaExpand, FaForward, FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { MdPictureInPictureAlt, MdSlowMotionVideo } from "react-icons/md";
import ReactPlayer from 'react-player';
import useClickOutside from '../hooks/useClickOutside';
import './VideoPlayer.scss';

const VideoPlayer = ({ url }) => {
    const [isOpenSpeedModal, setIsOpenSpeedModal] = useState(false);
    const videoRef = useRef();
    const playerRef = useRef();
    const timelineRef = useRef();
    const rafRef = useRef();
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMouseOverProgress, setIsMouseOverProgress] = useState(false);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(null);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [localSliderPercent, setLocalSliderPercent] = useState(null);
    const [isRewinding, setIsRewinding] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [hover, setHover] = useState(false);
    const [pip, setPip] = useState(false);

    useEffect(() => {
        const handleSC = () => {
            setIsFullScreen(document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleSC)
        return () => {
            document.removeEventListener('fullscreenchange', handleSC)
        };
    }, []);

    useEffect(() => {
        const updateProgress = () => {
            if (videoRef.current && isPlaying && !isRewinding) {
                setProgress(videoRef.current.currentTime);
            }
            rafRef.current = requestAnimationFrame(updateProgress);
        };

        if (isPlaying && !isRewinding) {
            rafRef.current = requestAnimationFrame(updateProgress);
        } else {
            cancelAnimationFrame(rafRef.current);
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, [isPlaying, isRewinding]);

    const eventToPercent = (e) => {
        var bounds = timelineRef.current.getBoundingClientRect();
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
            const percent = eventToPercent(e);
            videoRef.current.currentTime = percent * duration / 100;
            setProgress(videoRef.current.currentTime);
            setIsRewinding(false)
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
        };
    }, [isRewinding, duration]);

    useEffect(() => {
        if (isFullScreen) playerRef.current.requestFullscreen();
        else if (document.fullscreenElement) document.exitFullscreen();
    }, [isFullScreen]);

    const speedModalRef = useClickOutside(() => setIsOpenSpeedModal(false));

    const getTimePos = () => {
        const size = formatTime(duration * localSliderPercent / 100).length / 2 * 8;
        const pos = timelineRef.current?.clientWidth * localSliderPercent / 100
        if (pos + size > timelineRef.current?.clientWidth) {
            return timelineRef.current?.clientWidth - size;
        }
        if (pos - size < 0) {
            return size;
        }
        return pos;
    }

    return (
        <div ref={playerRef} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={classNames("video_player z-50", (hover || isRewinding) && "show-controls")}>
            <div className="wrapper">
                <div ref={timelineRef} className="video-timeline" onMouseEnter={() => setIsMouseOverProgress(true)} onMouseLeave={() => setIsMouseOverProgress(false)} onMouseDown={() => { setIsRewinding(true) }} onMouseMove={(e) => setLocalSliderPercent(eventToPercent(e))}>
                    <div className="progress-area">
                        {(isMouseOverProgress || isRewinding) && <span style={{ 'left': getTimePos() + 'px' }}>{formatTime(duration * localSliderPercent / 100) ?? '00:00'}</span>}
                        <div className="progress_bar"
                            style={{ width: (isRewinding ? localSliderPercent : progress * 100 / duration) + '%' }} />
                    </div>
                </div>
                <ul className="video-controls">
                    <li className="options left">
                        <button onClick={() => setMuted(p => !p)} className="volume">{volume === 0 || muted ? <FaVolumeMute /> : <FaVolumeUp />} </button>
                        <input onChange={(e) => { setMuted(false); setVolume(e.target.valueAsNumber) }} value={muted ? 0 : volume} type="range" min={0} max={1} step="any" />
                        <div className="video-timer">
                            <p className="current-time">{formatTime(progress) ?? '00:00'}</p>
                            <p className="separator"> / </p>
                            <p className="video-duration">{formatTime(duration) ?? '00:00'}</p>
                        </div>
                    </li>
                    <li className="options center">
                        <button onClick={() => videoRef.current.currentTime -= 5} className="skip-backward"><FaBackward /></button>
                        <button onClick={() => isPlaying ? setIsPlaying(false) : setIsPlaying(true)} className="play-pause">{isPlaying ? <FaPause /> : <FaPlay />}</button>
                        <button onClick={() => videoRef.current.currentTime += 5} className="skip-forward"><FaForward /></button>
                    </li>
                    <li className="options right">
                        <div ref={speedModalRef} className="playback-content">
                            <button onClick={() => setIsOpenSpeedModal(p => !p)} className="playback-speed" ><MdSlowMotionVideo /></button>
                            <ul className={classNames("speed-options", isOpenSpeedModal && "show")} onClick={(e) => setPlaybackRate(parseFloat(e.target.dataset.speed) ?? playbackRate)}>
                                {[2, 1.5, 1, 0.75, 0.5].map(x =>
                                    <li key={x} data-speed={x} className={classNames(playbackRate === x && "active")} >{x === 1 ? "Normal" : x + 'x'}</li>
                                )}
                            </ul>
                        </div>
                        <button onClick={() => setPip(!pip)} className="pic-in-pic"><MdPictureInPictureAlt /></button>
                        <button onClick={() => setIsFullScreen(p => !p)} className="fullscreen">{isFullScreen ? <FaCompress /> : <FaExpand />}</button>
                    </li>
                </ul>
            </div>
            {<ReactPlayer
                src={url}
                playing={isPlaying}
                autoPlay
                width='100%'
                height='100%'
                volume={muted ? 0 : volume}
                playbackRate={playbackRate}
                onDurationChange={e => setDuration(e.target.duration)}
                playsinline
                pip={pip}
                ref={videoRef}
                onLeavePictureInPicture={() => setPip(false)}
                onError={() => setIsPlaying(false)}
                onSeeked={(s) => setProgress(s.target.currentTime)}
                onPause={() => setIsPlaying(false)}
                onClick={() => setIsPlaying(p => !p)}
                onTimeUpdate={e => setProgress(e.target.currentTime)}
            />}
        </div >

    );
}

export default VideoPlayer;
