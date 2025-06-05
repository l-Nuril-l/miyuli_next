"use client";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

import { applyAudioCache, pause, play, previous, setDownloadProgress, skip, stop } from '@/lib/features/audio';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { AudioPlayerContext } from '../contexts';


const AudioService = ({ children }) => {
    const audio = useAppSelector((s) => s.audio)
    const dispatch = useAppDispatch();
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const player = useRef();

    const mediaSource = useRef();

    useEffect(() => {
        mediaSource.current = new MediaSource();
    }, []);

    const abortControllerRef = useRef(new AbortController());
    const sourceBuffer = useRef(null);

    useEffect(() => {
        audio.isPlaying ? player.current.audioEl.current?.paused && player.current.audioEl.current?.play().catch(() => dispatch(pause())) : player.current.audioEl.current?.pause();
    }, [dispatch, audio.isPlaying]);

    const isLoadedRef = useRef(false);

    const [currentTime, setCurrentTime] = useState(0);

    const getIterationSize = (i) => {
        if (i === 1) return 100000 - 1;
        if (i === 2) return 200000 - 1;
        if (i >= 3) return 700000 - 1;
        console.log("Error")
    }

    useEffect(() => {
        if (!audio.audio?.id) return;
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: audio.audio.name,
                artist: audio.audio.artist,
                album: "The Ultimate Collection (Remastered)",
                ...(audio.audio.imageId ? {
                    artwork: [
                        // {
                        //     src: "https://dummyimage.com/96x96",
                        //     sizes: "96x96",
                        //     type: "image/png",
                        // },
                        // {
                        //     src: "https://dummyimage.com/128x128",
                        //     sizes: "128x128",
                        //     type: "image/png",
                        // },
                        // {
                        //     src: "https://dummyimage.com/192x192",
                        //     sizes: "192x192",
                        //     type: "image/png",
                        // },
                        {
                            src: API_URL + "audio/picture/" + audio.audio.imageId,
                            sizes: "256x256",
                            type: "image/png",
                        },
                        // {
                        //     src: "https://dummyimage.com/384x384",
                        //     sizes: "384x384",
                        //     type: "image/png",
                        // },
                        // {
                        //     src: "https://dummyimage.com/512x512",
                        //     sizes: "512x512",
                        //     type: "image/png",
                        // },
                    ]
                } : {})
            });
            navigator.mediaSession.setActionHandler("play", () => {
                dispatch(play());
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                dispatch(pause());
            });
            navigator.mediaSession.setActionHandler("stop", () => {
                dispatch(stop());
                player.current.audioEl.current.currentTime = 0
                setCurrentTime(0);
                player.current.audioEl.current.load();
            });
            navigator.mediaSession.setActionHandler("seekbackward", () => {
                player.current.audioEl.current.currentTime - 10
            });
            navigator.mediaSession.setActionHandler("seekforward", () => {
                player.current.audioEl.current.currentTime + 10
            });
            navigator.mediaSession.setActionHandler("seekto", (e) => {
                let newTime = e.seekTime < 0 ? 0 : e.seekTime > audio.audio.duration ? audio.audio.duration : e.seekTime;
                player.current.audioEl.current.currentTime = newTime;
                setCurrentTime(newTime);
            });
            navigator.mediaSession.setActionHandler("previoustrack", () => {
                dispatch(previous());
            });
            navigator.mediaSession.setActionHandler("nexttrack", () => {
                dispatch(skip());
            });

            navigator.mediaSession.setPositionState({
                duration: player.current.audioEl.current.currentTime.d,
                playbackRate: 1,
                position: player.current.audioEl.current,
            });
        }
    }, [audio.audio?.id, audio.audio?.artist, audio.audio?.imageId, audio.audio?.name, audio.audio?.duration, dispatch, API_URL]);

    const getNextSegment = useCallback((startByte, iteration = 1) => {
        if (isLoadedRef.current) return;
        if (iteration >= 5) return;
        isLoadedRef.current = true;

        console.log(sourceBuffer.current)

        // Fetch the next segment of the audio file
        axios.get(`audio/stream/${audio.audio.id}`, {
            responseType: 'arraybuffer',
            headers: { Range: `bytes=${startByte}-${startByte + getIterationSize(iteration)}` },
            signal: abortControllerRef.current.signal
        })
            .then(response => {
                console.log(response)

                const contentLength = response.headers['content-length'];
                const end = startByte + contentLength;

                dispatch(setDownloadProgress(end * 100 / audio.audio.size))

                if (end === audio.audio.size) {
                    mediaSource.current.endOfStream();
                    console.log('Reached end of audio file');
                    return;
                }

                sourceBuffer.current.appendBuffer(response.data);

                isLoadedRef.current = false;

                // Continue loading the next segment
                setTimeout(() => getNextSegment(end + 1, iteration + 1), 1000)

            })
            .catch(error => console.error(error));
    }, [dispatch, audio.audio?.id, audio.audio?.size]);

    useEffect(() => {
        // const secondsToStartPos = (seconds, size) => {
        //     return Math.trunc(audio.audio?.size / audio?.duration * seconds)
        // }

        if (player.current.audioEl.current /*&& !rewind check! */) {
            // player.current.audioEl.current.pause();

            // if (!sourceBuffer.current) return
            // for (let index = 0; index < sourceBuffer.current.buffered.length; index++) {
            //     if (sourceBuffer.current.buffered.start(index) <= audio.rewindTime && sourceBuffer.current.buffered.end(index) >= audio.rewindTime) {
            //         console.log("EXIST")
            //         dispatch(play())
            //     }
            //     else {
            //         abortControllerRef.current.abort()
            //         abortControllerRef.current = new AbortController();
            //         const func = () => {
            //             sourceBuffer.current.timestampOffset = audio.rewindTime;
            //             sourceBuffer.current.removeEventListener('updateend', func);
            //         };
            //         sourceBuffer.current.addEventListener('updateend', func);
            //         getNextSegment(secondsToStartPos(audio.rewindTime))
            //         console.log("NOT EXIST")
            //     }

            // }
        }
    }, [dispatch, getNextSegment, audio.audio?.size, audio?.duration]);

    // useEffect(() => {
    //     if (!audio.audio?.id) return
    //     let mediaSourceLink = mediaSource.current;
    //     let audioElement = player.current.audioEl.current;
    //     const onSourceOpen = () => {
    //         sourceBuffer.current = mediaSource.current.addSourceBuffer('audio/mpeg;'); //codecs="mp4a.40.2"

    //         //sourceBuffer.current.timestampOffset = 60;
    //         // player.current.audioEl.current.currentTime = 0;

    //         // sourceBuffer.current.addEventListener('updateend', () => {
    //         //     console.log(123)
    //         // });
    //         getNextSegment(0);
    //     }
    //     mediaSource.current.addEventListener("sourceopen", onSourceOpen)
    //     audioElement.src = URL.createObjectURL(mediaSource.current)
    //     let abortController = abortControllerRef.current;
    //     return () => {
    //         abortController.abort()
    //         abortControllerRef.current = new AbortController();
    //         audioElement.pause()
    //         URL.revokeObjectURL(audioElement.src);
    //         mediaSourceLink.removeSourceBuffer(sourceBuffer.current)
    //         mediaSourceLink.removeEventListener("sourceopen", onSourceOpen)
    //     };
    // }, [dispatch, audio.audio?.id, getNextSegment]);

    const rewindToPercent = (percent) => {
        var newTime = audio.duration * percent / 100;
        player.current.audioEl.current.currentTime = newTime;
        setCurrentTime(newTime)
    }

    const rewind = (newTime) => {
        newTime = newTime < 0 ? 0 : newTime > audio.duration ? audio.duration : newTime;
        player.current.audioEl.current.currentTime = newTime;
        setCurrentTime(newTime);
    }

    const cacheInitialization = useRef(null);

    useEffect(() => {
        var cache = JSON.parse(localStorage.getItem("audio"));
        if (!cache) return;
        player.current.audioEl.current.currentTime = cache.currentTime ?? 0;
        setCurrentTime(cache.currentTime ?? 0)
        cacheInitialization.current = cache.id;
        dispatch(applyAudioCache({ ...cache }))
    }, [dispatch]);

    useEffect(() => {
        if (cacheInitialization.current == audio.audio?.id && audio.audio?.id != undefined) {
            cacheInitialization.current = null;
        }
        else {
            if (audio.audio?.id != undefined) {
                setCurrentTime(0);
            }
        }
    }, [audio.audio?.id]);

    useEffect(() => {
        if (!audio.audio?.id) { return; }
        const func = () => localStorage.setItem("audio", JSON.stringify({
            id: audio.audio.id,
            playlistId: audio.playlistId,
            authorId: audio.authorId,
            currentTime: player.current.audioEl.current.currentTime,
            volume: audio.volume,
            search: audio.search,
            isPlaying: audio.isPlaying,
        }));

        window.addEventListener("beforeunload", func);
        return () => {
            window.removeEventListener("beforeunload", func);
        };
    }, [audio]);

    const resetPlayer = () => {
        player.current.audioEl.current.pause()
        rewind(0)
    }

    return (
        <AudioPlayerContext.Provider value={{ currentTime, rewindToPercent, rewind, skip: () => { dispatch(skip()); resetPlayer() }, previous: () => { dispatch(previous()); resetPlayer() } }}>
            {children}
            <ReactAudioPlayer
                ref={player}
                // src={audio.stream}
                src={audio.audio ? API_URL + `audio/stream/${audio.audio.id}` : null}
                loop={audio.loop}
                muted={audio.muted}
                style={{ display: 'none' }}
                controls
                autoPlay={audio.isPlaying}
                volume={audio.volumeScaleType === "logarithmic" ? (audio.volume === 0 ? 0 : Math.pow(10, audio.volume / 50) / 100) : audio.volume / 100}
                listenInterval={200}
                onListen={x => { setCurrentTime(x) }}
                onEnded={() => { rewind(0); dispatch(skip()) }}
                onLoadedMetadata={setPositionState()}
                onSeeked={setPositionState()}
            />
        </AudioPlayerContext.Provider>
    );
}

export default AudioService;
