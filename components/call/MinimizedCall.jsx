"use client";
import { useRef } from 'react';
import Draggable from 'react-draggable';
import useWindowSize from '../../hooks/useWindowSize';

const MinimizedCall = ({ onMaximize }) => {
    const minimizedRef = useRef(null)
    useWindowSize();
    return (
        <Draggable
            cancel={".need-interaction"}
            defaultPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 3 }}
            bounds={{ left: 15, top: 15, right: window.innerWidth - minimizedRef.current?.offsetWidth - 15, bottom: window.innerHeight - minimizedRef.current?.offsetHeight - 15 }}
        >
            <div ref={minimizedRef} className="modal_minimized modal_call_minimized">
                <div onClick={() => { onMaximize() }} className="btn_miyuli need-interaction">Back to the call</div>
            </div>
        </Draggable>
    );
}

export default MinimizedCall;
