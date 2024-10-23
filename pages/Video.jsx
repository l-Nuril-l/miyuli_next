"use client";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';


import AuthRequest from '@/components/AuthRequest';
import UploadVideo from '@/components/modals/upload/UploadVideo';
import { switchEditingMode } from '@/lib/features/video';
import classNames from 'classnames';
import Link from "next/link";
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import "./Video.scss";
import Videos from './Videos';
import VideosEdit from './VideosEdit';


const Video = () => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isMinimized, setMinimized] = useState(false);
    const video = useAppSelector(s => s.video);
    const [searchParamSection, setSearchParamSection] = useQueryState('section')
    const authStore = useAppSelector(s => s.auth.session)
    const router = useRouter()
    const t = useTranslations()
    const dispatch = useAppDispatch();

    useEffect(() => {
        let isUpl = searchParamSection === 'upload';
        if (video.uploading !== true && isUpl && !video.editing) {
            setSearchParamSection(null);
            dispatch(switchEditingMode(false))
        }
        else if (isUpl) dispatch(switchEditingMode(true))
        else if (video.editing) dispatch(switchEditingMode(false))
    }, [searchParamSection, dispatch, setSearchParamSection, video.uploading, video.editing]);

    return (
        <div className='video_layout'>
            <div className={classNames(`aside`, isMinimized && 'aside--collapsed')}>
                <div className="aside_body">
                    <div className='video_actions'>
                        <button className="btn_miyuli w-100" onClick={() => authStore ? setIsVideoModalOpen(true) : router.push("/login")}>
                            <div className="item_icon"><svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path clipRule="evenodd" d="M23 17a5 5 0 1 0-10 0 5 5 0 0 0 10 0zm-5.83-2.76a.83.83 0 0 1 1.66.1v1.83H20.77a.83.83 0 0 1-.1 1.66h-1.84V19.77a.83.83 0 0 1-1.66-.1v-1.84H15.23a.83.83 0 0 1 .1-1.66h1.84v-1.84z" fillRule="evenodd"></path><path d="M14.54 2.1H9.46c-1.02 0-1.83 0-2.5.05-.68.06-1.27.18-1.82.46A4.65 4.65 0 0 0 3.1 4.64c-.28.55-.4 1.14-.46 1.82a33.3 33.3 0 0 0-.05 2.5v6.08c0 1.02 0 1.83.05 2.5.06.68.18 1.27.46 1.82a4.65 4.65 0 0 0 2.03 2.03c.55.28 1.14.4 1.82.46.67.05 1.48.05 2.5.05h1.96a.9.9 0 0 0 0-1.8H9.5c-1.07 0-1.81 0-2.39-.05-.57-.04-.9-.13-1.15-.26-.54-.27-.98-.71-1.25-1.25a3.03 3.03 0 0 1-.26-1.15c-.05-.58-.05-1.33-.05-2.39V9c0-1.07 0-1.81.05-2.39.04-.57.13-.9.26-1.15.27-.54.7-.98 1.25-1.25.25-.13.58-.22 1.15-.26.58-.05 1.32-.05 2.39-.05h5c1.06 0 1.8 0 2.39.05.57.04.9.13 1.15.26.54.27.98.71 1.25 1.25.13.25.21.58.26 1.15.05.58.05 1.32.05 2.39v.71a.9.9 0 0 0 1.8 0v-.75c0-1.02 0-1.83-.05-2.5a4.77 4.77 0 0 0-.46-1.82 4.65 4.65 0 0 0-2.03-2.03 4.77 4.77 0 0 0-1.82-.46c-.67-.05-1.48-.05-2.5-.05z"></path><path d="M8.25 5.75h-1a.75.75 0 0 0-.75.75v1c0 .41.34.75.75.75h1c.41 0 .75-.34.75-.75v-1a.75.75 0 0 0-.75-.75zm0 5h-1a.75.75 0 0 0-.75.75v1c0 .41.34.75.75.75h1c.41 0 .75-.34.75-.75v-1a.75.75 0 0 0-.75-.75zm-1 5h1c.41 0 .75.34.75.75v1c0 .41-.34.75-.75.75h-1a.75.75 0 0 1-.75-.75v-1c0-.41.34-.75.75-.75zm8.5-10h1c.41 0 .75.34.75.75v1c0 .41-.34.75-.75.75h-1A.75.75 0 0 1 15 7.5v-1c0-.41.34-.75.75-.75z"></path></g></svg></div>
                            <div className="item_text">{t('uploadVideo')}</div>
                        </button>
                    </div>
                    <div className="aside_menu_list">
                        <Link href="/video" className="menu_list_item ">
                            <div className="menu_list_item_icon"><svg fill="none" height="28" viewBox="0 0 28 28" width="28" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M13.4 5.05a1.31 1.31 0 0 1 2.6.27V10a1 1 0 0 0 1 1h1.5c1.82 0 3.16.5 4.05 1.37.89.86 1.45 2.2 1.45 4.13v1c0 1.93-.56 3.27-1.45 4.13-.89.86-2.23 1.37-4.05 1.37H9.5v-9.01l1.7-1.37c.46-.36.77-.87.9-1.44zm-4.6 6.93 1.15-.92c.1-.08.16-.18.19-.3l1.31-6.13a3.31 3.31 0 0 1 6.55.7V9h.5c2.18 0 4.09.62 5.45 1.94C25.3 12.27 26 14.18 26 16.5v1c0 2.32-.69 4.23-2.05 5.56C22.59 24.38 20.68 25 18.5 25H8.82c-.3.35-.68.62-1.1.8-.31.12-.62.16-.92.18-.28.02-.63.02-1.02.02h-.06c-.4 0-.74 0-1.02-.02a2.85 2.85 0 0 1-2.5-1.77c-.12-.3-.16-.6-.18-.9C2 23 2 22.66 2 22.27V14.72c0-.4 0-.74.02-1.02a2.85 2.85 0 0 1 1.77-2.5c.3-.12.6-.16.9-.18C5 11 5.34 11 5.73 11h.06c.4 0 .74 0 1.02.02a2.85 2.85 0 0 1 2 .96zm-4.27 1.08c.03 0 .1-.03.3-.05l.92-.01.92.01c.2.02.27.04.3.05.21.09.38.26.47.47.01.03.03.1.05.3l.01.92v7.5l-.01.92c-.02.2-.04.27-.05.3a.85.85 0 0 1-.47.47c-.03.01-.1.03-.3.05l-.92.01-.92-.01c-.2-.02-.27-.04-.3-.05a.85.85 0 0 1-.47-.47c-.01-.03-.03-.1-.05-.3L4 22.25v-7.5l.01-.92c.02-.2.04-.27.05-.3a.85.85 0 0 1 .47-.47z" fill="currentColor" fillRule="evenodd"></path></svg></div>
                            <div className="menu_list_item_content"><div className="menu_list_item_content">{t("forYou")}</div></div>
                        </Link>
                        {authStore ?
                            <>
                                <Link href={`/video/${authStore.login || authStore.id}`} className="menu_list_item">
                                    <div className="menu_list_item_icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 28 28"><path fill="currentColor" d="M21 7a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4h14Zm0 2H7a2 2 0 0 0-2 2v9c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-8.5 3.32a.5.5 0 0 1 .27.08l4.07 2.67a.5.5 0 0 1 0 .84l-4.08 2.51A.5.5 0 0 1 12 18v-5.18a.5.5 0 0 1 .5-.5ZM18 3a2 2 0 0 1 2 1.85V5H8c0-1.1.9-2 2-2h8Z"></path></svg></div>
                                    <div className="menu_list_item_content"> <div className="menu_list_item_content">{t("myVideo")}</div> </div>
                                    <div className="menu_list_item_toggle"><svg fill="none" height="16" viewBox="0 0 12 16" width="12" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M4.22 3.47c.3-.3.77-.3 1.06 0l4 4c.3.3.3.77 0 1.06l-4 4a.75.75 0 0 1-1.06-1.06L7.69 8 4.22 4.53a.75.75 0 0 1 0-1.06z" fill="currentColor" fillRule="evenodd"></path></svg></div>
                                </Link>
                                <Link href="/video/subscriptions" className="menu_list_item " >
                                    <div className="menu_list_item_icon"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.85 6c-.27 0-.53 0-.8.02a1 1 0 1 1-.1-2l.9-.02a17.15 17.15 0 0 1 17.13 18.05 1 1 0 0 1-2-.1l.02-.8C22 12.78 15.22 6 6.85 6Zm-.68 10.07a5 5 0 0 1 5.77 5.77 1 1 0 0 0 1.96.33 7 7 0 0 0-8.07-8.07 1 1 0 0 0 .34 1.97ZM9 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-2.91-9.96a10 10 0 0 1 10.87 10.87 1 1 0 0 0 2 .18A12 12 0 0 0 5.91 9.05a1 1 0 0 0 .17 2Z" fill="currentColor"></path></svg></div>
                                    <div className="menu_list_item_content"> <div className="menu_list_item_content">{t("subscriptions")}</div> </div></Link>
                                <Link href={`/video/${authStore.login || authStore.id}/added`} className="menu_list_item">
                                    <div className="menu_list_item_icon"><svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g id="add_outline_28__Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="add_outline_28__add_outline_28"><path d="M0 0h28v28H0z"></path><path d="M14 4a1 1 0 0 1 1 1v8h8a1 1 0 0 1 0 2h-8v8a1 1 0 0 1-2 0v-8H5a1 1 0 0 1 0-2h8V5a1 1 0 0 1 1-1Z" id="add_outline_28__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg></div>
                                    <div className="menu_list_item_content"><div className="menu_list_item_content">{t("addedVideos")}</div></div>
                                </Link>
                                <Link href={`/video/${authStore.login || authStore.id}/uploaded`} className="menu_list_item ">
                                    <div className="menu_list_item_icon"><svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g id="upload_outline_28__Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="upload_outline_28__upload_outline_28"><path d="M0 0h28v28H0z"></path><path d="M21 22a1 1 0 1 1 0 2H7a1 1 0 0 1 0-2h14ZM14 3h.02a1 1 0 0 1 .07 0H14a1 1 0 0 1 .7.3l-.08-.09v.01l.09.07 7 7a1 1 0 0 1-1.42 1.42L15 6.4V19a1 1 0 0 1-2 0V6.41l-5.3 5.3a1 1 0 0 1-1.31.08l-.1-.08a1 1 0 0 1 0-1.42l7-7 .08-.07A1 1 0 0 1 14 3Z" id="upload_outline_28__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg></div>
                                    <div className="menu_list_item_content">
                                        <div className="menu_list_item_content">{t("uploadedVideos")}</div>
                                    </div>
                                </Link>
                                <Link href="/video/liked" className="menu_list_item " data-title={t("likedByMe")}>
                                    <div className="menu_list_item_icon"><svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g id="like_outline_28__Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="like_outline_28__like_outline_28"><path d="M0 0h28v28H0z"></path><path d="M9.03 4.88a6.53 6.53 0 0 0-6.53 6.53c0 3.6 1.44 5.42 7.5 10.12l2.77 2.16a2 2 0 0 0 2.46 0L18 21.53c6.05-4.7 7.49-6.51 7.49-10.12 0-3.6-2.92-6.53-6.53-6.53-1.87 0-3.53.85-4.97 2.49-1.44-1.64-3.1-2.49-4.97-2.49Zm0 2c1.52 0 2.88.86 4.15 2.68l.2.3a.75.75 0 0 0 1.24 0l.2-.3c1.27-1.82 2.63-2.68 4.15-2.68 2.5 0 4.53 2.03 4.53 4.53 0 2.78-1.14 4.2-6.72 8.54L14 22.11l-2.78-2.16C5.64 15.61 4.5 14.2 4.5 11.41c0-2.5 2.03-4.53 4.53-4.53Z" id="like_outline_28__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg></div>
                                    <div className="menu_list_item_content"> <div className="menu_list_item_content">{t("likedByMe")}</div> </div>
                                </Link>
                            </>
                            : <AuthRequest>authRequestVideo</AuthRequest>}
                    </div>
                </div>

                <div className="aside_footer">
                    <div className="menu_list_item" onClick={() => setMinimized(!isMinimized)}>
                        <div className="menu_list_item_icon">
                            <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g id="arrow_left_outline_28__Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="arrow_left_outline_28__arrow_left_outline_28"><path d="M28 0H0v28h28z"></path><path d="M12.3 6.3a1 1 0 0 1 1.4 1.4L8.42 13H22a1 1 0 0 1 1 .88V14a1 1 0 0 1-1 1H8.41l5.3 5.3a1 1 0 0 1 .08 1.31l-.08.1a1 1 0 0 1-1.42 0l-7-7-.07-.08A1 1 0 0 1 5 14v.09a1 1 0 0 1 0-.07V14a1.02 1.02 0 0 1 .2-.6 1 1 0 0 1 .1-.1l-.09.08a1 1 0 0 1 .08-.09Z" id="arrow_left_outline_28__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg>
                        </div>
                        <div className="menu_list_item_content">
                            <div className="menu_list_item_content">{t("collapse")}</div>
                        </div>

                    </div>

                </div>
                <UploadVideo isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />

            </div>
            <div className='main'>
                {video.editing === false ?
                    <Videos></Videos>
                    :
                    video.uploading === false ? <VideosEdit></VideosEdit>
                        :
                        <div className="loader">Loading...</div>

                }
            </div>
        </div>
    );
}

export default Video;
