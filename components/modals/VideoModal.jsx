"use client";
import { createComment, disposeVideo, getVideo, likeVideo, switchAddedVideo, unforceVideo } from '@/lib/features/video';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useState } from 'react';
import Avatar from '../Avatar';
import Comment from '../Comment';
import CreateComment from '../CreateComment';
import VideoPlayer from '../VideoPlayer';
import Modal from './Modal';
import ShareModal from './ShareModal';
import './VideoModal.scss';

const VideoModal = () => {
    const [searchParamZ, setSearchParamZ] = useQueryState('z')

    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations()
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const dispatch = useAppDispatch();
    const videoStore = useAppSelector(s => s.video)
    const date = new Date(videoStore.video?.created);
    const data = videoStore.video;
    const router = useRouter()
    const isAuthorized = useAppSelector(s => s.auth.session) !== null;
    const locale = useLocale();
    const [shareModalVisible, setShareModalVisible] = useState(false);

    let params = videoStore.forceVideoModal ? videoStore.forceVideoModal.split("_") : searchParamZ?.split("_");


    useEffect(() => {
        let videoId = params?.[1];
        setIsOpen(true);
        dispatch(getVideo(videoId))
    }, [dispatch, params]);

    const onClose = useCallback(() => {
        setIsOpen(false)
        dispatch(disposeVideo())
        setSearchParamZ(null);
        if (videoStore.forceVideoModal) dispatch(unforceVideo())
    }, [dispatch, setSearchParamZ, videoStore.forceVideoModal])

    const getDestinationLink = () => {
        if (data.uploadedBy?.login) return data.uploadedBy.login;
        return (data.uploadedBy.isCommunity ? `/community/` : `/id/`) + data.uploadedBy.id
    }

    useEffect(() => {
        if (videoStore.errors.video === true) onClose();
    }, [videoStore.errors.video, onClose]);

    // const videoRef = useRef();
    // const [url, setUrl] = useState("");
    // useEffect(() => {
    //     const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    //     if (videoRef.current && MediaSource.isTypeSupported(mimeCodec)) {
    //         const myMediaSource = new MediaSource();
    //         const url = URL.createObjectURL(myMediaSource);

    //         setUrl(url);
    //         console.log(url);

    //         myMediaSource.addEventListener('sourceopen', () => {
    //             const videoSourceBuffer = myMediaSource.addSourceBuffer(mimeCodec);

    //             videoSourceBuffer.addEventListener('error', console.log);

    //             // this is just an express route that return an mp4 file using `res.sendFile`
    //             fetch('https://localhost:7284/api/video/stream/16').then((response) => {
    //                 return response.arrayBuffer();
    //             }).then((videoData) => {
    //                 videoSourceBuffer.appendBuffer(videoData);
    //             });
    //             console.log(123);
    //         });
    //     }

    // }, []);

    return <Modal isOpen={isOpen} onClose={onClose}>
        {!videoStore.video.id ? <div className='loader'></div> :
            <div className='modal_miyuli modal_video'>
                <div className='modal-header modal_header'>
                    <div>{videoStore.video?.title}</div>
                    <div role="button" onClick={() => onClose()}>╳</div>
                </div>
                <div className='modal-body modal_body'>
                    <VideoPlayer url={API_URL + `video/stream/${videoStore.video.id}`} />
                </div>
                <div className='mv_info'>
                    <div className="mv_title_block">
                        <div className='mv_title'>{videoStore.video?.title}</div>
                        <div className="mv_title_info">
                            <div>{t("view", { count: data.views })}</div>
                            <div className='mv_title_date'>{date.getDate()} {date.toLocaleDateString(locale, { month: 'short' })} {date.getFullYear()} в {date.getHours()}:{String(date.getMinutes()).padStart(2, '0')}</div>
                        </div>
                    </div>
                    <div className='mv_actions'>
                        <div className='modal_action_btn' onClick={() => !isAuthorized ? router.push('') : dispatch(likeVideo({ id: videoStore.video?.id, like: !videoStore.video?.isLiked }))}>
                            {!videoStore.video?.isLiked ?
                                <div className="like_icon">
                                    <svg height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M16 4a5.95 5.95 0 0 0-3.89 1.7l-.12.11-.12-.11A5.96 5.96 0 0 0 7.73 4 5.73 5.73 0 0 0 2 9.72c0 3.08 1.13 4.55 6.18 8.54l2.69 2.1c.66.52 1.6.52 2.26 0l2.36-1.84.94-.74c4.53-3.64 5.57-5.1 5.57-8.06A5.73 5.73 0 0 0 16.27 4zm.27 1.8a3.93 3.93 0 0 1 3.93 3.92v.3c-.08 2.15-1.07 3.33-5.51 6.84l-2.67 2.08a.04.04 0 0 1-.04 0L9.6 17.1l-.87-.7C4.6 13.1 3.8 11.98 3.8 9.73A3.93 3.93 0 0 1 7.73 5.8c1.34 0 2.51.62 3.57 1.92a.9.9 0 0 0 1.4-.01c1.04-1.3 2.2-1.91 3.57-1.91z" fill="currentColor" fillRule="nonzero"></path></g></svg>
                                </div>
                                :
                                <div className="liked_icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M11.08 2.5A3.92 3.92 0 0115 6.42c0 2.19-.88 3.28-4.6 6.18L8.73 13.9c-.43.33-1.01.33-1.44 0L5.6 12.6C1.88 9.7 1 8.6 1 6.42A3.92 3.92 0 014.92 2.5c1.16 0 2.2.55 3.08 1.6.89-1.05 1.92-1.6 3.08-1.6z" fill="#ff3347" /></svg>
                                </div>}
                            <div className="action_text">{data.likesCount}</div>
                        </div>
                        <div className='modal_action_btn' onClick={() => !isAuthorized ? router.push('') : setShareModalVisible(true)}>
                            <svg height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M12 3.73c-1.12.07-2 1-2 2.14v2.12h-.02a9.9 9.9 0 0 0-7.83 10.72.9.9 0 0 0 1.61.46l.19-.24a9.08 9.08 0 0 1 5.84-3.26l.2-.03.01 2.5a2.15 2.15 0 0 0 3.48 1.69l7.82-6.14a2.15 2.15 0 0 0 0-3.38l-7.82-6.13c-.38-.3-.85-.46-1.33-.46zm.15 1.79c.08 0 .15.03.22.07l7.82 6.14a.35.35 0 0 1 0 .55l-7.82 6.13a.35.35 0 0 1-.57-.28V14.7a.9.9 0 0 0-.92-.9h-.23l-.34.02c-2.28.14-4.4.98-6.12 2.36l-.17.15.02-.14a8.1 8.1 0 0 1 6.97-6.53.9.9 0 0 0 .79-.9V5.87c0-.2.16-.35.35-.35z" fill="currentColor" fillRule="nonzero"></path></g></svg>
                            <div className="action_text">{data.repostsCount}</div>
                        </div>
                        {shareModalVisible && <ShareModal attachedVideoId={data.id} onClose={() => setShareModalVisible(false)}></ShareModal>}
                        <div className='modal_action_btn' onClick={() => !isAuthorized ? router.push('') : dispatch(switchAddedVideo({ id: videoStore.video.id, state: !videoStore.video.isAdded }))}>
                            {!videoStore.video?.isAdded ?
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 24 24"><path d="m0 0h24v24h-24z" fill="none" /><path d="m13 11h7a1 1 0 0 1 0 2h-7v7a1 1 0 0 1 -2 0v-7h-7a1 1 0 0 1 0-2h7v-7a1 1 0 0 1 2 0z" fill="currentColor" /></svg>
                                    <div className='action_text'>{t("addToMyVideos")}</div>
                                </>
                                :
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 24 24" width="30"><g fill="none" fillRule="evenodd"><path d="m0 0h24v24h-24z" /><path d="m4 12.5 4.9999939 5 11.5000061-11.5" stroke="#828a99" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></g></svg>
                                    <div className='action_text'>{t("added")}</div>
                                </>
                            }
                        </div>
                    </div>

                    <div className='mv_author'>
                        <Avatar className="avatar_element" size={50} crop={data.uploadedBy.avatarCrop} avatar={data.uploadedBy.avatar} onClick={() => router.push(getDestinationLink())}> </Avatar>
                        <Link href={getDestinationLink()}>{data.uploadedBy.name}</Link>
                    </div>
                    <div className='mv_description'>{data.description}</div>
                    <div className='mv_comments_wrap'>
                        <div className="mv_comments_summary">{data.commentsCount} {t("comment", { count: data.commentsCount })}</div>
                        <div className="mv_comments">
                            {data.comments.map(x => <Comment location="video" key={x.id} comment={x}></Comment>)}
                        </div>
                    </div>
                </div>
                <div className='mv_create_comment'><CreateComment data={{ videoId: data.id }} createComment={createComment}></CreateComment></div>

            </div>}
    </Modal>
}

export default VideoModal;
