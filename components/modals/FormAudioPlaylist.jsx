"use client";
import { clearErrorAudios, clearPlaylist, clearPlaylistAudios, closeEditPlaylistModal, createAudioPlaylist, editAudioPlaylist, getPlaylist, getPlaylistAudios, reorder } from '@/lib/features/audio';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Form } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import ReactTextareaAutosize from 'react-textarea-autosize';
import BackSvg from '../../assets/BackSvg';
import AudioCard from '../AudioCard';
import "./FormAudioPlaylist.scss";
import Modal from './Modal';





const FormAudioPlaylist = (props) => {
    const t = useTranslations()
    const { isOpen } = props;
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const dispatch = useAppDispatch();
    const router = useRouter()
    const audioStore = useAppSelector(s => s.audio)
    const authStore = useAppSelector(s => s.auth.session)
    const [playlist, setPlaylist] = useState({ title: "", description: "" });
    const [cover, setCover] = useState(null);
    const playlistStore = useAppSelector(s => s.audio.playlist)
    const componentType = audioStore.showFormPlaylistModal > 0 ? "editing" : "creating";
    const [addingAudios, setAddingAudios] = useState(false);
    const scrollParentRef = useRef();

    const onClose = () => dispatch(closeEditPlaylistModal(false));

    useEffect(() => {
        const onClose = () => dispatch(closeEditPlaylistModal(false));
        if (audioStore.showFormPlaylistModal < 1) {
            return;
        }
        let promise = dispatch(getPlaylist(audioStore.showFormPlaylistModal))
        promise.unwrap().then(payload => {
            typeof payload === 'object' ?
                setPlaylist(payload)
                :
                dispatch(clearPlaylist())
        }).catch(() => { onClose() })

        return () => {
            dispatch(clearPlaylist())
            promise?.abort();
        };
    }, [dispatch, audioStore.showFormPlaylistModal]);

    const formAction = () => {
        var action = audioStore.showFormPlaylistModal === 0 ? createAudioPlaylist : editAudioPlaylist;
        const { title, description } = playlist;

        var obj = Object.assign({
            ...(playlistStore.id && { id: playlistStore.id }),
            ...(title && { title }),
            ...(description && { description }),
            ...(cover && { cover }),
            ...(audioStore.formPlaylistModalCommunityId && { authorId: audioStore.formPlaylistModalCommunityId * -1 }),
            ...(playlist.coverId === 0 && { coverId: 0 }),
        },
            addList.length === 0 ? null : { addList: addList.map(x => x.id) },
            remList.length === 0 ? null : { remList: remList.map(x => x.id) },
        );

        dispatch(action(obj)).then(e => (e.id) && router.push('/audio_playlist/' + e.payload.id));
        onClose();
    }

    const fetchAudios = () => {
        if (playlistStore.id === undefined && addingAudios === false) return;
        let after
        if (playlistStore.audios)
            after = Math.min(...playlistStore.audios.map(o => o.ordinalNumber));
        if (!Number.isFinite(after) || after === 0) {
            after = playlistStore.audios[playlistStore.audios.length - 1]?.id;
        }
        // let authorId2 = authorId ?? store.community?.community?.id * -1
        // if (isNaN(authorId2)) authorId2 = authStore.id

        let authorId2 = audioStore?.formPlaylistModalCommunityId ?? authStore.id;

        dispatch(getPlaylistAudios({ id: authorId2, after, playlistId: playlistStore.id, editingPlaylist: addingAudios }))
    }

    useEffect(() => {

        return () => {
            dispatch(clearPlaylistAudios())
        };
    }, [dispatch, addingAudios]);

    const onChange = (e) => {
        setPlaylist({
            ...playlist,
            [e.target.name]: e.target.value
        })
    }

    const selectFile = () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png, image/jpeg';
        input.click();
        input.addEventListener("change", () => {
            if (input.files && input.files[0] && input.files[0].type.includes("image")) {
                setCover(input.files[0])
                setPlaylist({
                    ...playlist,
                    cover: URL.createObjectURL(input.files[0])
                })
            }
        })
    }

    const [addList, setAddList] = useState([]);
    const [remList, setDelList] = useState([]);

    const handleCheck = ({ audio, state }) => {
        // console.log(addList);
        // console.log(remList);
        // console.log(audio, state);
        if (state) {
            if (remList.some(x => x.id === audio.id))
                setDelList(remList.filter(x => x.id === audio.id))
            else
                setAddList([...addList, audio])

        }
        else {
            if (addList.some(x => x.id === audio.id))
                setAddList(addList.filter(x => x.id !== audio.id))
            else
                setDelList([...remList, audio])

        }
    }

    const onDragEnd = (result) => {
        //dropped outside the list
        if (!result.destination || result.destination.index == result.source.index) {
            return;
        }

        dispatch(reorder({ result, playlistId: playlistStore.id }))
    };

    return <Modal isOpen={isOpen} onClose={onClose}>
        {(audioStore.showFormPlaylistModal > 0) && !playlist.id ? <div className='loader'></div> :
            <Form onSubmit={(e) => { e.preventDefault(); formAction() }} className='modal_miyuli modal_audioplaylist modal_form_audioplaylist'>
                <div className='modal_header'>
                    {addingAudios ?
                        <div className='header_text header_button' onClick={() => setAddingAudios(false)}>
                            <BackSvg />
                            {t('back')}
                        </div>
                        :
                        <div className='header_text'>{t(componentType + 'Playlist')}</div>
                    }
                    <div className='header_close' onClick={() => onClose()}>╳</div>
                </div>
                <div className='modal_body'>
                    {!addingAudios && <div className="playlist_header">
                        <div className="header_playlist_cover" onClick={() => selectFile()}>
                            {playlist.coverId > 0 || playlist.cover ?
                                <>
                                    <img className='playlist_cover' alt="PlaylistImg" src={playlist.cover ? playlist.cover : API_URL + "photo/" + playlist.coverId} />
                                    <div className="remove_cover" onClick={(e) => {
                                        setCover(null)
                                        setPlaylist((prev) => ({
                                            ...prev,
                                            cover: null,
                                            coverId: 0
                                        }))
                                        e.stopPropagation()
                                    }}>╳</div>
                                </>
                                :
                                <div className="playlist_cover_placeholder">
                                    <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="playlist_outline_56__Icons-56/playlist_outline_56" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="playlist_outline_56__playlist_outline_28"><path id="playlist_outline_56__playlist_outline_56" d="M0 0h56v56H0z"></path><path d="M39 38.93c0 4.55-1.94 7.97-5.07 9.62-2.84 1.5-6.24 1.22-8.22-.76-2.04-2.04-2.3-5.5-.58-8.3C27 36.44 30.77 34.61 36 34.5V16.76a6.88 6.88 0 0 1 5.03-6.68c1.08-.36 3.24-.92 6.5-1.67l1.64-.37A1.5 1.5 0 0 1 51 9.5v4.2a6.7 6.7 0 0 1-4.97 6.48L39 22.05Zm-3-1.42h-.4c-4 .18-6.67 1.53-7.91 3.54-1.02 1.66-.88 3.6.14 4.62.98.98 2.96 1.14 4.7.22 2.12-1.11 3.47-3.5 3.47-6.96V37.5ZM27.5 22a1.5 1.5 0 0 1 0 3h-19a1.5 1.5 0 0 1 0-3h19ZM48 11.38a83.8 83.8 0 0 0-6.03 1.54l-.21.08c-1.93.71-2.8 2.05-2.76 4.33v1.62l6.25-1.67A3.7 3.7 0 0 0 48 13.71ZM30.5 10a1.5 1.5 0 0 1 0 3h-22a1.5 1.5 0 0 1 0-3h22Z" id="playlist_outline_56__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg>
                                </div>}
                        </div>
                        <div className="header_playlist_info">
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>{t('title')}</Form.Label>
                                <Form.Control className="input" required maxLength={64} type="text" name="title" value={playlist.title} onChange={onChange} />
                            </Form.Group>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>{t('description')}</Form.Label>
                                <ReactTextareaAutosize name="description" maxLength={16384} className='input textarea d-block w-100' value={playlist.description} onChange={onChange} />
                            </Form.Group>
                        </div>
                    </div>}
                    <div className="playlist_search"></div>
                    {!addingAudios && <div className="playlist_add_audios" onClick={() => setAddingAudios(true)}>{t("addAudios")}</div>}
                    <div className="playlist_body" ref={scrollParentRef}>
                        <div className="playlist_audios">
                            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                                <Droppable direction='vertical' isDropDisabled={!(playlist.author?.id === authStore.id && addingAudios === false)} isCombineEnabled={false} ignoreContainerClipping={true} droppableId={"audiosPlaylist"}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef}>
                                            <InfiniteScroll
                                                className='audios_container'
                                                loadMore={() => { !playlistStore.errors.main && !playlistStore.isFetching ? fetchAudios() : null }}
                                                hasMore={playlistStore.hasMore}
                                                useWindow={false}
                                                element="ul"
                                                getScrollParent={() => scrollParentRef.current}
                                                {...provided.droppableProps}
                                            >
                                                {playlistStore.audios?.map((x, i) =>
                                                    <Draggable key={x.id} isDragDisabled={!(playlist.author?.id === authStore.id && addingAudios === false)} draggableId={x.id.toString()} index={i}>
                                                        {(provided) => (
                                                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <div className="ape_audio_item_wrap">
                                                                    <AudioCard access={playlist.access} playlistId={playlist.id} key={x.id} audio={x}></AudioCard>
                                                                    <div className="ape_check" onClick={() => handleCheck({ audio: x, state: !((x.isAdded && !remList.some(y => y.id === x.id)) || addList.some(y => y.id === x.id)) })}>
                                                                        {(x.isAdded && !remList.some(y => y.id === x.id)) || addList.some(y => y.id === x.id) ?
                                                                            <div className="ape_check--checked"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 24a12 12 0 1 0 0-24 12 12 0 0 0 0 24Zm6.2-14.8a1 1 0 0 0-1.4-1.4L10 14.58l-2.8-2.8a1 1 0 0 0-1.4 1.42l3.5 3.5a1 1 0 0 0 1.4 0l7.5-7.5Z" fill="currentColor"></path></svg></div>
                                                                            :
                                                                            <div className="ape_check--unchecked"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0a12 12 0 1 1 0 24 12 12 0 0 1 0-24Zm0 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Z" fill="currentColor"></path></svg></div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                )}
                                                {provided.placeholder}
                                            </InfiniteScroll>
                                        </div>)}
                                </Droppable>
                            </DragDropContext>

                            {playlistStore.isFetching && <div className='loader'></div>}

                            {!playlistStore.hasMore && playlistStore.audios.length === 0 && <div className="p-2 text-center">{t("noAudios")}</div>}
                            {playlistStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                                <div>{t(handleCommonErrorCases(playlistStore.errors.main))}</div>
                                <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorAudios())}>{t('tryAgain')}</button></div>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className='modal-footer modal_footer'>
                    <div onClick={() => onClose()}>{t('cancel')}</div>
                    <button type='submit' className='btn_miyuli'>{t('save')}</button>
                </div>
            </Form>
        }
    </Modal >
}

export default FormAudioPlaylist;

