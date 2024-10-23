"use client";
import { clearErrorAudios, clearPlaylist, getPlaylist, getPlaylistAudios, showEditPlaylistModal } from '@/lib/features/audio';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import AudioCard from '../AudioCard';
import './AudioPlaylistModal.scss';
import Modal from './Modal';




const AudioPlaylistModal = () => {
    const [searchParamZ, setSearchParamZ] = useQueryState('z')
    const [isOpen, setIsOpen] = useState(true);
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const t = useTranslations()
    const dispatch = useAppDispatch();
    const playlist = useAppSelector(s => s.audio.playlist)
    const scrollParentRef = useRef();

    useEffect(() => {
        let params = searchParamZ?.slice(14).split("_");
        if (!params) return;
        let promise = dispatch(getPlaylist(params[1]))
        promise.unwrap().catch(setIsOpen(false));
        setIsOpen(true);

        return () => {
            promise?.abort();
            dispatch(clearPlaylist());
        }
    }, [dispatch, searchParamZ]);


    const Close = () => {
        setSearchParamZ(null);
        setIsOpen(false)
    }

    const fetchAudios = () => {
        let after;
        if (playlist.audios)
            after = Math.min(...playlist.audios.map(o => o.ordinalNumber));
        if (!Number.isFinite(after) || after === 0) {
            after = playlist.audios[playlist.audios.length - 1]?.id;
        }
        dispatch(getPlaylistAudios({ after, playlistId: playlist.id }))
    }

    return <Modal isOpen={isOpen} onClose={Close}>
        {!playlist.id ? <div className='loader'></div> :
            <div className='modal_miyuli modal_audioplaylist'>
                <div className="playlist_header">
                    <div className="header_playlist_cover">
                        {playlist.coverId ?
                            <img className='playlist_cover' alt="PlaylistImg" src={API_URL + "photo/" + playlist.coverId}></img>
                            :
                            <div className="playlist_cover_placeholder">
                                <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="playlist_outline_56__Icons-56/playlist_outline_56" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="playlist_outline_56__playlist_outline_28"><path id="playlist_outline_56__playlist_outline_56" d="M0 0h56v56H0z"></path><path d="M39 38.93c0 4.55-1.94 7.97-5.07 9.62-2.84 1.5-6.24 1.22-8.22-.76-2.04-2.04-2.3-5.5-.58-8.3C27 36.44 30.77 34.61 36 34.5V16.76a6.88 6.88 0 0 1 5.03-6.68c1.08-.36 3.24-.92 6.5-1.67l1.64-.37A1.5 1.5 0 0 1 51 9.5v4.2a6.7 6.7 0 0 1-4.97 6.48L39 22.05Zm-3-1.42h-.4c-4 .18-6.67 1.53-7.91 3.54-1.02 1.66-.88 3.6.14 4.62.98.98 2.96 1.14 4.7.22 2.12-1.11 3.47-3.5 3.47-6.96V37.5ZM27.5 22a1.5 1.5 0 0 1 0 3h-19a1.5 1.5 0 0 1 0-3h19ZM48 11.38a83.8 83.8 0 0 0-6.03 1.54l-.21.08c-1.93.71-2.8 2.05-2.76 4.33v1.62l6.25-1.67A3.7 3.7 0 0 0 48 13.71ZM30.5 10a1.5 1.5 0 0 1 0 3h-22a1.5 1.5 0 0 1 0-3h22Z" id="playlist_outline_56__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg>
                            </div>}
                    </div>
                    <div className="header_playlist_info">
                        <h5>{playlist.title}</h5>
                        <div>{playlist.author.name}</div>
                        {playlist.access && <div role="button" onClick={() => { dispatch(showEditPlaylistModal({ id: playlist.id })); Close() }}>{t('edit')}</div>}
                    </div>
                </div>
                <div className="playlist_body" ref={scrollParentRef}>
                    <div className="playlist_description">
                        {playlist.description}
                    </div>
                    <div className="playlist_audios">
                        <InfiniteScroll
                            className='audios_container'
                            loadMore={() => !playlist.errors.main && !playlist.isFetching ? fetchAudios() : null}
                            hasMore={playlist.hasMore}
                            useWindow={false}
                            getScrollParent={() => scrollParentRef.current}
                        >
                            {playlist.audios.map(x => <AudioCard playlistId={playlist.id} key={x.id} audio={x}></AudioCard>)}
                            {playlist.isFetching && <div className='loader'></div>}
                        </InfiniteScroll>
                        {!playlist.hasMore && !playlist.audios.length && <div className="p-2 text-center">{t("noAudios")}</div>}
                        {playlist.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                            <div>{t(handleCommonErrorCases(playlist.errors.main))}</div>
                            <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorAudios())}>{t('tryAgain')}</button></div>
                        </div>}
                    </div>
                </div>
                <div className="playlist_footer">{playlist.author.name}</div>
            </div>}
    </Modal>
}

export default AudioPlaylistModal;
