"use client";
import { uploadAudios } from '@/lib/features/audio';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import useAdminPermissionsCheck from '../../../hooks/useAdminPermissionsCheck';
import Modal from '../Modal';



const UploadAudio = (props) => {
    const t = useTranslations()
    const { onClose, isOpen, communityId } = props;
    const [audio, setAudio] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState("");
    const dispatch = useAppDispatch();
    const audioStore = useAppSelector(s => s.audio.page)
    const { isAdmin } = useAdminPermissionsCheck();

    const CloseAndClear = () => {
        setAudio(false);
        onClose();
    }

    useEffect(() => {
        if (audioStore.errors.upload)
            setStatus(t(handleCommonErrorCases(audioStore.errors.upload)))
        else
            setStatus(t("uploadAudioSuccess"))

    }, [audioStore.errors.upload, t]);

    const onFileSelected = (e) => {
        if (e.files) {
            setIsUploading(true)
            if (e.files.length > 20 * (isAdmin ? 50 : 1)) {
                console.log(e.files.length)
                setStatus(t("uploadAudioLimitError"))
                setIsUploading(false)
                setAudio(true)
                return;
            }
            var obj = {
                files: [...e.files],
                ...(communityId ? { communityId } : {}),
            };
            dispatch(uploadAudios(obj))
                .finally(() => {
                    setIsUploading(false)
                    setAudio(true)
                })
        }
    }

    return <Modal isOpen={isOpen} onClose={CloseAndClear}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t("uploadingAudios")}</div>
                <div role="button" onClick={() => CloseAndClear()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                {audio ?
                    <>
                        <div className='align-self-center'>{status}</div>
                    </>
                    :
                    <>
                        {!isUploading ?

                            <>
                                <h4 className="subheader">{t("limitations")}</h4>
                                <ul className="audio_add_restrictions">
                                    <li>
                                        {t("audioLimitationSizeAndFormat")}
                                    </li>
                                    <li>
                                        {t("limitationMaxFiles")}
                                    </li>
                                    <li>
                                        {t("fileTemplate")}: {t("artist")}1, {t("artist")}1 - {t("trackName")}.mp3
                                    </li>
                                </ul>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>{t('chooseFiles')}</Form.Label>
                                    <Form.Control type="file" multiple accept="audio/mpeg" onChange={(x) => { onFileSelected(x.target) }} />
                                </Form.Group>
                            </>
                            :
                            <div className='loader'></div>
                        }
                    </>
                }
            </div>
            <div className='modal-footer modal_footer'>
                <button className='btn_miyuli' onClick={() => { CloseAndClear("") }}>{t("close")}</button>
            </div>
        </div>
    </Modal>
}

export default UploadAudio;

