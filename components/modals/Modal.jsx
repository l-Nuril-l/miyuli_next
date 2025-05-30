"use client";
import { forwardRef, useRef } from 'react';
import { createPortal } from 'react-dom';
import ConditionalWrap from '../ConditionalWrap';

const Modal = forwardRef((props, ref) => {
    const { isOpen = true, isLoading, onClose, minimized, protal = true } = props;
    const closeAccess = useRef(false);

    // Проверяем, доступен ли document и существует ли modalRootElement
    const modalRootElement = typeof document !== 'undefined' ? document.querySelector("#modal") : null;

    if (isOpen) {
        const modalContent = (
            <ConditionalWrap
                condition={!minimized}
                wrap={(children) => (
                    <div
                        ref={ref}
                        className={'modal modal_background'}
                        onMouseDown={e => { closeAccess.current = e.target === e.currentTarget }}
                        onMouseUp={(e) => {
                            if (e.target === e.currentTarget) {
                                closeAccess.current !== true ? closeAccess.current = false : onClose(false);
                            }
                        }}
                    >
                        {isLoading ? <div className='loader'></div> : props.children}
                    </div>
                )}
            >
                {props.children}
            </ConditionalWrap>
        );

        // If protal is true, use createPortal; otherwise, return modalContent directly
        return protal && modalRootElement ? createPortal(modalContent, modalRootElement) : modalContent;
    }
    return null; // Возвращаем null, если модальное окно не открыто
});

Modal.displayName = "Modal";

export default Modal;
