"use client";
import { getPlaylistAudio, pause, showEditPlaylistModal, switchPlaylist } from '@/lib/features/audio';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from "next/link";
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import ShareModal from './modals/ShareModal';

const AudioPlaylistCard = ({ playlist }) => {
    const [searchParamZ, setSearchParamZ] = useQueryState('z')
    const audioStore = useAppSelector(s => s.audio)
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const [isSharing, setIsSharing] = useState(false);
    const dispatch = useAppDispatch()
    return (
        <div className='playlist'>
            <div className="playlist_cover_wrap">
                {playlist.coverId ?
                    <img className='playlist_cover' alt="PlaylistImg" src={API_URL + "photo/" + playlist.coverId}></img>
                    :
                    <div className="cover_placeholder">
                        <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="playlist_outline_56__Icons-56/playlist_outline_56" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="playlist_outline_56__playlist_outline_28"><path id="playlist_outline_56__playlist_outline_56" d="M0 0h56v56H0z"></path><path d="M39 38.93c0 4.55-1.94 7.97-5.07 9.62-2.84 1.5-6.24 1.22-8.22-.76-2.04-2.04-2.3-5.5-.58-8.3C27 36.44 30.77 34.61 36 34.5V16.76a6.88 6.88 0 0 1 5.03-6.68c1.08-.36 3.24-.92 6.5-1.67l1.64-.37A1.5 1.5 0 0 1 51 9.5v4.2a6.7 6.7 0 0 1-4.97 6.48L39 22.05Zm-3-1.42h-.4c-4 .18-6.67 1.53-7.91 3.54-1.02 1.66-.88 3.6.14 4.62.98.98 2.96 1.14 4.7.22 2.12-1.11 3.47-3.5 3.47-6.96V37.5ZM27.5 22a1.5 1.5 0 0 1 0 3h-19a1.5 1.5 0 0 1 0-3h19ZM48 11.38a83.8 83.8 0 0 0-6.03 1.54l-.21.08c-1.93.71-2.8 2.05-2.76 4.33v1.62l6.25-1.67A3.7 3.7 0 0 0 48 13.71ZM30.5 10a1.5 1.5 0 0 1 0 3h-22a1.5 1.5 0 0 1 0-3h22Z" id="playlist_outline_56__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg>
                    </div>}
                <Link href={`/audio/playlist/${playlist.id}`} className='playlist_cover_actions_wrap' onClick={(e) => { e.preventDefault(); setSearchParamZ(`audio_playlist/${playlist.author.id}_${playlist.id}`) }}>
                    <div className="playlist_cover_actions">
                        {playlist.access ?
                            <div className='audio_playlist_action audio_playlist_action_edit' onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(showEditPlaylistModal({ id: playlist.id })) }}></div>
                            :
                            playlist.isAdded ?
                                <div className='audio_playlist_action audio_playlist_action_remove' onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(switchPlaylist({ id: playlist.id, state: false })) }}></div>
                                :
                                <div className='audio_playlist_action audio_playlist_action_add' onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(switchPlaylist({ id: playlist.id, state: true })) }}></div>

                        }
                        {
                            audioStore.playlistId === playlist.id && audioStore.isPlaying ?
                                <div className='audio_playlist_action audio_playlist_action_pause' onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(pause()) }}></div>
                                :
                                <div className='audio_playlist_action audio_playlist_action_play' onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(getPlaylistAudio(playlist.id)) }}></div>
                        }
                        <div className='audio_playlist_action audio_playlist_action_share' onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSharing(true) }}></div>
                    </div>
                </Link>
            </div>
            <h6 className="playlist_title">
                <Link href={`/audio/playlist/${playlist.id}`} onClick={(e) => { e.preventDefault(); setSearchParamZ(`audio_playlist/${playlist.author.id}_${playlist.id}`) }}>{playlist.title}</Link>
            </h6>
            <div className="playlist_author">
                <Link href={`/audios${playlist.author.id * (playlist.author.isCommunity ? -1 : 1)}`}>{playlist.author.name}</Link>
            </div>
            {isSharing && <ShareModal attachedAudioPlaylistId={playlist.id} onClose={() => setIsSharing(false)}></ShareModal>}
        </div >
    );
}

export default AudioPlaylistCard;
