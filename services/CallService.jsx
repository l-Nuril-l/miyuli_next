"use client";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

import SmartInput from '@/components/SmartInput';
import ConservationCard from '@/components/call/ConversationCard';
import IncomingCall from '@/components/call/IncomingCall';
import MinimizedCall from '@/components/call/MinimizedCall';
import Modal from '@/components/modals/Modal';
import { RTCStates, callAccept, callAccepted, callDeclined, callEnded, getAccountCall } from '@/lib/features/call';
import classNames from 'classnames';
import freeice from 'freeice';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import BackCameraSvg from '../assets/BackCameraSvg';
import CameraSvg from '../assets/CameraSvg';
import HangUpSvg from '../assets/HangUpSvg';
import MicrophoneOffSvg from '../assets/MicrophoneOffSvg';
import MicrophoneSvg from '../assets/MicrophoneSvg';
import ScreenShareSvg from '../assets/ScreenShareSvg';
import SelfieCameraSvg from '../assets/SelfieCameraSvg';
import StopScreenShareSvg from '../assets/StopScreenShareSvg';
import { ConnectionContext } from '../contexts';
import './CallService.scss';


const ACTIONS = {
    JOIN: 'Join',
    LEAVE: 'Leave',
    SHARE_ROOMS: 'ShareRooms',
    ADD_PEER: 'AddPeer',
    REMOVE_PEER: 'RemovePeer',
    RELAY_SDP: 'RelaySdp',
    RELAY_ICE: 'RelayIce',
    ICE_CANDIDATE: 'IceCandidate',
    SESSION_DESCRIPTION: 'SessionDescription'
};

const POLITENESS = {
    POLITE: 'POLITE',
    IMPOLITE: 'IMPOLITE',
};

const STREAMS = {
    Audio: 'audio',
    Camera: 'camera',
    DisplayAudio: 'display_audio',
    DisplayVideo: 'display_video',
    DisplayBoth: 'display_both',
};

