"use client";
import { disposeCommunities, getCommunitiesAdmin } from '@/lib/features/community';
import { sendPost } from '@/lib/features/posts';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import ReactTextareaAutosize from 'react-textarea-autosize';
import Modal from './Modal';




const ShareModal = ({ attachedCommunityId, attachedVideoId, attachedImageId, repostId, attachedAudioPlaylistId, videoPlaylistId, onClose }) => {
    const t = useTranslations()
    const [text, setText] = useState("");
    const [radio, setRadio] = useState(1);
    const [communityId, setCommunityId] = useState(1);
    const dispatch = useAppDispatch();
    const authStore = useAppSelector(s => s.auth.session);
    const communityStore = useAppSelector(s => s.community.communities)

    const share = () => {
        dispatch(sendPost({
            text,
            attachedCommunityId,
            attachVideosWithIds: attachedVideoId ? [attachedVideoId] : [],
            attachImagesWithIds: attachedImageId ? [attachedImageId] : [],
            repostId,
            accountId: radio === 1 ? authStore.id : null,
            communityId: radio === 2 ? communityId : null,
            attachedAudioPlaylistId,
            videoPlaylistId,
        }))
        onClose()
    }

    useEffect(() => {
        var cleanup;
        switch (radio) {
            case 2:
                dispatch(getCommunitiesAdmin())
                cleanup = () => dispatch(disposeCommunities());
                break;
            default:
                break;
        }
        return () => {
            if (cleanup !== undefined) cleanup()
        };
    }, [radio, dispatch]);

    return <Modal onClose={onClose}>
        <div className='modal_miyuli modal_share'>
            <div className='modal-header modal_header'>
                <div>{t('shareModal')}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                <Form.Group className="mb-3">
                    <Form.Check
                        onChange={() => setRadio(1)}
                        type="radio"
                        id={`on-my-page-radio`}
                        label={t("onMyWall")}
                        name="target"
                        checked={radio === 1}
                    />

                    <>
                        <Form.Check
                            onChange={() => { setRadio(2) }}
                            type="radio"
                            label={t("inMyCommuniy")}
                            id={`in-my-communiy-radio`}
                            name="target"
                        />
                        {radio === 2 && <Form.Select aria-label="Default select example" onChange={(x) => setCommunityId(x.target.value)}>
                            {communityStore.map(x => <option key={x.id} value={x.id}> {x.name}</option>)}
                        </Form.Select>}
                    </>
                    <Form.Control.Feedback type="valid">
                        You did it!
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>{t('yourMessage')}</Form.Label>
                    <ReactTextareaAutosize className='input textarea d-block w-100' value={text} onChange={(e) => setText(e.target.value)} />
                </Form.Group>
            </div>
            <div className='modal-footer modal_footer'>
                <div onClick={() => onClose()}>{t('cancel')}</div>
                <button onClick={() => share()} className='btn_miyuli'>{t('share')}</button>
            </div>
        </div>
    </Modal>
}

export default ShareModal;
