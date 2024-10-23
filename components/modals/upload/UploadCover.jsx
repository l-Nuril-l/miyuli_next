"use client";
import { uploadCover } from '@/lib/features/community';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import ImageCrop from '../ImageCrop';
import Modal from '../Modal';

const UploadCover = (props) => {
    const t = useTranslations()
    const { onClose, isOpen, communityId } = props;
    const [img, setImg] = useState();
    const [file, setFile] = useState();
    const dispatch = useAppDispatch();

    const CloseAndClear = () => {
        setImg("");
        onClose();
    }

    const onFileSelected = (e) => {
        setImg("");
        if (e.files && e.files[0] && e.files[0].type.includes("image")) {
            setFile(e.files[0]);
            var reader = new FileReader();
            reader.onload = function (e) {
                setImg(e.target.result);
            }
            reader.readAsDataURL(e.files[0]);
        }
    }

    return <Modal isOpen={isOpen} onClose={CloseAndClear}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t("uploadNewCover")}</div>
                <div role="button" onClick={() => CloseAndClear()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                {img ?
                    <>
                        <div className='align-self-center'>
                            <ImageCrop onBack={() => { setImg("") }} onCrop={(crop) => { dispatch(uploadCover({ communityId, file, crop })); CloseAndClear() }} className="align-self-center">
                                <img className='modal_image_preview' src={img} alt="preview"></img>
                            </ImageCrop>
                        </div>
                    </>
                    :
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>{t('chooseImage')}</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/heic,image/heif,image/webp"
                            onChange={(x) => { console.log(x); onFileSelected(x.target) }}
                        />
                    </Form.Group>
                }
            </div>
            <div className='modal-footer modal_footer'>
                {t('problemsWithUpload')}
            </div>
        </div>
    </Modal>
}

export default UploadCover;

