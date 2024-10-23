"use client";
import { useAppSelector } from '@/lib/hooks';
import { useRef } from 'react';
import Draggable from 'react-draggable';
import CallSvg from '../../assets/CallSvg';
import HangUpSvg from '../../assets/HangUpSvg';
import useWindowSize from '../../hooks/useWindowSize';
import Avatar from '../Avatar';
import Modal from '../modals/Modal';

const IncomingCall = ({ id, onAccept, onDecline }) => {
    const accounts = useAppSelector(s => s.call.accounts)
    const acc = accounts[id];
    const minimizedRef = useRef(null)

    useWindowSize();

    return (
        <Modal minimized isOpen={true}>
            <Draggable
                cancel={".need-interaction"}
                defaultPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 3 }}
                bounds={{ left: 15, top: 15, right: window.innerWidth - minimizedRef.current?.offsetWidth - 15, bottom: window.innerHeight - minimizedRef.current?.offsetHeight - 15 }}
            >
                <div ref={minimizedRef} className='modal_draggable modal_incoming_call'>
                    <div className='d-flex flex-column align-items-center'>
                        <Avatar size={80} avatar={acc?.avatar} crop={acc?.crop}></Avatar>
                        <div>{acc?.name}{' '}{acc?.name}</div>
                    </div>
                    <div className="actions">
                        <button className="btn_miyuli btn_miyuli--rounded btn_miyuli--success need-interaction" onClick={() => onAccept()}>
                            <CallSvg />
                        </button>
                        <button className="btn_miyuli btn_miyuli--rounded btn_miyuli--danger need-interaction" onClick={() => onDecline()}>
                            <HangUpSvg />
                        </button>
                    </div>
                </div>
            </Draggable>
        </Modal >
    );
}

export default IncomingCall;
