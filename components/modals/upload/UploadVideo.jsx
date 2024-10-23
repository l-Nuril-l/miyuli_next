"use client";
import { uploadVideos } from '@/lib/features/video';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { Form } from 'react-bootstrap';
import Modal from '../Modal';

const UploadVideo = (props) => {
    const t = useTranslations()
    const { onClose, isOpen, communityId } = props;
    const dispatch = useAppDispatch();
    const [searchParamSection, setSearchParamSection] = useQueryState('section')

    const onFileSelected = (e) => {
        if (e.files && e.files[0] && Array.from(e.files).every(x => x.type.includes("video/"))) {
            dispatch(uploadVideos({ files: Array.from(e.files), communityId }))
            setSearchParamSection("upload")
            onClose();
        }
    }

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='modal_miyuli' onClick={e => e.stopPropagation()}>
            <div className='modal-header modal_header'>
                <div>{t("uploadNewVideo")}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>{t('chooseFiles')}</Form.Label>
                    <Form.Control type="file" multiple accept="video/mp4,video/x-m4v,video/*" onChange={(x) => { onFileSelected(x.target) }} />
                </Form.Group>
            </div>
            <div className='modal-footer modal_footer'>
                {t('problemsWithUploadVideo')}
            </div>
        </div>
    </Modal>
}

export default UploadVideo;