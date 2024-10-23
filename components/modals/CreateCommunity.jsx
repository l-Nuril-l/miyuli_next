"use client";
import { createCommunity } from '@/lib/features/community';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Modal from './Modal';





const CreateCommunity = (props) => {
    const t = useTranslations()
    const { onClose, isOpen } = props;
    const dispatch = useAppDispatch();
    const [name, setName] = useState("");
    const router = useRouter()
    const categories = useAppSelector(s => s.filters.categories)
    const [categoryId, setCategoryId] = useState(1);


    const createCommunityAction = () => {
        dispatch(createCommunity({ name, categoryId })).then(e => (e.payload) && router.push('/community/' + e.payload.id));
        onClose();
    }

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t('creatingCommunity')}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{t('category')}</Form.Label>
                    <Form.Select className="input_select" value={categoryId} onChange={x => setCategoryId(x.target.value)}>
                        {categories.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                    </Form.Select>
                </Form.Group>
            </div>
            <div className='modal-footer modal_footer'>
                <div onClick={() => onClose()}>{t('cancel')}</div>
                <button onClick={() => createCommunityAction()} className='btn_miyuli'>{t('createCommunity')}</button>
            </div>
        </div>
    </Modal>
}

export default CreateCommunity;