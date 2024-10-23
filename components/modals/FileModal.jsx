"use client";
import { updateFile } from '@/lib/features/file';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Modal from './Modal';

const FileModal = (props) => {
    const t = useTranslations()
    const { onClose, file } = props;
    const dispatch = useAppDispatch();
    const [name, setName] = useState(file.name);

    const modalAction = () => {
        dispatch(updateFile({ id: file.id, name })).then(() => onClose());
    }

    return <Modal onClose={onClose}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t('editingFile')}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>{t('title')}</Form.Label>
                    <Form.Control className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
            </div>
            <div className='modal-footer modal_footer'>
                <div role="button" onClick={() => onClose()}>{t('cancel')}</div>
                <button onClick={() => modalAction()} className='btn_miyuli'>{t('save')}</button>
            </div>
        </div>
    </Modal>;
}

export default FileModal;