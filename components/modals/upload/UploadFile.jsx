"use client";
import { clearErrorFiles, uploadFiles } from '@/lib/features/file';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Modal from '../Modal';



const UploadFile = (props) => {
    const fileStore = useAppSelector(s => s.file)
    const t = useTranslations()
    const { onClose, isOpen } = props;
    const [file, setFile] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState("");
    const dispatch = useAppDispatch();

    const CloseAndClear = () => {
        setFile(false);
        dispatch(clearErrorFiles());
        onClose();
    }

    const onFileSelected = (e) => {
        if (e.files) {
            setIsUploading(true)
            if (e.files.length > 20) {
                setStatus(t("uploadFileLimitError"))
                setIsUploading(false)
                setFile(true)
                return;
            }
            dispatch(uploadFiles({ files: [...e.files] }))
                .finally(() => {
                    setStatus(null);
                    setIsUploading(false)
                    setFile(true)
                })
        }
    }

    return <Modal isOpen={isOpen} onClose={CloseAndClear}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t("uploadingFile")}</div>
                <div role="button" onClick={() => CloseAndClear()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                {file ?
                    <>
                        <div className='align-self-center'>{t(handleCommonErrorCases(fileStore.errors.upload ?? status))}</div>
                    </>
                    :
                    <>
                        {!isUploading ?

                            <>
                                <h4 className="subheader">{t("limitations")}</h4>
                                <ul className="file_add_restrictions">
                                    <li>
                                        {t("fileLimitationSizeAndFormat")}
                                    </li>
                                    <li>
                                        {t("limitationMaxFiles")}
                                    </li>
                                </ul>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>{t('chooseFiles')}</Form.Label>
                                    <Form.Control type="file" multiple onChange={(x) => { onFileSelected(x.target) }} />
                                    {/* webkitdirectory="" */}
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

export default UploadFile;