const CallService = () => {
    const t = useTranslations()
    const callStore = useAppSelector((s) => s.call)
    const authAccount = useAppSelector((s) => s.auth.account)
    const dispatch = useAppDispatch();
    const signalR = useContext(ConnectionContext)
    const peerConnections = useRef({});
    const dataChannel = useRef({});
    const localMediaStream = useRef(null);
    const localDisplayStream = useRef(null);
    const peerCameraStreams = useRef({})
    const peerMediaStreams = useRef({})
    const peerAudioStreams = useRef({})
    const peerAudioElements = useRef({})
    const peerDisplayStreams = useRef({})
    const [peerDisplayKeys, setPeerDisplayKeys] = useState([])
    const streamPosType = useRef({})
    const [, setForceRerender] = useState(false);
    const facingMode = useRef("user");
    const connectionState = useRef({});
    const isOpen = callStore.outgoingCall || callStore.call;
    const isOpenRef = useRef(false);
    const [enabledStreams, setEnabledStreams] = useState(callStore.settings);
    const [messages, setMessages] = useState([]);

    const politeness = useRef(POLITENESS.POLITE);
    //const isNegotiating = useRef(false); #MAKE ME FIX ME

    if (false) {
        console.log("LMS", localMediaStream.current)
        console.log("LCS", localMediaStream.current?.getVideoTracks()[0])
        console.log("LAS", localMediaStream.current?.getAudioTracks()[0])
        console.log("LDS", localDisplayStream.current)
        console.log("PCS", peerMediaStreams.current)
        console.log("PDS", peerDisplayStreams.current)
        console.log("PC", peerConnections.current)
        console.log("Senders", peerConnections.current[callStore.call]?.getSenders())
        console.log("Receivers", peerConnections.current[callStore.call]?.getReceivers())
        console.log("SPT", streamPosType.current)
    }

    /*  STAGE 1
        Register call with SignalR and init caller local media stream
    */
    /*  STAGE 2
        signalR.on("CallAccepted"
        Setup peer connections
     */
    const isLateMedia = useRef(false);

    useEffect(() => {
        if (!isOpen || localMediaStream.current) return;
        console.log("ENABLING REC")
        isOpenRef.current = true;
        let settings = {
            video: callStore.settings.video ? { facingMode: facingMode.current } : false,
            audio: callStore.settings.audio ? true : false
        }
        if (isOpenRef.current === false) return;
        navigator.mediaDevices.getUserMedia(settings).then(x => {

            localMediaStream.current = x
            setForceRerender(prev => !prev)
            console.log("REC ENABLED")
            //Ответный оффер был отправлен до того как стрим запустился

            const videoTracks = x.getVideoTracks();
            if (videoTracks && videoTracks.length > 0) {
                videoTracks[0].onended = function () {
                    setEnabledStreams({ ...enabledStreams, video: false })
                };
            }

            Object.entries(peerConnections.current).forEach(connection => {
                if (RTCStates.CONNECTED === connectionState.current[connection[0]] || isLateMedia.current) {
                    let attempt = 0;
                    var itId = setInterval(() => {
                        if (RTCStates.NONE === connectionState.current[connection[0]]) clearInterval(itId)
                        if (attempt++ > 30) {
                            clearInterval(itId)
                            // signalR.invoke("HangUp")
                            // disposeCall()
                            // dispatch(callEnded(callStore.call))
                            return
                        }
                        if (RTCStates.CONNECTED !== connectionState.current[connection[0]]) return;
                        //init callee after connected
                        localMediaStream.current?.getTracks().forEach(track => {
                            console.log("LATE ADD MEDIA")
                            const tt = x.kind === 'video' ? STREAMS.Camera : STREAMS.Audio;
                            connection[1].addTrack(track, localMediaStream.current)
                            dataChannel.current[connection[0]].send('+' + tt + ':' + (streamPosType.current[connection[0]].senders.push(tt) - 1))

                        })
                        clearInterval(itId)
                    }, isLateMedia.current ? 333 : 0)
                }
            })
        })
    }, [enabledStreams, isOpen, callStore.settings]);

    const onNegotiationNeededHandler = useCallback((userId, force) => {
        if (connectionState.current[userId] !== RTCStates.CONNECTED && !force) return;
        peerConnections.current[userId].createOffer().then(offer => {
            peerConnections.current[userId].setLocalDescription(offer)
            signalR.invoke(ACTIONS.RELAY_SDP, JSON.stringify(offer), userId)
        })
        console.log("Negotiation")
    }, [signalR])

    const onDescriptionHandler = useCallback(async (peerId, description) => {
        let remoteDescription = JSON.parse(description);
        await peerConnections.current[peerId].setRemoteDescription(remoteDescription)
        console.log("Description: Answer?")
        if (remoteDescription.type === 'offer') {
            console.log("Offer!")
            isLateMedia.current = localMediaStream.current === null;
            const answer = await peerConnections.current[peerId].createAnswer()
            politeness.current = POLITENESS.IMPOLITE
            await peerConnections.current[peerId].setLocalDescription(answer)
            signalR.invoke(ACTIONS.RELAY_SDP, JSON.stringify(answer), peerId)
            console.log("ANSWER CREATED")
        }
    }, [signalR])

    const handleNewPeer = useCallback((peerId) => {
        console.log("NEW PEER", peerId)
        if (connectionState.current[peerId] === RTCStates.OFFER || connectionState.current[peerId] === RTCStates.ANSWER) {
            peerConnections.current[peerId] = new RTCPeerConnection({
                iceServers: freeice().concat(JSON.parse(process.env.NEXT_PUBLIC_APP_ICE_SERVERS)),
            });
            streamPosType.current[peerId] = { receivers: {}, senders: [] };
            peerConnections.current[peerId].onicecandidate = (e) => {
                if (e.candidate) signalR.invoke(ACTIONS.RELAY_ICE, JSON.stringify(e.candidate), peerId)
            }
            peerConnections.current[peerId].ontrack = x => {
                console.log('onTrack')
                console.log(x)
                console.log(x.streams[0])
                console.log(x.streams[0].getTracks())

                //v3
                if (!peerMediaStreams.current[peerId] || peerMediaStreams.current[peerId].id === x.streams[0].id) {
                    console.log("media stream")
                    peerMediaStreams.current[peerId] = x.streams[0]
                    if (x.track.kind === 'video') {
                        peerCameraStreams.current[peerId] = new MediaStream();
                        peerCameraStreams.current[peerId].addTrack(x.track)
                        console.log("VIDEO GOT")
                    }
                    else {
                        peerAudioStreams.current[peerId] = new MediaStream();
                        peerAudioStreams.current[peerId].addTrack(x.track)
                        peerAudioElements.current[peerId] = new Audio();
                        peerAudioElements.current[peerId].srcObject = peerAudioStreams.current[peerId];
                        peerAudioElements.current[peerId].play()
                        // Broken
                        // const audioContext2 = new AudioContext();
                        // const mediaStreamSource = audioContext2.createMediaStreamSource(peerAudioStreams.current[peerId]);
                        // var audioDestination = audioContext2.destination;
                        // var gainNode = audioContext2.createGain();
                        // mediaStreamSource.connect(gainNode);
                        // gainNode.connect(audioDestination);
                    }
                }
                else {
                    console.log("display stream")
                    peerDisplayStreams.current[peerId] = x.streams[0]
                    setPeerDisplayKeys(prev => prev.includes(peerId) ? prev : [...prev, peerId])
                }

                //pre v4 (old v2)
                // switch (streamIdType.current[x.streams[0].id]) {
                //     case 'screen': {
                //         peerDisplayStreams.current[peerID] = x.streams[0]
                //         break;
                //     }
                //     case 'camera': {
                //         peerMediaStreams.current[peerID] = x.streams[0]
                //         break;
                //     }
                //     default:
                //         peerMediaStreams.current[peerID] = x.streams[0]
                // }
                setForceRerender(prev => !prev)
            }
            localMediaStream.current?.getTracks().forEach(x => {
                console.log("INIT ADD CAMERA")
                streamPosType.current[peerId].senders.push(x.kind === 'video' ? STREAMS.Camera : STREAMS.Audio)
                peerConnections.current[peerId].addTrack(x, localMediaStream.current)
            })
            localDisplayStream.current?.getTracks().forEach(x => {
                console.log("INIT ADD DISPLAY")
                streamPosType.current[peerId].senders.push(x.kind === 'video' ? STREAMS.DisplayVideo : STREAMS.DisplayAudio)
                peerConnections.current[peerId].addTrack(x, localDisplayStream.current)
            })
            peerConnections.current[peerId].onnegotiationneeded = () => onNegotiationNeededHandler(peerId)
        }

        const handleChannel = () => {
            dataChannel.current[peerId].onopen = () => {
                console.log("Opened");
                connectionState.current[peerId] = RTCStates.CONNECTED;
                dataChannel.current[peerId].send(" :" + JSON.stringify(streamPosType.current[peerId].senders))
                //setForceRerender(x => !x) //caller remote video
            }
            dataChannel.current[peerId].onmessage = (e) => {
                var res = e.data.split(':')
                if (res.length === 2) {
                    console.log(res[0][0] + "onmessage")
                    switch (res[0][0]) {
                        case '+': {
                            streamPosType.current[peerId].receivers[res[0].substring(1)] = res[1];
                            break;
                        }
                        case '-': {
                            if (res[0].substring(1) === STREAMS.DisplayBoth) {
                                delete streamPosType.current[peerId].receivers[STREAMS.DisplayAudio];
                                delete streamPosType.current[peerId].receivers[STREAMS.DisplayVideo];
                            }
                            else
                                delete streamPosType.current[peerId].receivers[res[0].substring(1)];
                            break;
                        }
                        case ' ': {
                            console.log("trackCFG")
                            streamPosType.current[peerId].receivers =
                                JSON.parse(res[1]).reduce((acc, curr, index) => {
                                    acc[curr] = index;
                                    return acc;
                                }, {});
                            break;
                        }
                    }
                    setForceRerender(prev => !prev)
                }
                else {
                    setMessages(prev => [...prev, peerId + ": " + e.data])
                }
            }
        }
        if (connectionState.current[peerId] === RTCStates.OFFER) {
            //1
            dataChannel.current[peerId] = peerConnections.current[peerId].createDataChannel('text');
            handleChannel();
            onNegotiationNeededHandler(peerId, true)
            console.log("OFFER INIT END")
            //1/
        }
        else if (connectionState.current[peerId] === RTCStates.ANSWER) {
            //2
            peerConnections.current[peerId].ondatachannel = e => {
                dataChannel.current[peerId] = e.channel
                handleChannel();
            }
            console.log("ANSWER INIT END")
            //2/
        }
    }, [onNegotiationNeededHandler, signalR])

    useEffect(() => {
        if (!signalR) return
        signalR.on(ACTIONS.SESSION_DESCRIPTION, (userId, description) => {
            console.log("SESSION_DESCRIPTION_RECEIVED", connectionState.current[userId])
            if (connectionState.current[userId] === undefined) {
                dispatch(getAccountCall(userId))
                connectionState.current[userId] = RTCStates.ANSWER;
            }

            console.log("🚀IS IS NEW")
            if (connectionState.current[userId] === RTCStates.ANSWER) {
                console.log("🚀IS NEW")
                handleNewPeer(userId)
            }
            onDescriptionHandler(userId, description)

            console.log("SESSION_DESCRIPTION_END", connectionState.current[userId])
        });
        return () => {
            signalR.off(ACTIONS.SESSION_DESCRIPTION)
        }
    }, [signalR, onDescriptionHandler, handleNewPeer, dispatch]);

    useEffect(() => {
        if (!signalR) return
        signalR.on("CallAccepted", (userId, chatId) => {
            connectionState.current[userId] = RTCStates.OFFER
            handleNewPeer(userId)
            dispatch(callAccepted(chatId ? chatId : userId))
            dispatch(getAccountCall(userId))
        });
        return () => {
            signalR.off("CallAccepted")
        }
    }, [signalR, handleNewPeer, dispatch]);

    const disposeUser = useCallback((id) => {
        peerConnections.current[id]?.close()
        delete peerConnections.current[id]

        peerMediaStreams.current[id]?.getTracks().forEach(track => track.stop()) // auto stop after PEER?
        delete peerMediaStreams.current[id]

        peerDisplayStreams.current[id]?.getTracks().forEach(track => track.stop()) // auto stop after PEER?
        delete peerDisplayStreams.current[id]

        delete peerCameraStreams.current[id]
        delete peerAudioStreams.current[id]
        delete peerAudioElements.current[id]
        delete connectionState.current[id]
        delete streamPosType.current[id]
        setPeerDisplayKeys([]) //setForceRerender(s => !s)
        //politeness.current = POLITENESS.POLITE;
        //streamPosType.current = {};
    }, [])

    const disposeCall = useCallback(() => {
        Object.keys(peerConnections.current).forEach(key => {
            peerConnections.current[key].close()
        })
        peerConnections.current = {}
        Object.keys(peerMediaStreams.current).forEach(key => {
            peerMediaStreams.current[key].getTracks().forEach(track => track.stop())
        })
        peerMediaStreams.current = {}
        Object.keys(peerDisplayStreams.current).forEach(key => {
            peerDisplayStreams.current[key].getTracks().forEach(track => track.stop())
        })
        peerDisplayStreams.current = {}
        peerCameraStreams.current = {}
        peerAudioStreams.current = {}
        peerAudioElements.current = {}
        connectionState.current = {}
        streamPosType.current = {};
        setMinimized(false)

        setMessages([])
        setPeerDisplayKeys([])
        politeness.current = POLITENESS.POLITE;
    }, [])

    const disposeAll = useCallback(() => {
        localDisplayStream.current?.getTracks().forEach(track => track.stop());
        localDisplayStream.current = null;
        localMediaStream.current?.getTracks().forEach(track => track.stop())
        localMediaStream.current = null;
        disposeCall()
    }, [disposeCall])

    useEffect(() => {
        if (isOpen) return;
        isOpenRef.current = false;
        disposeAll();
        setEnabledStreams(callStore.settings)
    }, [isOpen, callStore.settings, disposeAll]);

    useEffect(() => {
        if (!signalR) return
        signalR.on("CallEnded", (userId, reason) => {
            dispatch(callEnded(userId, reason))
            disposeUser(userId);
        });
        return () => {
            signalR.off("CallEnded")
        }
    }, [signalR, dispatch, disposeUser]);

    useEffect(() => {
        if (!signalR) return
        signalR.on(ACTIONS.ICE_CANDIDATE, (peerID, iceCandidate) => {
            console.log('ice', peerID)
            peerConnections.current[peerID].addIceCandidate(
                JSON.parse(iceCandidate)
            );
        });

        return () => {
            signalR.off(ACTIONS.ICE_CANDIDATE);
        }
    }, [signalR]);

    useEffect(() => {
        console.log("SWITCH VIDEO")
        if (!localMediaStream.current) return;
        let connections = Object.entries(peerConnections.current);
        if (enabledStreams.video) {
            if (!localMediaStream.current || localMediaStream.current.getVideoTracks[0]) {
                console.log("CAM ALREADY ON")
                return;
            }
            console.log("CAMERA ON")
            navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode.current } }).then(newStream => {
                let newVideoTrack = newStream.getVideoTracks()[0]
                newVideoTrack.onended = function () {
                    setEnabledStreams(prev => { return { ...prev, video: false } })
                };
                localMediaStream.current.addTrack(newVideoTrack)
                connections.forEach(connEntry => {
                    var index = streamPosType.current[connEntry[0]].senders.findIndex(x => x === STREAMS.Camera)
                    if (index !== -1) {
                        let sender = connEntry[1].getSenders()[index]
                        sender.replaceTrack(newVideoTrack)
                        connectionState.current[connEntry[0]] === RTCStates.CONNECTED && dataChannel.current[connEntry[0]].send("+" + STREAMS.Camera + ':' + index)
                        console.log("заменой")
                    }
                    else {
                        connEntry[1].addTrack(newVideoTrack, localMediaStream.current)
                        connectionState.current[connEntry[0]] === RTCStates.CONNECTED && dataChannel.current[connEntry[0]].send("+" + STREAMS.Camera + ':' + (streamPosType.current[connEntry[0]].senders.push(STREAMS.Camera) - 1))
                    }
                })
            })

        }
        else {
            console.log("CAMERA OFF")
            let track = localMediaStream.current.getVideoTracks()[0]
            if (track == null) return;
            track.stop()
            localMediaStream.current.removeTrack(track);
            connections.forEach(connEntry => {
                connectionState.current[connEntry[0]] === RTCStates.CONNECTED && dataChannel.current[connEntry[0]].send("-" + STREAMS.Camera + ':')
            })
        }
    }, [enabledStreams.video]);

    useEffect(() => {
        console.log("SWITCH DISPLAY")
        let connections = Object.entries(peerConnections.current);
        const options = { audio: true, video: true };
        if (enabledStreams.display) {
            navigator.mediaDevices.getDisplayMedia(options)
                .then(displayStream => {
                    localDisplayStream.current = displayStream
                    displayStream.getVideoTracks()[0].onended = function () {
                        setEnabledStreams(prev => { return { ...prev, display: false } })
                    };
                    displayStream.getTracks().forEach(track => {
                        connections.forEach(connEntry => {
                            const tt = track.kind === 'video' ? STREAMS.DisplayVideo : STREAMS.DisplayAudio;
                            var index = streamPosType.current[connEntry[0]].senders.findIndex(x => x === tt)
                            if (index !== -1) {
                                console.log("ReplaceDisplay")
                                let sender = connEntry[1].getSenders()[index]
                                sender.replaceTrack(track)
                                connectionState.current[connEntry[0]] === RTCStates.CONNECTED && dataChannel.current[connEntry[0]].send("+" + tt + ':' + index)
                            }
                            else {
                                console.log("NewDisplay")
                                connEntry[1].addTrack(track, localDisplayStream.current)
                                connectionState.current[connEntry[0]] === RTCStates.CONNECTED && dataChannel.current[connEntry[0]].send("+" + tt + ':' + (streamPosType.current[connEntry[0]].senders.push(tt) - 1))
                            }
                        })
                    })
                    setForceRerender(prev => !prev)
                }).catch(() => {
                    setEnabledStreams(prev => { return { ...prev, display: false } })
                });
        }
        else {
            if (!localDisplayStream.current) return;

            localDisplayStream.current.getTracks().forEach(track => {
                connections.forEach(connection => {
                    let senders = connection[1].getSenders();
                    senders.forEach(sender => {
                        if (sender.track && sender.track.id === track.id) {
                            connection[1].removeTrack(sender);
                        }
                    })
                });
                track.stop()
            })
            connections.forEach(connEntry => {
                connectionState.current[connEntry[0]] === RTCStates.CONNECTED && dataChannel.current[connEntry[0]].send("-" + STREAMS.DisplayBoth + ':')
            })
            localDisplayStream.current = null;
        }
    }, [enabledStreams.display]);

    useEffect(() => {
        console.log("MICROPHONE", enabledStreams.audio)
        if (localMediaStream.current)
            localMediaStream.current.getAudioTracks()[0].enabled = enabledStreams.audio;
    }, [enabledStreams.audio]);

    //Outgoing call 30s limit
    useEffect(() => {
        if (!callStore.outgoingCall) return
        let timeoutId = setTimeout(() => {
            signalR.invoke("HangUp")
            dispatch(callDeclined(callStore.outgoingCall))
        }, 30000)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [dispatch, callStore.outgoingCall, signalR]);

    const [minimized, setMinimized] = useState(false);

    return (
        <>
            {callStore.incomingCalls.map(x => <IncomingCall
                key={x.accountId}
                id={x.accountId}
                onAccept={() => {
                    dispatch(callAccept(x))
                    connectionState.current[x.accountId] = RTCStates.ANSWER
                    signalR.invoke(x.chatId ? "AnswerGroupCall" : "AnswerCall", true, x.chatId ? x.chatId : x.accountId)
                }}
                onDecline={() => {
                    signalR.invoke(x.chatId ? "AnswerGroupCall" : "AnswerCall", false, x.chatId ? x.chatId : x.accountId)
                    dispatch(callDeclined(x))
                }} />
            )}
            <Modal isOpen={isOpen} minimized={minimized} onClose={() => setMinimized(true)}>
                {minimized ?
                    <MinimizedCall onMaximize={() => setMinimized(false)}></MinimizedCall>
                    :
                    <div className='modal-body modal_body modal_call'>
                        <div className="call_container">
                            <div className="call_top">
                                {callStore.outgoingCall && <div>{`Исходящий звонок к ${callStore.outgoingCall}`}</div>}
                            </div>
                            <div className="calls_wrapper">
                                <ConservationCard account={authAccount} stream={enabledStreams.video ? localMediaStream.current : null} muted></ConservationCard>
                                {enabledStreams.display && <ConservationCard account={authAccount} stream={localDisplayStream.current} muted></ConservationCard>}
                                {Object.keys(peerConnections.current).map(x => callStore.accounts[x] && <ConservationCard tag="bruhPC" key={x} disabled={!streamPosType.current[x].receivers[STREAMS.Camera]} account={callStore.accounts[x]} stream={peerCameraStreams.current[x]}></ConservationCard>)}
                                {peerDisplayKeys.map(x => <ConservationCard key={x} display disabled={!streamPosType.current[x].receivers[STREAMS.DisplayVideo]} account={callStore.accounts[x]} stream={peerDisplayStreams.current[x]}></ConservationCard>)}
                            </div>
                            <div className="call_controls">
                                <button className='btn_miyuli btn_miyuli--rounded' onClick={() => { facingMode.current = facingMode.current === "user" ? "environment" : "user"; setForceRerender(r => !r) }}>
                                    {facingMode.current === "user" ? <SelfieCameraSvg /> : <BackCameraSvg />}
                                </button>
                                <button className={classNames("btn_miyuli btn_miyuli--rounded", enabledStreams.video && 'btn_miyuli--enabled')} onClick={() => setEnabledStreams({ ...enabledStreams, video: !enabledStreams.video })}>
                                    <CameraSvg />
                                </button>
                                {typeof navigator !== 'undefined' && 'getDisplayMedia' in navigator.mediaDevices && <button className="btn_miyuli btn_miyuli--rounded" onClick={() => setEnabledStreams({ ...enabledStreams, display: !enabledStreams.display })}>
                                    {enabledStreams.display ? <ScreenShareSvg /> : <StopScreenShareSvg />}
                                </button>}
                                <button className="btn_miyuli btn_miyuli--rounded" onClick={() => setEnabledStreams({ ...enabledStreams, audio: !enabledStreams.audio })}>
                                    {enabledStreams.audio ? <MicrophoneSvg /> : <MicrophoneOffSvg />}
                                </button>
                                <button className="btn_miyuli btn_miyuli--rounded btn_miyuli--danger" onClick={() => {
                                    signalR.invoke("HangUp")
                                    disposeCall()
                                    dispatch(callEnded(callStore.call))
                                }}>
                                    <HangUpSvg />
                                </button>
                            </div>
                        </div>
                        <div className='p2p_chat'>
                            <h3>{t("p2pChatAbout")}</h3>
                            <div className="messages_wrap">
                                {messages.map((e, i) => <div key={i} className="message">
                                    {e}
                                </div>)}
                            </div>
                            <SmartInput onSend={(text) => {
                                Object.entries(connectionState.current).forEach(x => {
                                    if (x[1] === RTCStates.CONNECTED) {
                                        dataChannel.current[x[0]].send(text)
                                        setMessages(prev => [...prev, "YOU: " + text])
                                    }
                                })
                            }} />
                        </div>
                    </div>}
            </Modal>
        </>
    )

}

export default CallService;