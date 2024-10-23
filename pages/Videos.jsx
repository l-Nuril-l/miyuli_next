"use client";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';


import Avatar from '@/components/Avatar';
import PageBlock from '@/components/PageBlock';
import VideoCard from '@/components/VideoCard';
import UploadVideo from '@/components/modals/upload/UploadVideo';
import { clearErrorVideos, disposeVideos, forceVideoModal, getAddedVideos, getAuthorVideos, getLiked, getRecommendedVideos, getSubscriptions, getUploadedVideos, getVideosData } from '@/lib/features/video';
import { handleCommonErrorCases } from '@/lib/functions';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDebounce } from 'react-use';
import CloseSvg from '../assets/CloseSvg';
import "./Videos.scss";


const Videos = () => {
    const dispatch = useAppDispatch();
    const videoStore = useAppSelector(s => s.video)
    const params = useParams()
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const t = useTranslations()
    const router = useRouter()
    const promisesRef = useRef({});
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );

    const getMore = () => {
        const args = {
            id: videoStore.author?.id ?? params.id,
            seed: videoStore.seed,
            after: videoStore.videos[videoStore.videos.length - 1]?.id,
            search: search
        }

        if (!params.id)
            promisesRef.current.videos = dispatch(getRecommendedVideos(args))
        else
            switch (params.id) {
                case "liked": promisesRef.current.videos = dispatch(getLiked(args))
                    break;
                case "subscriptions": promisesRef.current.videos = dispatch(getSubscriptions(args))
                    break;
                default: {
                    if (!params.type) {
                        if (params.id.includes('_')) {
                            dispatch(forceVideoModal(params.id));
                            promisesRef.current.videos = dispatch(getRecommendedVideos(args))
                        }
                        else {
                            if (!videoStore.author) {
                                promisesRef.current.videos = dispatch(getVideosData(args))
                                promisesRef.current.videos.unwrap().catch(e => e.status === 404 && router.push("/video"));
                                return
                            }
                            promisesRef.current.videos = dispatch(getAuthorVideos(args));
                        }
                    }
                    else {
                        if (!videoStore.author) {
                            promisesRef.current.videos = dispatch(getVideosData(args))
                            promisesRef.current.videos.unwrap().catch(e => e.status === 404 && router.push("/video"));
                            return
                        }
                        switch (params.type) {
                            case "added": promisesRef.current.videos = dispatch(getAddedVideos(args))
                                break;
                            case "uploaded": promisesRef.current.videos = dispatch(getUploadedVideos(args))
                                break;
                            default:
                                () => router.push("/video")()

                        }
                    }
                }
            }
    }

    useEffect(() => {
        var promises = promisesRef.current
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposeVideos());
        }
    }, [dispatch, params.id, params.type, debouncedSearch]);

    return (
        <>
            <PageBlock className="search_block">
                <div className="search_wrap">
                    <input placeholder={t("searchVideo")} className='input search_icon search_miyuli' type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                    {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
                </div>
            </PageBlock>
            <PageBlock>
                <UploadVideo communityId={videoStore.author?.isCommunity ? videoStore.author?.id : null} isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)}></UploadVideo>
                {videoStore.author &&
                    <div className='page_block_header'>
                        <div className='header_item_left'>
                            <Avatar className="avatar_element" crop={videoStore.author.avatarCrop} avatar={videoStore.author.avatar}></Avatar>
                            {videoStore.author.name}
                        </div>
                        {videoStore.author.access && <div className='header_item_right'>
                            <button onClick={() => setIsVideoModalOpen(true)} className="btn_miyuli">
                                {t("uploadVideo")}
                            </button>
                        </div>}
                    </div>}
                <InfiniteScroll
                    className='videos_container'
                    loadMore={() => !videoStore.errors.main && !videoStore.isFetching ? getMore() : null}
                    hasMore={videoStore.hasMore}
                    initialLoad={true}
                >
                    {videoStore.videos.length > 0 && <div className="videos_wrap">
                        {videoStore.videos.map(x => <VideoCard key={x.id} video={x}></VideoCard>)}
                    </div>}
                    {videoStore.isFetching && <div className='loader'></div>}
                </InfiniteScroll>
                {!videoStore.hasMore && !videoStore.videos.length && <div className="p-2 text-center">{t("noVideos")}</div>}
                {videoStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(videoStore.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorVideos())}>{t('tryAgain')}</button></div>
                </div>}
            </PageBlock>
        </>
    );
}

export default Videos;
