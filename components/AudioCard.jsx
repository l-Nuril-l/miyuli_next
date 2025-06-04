"use client";
import { deleteAudio, getAudio, pause, play, switchAudio, toBottom, toTop } from '@/lib/features/audio';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { memo, useState } from 'react';
import EditSvg from '../assets/EditSvg';
import TopListSvg from '../assets/TopListSvg';
import TrashCanSvg from '../assets/TrashCanSvg';
import useAdminPermissionsCheck from '../hooks/useAdminPermissionsCheck';
import "./AudioCard.scss";
import AudioModal from './modals/AudioModal';

AudioCard.displayName = "AudioCard";

const AudioCard = memo(({ audio, off, authorId, playlistId, search, access }) => {
  const x = audio;
  const dispatch = useAppDispatch();
  const audioStore = useAppSelector((s) => s.audio)
  const API_URL = useAppSelector((s) => s.miyuli.API_URL)
  const isPlaying = x.id === audioStore.audio?.id
  const { isAdmin } = useAdminPermissionsCheck();
  const [editModal, setEditModal] = useState(false);
  const t = useTranslations()

  const deleteAudioHandler = (e) => { e.stopPropagation(); if (window.confirm(t("deletionConfirmation"))) dispatch(deleteAudio(x.id)) }

  return (
    <div className={`audio_line ${isPlaying ? "audio_playing" : ""}`} onClick={() => dispatch(isPlaying ? audioStore.isPlaying ? pause() : play() : getAudio({ id: x.id, authorId, playlistId, search }))}>
      <div className={classNames("audio_icon", x.imageId == null ? "audio_icon_placeholder" : "")}>
        {x.imageId == null ?
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="song_24__Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="song_24__song_24"><path id="song_24__Bounds" d="M0 0h24v24H0z"></path><path d="M13 11.48v5.65c0 4.52-.87 5.39-4.37 5.85C6.96 23.19 5 22.44 5 19.8c0-1.28.8-2.5 2.46-2.81 1.27-.25-.09.02 2.78-.52.7-.13.77-.37.77-.9V7.05 3.98c0-1.24.67-1.69 2.66-2.09l4.68-.87c.37-.07.65.07.65.49v4.05c0 .42-.17.6-.59.68l-4.86.86c-.38.1-.55.36-.55.74v3.64z" id="song_24__Mask" fill="currentColor"></path></g></g></svg>
          :
          <Image alt='AudioPicture' src={API_URL + "audio/picture/" + x.imageId} width='40' height='40' />
        }
      </div>
      <div className={`audio_data`}>
        <div className='audio_name'>{x.name}</div>
        <div className='audio_artist'>{x.artist}</div>
        <div className='audio_actions' onClick={(e) => e.stopPropagation()}>
          {!off && <>
            {isAdmin && <div className="audio_action" onClick={deleteAudioHandler}>
              <TrashCanSvg width={16} height={16} />
            </div>}
            {(isAdmin || access) && <>
              <div className="audio_action" onClick={() => setEditModal(true)}>
                <EditSvg />
              </div>
              {editModal && <AudioModal audio={x} onClose={() => setEditModal(false)}></AudioModal>}
            </>}
            {access && <>
              <div className="audio_action" onClick={() => {
                dispatch(toTop({
                  ordinalNumber: x.ordinalNumber,
                  playlistId,
                  authorId
                }))
              }}>
                <TopListSvg />
              </div>
              <div className="audio_action rotate-x-180" onClick={() => {
                dispatch(toBottom({
                  ordinalNumber: x.ordinalNumber,
                  playlistId,
                  authorId
                }))
              }}>
                <TopListSvg />
              </div>
            </>}
            <div className="audio_action" onClick={(e) => { e.stopPropagation(); dispatch(switchAudio({ id: x.id, state: !x.isAdded })) }}>
              {x.isAdded ?
                <svg fill="none" height="18" viewBox="0 0 20 20" width="18" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M4.72 4.72c.3-.3.77-.3 1.06 0L10 8.94l4.22-4.22a.75.75 0 1 1 1.06 1.06L11.06 10l4.22 4.22a.75.75 0 1 1-1.06 1.06L10 11.06l-4.22 4.22a.75.75 0 0 1-1.06-1.06L8.94 10 4.72 5.78a.75.75 0 0 1 0-1.06z" fill="currentColor" fillRule="evenodd"></path></svg>
                :
                <svg fill="none" height="18" viewBox="0 0 20 20" width="18" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M10 2c.41 0 .75.34.75.75v6.5h6.5a.75.75 0 0 1 0 1.5h-6.5v6.5a.75.75 0 0 1-1.5 0v-6.5h-6.5a.75.75 0 0 1 0-1.5h6.5v-6.5c0-.41.34-.75.75-.75z" fill="currentColor" fillRule="evenodd"></path></svg>
              }
            </div>
          </>
          }
        </div>
      </div>
      <div className='audio_time'>{x.duration}</div>
    </div>
  );
})

export default AudioCard;
