"use client";
import AudioCard from '@/components/AudioCard';
import AudioPlayer from '@/components/AudioPlayer';
import AudioPlaylists from '@/components/AudioPlaylists';
import Avatar from '@/components/Avatar';
import PageBlock from '@/components/PageBlock';
import UploadAudio from '@/components/modals/upload/UploadAudio';
import { clearAudioData, clearAudios, clearErrorAudios, getAudios, getPlaylists, getRecommendations, reorder, showEditPlaylistModal } from '@/lib/features/audio';
import { handleCommonErrorCases } from "@/lib/functions";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import classNames from 'classnames';
import { getCookie, setCookie } from "cookies-next";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import InfiniteScroll from 'react-infinite-scroller';
import { useDebounce } from 'react-use';
import CloseSvg from '../assets/CloseSvg';
import './Audio.scss';

function Audio({ guest }) {
  const audioStore = useAppSelector((s) => (s.audio.page))
  const curAudioStore = useAppSelector((s) => (s.audio.audio))
  const authStore = useAppSelector((s) => s.auth.session)
  const t = useTranslations()

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    [search]
  );

  const dispatch = useAppDispatch();
  const [uploadModal, setUploadModal] = useState(false);

  const params = useParams()
  const id = params.id?.replace(/^audios/, '');

  const [searchParamSection, setSearchParamSection] = useQueryState('section')
  const section = searchParamSection || (authStore?.id && getCookie('lastAudioPageSection')) || 'general';

  const authorPage = id !== undefined && (parseInt(params?.id) !== authStore?.id);
  const promisesRef = useRef({});

  useEffect(() => {
    return () => {
      dispatch(clearAudios())
    }
  }, [dispatch, debouncedSearch]);

  useEffect(() => {
    let promises = promisesRef.current;
    setCookie('lastAudioPageSection', section);
    return () => {
      Object.values(promises).forEach(x => x.abort());
      dispatch(clearAudioData())
    }
  }, [dispatch, section, authorPage]);

  const fetchAudios = () => {
    let promises = promisesRef.current;
    let after;
    if (audioStore.audios)
      after = Math.min(...audioStore.audios.map(o => o.ordinalNumber));
    if (!Number.isFinite(after) || after === 0) {
      after = audioStore.audios[audioStore.audios.length - 1]?.id;
    }
    if (authorPage) {
      promises.audios = dispatch(getAudios({ id: id, search: search, after }))
      promises.playlists = dispatch(getPlaylists({ id: id }))
    }
    else
      switch (section) {
        case "all":
          promises.playlists = dispatch(getPlaylists({ id: id }))
          promises.audios = dispatch(getAudios({ id: id, search: search, after }))
          break;
        default:
          promises.audios = dispatch(getRecommendations({ search: search, after }))
          break;
      }
  }

  const sections = ['general', "all"].splice(0, guest ? 1 : 2)
  const names = ['main', 'myMusic']

  const onDragEnd = (result) => {
    //dropped outside the list
    if (!result.destination || result.destination.index == result.source.index) {
      return;
    }
    dispatch(reorder({ result }))
  };

  const [isFixedPlayer, setIsFixedPlayer] = useState(false);
  const playerRef = useRef();

  useEffect(() => {
    playerRef.current.style.height = playerRef.current.firstChild.clientHeight + 'px';
  }, [curAudioStore]);

  useEffect(() => {
    const handleScroll = (e) => {
      setIsFixedPlayer(window.scrollY > 300);
      playerRef.current.style.height = playerRef.current.firstChild.clientHeight + 'px';
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = (e) => {
      playerRef.current.style.height = playerRef.current.firstChild.clientHeight + 'px';
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="audio_page">
      <UploadAudio communityId={audioStore.author?.isCommunity && audioStore.author.id} onClose={() => setUploadModal(false)} isOpen={uploadModal}></UploadAudio>
      <div ref={playerRef} className="audio_player_wrap">
        <PageBlock className={classNames("audio_player", isFixedPlayer && "fixed_audio_player", isFixedPlayer && "fixed_audio_player_shown")}>
          <div className='player_audio_wrap'>{curAudioStore && <AudioCard audio={curAudioStore}></AudioCard>}</div>
          <AudioPlayer></AudioPlayer>
        </PageBlock>
      </div>

      {audioStore.playlists.length > 0 && <AudioPlaylists></AudioPlaylists>}

      <PageBlock >
        <div className="page_block_header">
          <ul className='header_item_left'>
            {authorPage ?
              <>
                <Avatar className="avatar_element" crop={audioStore.author?.avatarCrop} avatar={audioStore.author?.avatar}></Avatar>
                {audioStore.author?.name}
              </>
              :
              sections.map((x, i) => {
                return <li key={i} className={`header_item${(section === x ? " active" : "")}`} onClick={() => { setSearchParamSection(x); }}>
                  <div >{t(names[i])}</div>
                </li>
              })}
          </ul>
          {!guest && (audioStore.author?.access !== false) &&
            <div className="header_item_right">
              <button className='svg_btn' onClick={() => dispatch(showEditPlaylistModal({ communityId: audioStore.author?.isCommunity ? audioStore.author.id : null }))}>
                <svg fill="none" height="28" viewBox="0 0 28 28" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M20 13a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4v-4a1 1 0 0 1 1-1zm-10 5a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm5-6a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm7-6a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z" fill="currentColor"></path></svg>
              </button>
              <button className='svg_btn' onClick={() => setUploadModal(true)}>
                <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g id="upload_outline_28__Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="upload_outline_28__upload_outline_28"><path d="M0 0h28v28H0z"></path><path d="M21 22a1 1 0 1 1 0 2H7a1 1 0 0 1 0-2h14ZM14 3h.02a1 1 0 0 1 .07 0H14a1 1 0 0 1 .7.3l-.08-.09v.01l.09.07 7 7a1 1 0 0 1-1.42 1.42L15 6.4V19a1 1 0 0 1-2 0V6.41l-5.3 5.3a1 1 0 0 1-1.31.08l-.1-.08a1 1 0 0 1 0-1.42l7-7 .08-.07A1 1 0 0 1 14 3Z" id="upload_outline_28__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg>
              </button>
            </div>}
        </div>
        <div className="search_wrap">
          <input className='input search_icon search_miyuli ' type="text" value={search} placeholder={t("searchAudio")}
            onChange={(e) => setSearch(e.target.value)} />
          {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
        </div>
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <Droppable direction='vertical' isDropDisabled={!(!guest && (audioStore.author?.id === authStore.id))} isCombineEnabled={false} ignoreContainerClipping={true} droppableId={"audios"}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                <InfiniteScroll
                  className='audios_container'
                  loadMore={() => !audioStore.errors.main && !audioStore.isFetching ? fetchAudios() : null}
                  hasMore={audioStore.hasMore}
                  element="ul"
                  {...provided.droppableProps}
                >
                  {audioStore.audios?.map((x, i) =>
                    <Draggable isDragDisabled={!(!guest && (audioStore.author?.id === authStore.id))} key={x.id} draggableId={x.id.toString()} index={i}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <AudioCard off={guest} access={audioStore.author?.access} search={search} authorId={!audioStore.author ? undefined : ((audioStore.author.isCommunity ? -1 : 1) * audioStore.author.id)} key={x.id} audio={x}></AudioCard>
                        </li>
                      )}
                    </Draggable>
                  )}
                  {provided.placeholder}
                </InfiniteScroll>
              </div>)}
          </Droppable>
        </DragDropContext>

        {audioStore.isFetching && <div className='loader'></div>}
        {!audioStore.hasMore && audioStore.audios.length === 0 && <div className="p-2 text-center">{t("noAudios")}</div>}
        {audioStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
          <div>{t(handleCommonErrorCases(audioStore.errors.main))}</div>
          <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorAudios())}>{t('tryAgain')}</button></div>
        </div>}
      </PageBlock>
    </div >
  );
}

export default Audio;
