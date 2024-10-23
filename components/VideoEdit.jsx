"use client";
import { removeThumbnail, updateVideo, uploadThumbnail } from '@/lib/features/video';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import CloseSvg from '../assets/CloseSvg';
import ImageCard from './ImageCard';
import PageBlock from './PageBlock';
import "./VideoEdit.scss";




const VideoEdit = ({ videoIndex }) => {
    const video = useAppSelector(s => s.video.videosEdit[videoIndex])
    const isSaved = useAppSelector(s => s.video.saved[videoIndex])
    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description);
    const [thumb, setThumb] = useState(video.thumbnail);
    const t = useTranslations()
    const dispatch = useAppDispatch();

    useEffect(() => {
        setThumb(video.thumbnail)
    }, [video.thumbnail])

    const selectFile = () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.addEventListener("change", () => {
            if (input.files && input.files[0] && input.files[0].type.includes("image")) {
                dispatch(uploadThumbnail({ file: input.files[0] }))
            }
        })
    }

    return (
        <PageBlock key={video.id} className="video_edit_block">
            <div className="video_notification_wrapper">
                {isSaved &&
                    <div className='notification notification_success'>
                        <div className="notification_icon"><svg fill="none" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="M14.96 9.26a.9.9 0 0 1 1.28 1.28l-4.6 4.6a.9.9 0 0 1-1.28 0l-2.6-2.6a.9.9 0 0 1 1.28-1.28L11 13.23z"></path><path clipRule="evenodd" d="M12 2.1a9.9 9.9 0 1 1 0 19.8 9.9 9.9 0 0 1 0-19.8zm0 1.8A8.1 8.1 0 0 0 3.9 12a8.1 8.1 0 0 0 8.1 8.1 8.1 8.1 0 0 0 8.1-8.1A8.1 8.1 0 0 0 12 3.9z" fillRule="evenodd"></path></g></svg></div>
                        <div className="notification_text">{t("videoSaved")}</div>
                    </div>
                }
                {isSaved === false &&
                    <div className="notification notification_error">
                        <div className="notification_icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.93 4.93A9.97 9.97 0 0 1 12 2a9.97 9.97 0 0 1 7.07 2.93A9.97 9.97 0 0 1 22 12a9.97 9.97 0 0 1-2.93 7.07A9.97 9.97 0 0 1 12 22a9.97 9.97 0 0 1-7.07-2.93A9.97 9.97 0 0 1 2 12a9.97 9.97 0 0 1 2.93-7.07ZM12 3.8a8.17 8.17 0 0 0-5.8 2.4A8.17 8.17 0 0 0 3.8 12a8.17 8.17 0 0 0 2.4 5.8 8.17 8.17 0 0 0 5.8 2.4 8.17 8.17 0 0 0 5.8-2.4 8.17 8.17 0 0 0 2.4-5.8 8.17 8.17 0 0 0-2.4-5.8A8.17 8.17 0 0 0 12 3.8ZM13 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1-9a.9.9 0 0 1 .9.9v5.2a.9.9 0 0 1-1.8 0V7.9A.9.9 0 0 1 12 7Z" clipRule="evenodd"></path></svg></div>
                        <div className="notification_text">{t("occurredError")}</div>
                    </div>
                }
            </div>
            <div className='video_edit'>
                <div className='video_edit_card'>
                    <div className='video_card_thumb'>
                        {!video.thumbnail ?
                            <div className="video_card_uploading">
                                <div className="video_card_uploading_icon">
                                    <svg fill="none" height="56" viewBox="0 0 56 56" width="56" xmlns="http://www.w3.org/2000/svg"><path d="M37.74 6c3.57 0 4.86.37 6.17 1.07s2.32 1.72 3.02 3.02c.7 1.3 1.07 2.6 1.07 6.17v23.48c0 3.57-.37 4.86-1.07 6.17a7.27 7.27 0 0 1-3.02 3.02c-1.3.7-2.6 1.07-6.17 1.07H18.26c-3.57 0-4.86-.37-6.17-1.07-1.3-.7-2.32-1.72-3.02-3.02S8 43.3 8 39.74V16.26c0-3.57.37-4.86 1.07-6.17.7-1.3 1.72-2.32 3.02-3.02S14.7 6 18.26 6zm.32 3h-19.8c-2.8 0-3.77.19-4.75.71a4.27 4.27 0 0 0-1.8 1.8c-.5.95-.7 1.87-.7 4.43L11 39.74c0 2.8.19 3.77.71 4.75a4.27 4.27 0 0 0 1.8 1.8c.99.52 1.95.71 4.75.71h19.48c2.8 0 3.77-.19 4.75-.71a4.27 4.27 0 0 0 1.8-1.8c.52-.98.71-1.95.71-4.75V16.26c0-2.8-.19-3.77-.71-4.75a4.27 4.27 0 0 0-1.8-1.8c-.95-.5-1.87-.7-4.43-.7zM18.72 38c.44 0 .6.05.77.13.16.1.29.22.38.38.08.16.13.33.13.77v1.44c0 .44-.05.6-.13.77a.9.9 0 0 1-.38.38c-.16.08-.33.13-.77.13h-1.44c-.44 0-.6-.05-.77-.13a.9.9 0 0 1-.38-.38c-.08-.16-.13-.33-.13-.77v-1.44c0-.44.05-.6.13-.77a.9.9 0 0 1 .38-.38c.16-.08.33-.13.77-.13zm20 0c.44 0 .6.05.77.13.16.1.29.22.38.38.08.16.13.33.13.77v1.44c0 .44-.05.6-.13.77a.9.9 0 0 1-.38.38c-.16.08-.33.13-.77.13h-1.44c-.44 0-.6-.05-.77-.13a.9.9 0 0 1-.38-.38c-.08-.16-.13-.33-.13-.77v-1.44c0-.44.05-.6.13-.77a.9.9 0 0 1 .38-.38c.16-.08.33-.13.77-.13zm-20-8c.44 0 .6.05.77.13.16.1.29.22.38.38.08.16.13.33.13.77v1.44c0 .44-.05.6-.13.77a.9.9 0 0 1-.38.38c-.16.08-.33.13-.77.13h-1.44c-.44 0-.6-.05-.77-.13a.9.9 0 0 1-.38-.38c-.08-.16-.13-.33-.13-.77v-1.44c0-.44.05-.6.13-.77a.9.9 0 0 1 .38-.38c.16-.08.33-.13.77-.13zm20 0c.44 0 .6.05.77.13.16.1.29.22.38.38.08.16.13.33.13.77v1.44c0 .44-.05.6-.13.77a.9.9 0 0 1-.38.38c-.16.08-.33.13-.77.13h-1.44c-.44 0-.6-.05-.77-.13a.9.9 0 0 1-.38-.38c-.08-.16-.13-.33-.13-.77v-1.44c0-.44.05-.6.13-.77a.9.9 0 0 1 .38-.38c.16-.08.33-.13.77-.13zm-20-8c.44 0 .6.05.77.13.16.1.29.22.38.38.08.16.13.33.13.77v1.44c0 .44-.05.6-.13.77a.9.9 0 0 1-.38.38c-.16.08-.33.13-.77.13h-1.44c-.44 0-.6-.05-.77-.13a.9.9 0 0 1-.38-.38c-.08-.16-.13-.33-.13-.77v-1.44c0-.44.05-.6.13-.77a.9.9 0 0 1 .38-.38c.16-.08.33-.13.77-.13zm20 0c.44 0 .6.05.77.13.16.1.29.22.38.38.08.16.13.33.13.77v1.44c0 .44-.05.6-.13.77a.9.9 0 0 1-.38.38c-.16.08-.33.13-.77.13h-1.44c-.44 0-.6-.05-.77-.13a.9.9 0 0 1-.38-.38c-.08-.16-.13-.33-.13-.77v-1.44c0-.44.05-.6.13-.77a.9.9 0 0 1 .38-.38c.16-.08.33-.13.77-.13zm-20-8c.44 0 .6.05.77.13.16.1.29.22.38.38.08.16.13.33.13.77v1.44c0 .44-.05.6-.13.77a.9.9 0 0 1-.38.38c-.16.08-.33.13-.77.13h-1.44c-.44 0-.6-.05-.77-.13a.9.9 0 0 1-.38-.38c-.08-.16-.13-.33-.13-.77v-1.44c0-.44.05-.6.13-.77a.9.9 0 0 1 .38-.38c.16-.08.33-.13.77-.13zm20 0c.44 0 .6.05.77.13.16.1.29.22.38.38.08.16.13.33.13.77v1.44c0 .44-.05.6-.13.77a.9.9 0 0 1-.38.38c-.16.08-.33.13-.77.13h-1.44c-.44 0-.6-.05-.77-.13a.9.9 0 0 1-.38-.38c-.08-.16-.13-.33-.13-.77v-1.44c0-.44.05-.6.13-.77a.9.9 0 0 1 .38-.38c.16-.08.33-.13.77-.13z" fill="currentColor"></path></svg>
                                </div>
                                <div className="video_card_uploading_text">
                                    {t("videoIspUploading")}
                                </div>
                            </div>
                            :
                            <ImageCard className='video_card_image' image={thumb}></ImageCard>
                        }
                    </div>
                    <div className='video_card_body'>
                        <div className="video_card_row">
                            <div className="video_row_title">{t("fileName")}</div>
                            <div className="video_row_info">{video.title}</div>
                        </div>
                        <div className="video_card_row">
                            <div className="video_row_title">{t("videoLink")}</div>
                            <a rel="noreferrer" href={`${document.location.origin}/video/${video.uploadedBy.isCommunity ? -video.uploadedBy.id : video.uploadedBy.id}_${video.id}`} target="_blank" className="video_row_info">{document.location.origin}/video/{video.uploadedBy.isCommunity ? -video.uploadedBy.id : video.uploadedBy.id}_{video.id}</a>
                        </div>
                    </div>
                </div>
                <div className="video_edit_body">
                    <div className='video_row'>
                        <div className="video_row_title">{t("title")}</div>
                        <input className='input video_input' value={title} onChange={x => setTitle(x.target.value)} />
                    </div>
                    <div className="video_row">
                        <div className="video_row_title">{t("description")}</div>
                        <TextareaAutosize placeholder={t("aboutWhatVideo")} className='input video_textarea' value={description} onChange={x => setDescription(x.target.value)} ></TextareaAutosize>
                    </div>
                    <div className="video_row">
                        <div className="video_row_title">{t("videoThumbnail")}</div>
                        <div className='video_default_thumbs'>
                            <div className='video_default_thumb'>
                                {video.defaultThumbnails.some(x => x.id === video.thumbnail.id) ?
                                    <div className='video_thumb_upload' onClick={() => selectFile()}>
                                        <div className="thumb_upload">
                                            <div className="thumb_upload_icon"><svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g id="camera_outline_28__Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="camera_outline_28__camera_outline_28"><path d="M0 0h28v28H0z"></path><path d="M15.7 2c.52 0 .99.06 1.43.2.45.15.87.37 1.24.67.36.28.67.64.96 1.08l.27.4.13.18c.1.13.16.2.24.26.08.07.17.12.28.15.13.04.26.06.57.06h.22c1.2.05 1.87.22 2.59.6.76.4 1.36 1 1.77 1.77.45.83.6 1.63.6 3.24v5.98c0 2.18-.2 3.23-.79 4.32a5.54 5.54 0 0 1-2.3 2.3c-1.09.59-2.14.79-4.32.79H9.41c-2.18 0-3.23-.2-4.32-.79a5.54 5.54 0 0 1-2.3-2.3c-.56-1.03-.77-2.03-.79-3.98v-6.6c.02-1.43.18-2.18.6-2.96A4.27 4.27 0 0 1 4.37 5.6c.7-.37 1.35-.53 2.45-.58L6.91 5h.27c.31 0 .44-.02.57-.06.11-.03.2-.08.28-.15.1-.09.2-.18.37-.45l.27-.4c.29-.43.6-.79.96-1.07.37-.3.79-.52 1.24-.67.44-.14.91-.2 1.43-.2h3.4Zm0 2h-3.4c-.32 0-.6.04-.83.11-.22.07-.4.17-.58.31-.2.16-.38.36-.56.63l-.3.46c-.27.39-.47.61-.72.82-.3.24-.62.42-.98.53-.34.1-.65.14-1.19.14H7.1l-.27.02c-.75.04-1.11.13-1.5.34-.42.22-.74.54-.96.95-.27.5-.36 1-.36 2.3v5.98c0 1.88.14 2.62.55 3.38.34.64.84 1.14 1.48 1.48.68.36 1.34.52 2.82.55h10.3c1.48-.03 2.14-.19 2.82-.55a3.54 3.54 0 0 0 1.48-1.48c.36-.68.52-1.34.55-2.82V10.16c-.03-.98-.13-1.4-.36-1.85a2.27 2.27 0 0 0-.95-.95A3.5 3.5 0 0 0 21 7h-.24c-.48-.01-.77-.05-1.09-.14-.36-.11-.69-.29-.98-.53a3.72 3.72 0 0 1-.72-.82l-.3-.46a2.78 2.78 0 0 0-.56-.63 1.74 1.74 0 0 0-.58-.31c-.23-.07-.5-.11-.83-.11ZM14 8.5A5.25 5.25 0 1 1 14 19a5.25 5.25 0 0 1 0-10.5Zm0 2a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z" id="camera_outline_28__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg></div>
                                            <div className="thumb_upload_text">Загрузить</div>
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <ImageCard image={video.thumbnail} alt='Thumb' className='video_default_thumb_image' />
                                        <div className='video_default_thumb_hover' onClick={() => setThumb(video.thumbnail)}>
                                            <div className="video_default_thumb_check_icon">
                                                <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g id="done_outline_28__Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="done_outline_28__done_outline_28"><path d="M0 0h28v28H0z"></path><path d="m11 18.59-5.3-5.3a1 1 0 1 0-1.4 1.42l6 6a1 1 0 0 0 1.4 0l12-12a1 1 0 1 0-1.4-1.42L11 18.6Z" id="done_outline_28__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg>
                                            </div>
                                        </div>
                                        <div className="video_thumb_actions">
                                            <div className='video_card_action' onClick={() => dispatch(removeThumbnail(videoIndex))}>
                                                <div className="video_card_action_icon"><CloseSvg width={16} height={16} /></div>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                            {video.defaultThumbnails?.map((x) =>
                                <div key={x.id} className="video_default_thumb" onClick={() => setThumb(x)}>
                                    <ImageCard image={x} alt='DefaultThumb' className='video_default_thumb_image'></ImageCard>
                                    <div className='video_default_thumb_hover'>
                                        <div className="video_default_thumb_check_icon">
                                            <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><g id="done_outline_28__Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="done_outline_28__done_outline_28"><path d="M0 0h28v28H0z"></path><path d="m11 18.59-5.3-5.3a1 1 0 1 0-1.4 1.42l6 6a1 1 0 0 0 1.4 0l12-12a1 1 0 1 0-1.4-1.42L11 18.6Z" id="done_outline_28__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></svg>
                                        </div>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
            <div className='video_edit_footer'>
                <button className='btn_miyuli' onClick={() => dispatch(updateVideo({ videoIndex, video: { id: video.id, title, description, thumbnailid: thumb.id } }))}>{t("save")}</button>
                {isSaved === null &&
                    <div className="loader"></div>
                }
            </div>
        </PageBlock >
    );
}

export default VideoEdit;
