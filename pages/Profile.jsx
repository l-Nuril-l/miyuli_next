"use client";
import AlbumCard from '@/components/AlbumCard';
import AudioCard from '@/components/AudioCard';
import Avatar from '@/components/Avatar';
import CommunityCard from '@/components/CommunityCard';
import CreatePost from '@/components/CreatePost';
import ImageCard from '@/components/ImageCard';
import NoAvatar from '@/components/NoAvatar';
import PageBlock from '@/components/PageBlock';
import Post from '@/components/Post';
import ProfileInfo from '@/components/ProfileInfo';
import VideoCard from '@/components/VideoCard';
import CropModal from '@/components/modals/CropModal';
import UploadImage from '@/components/modals/upload/UploadImage';
import { addFriend, clearErrorAccount, deleteFriend, disposeAccount, fetchAccount, initializeProfile, updateProfileAvatar, uploadAvatar } from '@/lib/features/account';
import { clearErrorPosts, disposePosts, fetchPosts } from '@/lib/features/posts';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector, useAppStore } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useMediaQuery } from 'react-responsive';
import StickyBox from 'react-sticky-box';
import './Profile.scss';

export default function Profile({ profile }) {
    const store = useAppStore()
    const initialized = useRef(0)
    if (initialized.current === 0) {
        store.dispatch(initializeProfile(profile))
        initialized.current = 1
    }

    const profileStore = useAppSelector((s) => s.account)
    const postStore = useAppSelector((s) => s.posts)
    const authStore = useAppSelector((s) => s.auth)
    const dispatch = useAppDispatch();
    const params = useParams();
    const id = params.id.replace(/^id/, '')
    const router = useRouter()
    const t = useTranslations()
    const [isCrop, setIsCrop] = useState(false);
    const promisesRef = useRef({});

    useEffect(() => {
        if (authStore.account?.avatar && profileStore.account && profileStore.account.id === authStore.account.id) {
            if (profileStore.account.avatar?.id !== authStore.account.avatar.id || (authStore.account.avatarCrop && Object.entries(authStore.account.avatarCrop).toString() !== Object.entries(profileStore.account.avatarCrop)))
                dispatch(updateProfileAvatar({ avatar: authStore.account.avatar, avatarCrop: authStore.account.avatarCrop }))
        }
    }, [dispatch, authStore.account, profileStore.account]);

    useEffect(() => {
        if (initialized.current === 1) { initialized.current = 2; return; }
        let promises = promisesRef.current;
        let cleanup = () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposePosts());
            dispatch(disposeAccount());
        }
        if (profileStore.errors.main !== undefined) return cleanup;

        promises.account = dispatch(fetchAccount(id))
        promises.account.then(x => {
            if (x.payload?.status === 404)
                router.push('unknown')
        });
        return cleanup;
    }, [dispatch, id, profileStore.errors.main]);

    useEffect(() => {
        return () => {
            dispatch(clearErrorAccount());
        };
    }, [dispatch, id]);

    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    const friendBtnHandler = () => {
        dispatch(profileStore.account.friendState % 2 === 1 ? deleteFriend(profileStore.account.id) : addFriend(profileStore.account.id))
    }

    const morePosts = () => {
        promisesRef.current.posts = dispatch(fetchPosts({ id: id, after: postStore.posts[postStore.posts.length - 1]?.id }))
    }

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

    return (
        <>
            {profileStore.isFetching && <div className="loader">Loading...</div>}
            {profileStore.errors.main && <main>
                <PageBlock className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(profileStore.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorAccount())}>{t('tryAgain')}</button></div>
                </PageBlock>
            </main>}
            {profileStore.account && <main className='profile_content'>
                <div className='left_side'>
                    <StickyBox offsetTop={parseInt(process.env.NEXT_PUBLIC_HEADER_HEIGHT)}>
                        <div className='page_block page_photo'>
                            <div className="owner_photo_wrap">
                                <UploadImage isOpen={isAvatarModalOpen} onUpload={(params) => dispatch(uploadAvatar(params))} onClose={() => setIsAvatarModalOpen(false)} />
                                {profileStore.account?.avatar?.id ?
                                    <>
                                        <ImageCard image={profileStore.account.avatar} crop={profileStore.account.avatarCrop}></ImageCard>
                                        <CropModal isOpen={isCrop} onClose={() => setIsCrop(false)} initialCrop={profileStore.account.avatarCrop} imageId={profileStore.account.avatar.id} />
                                    </> :
                                    <NoAvatar className='profile_avatar_img'></NoAvatar>
                                }
                                {profileStore.account?.id === authStore.session?.id && <>
                                    <div className='avatar_menu'>
                                        <div onClick={() => setIsAvatarModalOpen(true)}>{t("uploadAvatar")}</div>
                                        {profileStore.account?.avatar?.id && <div onClick={() => setIsCrop(true)}>{t("cropAvatar")}</div>}
                                    </div>
                                    <div onClick={() => dispatch(updateProfileAvatar())} className='remove_avatar'>╳</div>
                                </>}
                            </div>
                            <div className='profile_actions'>
                                {authStore.session?.id === parseInt(id) || authStore.session?.login === id ?
                                    <>
                                        <Link href={"/settings"} className='btn_miyuli'><div className="btn_miyuli_in">{t("edit")}</div></Link>
                                        {/* <div className='page_actions_expanded'>
                                                    <div className='page_action_cell profile_action_cell'>
                                                        <svg className='page_action_cell_icon' fill="none" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path clipRule="evenodd" d="M12 7.1a.9.9 0 0 1 .9.9v3.73l2.24 2.23a.9.9 0 1 1-1.28 1.28l-2.5-2.5a.9.9 0 0 1-.26-.64V8a.9.9 0 0 1 .9-.9z" fillRule="evenodd"></path><path d="M19 5a9.87 9.87 0 0 0-7-2.9 9.87 9.87 0 0 0-7.1 3V3a.9.9 0 0 0-1.8 0v4a.9.9 0 0 0 .9.9h4a.9.9 0 0 0 0-1.8H6.45A8.07 8.07 0 0 1 12 3.9c2.24 0 4.26.9 5.73 2.37A8.07 8.07 0 0 1 20.1 12c0 2.24-.9 4.26-2.37 5.73A8.07 8.07 0 0 1 12 20.1a8.06 8.06 0 0 1-5.2-1.9.9.9 0 0 0-1.16 1.39A9.86 9.86 0 0 0 12 21.9a9.87 9.87 0 0 0 9.9-9.9c0-2.73-1.1-5.21-2.9-7z"></path></g></svg>
                                                        {t('memories')}
                                                    </div>
                                                    <div className='page_action_cell profile_action_cell'>
                                                        <svg className='page_action_cell_icon' fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M3.93 11.7c0-3.63 3.49-6.8 8.09-6.8s8.08 3.17 8.08 6.8c0 3.64-3.48 6.81-8.08 6.81a9.34 9.34 0 0 1-3.29-.58.9.9 0 0 0-1 .26c-.67.8-1.8 1.35-3.51 1.55.2-.44.4-.9.57-1.37.3-.78.53-1.66.53-2.56a.9.9 0 0 0-.18-.53 5.95 5.95 0 0 1-1.2-3.57zm8.09-8.6c-5.33 0-9.89 3.73-9.89 8.6 0 1.62.5 3.12 1.38 4.39a6.22 6.22 0 0 1-.4 1.65c-.2.53-.43 1.04-.67 1.55l-.23.52c-.39.86.28 1.83 1.21 1.79 2.2-.09 4-.64 5.25-1.8 1.05.34 2.17.51 3.35.51 5.32 0 9.88-3.73 9.88-8.6 0-4.88-4.56-8.61-9.88-8.61zM12 8.9a.6.6 0 0 0-.57.4.9.9 0 1 1-1.7-.6 2.4 2.4 0 0 1 4.67.8c0 1.1-.53 1.73-.92 2.17l-.01.02c-.4.44-.54.6-.58.91a.9.9 0 0 1-1.78-.2 3.2 3.2 0 0 1 1.02-1.92c.32-.36.47-.57.47-.98a.6.6 0 0 0-.6-.6zm1 6.6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="currentColor" fillRule="evenodd"></path></svg>
                                                        {t('myQuestions')}
                                                    </div>
                                                </div> */}
                                    </>
                                    :
                                    <>
                                        {authStore.session && <>
                                            <button onClick={() => router.push(`/im?sel=${profileStore.account.id}`)} className='btn_miyuli'><div className="btn_miyuli_in">{t("writeMsg")}</div></button>
                                            <button onClick={() => friendBtnHandler()} className='btn_miyuli'><div className="btn_miyuli_in">{profileStore.account.friendState === 3 ? t("deleteFriend") : profileStore.account.friendState === 2 ? t("acceptFriendRequest") : profileStore.account.friendState === 1 ? t("cancelFriendRequest") : t("sendFriendRequest")}</div></button>
                                        </>}
                                    </>
                                }
                            </div>
                        </div>
                        {isMobile && <ProfileInfo />}
                        {profileStore.account.friends?.length > 0 &&
                            <PageBlock>
                                <Link href={`/friends?id=${profileStore.account.id}&section=all`} className='block_header_top'>
                                    <span className='header_label'>{t("friends")}</span>
                                    <span className='header_count'>{profileStore.account.friendsCount}</span>
                                </Link>
                                <div className='profile_card_body'>
                                    {profileStore.account.friends?.map(x =>
                                        <div key={x.id} className='people_cell' onClick={() => router.push(`/id/${x.id}`)}>
                                            <Avatar className='people_cell_avatar' size={50} crop={x.avatarCrop} avatar={x.avatar}></Avatar>
                                            <div className='people_cell_name'>{x.name}</div>
                                        </div>
                                    )}
                                </div>
                            </PageBlock>}
                        {profileStore.account.communities?.length > 0 &&
                            <PageBlock>
                                <Link href={`/communities?id=${profileStore.account.id}`} className='block_header_top'>
                                    <span className='header_label'>{t("communities")}</span>
                                    <span className='header_count'>{profileStore.account.communitiesCount}</span>
                                </Link>
                                <div className='profile_card_body'>
                                    {profileStore.account.communities?.map(x =>
                                        <CommunityCard key={x.id} community={x} size={50}></CommunityCard>
                                    )}
                                </div>
                            </PageBlock>}
                        {profileStore.account.albums?.length > 0 &&
                            <PageBlock>
                                <Link href={'/albums/' + profileStore.account.id} className='block_header_top'>
                                    <span className='header_label'>{t("albums")}</span>
                                    <span className='header_count'>{profileStore.account.albumsCount}</span>
                                </Link>
                                <div className='albums_wrap'>
                                    {profileStore.account.albums?.map(x =>
                                        <AlbumCard key={x.id} album={x}></AlbumCard>
                                    )}
                                </div>
                            </PageBlock>}
                        {profileStore.account.videos?.length > 0 &&
                            <PageBlock>
                                <Link href={'/video/' + profileStore.account.id} className='block_header_top'>
                                    <span className='header_label'>{t("videos")}</span>
                                    <span className='header_count'>{profileStore.account.videosCount}</span>
                                </Link>
                                <div className='videos_wrap'>
                                    {profileStore.account.videos?.map(x =>
                                        <VideoCard off key={x.id} video={x}></VideoCard>
                                    )}
                                </div>
                            </PageBlock>}
                        {profileStore.account.audios?.length > 0 &&
                            <PageBlock>
                                <Link href={'/audios/' + profileStore.account.id} className='block_header_top'>
                                    <span className='header_label'>{t("audios")}</span>
                                    <span className='header_count'>{profileStore.account.audiosCount}</span>
                                </Link>
                                <div className='audios_wrap'>
                                    {profileStore.account.audios?.map(x =>
                                        <AudioCard authorId={profileStore.account.id} key={x.id} audio={x}></AudioCard>
                                    )}
                                </div>
                            </PageBlock>}
                    </StickyBox>
                </div>
                <div className='right_side'>
                    {!isMobile && <ProfileInfo />}
                    {profileStore.account.images?.length > 0 &&
                        <PageBlock>
                            <div className='profile_images_container'>
                                {profileStore.account.images.map(x => (
                                    <ImageCard key={x.id} className='image_block_img' image={x}></ImageCard>
                                ))}
                            </div>
                        </PageBlock>
                    }
                    {/* TODO: COMMENTS CLOSED   */}
                    <CreatePost profile></CreatePost>
                    <InfiniteScroll
                        loadMore={() => !postStore.errors.main && !postStore.isFetching ? morePosts() : null}
                        hasMore={postStore.hasMore}
                    >
                        {postStore.posts?.map(x =>
                            <Post key={x.id} post={x}></Post>
                        )}
                        {postStore.isFetching && <div className='loader'></div>}
                    </InfiniteScroll>
                    {!postStore.hasMore && !postStore.posts.length && <PageBlock className="p-2 text-center">{t("noFeed")}</PageBlock>}
                    {postStore.errors.main && <PageBlock className='p-2 gap-2 d-flex flex-column align-items-center'>
                        <div>{t(handleCommonErrorCases(postStore.errors.main))}</div>
                        <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorPosts())}>{t('tryAgain')}</button></div>
                    </PageBlock>}
                </div>
            </main>}
        </>
    )
}
