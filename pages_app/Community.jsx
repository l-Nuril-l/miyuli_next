"use client";
import AlbumCard from '@/components/AlbumCard';
import AudioCard from '@/components/AudioCard';
import Avatar from '@/components/Avatar';
import CreatePost from '@/components/CreatePost';
import ImageCard from '@/components/ImageCard';
import PageBlock from '@/components/PageBlock';
import Post from '@/components/Post';
import Status from '@/components/Status';
import VideoCard from '@/components/VideoCard';
import CropModal from '@/components/modals/CropModal';
import ShareModal from '@/components/modals/ShareModal';
import UploadCover from '@/components/modals/upload/UploadCover';
import UploadImage from '@/components/modals/upload/UploadImage';
import { cancelCommunityRequest, clearErrorCommunity, deleteAvatar, deleteCover, disposeCommunity, getCommunity, sendCommunityRequest, uploadCommunityAvatar } from '@/lib/features/community';
import { disposePosts, fetchCommunityPosts } from '@/lib/features/posts';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import StickyBox from 'react-sticky-box';
import './Community.scss';



const Community = () => {
    const communityStore = useAppSelector((s) => s.community)
    const community = communityStore.community
    const postStore = useAppSelector((s) => s.posts)
    const authStore = useAppSelector((s) => s.auth.session)
    const dispatch = useAppDispatch();
    const params = useParams();
    const id = params.id.replace(/^community/, '')
    const router = useRouter()

    const t = useTranslations()
    const promisesRef = useRef({});

    useEffect(() => {
        var promises = promisesRef.current
        if (communityStore.errors.main) {
            if (communityStore.errors.main === 404) router.push('unknown')
            return;
        }
        promises.community = dispatch(getCommunity(id))
        promises.posts = dispatch(fetchCommunityPosts({ id: id }))

        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposeCommunity());
            dispatch(disposePosts());
        }
    }, [dispatch, id, authStore, router, communityStore.errors.main]);

    const SubscribeHandler = () => {
        dispatch(community.isSubscribed ? cancelCommunityRequest(id) : sendCommunityRequest(id))
    }

    const scrollHandler = useCallback((e) => {
        if (postStore.hasMore === true && postStore.isFetching === false && e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            promisesRef.current.posts = dispatch(fetchCommunityPosts({ id: id, after: postStore.posts[postStore.posts.length - 1].id }))
        }
    }, [dispatch, id, postStore])

    useEffect(() => {
        document.addEventListener("scroll", scrollHandler)
        return () => {
            document.removeEventListener("scroll", scrollHandler);
        };
    }, [scrollHandler]);

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [isShareCommunity, setIsShareCommunity] = useState(false);

    const [isCrop, setIsCrop] = useState(false);
    const [isCoverCrop, setIsCoverCrop] = useState(false);

    return (
        <>
            <main className='community'>
                {communityStore.isFetching && <div className="loader">Loading...</div>}
                {communityStore.errors.main && <PageBlock className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(communityStore.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorCommunity())}>{t('tryAgain')}</button></div>
                </PageBlock>}
                {community && <>
                    <PageBlock className='community_header' >
                        {community.cover?.id ?
                            <div className='cover_container'>
                                <CropModal cover communityId={community.id} isOpen={isCoverCrop} onClose={() => setIsCoverCrop(false)} initialCrop={community.coverCrop} imageId={community.cover?.id} />
                                <ImageCard crop={community.coverCrop} className='poster_image' image={community.cover}></ImageCard>
                                <div className="cover_actions">
                                    <div className="action upload" onClick={() => setIsCoverModalOpen(true)}></div>
                                    <div className="action crop" onClick={() => setIsCoverCrop(true)}></div>
                                    <div className="action delete" onClick={() => dispatch(deleteCover(community.id))}></div>
                                </div>
                            </div>
                            :
                            authStore && community.ownerId === authStore.id && <div className="no_cover" onClick={() => setIsCoverModalOpen(true)}>{t('setCover')}</div>}
                        <UploadCover communityId={community.id} isOpen={isCoverModalOpen} onClose={() => setIsCoverModalOpen(false)} />
                        <div className='header_data'>
                            <div className='d-flex align-items-center flex-grow-1'>
                                <Avatar className="avatar_element community_avatar" size={50} open crop={community.avatarCrop} avatar={community.avatar}>
                                    <UploadImage onUpload={(params) => dispatch(uploadCommunityAvatar(Object.assign({ communityId: community.id }, params)))} isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />
                                    <CropModal communityId={community.id} isOpen={isCrop} onClose={() => setIsCrop(false)} initialCrop={community.avatarCrop} imageId={community.avatar?.id} />
                                    {community.ownerId === authStore?.id && <div className="miyuli_dropdown">
                                        <div className="miyuli_dropdown_row" onClick={() => setIsAvatarModalOpen(true)}>{t("uploadAvatar")}</div>
                                        {community.avatar && <>
                                            <div className="miyuli_dropdown_row" onClick={() => setIsCrop(true)}>{t("cropAvatar")}</div>
                                            <div className="miyuli_dropdown_row" onClick={() => dispatch(deleteAvatar(community.id))}>{t("deleteAvatar")}</div>
                                        </>
                                        }
                                    </div>}
                                </Avatar>
                                <div className='flex-grow-1'>
                                    <div>{community.name}</div>
                                    {authStore && <Status disabled={authStore.id !== community.ownerId} status={community.status} communityId={community.id}></Status>}
                                    {/* <div className='label'>{community.status}</div> */}
                                </div>
                            </div>
                            <button className='btn_miyuli' onClick={() => SubscribeHandler()}>
                                {community.isSubscribed ? t("unsubscribe") : t("subscribe")}
                                {/* <DropDownArrow></DropDownArrow> */}
                            </button>
                        </div>
                    </PageBlock>
                    <div className='community_content'>
                        <div className='community_left'>
                            <PageBlock>
                                <CreatePost community={community.id}></CreatePost>
                            </PageBlock>
                            {Array.isArray(postStore.posts) && postStore.posts?.map(x => {
                                return <Post key={x.id} post={x}></Post>
                            })}
                        </div>
                        <aside className='community_right'>
                            <StickyBox offsetTop={parseInt(process.env.NEXT_PUBLIC_HEADER_HEIGHT) + 15} offsetBottom={15}>
                                <PageBlock className='page_action_menu_groups'>
                                    <div className='page_actions_expanded'>
                                        <Link href={`/im?sel=-${community.id}`} className='page_action_cell'>
                                            <svg className='page_action_cell_icon' fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.71 18.2a.9.9 0 0 1 1-.26c1.03.39 2.14.59 3.29.59 4.5 0 8.1-3.09 8.1-6.82S16.5 4.9 12 4.9s-8.1 3.08-8.1 6.81a6 6 0 0 0 1.21 3.59.9.9 0 0 1 .18.54c0 .9-.38 2.18-1.11 3.91 1.65-.18 2.82-.7 3.53-1.55zM3.4 21.62c-.92.03-1.6-.95-1.21-1.8.78-1.71 1.2-2.97 1.3-3.72A7.76 7.76 0 0 1 2.1 11.7C2.1 6.92 6.56 3.1 12 3.1s9.9 3.82 9.9 8.61c0 4.8-4.46 8.62-9.9 8.62-1.16 0-2.29-.17-3.35-.5-1.21 1.1-2.98 1.7-5.26 1.79z" fill="currentColor"></path></svg>
                                            {t('writeMsg')}
                                        </Link>
                                        <hr />
                                        <Link href={`/gim/${community.id}`} className='page_action_cell'>
                                            <svg className='page_action_cell_icon' fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.71 18.2a.9.9 0 0 1 1-.26c1.03.39 2.14.59 3.29.59 4.5 0 8.1-3.09 8.1-6.82S16.5 4.9 12 4.9s-8.1 3.08-8.1 6.81a6 6 0 0 0 1.21 3.59.9.9 0 0 1 .18.54c0 .9-.38 2.18-1.11 3.91 1.65-.18 2.82-.7 3.53-1.55zM3.4 21.62c-.92.03-1.6-.95-1.21-1.8.78-1.71 1.2-2.97 1.3-3.72A7.76 7.76 0 0 1 2.1 11.7C2.1 6.92 6.56 3.1 12 3.1s9.9 3.82 9.9 8.61c0 4.8-4.46 8.62-9.9 8.62-1.16 0-2.29-.17-3.35-.5-1.21 1.1-2.98 1.7-5.26 1.79z" fill="currentColor"></path></svg>
                                            {t('messages')}
                                        </Link>
                                        {/* <div className='page_action_cell'>
                                                <svg className='page_action_cell_icon' fill="none" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.1c4.02 0 6.9 3.28 6.9 7.53v1.6c0 .23.2.53.72 1.08l.27.27c1.08 1.1 1.51 1.73 1.51 2.75 0 .44-.05.79-.27 1.2-.45.88-1.42 1.37-2.87 1.37h-1.9c-.64 2.33-2.14 3.6-4.36 3.6-2.25 0-3.75-1.3-4.37-3.67l.02.07H5.74c-1.5 0-2.47-.5-2.9-1.41-.2-.4-.24-.72-.24-1.16 0-1.02.43-1.65 1.51-2.75l.27-.27c.53-.55.72-.85.72-1.08v-1.6C5.1 5.38 7.99 2.1 12 2.1zm2.47 15.8H9.53c.46 1.25 1.25 1.8 2.47 1.8s2.01-.55 2.47-1.8zM12 3.9c-2.96 0-5.1 2.43-5.1 5.73v1.6c0 .85-.39 1.46-1.23 2.33l-.28.29c-.75.75-.99 1.11-.99 1.48 0 .19.01.29.06.38.1.22.43.39 1.28.39h12.52c.82 0 1.16-.17 1.28-.4.05-.1.06-.2.06-.37 0-.37-.24-.73-.99-1.48l-.28-.29c-.84-.87-1.23-1.48-1.23-2.33v-1.6c0-3.3-2.13-5.73-5.1-5.73z" fill="currentColor"></path></svg>
                                                {t('notifications')}
                                            </div> */}
                                        <div className='page_action_cell' onClick={() => setIsShareCommunity(true)}>
                                            <svg className='page_action_cell_icon' height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M12 3.73c-1.12.07-2 1-2 2.14v2.12h-.02a9.9 9.9 0 0 0-7.83 10.72.9.9 0 0 0 1.61.46l.19-.24a9.08 9.08 0 0 1 5.84-3.26l.2-.03.01 2.5a2.15 2.15 0 0 0 3.48 1.69l7.82-6.14a2.15 2.15 0 0 0 0-3.38l-7.82-6.13c-.38-.3-.85-.46-1.33-.46zm.15 1.79c.08 0 .15.03.22.07l7.82 6.14a.35.35 0 0 1 0 .55l-7.82 6.13a.35.35 0 0 1-.57-.28V14.7a.9.9 0 0 0-.92-.9h-.23l-.34.02c-2.28.14-4.4.98-6.12 2.36l-.17.15.02-.14a8.1 8.1 0 0 1 6.97-6.53.9.9 0 0 0 .79-.9V5.87c0-.2.16-.35.35-.35z" fill="currentColor" fillRule="nonzero"></path></g></svg>
                                            {t('share')}
                                        </div>
                                        <Link href={`${community.id}/settings`} className='page_action_cell'>
                                            <svg className="page_action_cell_icon" fill="none" height="24" viewBox="0 0 20 20" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10.6 2c.98.03 1.63.58 1.96 1.6l.06.18.04.15.06.2.04.13.03.01.06-.02.1-.04.13-.06c1.16-.53 2.05-.43 2.78.36l.1.12.67.83c.6.8.58 1.63 0 2.54l-.1.15-.1.14-.12.16-.05.1-.03.04v.02l.08.05.1.06.13.07c1.13.58 1.6 1.35 1.42 2.4l-.03.16-.2.87c-.13.56-.23.82-.63 1.19-.39.35-.83.5-1.42.55h-.18l-.16.01-.2.01-.15.02.01.12.01.08.03.14c.26 1.25-.03 2.1-.97 2.62l-.14.08-.96.47c-.9.4-1.72.2-2.48-.58l-.12-.13-.11-.13-.14-.15-.08-.08-.04-.04-.07.08-.09.08-.1.11c-.78.93-1.6 1.27-2.6.88L7 17.49l-.86-.42-.26-.13c-.39-.22-.6-.42-.82-.87a2.38 2.38 0 01-.13-1.54l.03-.19.04-.2L5 14 4.93 14l-.12-.01h-.15c-1.27-.03-2.03-.51-2.33-1.55l-.04-.15-.24-1.04c-.2-.97.2-1.72 1.11-2.28l.16-.1.15-.07.17-.1.13-.08v-.02l-.05-.08-.06-.1-.09-.12c-.76-1.02-.85-1.92-.22-2.8l.1-.12.67-.83c.64-.75 1.47-.9 2.48-.52l.17.07.15.06.18.08.11.04.03-.01.03-.08.04-.11.03-.14c.3-1.17.9-1.83 1.96-1.92L9.46 2zm-.05 1.47h-1.1l-.1.01c-.24.03-.4.16-.54.68l-.04.13-.04.17c-.09.29-.22.61-.39.93a4.8 4.8 0 00-.94.46 5.28 5.28 0 01-.95-.29l-.28-.13c-.2-.08-.36-.13-.48-.14h-.07a.45.45 0 00-.33.16l-.06.06-.64.8-.08.1c-.15.21-.17.4.16.88l.18.25c.18.26.35.57.5.9-.11.32-.19.65-.23.99a5.3 5.3 0 01-.83.6l-.28.14c-.5.28-.57.46-.53.72l.01.06.23 1 .04.13c.07.25.21.39.79.41l.32.02c.3.01.65.07 1 .16.18.29.4.55.63.8.02.43-.02.85-.1 1.18-.16.78 0 .9.32 1.06l.92.45c.1.05.19.07.28.07h.05c.15-.02.32-.13.55-.4l.21-.24c.21-.23.48-.47.78-.68l.24.01h.5l.24-.02c.3.22.57.46.78.69l.21.24c.27.3.44.4.6.4h.06c.05 0 .1-.02.14-.04l.08-.03.92-.45.12-.06c.24-.14.34-.32.2-1a5.07 5.07 0 01-.1-1.18c.24-.25.45-.51.64-.8.34-.1.7-.15 1-.16l.31-.02c.67-.03.75-.2.83-.54l.22-.93c.07-.33.07-.53-.5-.85l-.29-.15a5.26 5.26 0 01-.83-.59 4.87 4.87 0 00-.22-.98c.14-.34.32-.65.49-.9l.19-.26c.33-.48.3-.67.16-.88l-.04-.06-.65-.8c-.11-.13-.2-.23-.37-.26h-.06c-.13 0-.3.04-.54.14l-.3.13c-.27.11-.6.22-.94.28-.3-.18-.61-.33-.94-.45-.16-.3-.29-.62-.37-.9l-.1-.33c-.15-.56-.32-.66-.58-.68zM10 6.9a3.11 3.11 0 110 6.23 3.11 3.11 0 010-6.23zm0 1.48a1.64 1.64 0 100 3.27 1.64 1.64 0 000-3.27z" fill="currentColor"></path></svg>
                                            {t('settings')}
                                        </Link>
                                        {isShareCommunity && <ShareModal attachedCommunityId={community.id} onClose={() => setIsShareCommunity(false)}></ShareModal>}
                                    </div>
                                </PageBlock>
                                {community.accountsCount > 0 && <PageBlock>
                                    <div className='block_header_top'>
                                        <span className='header_label'>{t("members")}</span>
                                        <span className='header_count'>{community.accountsCount}</span>
                                    </div>
                                    <div className='profile_card_body'>
                                        {community.accounts?.map(x =>
                                            <div key={x.id} className='people_cell' onClick={() => router.push(`/id${x.id}`)}>
                                                <Avatar size={50} crop={x.avatarCrop} className="people_cell_avatar" avatar={x.avatar}></Avatar>
                                                <div className='people_cell_name'>{x.name}</div>
                                            </div>
                                        )}
                                    </div>
                                </PageBlock>}
                                <PageBlock>
                                    <div className='block_header_top'>
                                        <span className='header_label'>{t("owner")}</span>
                                    </div>
                                    <div className='profile_card_body'>
                                        <div className='people_row' onClick={() => router.push(`/id${community.owner.id}`)}>
                                            <Avatar size={50} crop={community.owner?.avatarCrop} className="people_cell_avatar" avatar={community.owner?.avatar}></Avatar>
                                            <div className='people_row_name'>{community.owner?.name} {community.owner?.surname}</div>
                                        </div>
                                    </div>
                                </PageBlock>
                                {community.albums?.length > 0 &&
                                    <PageBlock>
                                        <Link href={'/albums' + -community.id} className='block_header_top'>
                                            <span className='header_label'>{t("albums")}</span>
                                            <span className='header_count'>{community.albumsCount}</span>
                                        </Link>
                                        <div className='albums_wrap'>
                                            {community.albums?.map(x =>
                                                <AlbumCard key={x.id} album={x}></AlbumCard>
                                            )}
                                        </div>
                                    </PageBlock>}
                                {community.videos?.length > 0 &&
                                    <PageBlock>
                                        <Link href={'/video/-' + community.id} className='block_header_top'>
                                            <span className='header_label'>{t("videos")}</span>
                                            <span className='header_count'>{community.videosCount}</span>
                                        </Link>
                                        <div className='videos_wrap'>
                                            {community.videos?.map(x =>
                                                <VideoCard off key={x.id} video={x}></VideoCard>
                                            )}
                                        </div>
                                    </PageBlock>}
                                {community.audios?.length > 0 &&
                                    <PageBlock>
                                        <Link href={'/audios' + -community.id} className='block_header_top'>
                                            <span className='header_label'>{t("audios")}</span>
                                            <span className='header_count'>{community.audiosCount}</span>
                                        </Link>
                                        <div className='audios_wrap'>
                                            {community.audios?.map(x =>
                                                <AudioCard authorId={-community.id} key={x.id} audio={x}></AudioCard>
                                            )}
                                        </div>
                                    </PageBlock>}
                                {community.ownerId === authStore?.id && <PageBlock className='page_action_menu_groups'>
                                    <div className='page_actions_expanded'>
                                        <Link href={`/albums${-community.id}`} className='page_action_cell'>
                                            <svg className='page_action_cell_icon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.46 3h3.08c.29 0 .53 0 .76.03.7.1 1.35.47 1.8 1.03.25.3.4.64.62.96.2.28.5.46.85.48.3.02.58-.01.88.02a3.9 3.9 0 0 1 3.53 3.53c.02.18.02.37.02.65v4.04c0 1.09 0 1.96-.06 2.66a5.03 5.03 0 0 1-.47 1.92 4.9 4.9 0 0 1-2.15 2.15c-.57.29-1.2.41-1.92.47-.7.06-1.57.06-2.66.06H9.26c-1.09 0-1.96 0-2.66-.06a5.03 5.03 0 0 1-1.92-.47 4.9 4.9 0 0 1-2.15-2.15 5.07 5.07 0 0 1-.47-1.92C2 15.7 2 14.83 2 13.74V9.7c0-.28 0-.47.02-.65a3.9 3.9 0 0 1 3.53-3.53c.3-.03.59 0 .88-.02.34-.02.65-.2.85-.48.21-.32.37-.67.61-.96A2.9 2.9 0 0 1 9.7 3.03c.23-.03.47-.03.76-.03Zm0 1.8-.49.01a1.1 1.1 0 0 0-.69.4c-.2.24-.33.56-.52.82A2.9 2.9 0 0 1 6.54 7.3c-.28.01-.55-.02-.83 0a2.1 2.1 0 0 0-1.9 1.91l-.01.53v3.96c0 1.14 0 1.93.05 2.55.05.62.15.98.29 1.26.3.58.77 1.05 1.35 1.35.28.14.64.24 1.26.29.62.05 1.42.05 2.55.05h5.4c1.13 0 1.93 0 2.55-.05.62-.05.98-.15 1.26-.29a3.1 3.1 0 0 0 1.35-1.35c.14-.28.24-.64.29-1.26.05-.62.05-1.41.05-2.55V9.21a2.1 2.1 0 0 0-1.91-1.9c-.28-.03-.55 0-.83-.01a2.9 2.9 0 0 1-2.22-1.27c-.19-.26-.32-.58-.52-.83a1.1 1.1 0 0 0-.69-.39 3.92 3.92 0 0 0-.49-.01h-3.08Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M12 9.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm-4.5 2.7a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z" fill="currentColor"></path></svg>
                                            {t('addPhotos')}
                                        </Link>
                                        <Link href={`/video/${-community.id}`} className='page_action_cell'>
                                            <svg className='page_action_cell_icon' width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.46 2.1h5.08c1.02 0 1.83 0 2.5.05.68.06 1.27.18 1.82.46a4.65 4.65 0 0 1 2.03 2.03c.28.55.4 1.14.46 1.82.05.67.05 1.48.05 2.5v6.08c0 1.02 0 1.83-.05 2.5a4.77 4.77 0 0 1-.46 1.82 4.65 4.65 0 0 1-2.03 2.03c-.55.28-1.14.4-1.82.46-.67.05-1.48.05-2.5.05H9.46c-1.02 0-1.83 0-2.5-.05a4.77 4.77 0 0 1-1.82-.46 4.65 4.65 0 0 1-2.03-2.03 4.78 4.78 0 0 1-.46-1.82c-.05-.67-.05-1.48-.05-2.5V8.96c0-1.02 0-1.83.05-2.5.06-.68.18-1.27.46-1.82A4.65 4.65 0 0 1 5.14 2.6c.55-.28 1.14-.4 1.82-.46.67-.05 1.48-.05 2.5-.05zM7.11 3.95c-.57.05-.9.13-1.15.26A2.85 2.85 0 0 0 4.7 5.46c-.13.25-.21.58-.26 1.15C4.4 7.19 4.4 7.93 4.4 9v6c0 1.06 0 1.81.05 2.39.05.57.13.9.26 1.15.27.54.71.98 1.25 1.25.25.13.58.22 1.15.26.58.05 1.32.05 2.39.05h5c1.06 0 1.81 0 2.39-.05.57-.04.9-.13 1.15-.26a2.85 2.85 0 0 0 1.25-1.25c.13-.25.22-.58.26-1.15.05-.58.05-1.32.05-2.39V9c0-1.06 0-1.81-.05-2.39-.04-.57-.13-.9-.26-1.15a2.85 2.85 0 0 0-1.25-1.25 3.02 3.02 0 0 0-1.15-.26c-.58-.05-1.32-.05-2.39-.05h-5c-1.06 0-1.81 0-2.39.05zm.14 11.8h1a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm8.5 0h1a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-8.5-5h1a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm8.5 0h1a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-8.5-5h1A.75.75 0 0 1 9 6.5v1a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm8.5 0h1a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75h-1A.75.75 0 0 1 15 7.5v-1a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></svg>
                                            {t('addVideo')}
                                        </Link>
                                        <Link href={`/audios${-community.id}`} className='page_action_cell'>
                                            <svg className='page_action_cell_icon' fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M16.72 4.1a17.3 17.3 0 0 1 1.31-.24c.3-.04.41-.01.46 0 .2.07.38.21.49.4.02.04.07.14.1.44.02.3.02.7.02 1.32L8.9 8.14V7.6c0-.47 0-.78.02-1.02.01-.23.04-.33.07-.4.08-.18.21-.33.38-.45.05-.04.14-.09.36-.15.23-.07.53-.13 1-.23zm-9.62 11h-.2c-1.8 0-3.12.45-4.02 1.21a3.54 3.54 0 0 0-1.28 2.71 3.38 3.38 0 0 0 3.38 3.38c.92 0 1.94-.38 2.7-1.28.77-.9 1.22-2.23 1.22-4.02V9.98l10.2-2.12v5.24h-.2c-1.8 0-3.12.45-4.02 1.21a3.54 3.54 0 0 0-1.28 2.71 3.38 3.38 0 0 0 3.38 3.38c.92 0 1.94-.38 2.7-1.28.77-.9 1.22-2.23 1.22-4.02V6c0-.57 0-1.06-.03-1.45a2.79 2.79 0 0 0-.34-1.2 2.7 2.7 0 0 0-1.46-1.2 2.79 2.79 0 0 0-1.25-.08c-.4.05-.87.15-1.43.26l-.04.01-5.99 1.25h-.03c-.42.1-.8.17-1.1.26-.31.09-.62.2-.9.4-.44.32-.78.74-.99 1.22-.14.32-.2.64-.22.98-.02.3-.02.68-.02 1.12v.03zm8.95.59c-.48.4-.65.9-.65 1.34 0 .86.7 1.57 1.57 1.57.44 0 .94-.17 1.34-.65.41-.47.79-1.34.79-2.85v-.2h-.2c-1.5 0-2.38.38-2.85.79zM3.4 19.03c0-.44.17-.94.65-1.34.47-.41 1.34-.79 2.85-.79h.2v.2c0 1.5-.38 2.38-.79 2.85-.4.48-.9.65-1.33.65-.87 0-1.58-.7-1.58-1.58z" fill="currentColor" fillRule="evenodd"></path></svg>
                                            {t('addTrack')}
                                        </Link>
                                    </div>
                                </PageBlock>}
                            </StickyBox>
                        </aside>
                    </div>
                </>}
            </main >
        </>
    )
}

export default Community;
