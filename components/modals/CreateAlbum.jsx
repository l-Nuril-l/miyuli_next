"use client";
import { createAlbum } from '@/lib/features/photo';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import ReactTextareaAutosize from 'react-textarea-autosize';
import "./CreateAlbum.scss";
import Modal from './Modal';

const CreateAlbum = (props) => {
    const t = useTranslations()
    const { onClose, isOpen, communityId } = props;
    const dispatch = useAppDispatch();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter()

    const createAlbumAction = () => {
        dispatch(createAlbum({ name, description, communityId })).then(e => (e.payload) && router.push(`/album/${-e.payload.communityId ?? e.payload.accountId}_${e.payload.id}`));
        onClose();
    }

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t('createAlbum')}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>{t('title')}</Form.Label>
                    <Form.Control className="input" maxLength={64} type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>{t('description')}</Form.Label>
                    <ReactTextareaAutosize className='input textarea' maxLength={2048} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
            </div>
            <div className='modal-footer modal_footer'>
                <div onClick={() => onClose()}>{t('cancel')}</div>
                <button onClick={() => createAlbumAction()} className='btn_miyuli'>{t('createAlbum')}</button>
            </div>
        </div>
    </Modal>
}

export default CreateAlbum;