"use client";
import { clearAttachAudios, clearErrorAudios, getAttachAudios } from '@/lib/features/audio';
import { handleCommonErrorCases } from "@/lib/functions";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDebounce } from 'react-use';
import CloseSvg from "../../../assets/CloseSvg";
import AudioCard from '../../AudioCard';
import Modal from "../Modal";
import "./AttachAudioModal.scss";



const AttachAudioModal = ({ onFileSelected, onClose }) => {
    const audioStore = useAppSelector(s => s.audio.attach)
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );
    const dispatch = useAppDispatch()
    const promisesRef = useRef({});
    const t = useTranslations();

    useEffect(() => {
        var promises = promisesRef.current
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(clearAttachAudios());
        }
    }, [dispatch, debouncedSearch]);

    return <Modal onClose={onClose}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t("attachingAudio")}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className="search_wrap">
                <input className='input search_icon search_miyuli ' type="text" value={search} placeholder={t("searchAudio")}
                    onChange={(e) => setSearch(e.target.value)} />
                {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
            </div>
            <div className="infinite_scroll_container">
                <InfiniteScroll
                    className='audios_container'
                    loadMore={() => !audioStore.errors.main && !audioStore.isFetching ? promisesRef.current.audios = dispatch(getAttachAudios({ search: search, after: audioStore.audios[audioStore.audios.length - 1]?.ordinalNumber })) : null}
                    hasMore={audioStore.hasMore}
                    useWindow={false}
                >
                    {audioStore.audios?.map(x => <div key={x.id} className='attach_audio_row'>
                        <AudioCard search={search} authorId={audioStore.author.id} audio={x}></AudioCard>
                        <div onClick={() => { onFileSelected(x); onClose() }} className='attach_btn'>{t("attach")}</div>
                    </div>)}
                    {audioStore.isFetching && <div className='loader'></div>}
                </InfiniteScroll>
            </div>
            {!audioStore.hasMore && audioStore.audios.length === 0 && <div className="p-2 text-center">{t("noAudios")}</div>}
            {audioStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                <div>{t(handleCommonErrorCases(audioStore.errors.main))}</div>
                <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorAudios())}>{t('tryAgain')}</button></div>
            </div>}
        </div>

    </Modal>
}

export default AttachAudioModal;
