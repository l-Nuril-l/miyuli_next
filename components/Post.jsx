"use client";
import { deletePost, deletePostAdmin, likePost, loadMoreComments, reportPost, sendComment, switchComments } from '@/lib/features/posts';
import { beautifyDate, isEmptyOrSpaces } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import ActionsHSvg from '../assets/ActionsHSvg';
import useAdminPermissionsCheck from '../hooks/useAdminPermissionsCheck';
import AudioCard from './AudioCard';
import AudioPlaylistCard from './AudioPlaylistCard';
import Avatar from './Avatar';
import Comment from './Comment';
import CommunityCard from './CommunityCard';
import EmojiPicker from './EmojiPicker';
import FileCard from './FileCard';
import ImageCard from './ImageCard';
import Linkify from './Linkify';
import ShareModal from './modals/ShareModal';
import PageBlock from './PageBlock';
import "./Post.scss";
import VideoCard from './VideoCard';




const Post = (props) => {
    const [value, setValue] = useState("");
    const authStore = useAppSelector(s => s.auth)
    const { isAdmin } = useAdminPermissionsCheck();
    const { post } = props
    const [commentAreaVisible, setCommentAreaVisible] = useState(post.comments?.length > 0);
    const router = useRouter()
    const t = useTranslations()
    const dispatch = useAppDispatch();
    const postDate = useMemo(() => new Date(post.createdDate), [post.createdDate])
    const ref = useRef();

    const sendAndClear = () => {
        if (isEmptyOrSpaces(value)) return;
        dispatch(sendComment({
            text: value,
            postId: post.id
        }));
        setValue("")
    }

    const commentHandleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendAndClear()
        }
    }

    const showMoreComments = () => {
        dispatch(loadMoreComments(
            {
                "id": post.id,
                "commentId": post.comments[post.comments.length - 1]?.id
            }));
    }

    const [shareModalVisible, setShareModalVisible] = useState(false);

    return (
        <PageBlock className="post">
            <div className='post_header'>
                <Avatar crop={post.author?.avatarCrop} className="avatar_element" size={50} avatar={post.author?.avatar} onClick={() => router.push(`/id/${post.authorId}`)}> </Avatar>
                <div className='post_author'>
                    <div className='post_author_name' onClick={() => router.push(`/id/${post.authorId}`)}>
                        <Link href={`/id/${post.authorId}`}>{post.author?.name} {post.author?.surname}</Link>
                    </div>
                    <div className='post_author_time'>{beautifyDate(postDate, t)}</div>
                </div>
                {authStore.session && <div className='post_header_actions'>
                    <ActionsHSvg></ActionsHSvg>
                    <div className='miyuli_dropdown'>
                        {(authStore.session.id === post.authorId || authStore.session.id === post.accountId) &&
                            <div className='miyuli_dropdown_row' onClick={() => { dispatch(deletePost(post.id)) }}>{t("delete")}</div>}
                        {(authStore.session.id === post.accountId) &&
                            <div className='miyuli_dropdown_row' onClick={() => { dispatch(switchComments({ id: post.id, "state": !post.commentsDisabled })) }}>{post.commentsDisabled ? t("enableComments") : t("disableComments")}</div>}
                        {(authStore.session.id !== post.authorId) &&
                            <div className='miyuli_dropdown_row' onClick={() => { dispatch(reportPost(post.id)) }}>{t("report")}</div>}
                        {(isAdmin && authStore.session.id !== post.authorId) &&
                            <div className='miyuli_dropdown_row' onClick={() => { dispatch(deletePostAdmin(post.id)) }}>{t("delete") + t("(Admin)")}</div>}
                    </div>
                </div>}

            </div>
            <div className='post_body'>
                <Linkify>{post.text}</Linkify>
                <CommunityCard size={80} community={post.attachedCommunity}></CommunityCard>

                {(post.repost || post.attachedVideo || post.attachedImage || post.attachedAudioPlaylist) && <div className='repost_container'>
                    <div className='post_header'>
                        {post.attachedImage && <Avatar className="avatar_element" size={50} avatar={post.attachedImage?.uploadedBy?.avatar || post.attachedVideo?.uploadedBy?.avatar || post.repost?.author?.avatar} onClick={() => router.push(post.attachedImage?.uploadedBy.isCommunity ? '/community/' : '/id/' + post.attachedImage?.uploadedBy.id)}> </Avatar>}
                        {post.attachedVideo && <Avatar className="avatar_element" size={50} avatar={post.attachedImage?.uploadedBy?.avatar || post.attachedVideo?.uploadedBy?.avatar || post.repost?.author?.avatar} onClick={() => router.push(post.attachedVideo?.uploadedBy.isCommunity ? '/community/' : '/id/' + post.attachedVideo?.uploadedBy.id)}> </Avatar>}
                        {post.repost && <Avatar className="avatar_element" size={50} avatar={post.attachedImage?.uploadedBy?.avatar || post.attachedVideo?.uploadedBy?.avatar || post.repost?.author?.avatar} onClick={() => router.push('/id/' + post.repost?.author?.id)}> </Avatar>}
                        <div className='post_author'>
                            {post.attachedImage && <>
                                <div className='post_author_name' onClick={() => router.push(post.attachedImage?.uploadedBy.isCommunity ? '/community/' : '/id/' + post.attachedImage?.uploadedBy.id)}>
                                    <Link href={`${post.attachedImage?.uploadedBy.isCommunity ? '/community/' : '/id/' + post.attachedImage?.uploadedBy.id}`}>{post.attachedImage?.uploadedBy?.name}
                                    </Link></div>
                                <div className='post_author_time'>{beautifyDate(post.attachedImage?.created, t)}</div></>}
                            {post.attachedVideo && <>
                                <div className='post_author_name' onClick={() => router.push(post.attachedVideo?.uploadedBy.isCommunity ? '/community/' : '/id/' + post.attachedVideo?.uploadedBy.id)}>
                                    <Link href={`${post.attachedVideo?.uploadedBy.isCommunity ? '/community/' : '/id/' + post.attachedVideo?.uploadedBy.id}`}>{post.attachedVideo?.uploadedBy?.name}</Link>
                                </div>
                                <div className='post_author_time'>{beautifyDate(post.attachedVideo?.created, t)}</div>
                            </>}
                            {post.repost && <>
                                <div className='post_author_name' onClick={() => router.push('/id/' + post.repost?.author?.avatar?.id)}>
                                    <Link href={'/id' + post.repost?.author?.avatar?.id}>{post.repost?.author?.name}</Link>
                                </div>
                                <div className='post_author_time'>{beautifyDate(post.repost?.createdDate, t)}</div>
                            </>
                            }

                        </div>
                    </div>
                    <div className='post_body'>
                        {post.attachedImage && <ImageCard image={post.attachedImage}></ImageCard>}
                        {post.attachedVideo && <VideoCard video={post.attachedVideo}></VideoCard>}
                        {post.attachedAudioPlaylist && <AudioPlaylistCard playlist={post.attachedAudioPlaylist}></AudioPlaylistCard>}
                        {post.repost && <>
                            <Linkify>{post.repost.text}</Linkify>

                            <CommunityCard size={80} community={post.repost.attachedCommunity}></CommunityCard>

                            <div className='attached_media_wrap'>
                                {post.repost.images.length > 0 &&
                                    <div className='attached_images'>
                                        {post.repost.images.map((x) => <ImageCard key={x.id} image={x}></ImageCard>)}
                                    </div>
                                }
                                {post.repost.videos.length > 0 &&
                                    <div className='attached_videos'>
                                        {post.repost.videos.map((x) => <VideoCard off className="video_holder" key={x.id} video={x}></VideoCard>)}
                                    </div>
                                }
                            </div>

                            {post.repost.audios.length > 0 && <div className='attached_audios'>
                                {post.repost.audios.map((x) => <AudioCard key={x.id} audio={x}></AudioCard>)}
                            </div>}
                            {post.repost.files.length > 0 && <div className='attached_files'>
                                {post.repost.files.map((x) => <FileCard key={x.id} file={x}></FileCard>)}
                            </div>}

                        </>}
                    </div>
                </div>}

                {/* <div className='attached_media'>
                    {post.images.length > 0 && post.images.map((x, i) => <ImageCard key={x.id} image={x}></ImageCard>)}
                    {post.videos.length > 0 && post.videos.map((x, i) => <VideoCard off className="video_holder" key={x.id} video={x}></VideoCard>)}
                </div> */}

                <div className='attached_media_wrap'>
                    {post.images.length > 0 &&
                        <div className='attached_images'>
                            {post.images.map((x) => <ImageCard key={x.id} image={x}></ImageCard>)}
                        </div>
                    }
                    {post.videos.length > 0 &&
                        <div className='attached_videos'>
                            {post.videos.map((x) => <VideoCard off className="video_holder" key={x.id} video={x}></VideoCard>)}
                        </div>
                    }
                </div>
                {post.audios.length > 0 && <div className='attached_audios'>
                    {post.audios.map((x) => <AudioCard key={x.id} audio={x}></AudioCard>)}
                </div>}
                {post.files.length > 0 && <div className='attached_files'>
                    {post.files.map((x) => <FileCard key={x.id} file={x}></FileCard>)}
                </div>}
            </div>
            <div className='post_actions'>
                <div className='post_buttons'>
                    <div className='post_action_btn' onClick={() => dispatch(likePost({ id: post.id, like: !post.isLiked }))}>
                        {!post.isLiked ?
                            <div className="post_like_icon">
                                <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M16 4a5.95 5.95 0 0 0-3.89 1.7l-.12.11-.12-.11A5.96 5.96 0 0 0 7.73 4 5.73 5.73 0 0 0 2 9.72c0 3.08 1.13 4.55 6.18 8.54l2.69 2.1c.66.52 1.6.52 2.26 0l2.36-1.84.94-.74c4.53-3.64 5.57-5.1 5.57-8.06A5.73 5.73 0 0 0 16.27 4zm.27 1.8a3.93 3.93 0 0 1 3.93 3.92v.3c-.08 2.15-1.07 3.33-5.51 6.84l-2.67 2.08a.04.04 0 0 1-.04 0L9.6 17.1l-.87-.7C4.6 13.1 3.8 11.98 3.8 9.73A3.93 3.93 0 0 1 7.73 5.8c1.34 0 2.51.62 3.57 1.92a.9.9 0 0 0 1.4-.01c1.04-1.3 2.2-1.91 3.57-1.91z" fill="currentColor" fillRule="nonzero"></path></g></svg>
                            </div>
                            :
                            <div className="post_like_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M11.08 2.5A3.92 3.92 0 0115 6.42c0 2.19-.88 3.28-4.6 6.18L8.73 13.9c-.43.33-1.01.33-1.44 0L5.6 12.6C1.88 9.7 1 8.6 1 6.42A3.92 3.92 0 014.92 2.5c1.16 0 2.2.55 3.08 1.6.89-1.05 1.92-1.6 3.08-1.6z" fill="#ff3347" /></svg>
                            </div>}
                        {post.likesCount}
                    </div>{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"><defs><clipPath id="__lottie_element_2"><rect width="64" height="64" x="0" y="0"></rect></clipPath><clipPath id="__lottie_element_4"><path d="M0,0 L512,0 L512,512 L0,512z"></path></clipPath><radialGradient id="__lottie_element_11" spreadMethod="pad" gradientUnits="userSpaceOnUse" cx="11" cy="-24" r="78.1542012445136" fx="11" fy="-24"><stop offset="1%" stopColor="rgb(255,51,71)"></stop><stop offset="82%" stopColor="rgb(231,32,53)"></stop><stop offset="100%" stopColor="rgb(207,13,35)"></stop></radialGradient></defs><g clipPath="url(#__lottie_element_2)"><g clipPath="url(#__lottie_element_4)" transform="matrix(0.125,0,0,0.125,0,0)" opacity="1" style="display: block;"><g transform="matrix(6,0,0,6,256,256)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="url(#__lottie_element_11)" fillOpacity="1" d=" M32,0 C32,17.670000076293945 17.670000076293945,32 0,32 C-17.670000076293945,32 -32,17.670000076293945 -32,0 C-32,-17.670000076293945 -17.670000076293945,-32 0,-32 C17.670000076293945,-32 32,-17.670000076293945 32,0z"></path></g></g><g transform="matrix(6,0,0,6,256,256)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fillOpacity="1" d=" M19,-3.5350000858306885 C19,4.623000144958496 4.315000057220459,13.680999755859375 0.7110000252723694,15.781000137329102 C0.21899999678134918,16.069000244140625 -0.3840000033378601,16.069000244140625 -0.8880000114440918,15.803999900817871 C-4.638999938964844,13.75 -19,4.6570000648498535 -19,-3.5350000858306885 C-19,-9.315999984741211 -14.869000434875488,-14 -8.940999984741211,-14 C-5.214000225067139,-14 -1.9190000295639038,-12.142000198364258 0,-9.3149995803833 C1.9190000295639038,-12.142000198364258 5.214000225067139,-14 8.940999984741211,-14 C14.869000434875488,-14 19,-9.315999984741211 19,-3.5350000858306885z"></path></g></g></g></g></svg> */}

                    <div className='post_action_btn' onClick={() => { setCommentAreaVisible(true); setTimeout(() => ref.current.focus(), 0) }}>
                        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M16.9 4H7.1c-1.15 0-1.73.11-2.35.44-.56.3-1 .75-1.31 1.31C3.11 6.37 3 6.95 3 8.1v5.8c0 1.15.11 1.73.44 2.35.3.56.75 1 1.31 1.31l.15.07c.51.25 1.04.35 1.95.37h.25v2.21c0 .44.17.85.47 1.16l.12.1c.64.55 1.6.52 2.21-.08L13.37 18h3.53c1.15 0 1.73-.11 2.35-.44.56-.3 1-.75 1.31-1.31.33-.62.44-1.2.44-2.35V8.1c0-1.15-.11-1.73-.44-2.35a3.17 3.17 0 0 0-1.31-1.31A4.51 4.51 0 0 0 16.9 4zM6.9 5.8h9.99c.88 0 1.18.06 1.5.23.25.13.44.32.57.57.17.32.23.62.23 1.5v6.16c-.02.61-.09.87-.23 1.14-.13.25-.32.44-.57.57-.32.17-.62.23-1.5.23h-4.02a.9.9 0 0 0-.51.26l-3.47 3.4V17.1c0-.5-.4-.9-.9-.9H6.74a2.3 2.3 0 0 1-1.14-.23 1.37 1.37 0 0 1-.57-.57c-.17-.32-.23-.62-.23-1.5V7.74c.02-.61.09-.87.23-1.14.13-.25.32-.44.57-.57.3-.16.58-.22 1.31-.23z" fill="currentColor" fillRule="nonzero"></path></g></svg>
                        {post.commentsCount}
                    </div>
                    <div className='post_action_btn' onClick={() => setShareModalVisible(true)}>
                        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M12 3.73c-1.12.07-2 1-2 2.14v2.12h-.02a9.9 9.9 0 0 0-7.83 10.72.9.9 0 0 0 1.61.46l.19-.24a9.08 9.08 0 0 1 5.84-3.26l.2-.03.01 2.5a2.15 2.15 0 0 0 3.48 1.69l7.82-6.14a2.15 2.15 0 0 0 0-3.38l-7.82-6.13c-.38-.3-.85-.46-1.33-.46zm.15 1.79c.08 0 .15.03.22.07l7.82 6.14a.35.35 0 0 1 0 .55l-7.82 6.13a.35.35 0 0 1-.57-.28V14.7a.9.9 0 0 0-.92-.9h-.23l-.34.02c-2.28.14-4.4.98-6.12 2.36l-.17.15.02-.14a8.1 8.1 0 0 1 6.97-6.53.9.9 0 0 0 .79-.9V5.87c0-.2.16-.35.35-.35z" fill="currentColor" fillRule="nonzero"></path></g></svg>
                        {post.repostsCount}
                    </div>
                    {shareModalVisible && <ShareModal repostId={post.id} onClose={() => setShareModalVisible(false)}></ShareModal>}
                </div>
                <div className='post_views'>
                    <div className='post_views__icon '>
                        <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path><path clipRule="evenodd" d="M15.5 8c0-1-3-5-7.5-5S.5 7 .5 8s3 5 7.5 5 7.5-4 7.5-5zm-4 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" fillRule="evenodd"></path></g></svg>
                    </div>
                    {post.views}
                </div>
            </div>

            {commentAreaVisible &&
                <div className='post_comments'>
                    {post.comments.map((x) => <Comment location="post" comment={x} ownerId={post.accountId} key={x.id} ></Comment>)}
                    {post.commentsCount > post.comments.length && <span role='button' onClick={() => showMoreComments()}>{t("showNext")}</span>}
                    {!post.commentsDisabled ?
                        <>
                            {authStore.session ? <div className="comment_box_wrapper">
                                <Avatar className="avatar_element" crop={authStore.account?.avatarCrop} avatar={authStore.account?.avatar} onClick={() => router.push(`/id/${post.authorId}`)}> </Avatar>
                                <div className='comment_input_wrapper'>
                                    <input ref={ref} className='input input_reply' type="text" value={value} placeholder={t("writeComment")}
                                        onChange={(e) => setValue(e.target.value)} onKeyDown={commentHandleKeyDown} />
                                    <div className="input_comment_actions">
                                        {/* TODO: COMMENT FILE ATTACH */}
                                        {/* <span className="input_file_icon" >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><g fill="none" fillRule="evenodd"><path d="m20.0291094 15.0279907-5.384726 5.2303888c-2.5877049 2.513536-6.71408829 2.4838066-9.26530792-.0667538-2.6116233-2.6109485-2.61217034-6.8446794-.00122186-9.4563027.00760974-.0076117.01523784-.015205.02288425-.0227799l8.06657363-7.99110563c1.7601202-1.7436532 4.6004898-1.73030402 6.344143.02981623.0091252.00921136.0182104.01846224.0272554.02775238 1.7500823 1.79751906 1.7306631 4.66777042-.0435807 6.44144506l-8.1308667 8.12825806c-.8479169.8476448-2.20023168.9147308-3.12787932.1551687l-.1337127-.1094846c-.8947528-.7326277-1.02618115-2.0518803-.29355343-2.9466331.03855837-.047091.0791516-.0924786.12166404-.1360332l5.46733261-5.60136864" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></g></svg>
                                    </span> */}
                                        <EmojiPicker value={value} onChange={setValue} />
                                    </div>
                                </div>
                                <div className='send_reply_btn'><svg width="24" onClick={sendAndClear} height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="send_24__Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="send_24__send_24"><path id="send_24__Rectangle-76" d="M0 0h24v24H0z"></path><path d="M5.74 15.75a39.14 39.14 0 00-1.3 3.91c-.55 2.37-.95 2.9 1.11 1.78 2.07-1.13 12.05-6.69 14.28-7.92 2.9-1.61 2.94-1.49-.16-3.2C17.31 9.02 7.44 3.6 5.55 2.54c-1.89-1.07-1.66-.6-1.1 1.77.17.76.61 2.08 1.3 3.94a4 4 0 003 2.54l5.76 1.11a.1.1 0 010 .2L8.73 13.2a4 4 0 00-3 2.54z" id="send_24__Mask" fill="currentColor"></path></g></g></svg></div>
                            </div>
                                :
                                <div className='text-center p-2'>{'🔒 ' + t("commentAuthRequired")}</div>}
                        </>
                        :
                        <div className='text-center p-2'>{'🚫 ' + t("commentsDisabled")}</div>}
                </div>
            }

        </PageBlock>
    );
}

export default Post;
