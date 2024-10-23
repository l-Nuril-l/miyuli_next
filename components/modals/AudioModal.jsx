"use client";
import { editAudio } from '@/lib/features/audio';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import "./AudioModal.scss";
import Modal from './Modal';




const AudioModal = (props) => {
    const t = useTranslations()
    const { onClose, audio } = props;
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const dispatch = useAppDispatch();
    const [name, setName] = useState(audio.name ?? "");
    const [artist, setArtist] = useState(audio.artist ?? "");
    const [lyrics, setLyrics] = useState(audio.lyrics ?? "");
    const [curImg, setCurImg] = useState(audio.imageId);
    const [newImagePreview, setNewImagePreview] = useState(null);
    const imageUrlMemo = useMemo(() => { if (newImagePreview) return URL.createObjectURL(newImagePreview) }, [newImagePreview]);
    const [processing, setProcessing] = useState(false);

    const modalAction = () => {
        setProcessing(true)
        dispatch(editAudio({ id: audio.id, name, artist, lyrics, image: newImagePreview, imageId: curImg === 0 ? 0 : null })).unwrap().then(() => onClose()).catch(() => setProcessing(false));
    }

    const selectFile = () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg';
        input.click();
        input.addEventListener("change", () => {
            if (input.files && input.files[0] && input.files[0].type.includes("image")) {
                setNewImagePreview(input.files[0])
            }
        })
    }

    return <Modal onClose={onClose}>
        <Form onSubmit={(e) => { e.preventDefault(); modalAction() }} className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t('editingAudio')}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                {/* TODO: ERROR HANDLER */}
                <div className='modal_header_has_image'>
                    <div className="header_audio_cover" onClick={() => selectFile()}>
                        {curImg > 0 || imageUrlMemo ?
                            <div>
                                <img className='audio_cover' alt="PlaylistImg" src={imageUrlMemo ? imageUrlMemo : API_URL + "audio/picture/" + audio.imageId}></img>
                                <div className="remove" onClick={(e) => {
                                    if (newImagePreview) {
                                        setNewImagePreview(null)
                                        setCurImg(audio.imageId)
                                    }
                                    else
                                        setCurImg(0)
                                    e.stopPropagation()
                                }}>╳</div>
                            </div>
                            :
                            <div className="image_placeholder">
                                <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="playlist_outline_56__Icons-56/playlist_outline_56" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="playlist_outline_56__playlist_outline_28"><path id="playlist_outline_56__playlist_outline_56" d="M0 0h56v56H0z"></path><path d="M39 38.93c0 4.55-1.94 7.97-5.07 9.62-2.84 1.5-6.24 1.22-8.22-.76-2.04-2.04-2.3-5.5-.58-8.3C27 36.44 30.77 34.61 36 34.5V16.76a6.88 6.88 0 0 1 5.03-6.68c1.08-.36 3.24-.92 6.5-1.67l1.64-.37A1.5 1.5 0 0 1 51 9.5v4.2a6.7 6.7 0 0 1-4.97 6.48L39 22.05Zm-3-1.42h-.4c-4 .18-6.67 1.53-7.91 3.54-1.02 1.66-.88 3.6.14 4.62.98.98 2.96 1.14 4.7.22 2.12-1.11 3.47-3.5 3.47-6.96V37.5ZM27.5 22a1.5 1.5 0 0 1 0 3h-19a1.5 1.5 0 0 1 0-3h19ZM48 11.38a83.8 83.8 0 0 0-6.03 1.54l-.21.08c-1.93.71-2.8 2.05-2.76 4.33v1.62l6.25-1.67A3.7 3.7 0 0 0 48 13.71ZM30.5 10a1.5 1.5 0 0 1 0 3h-22a1.5 1.5 0 0 1 0-3h22Z" id="playlist_outline_56__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg>
                            </div>}
                    </div>
                    <div>
                        <Form.Group controlId="AMtitle" className="mb-2">
                            <Form.Label>{t('title')}</Form.Label>
                            <Form.Control className="input" required maxLength={64} type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="AMartist" className="mb-2">
                            <Form.Label>{t('artist')}</Form.Label>
                            <Form.Control className="input" required maxLength={64} type="text" value={artist} onChange={(e) => setArtist(e.target.value)} />
                        </Form.Group>
                    </div>
                </div>
                <Form.Group controlId="AMlyrics" className="mb-2">
                    <Form.Label>{t('lyrics')}</Form.Label>
                    <textarea className="input textarea" rows={10} maxLength={16384} type="textarea" value={lyrics} onChange={(e) => setLyrics(e.target.value)} />
                </Form.Group>
            </div>
            <div className='modal-footer modal_footer'>
                <div role="button" onClick={() => onClose()}>{t('cancel')}</div>
                <button disabled={processing} className='btn_miyuli' type='submit'>{t('save')}</button>
            </div>
        </Form>
    </Modal>;
}

export default AudioModal;