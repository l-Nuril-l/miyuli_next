"use client";
import { clearErrorVideos, disposeVideos, getAuthorVideos, getVideosData } from '@/lib/features/video';
import { handleCommonErrorCases } from "@/lib/functions";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from "react-infinite-scroller";
import { useDebounce } from 'react-use';
import CloseSvg from "../../../assets/CloseSvg";
import "../../../pages_app/Videos.scss";
import VideoCard from '../../VideoCard';
import Modal from "../Modal";
import "./AttachVideoModal.scss";



const AttachVideoModal = ({ onFileSelected, onClose }) => {
    const authStore = useAppSelector(x => x.auth.session)
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );
    const videoStore = useAppSelector(s => s.video)
    const promisesRef = useRef({});
    const dispatch = useAppDispatch()
    const t = useTranslations();

    useEffect(() => {
        var promises = promisesRef.current
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposeVideos())
        }
    }, [dispatch, authStore.id, debouncedSearch]);

    const getMore = () => {
        const args = {
            id: authStore.id,
            search,
            after: videoStore.videos[videoStore.videos.length - 1]?.id
        }

        if (!videoStore.author) {
            promisesRef.current.videos = dispatch(getVideosData(args));
            return
        }
        promisesRef.current.videos = dispatch(getAuthorVideos(args));
    }

    const modalRef = useRef(null);

    return <Modal ref={modalRef} onClose={onClose}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t("attachingVideo")}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className="search_wrap">
                <input className='input search_icon search_miyuli ' type="text" value={search} placeholder={t("searchFiles")}
                    onChange={(e) => setSearch(e.target.value)} />
                {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
            </div>

            {videoStore.isFetching && <div className='loader'></div>}
            <InfiniteScroll
                className='videos_container'
                loadMore={() => !videoStore.errors.main && !videoStore.isFetching ? getMore() : null}
                hasMore={videoStore.hasMore}
                useWindow={false}
                getScrollParent={() => modalRef.current}
            >
                <div className="videos_wrap">
                    {videoStore.videos?.map(x => <VideoCard off key={x.id} onClick={() => { onFileSelected(x); onClose() }} video={x}></VideoCard>)}
                </div>
                {!videoStore.videos && <div className="files_no_content">{t("noVideos")}</div>}
            </InfiniteScroll>
            {videoStore.errors.main && <div className=' m-3 p-2 gap-2 d-flex flex-column align-items-center'>
                <div>{t(handleCommonErrorCases(videoStore.errors.main))}</div>
                <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorVideos())}>{t('tryAgain')}</button></div>
            </div>}
        </div>
    </Modal>
}

export default AttachVideoModal;
