"use client";
import { uploadAudiosOnly } from '@/lib/features/audio';
import { uploadFilesOnly } from '@/lib/features/file';
import { uploadImagesOnly } from '@/lib/features/photo';
import { sendPost } from '@/lib/features/posts';
import { uploadVideosOnly } from '@/lib/features/video';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import AttachmentContainer from './AttachmentContainer';
import AudioCard from './AudioCard';
import Avatar from './Avatar';
import "./CreatePost.scss";
import DragHere from './DragHere';
import EmojiPicker from './EmojiPicker';
import FileCard from './FileCard';
import ImageCard from './ImageCard';
import AttachAudioModal from './modals/attach/AttachAudioModal';
import AttachFileModal from './modals/attach/AttachFileModal';
import AttachImageModal from './modals/attach/AttachImageModal';
import AttachVideoModal from './modals/attach/AttachVideoModal';
import PageBlock from './PageBlock';
import VideoCard from './VideoCard';



const CreatePost = (props) => {
    const { community: isCommunity } = props
    const authStore = useAppSelector((s) => s.auth)
    const community = useAppSelector((s) => s.community.community)
    const account = useAppSelector((s) => s.account)
    const categories = useAppSelector((s) => s.filters.categories)

    const t = useTranslations()
    const dispatch = useAppDispatch();

    const [value, setValue] = useState("");
    const [commentsDisabled, setCommentsDisabled] = useState(false);
    const isOwner = community?.ownerId === authStore.session?.id;

    const [files, setFiles] = useState([]);
    const [audios, setAudios] = useState([]);
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState([]);

    const [isAttachingFile, setIsAttachingFile] = useState(false);
    const [isAttachingAudio, setIsAttachingAudio] = useState(false);
    const [isAttachingVideo, setIsAttachingVideo] = useState(false);
    const [isAttachingImage, setIsAttachingImage] = useState(false);

    const [categoryId, setCategoryId] = useState(1);

    const createPost = () => {
        const post = {
            text: value,
            attachImagesWithIds: images.map(x => x.id),
            attachVideosWithIds: videos.map(x => x.id),
            attachAudiosWithIds: audios.map(x => x.id),
            attachFilesWithIds: files.map(x => x.id),
            accountId: isCommunity ? null : account.account?.id || authStore.session.id,
            communityId: isCommunity ? community.id : null,
            categoryId,
            commentsDisabled
        }

        dispatch(/* isCommunity && !isOwner ? suggestCommunityPost(post) :*/ sendPost(post));
        setValue('')
        setFiles([])
        setAudios([])
        setVideos([])
        setImages([])
    }

    const onDropHandler = (e) => {
        if (e.dataTransfer && e.dataTransfer.files.length != 0) {
            var files = Array.from(e.dataTransfer.files) //Array of filenames
            dispatch(uploadImagesOnly({ files: files.filter(x => "image/jpeg,image/png,image/gif,image/heic,image/heif,image/webp".includes(x.type)) })).unwrap().then(x => setImages(images => images.concat(x)))
            dispatch(uploadVideosOnly({ files: files.filter(x => "video/mp4,video/x-m4v,video/*".includes(x.type)) })).unwrap().then(x => setVideos(videos => videos.concat(x)))
            dispatch(uploadAudiosOnly({ files: files.filter(x => "audio/mpeg".includes(x.type)) })).unwrap().then(x => setAudios(audios => audios.concat(x)))
            dispatch(uploadFilesOnly({ files: files.filter(file => !"image/,video/,audio/".split(',').some(x => x.startsWith(file.type))) })).unwrap().then(x => setFiles(files => files.concat(x)))
            // code to place file name in field goes here...
        } else {
            // browser doesn't support drag and drop.
        }
    }

    return (
        <PageBlock className="create_post_wrapper">
            <DragHere onDrop={onDropHandler} />
            {
                authStore.session ? <>
                    <div className='make_post'>
                        <Avatar crop={authStore.account?.avatarCrop} avatar={authStore.account?.avatar}></Avatar>
                        <div className="text_area_container">
                            <TextareaAutosize placeholder={t(isCommunity ? isOwner ? "writeSomething" : "suggestSomething" : "whatNew")} value={value} onChange={x => setValue(x.target.value)} className='post_input' />
                            <EmojiPicker absolute value={value} onChange={setValue} />
                        </div>
                    </div>
                    <div className="post_attachements">
                        {images.length > 0 && <div className='attached_images'>
                            {images.map((x) => <AttachmentContainer key={x.id} onDetach={() => { setImages(images.filter((f) => f.id !== x.id)) }}>
                                <ImageCard image={x} />
                            </AttachmentContainer>)}
                        </div>}
                        {videos.length > 0 && <div className='attached_videos'>
                            {videos.map((x) => <AttachmentContainer key={x.id} onDetach={() => { setVideos(videos.filter((f) => f.id !== x.id)) }}>
                                <VideoCard off video={x}></VideoCard>
                            </AttachmentContainer>)}
                        </div>}
                        {audios.length > 0 && <div className='attached_audios'>
                            {audios.map((x) => <AttachmentContainer key={x.id} onDetach={() => { setAudios(audios.filter((f) => f.id !== x.id)) }}>
                                <AudioCard off audio={x}></AudioCard>
                            </AttachmentContainer>)}
                        </div>}
                        {files.length > 0 && <div className='attached_files'>
                            {files.map((x) => <AttachmentContainer key={x.id} onDetach={() => { setFiles(files.filter((f) => f.id !== x.id)) }}>
                                <FileCard off file={x}></FileCard>
                            </AttachmentContainer>)}
                        </div>}
                    </div>
                    <div className="post_footer">
                        <div className='post_actions_left'>
                            <span className="attachment_icon" onClick={() => setIsAttachingImage(true)}><svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M5.5 5.5c.57 0 1-.2 1.34-.52.24-.24.43-.54.55-.74l.06-.1c.15-.23.26-.37.39-.47.11-.08.3-.17.66-.17h3c.36 0 .55.09.66.17.13.1.24.24.4.48l.05.09c.12.2.3.5.55.74.33.32.77.52 1.34.52.73 0 .99 0 1.19.04.9.18 1.59.88 1.77 1.77.04.2.04.46.04 1.19v3.45c0 .85 0 1.45-.04 1.9-.04.46-.1.72-.2.92-.22.42-.57.77-.99.98-.2.1-.46.17-.91.21-.46.04-1.06.04-1.91.04h-6.9c-.85 0-1.45 0-1.91-.04a2.4 2.4 0 0 1-.91-.2 2.25 2.25 0 0 1-.99-.99 2.4 2.4 0 0 1-.2-.91c-.04-.46-.04-1.06-.04-1.91V8.5c0-.73 0-.99.04-1.19.18-.9.88-1.59 1.77-1.77.2-.04.46-.04 1.19-.04zm3-3.5c-.64 0-1.14.16-1.54.46-.39.27-.62.63-.78.9l-.08.11c-.13.22-.2.34-.3.43-.06.05-.12.1-.3.1h-.09c-.61 0-1.03 0-1.4.07a3.75 3.75 0 0 0-2.94 2.95C1 7.38 1 7.8 1 8.42v3.56c0 .81 0 1.47.04 2 .05.55.14 1.03.37 1.47.36.7.93 1.28 1.64 1.64.44.23.92.32 1.47.37.53.04 1.18.04 2 .04H13.48c.81 0 1.47 0 2-.04a3.84 3.84 0 0 0 1.47-.37c.7-.36 1.28-.93 1.64-1.64.23-.44.32-.92.37-1.47.04-.53.04-1.19.04-2V8.41c0-.61 0-1.03-.07-1.4a3.75 3.75 0 0 0-2.95-2.94 7.5 7.5 0 0 0-1.4-.07h-.08c-.18 0-.24-.05-.3-.1-.1-.1-.17-.2-.3-.43l-.08-.12c-.16-.26-.4-.62-.78-.9-.4-.29-.9-.45-1.54-.45zm3.75 8.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm1.5 0a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z" fill="currentColor" fillRule="evenodd"></path></svg></span>
                            <span className="attachment_icon" onClick={() => setIsAttachingVideo(true)}><svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M10 17a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm-8.5-7a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0zm8.65 3.38 2.7-1.56a2.1 2.1 0 0 0 0-3.64l-2.7-1.56A2.1 2.1 0 0 0 7 8.44v3.12a2.1 2.1 0 0 0 3.15 1.82zm1.95-3.9c.4.23.4.8 0 1.04l-2.7 1.56a.6.6 0 0 1-.9-.52V8.44c0-.46.5-.75.9-.52z" fill="currentColor" fillRule="evenodd"></path></svg></span>
                            <span className="attachment_icon" onClick={() => setIsAttachingAudio(true)}><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g id="music_outline_20__Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="music_outline_20__Icons-20/music_outline_20"><g id="music_outline_20__music_outline_20"><path d="M0 0h20v20H0z"></path><path d="M14.73 2.05a2.28 2.28 0 0 1 2.75 2.23v7.99c0 3.57-3.5 5.4-5.39 3.51-1.9-1.9-.06-5.38 3.52-5.38h.37V6.76L8 8.43v5.82c0 3.5-3.35 5.34-5.27 3.62l-.11-.1c-1.9-1.9-.06-5.4 3.51-5.4h.37V6.24c0-.64.05-1 .19-1.36l.05-.13c.17-.38.43-.7.76-.93.36-.26.7-.4 1.41-.54ZM6.5 13.88h-.37c-2.32 0-3.34 1.94-2.45 2.82.88.89 2.82-.13 2.82-2.45v-.37Zm9.48-1.98h-.37c-2.32 0-3.34 1.94-2.46 2.82.89.89 2.83-.13 2.83-2.45v-.37Zm-.02-7.78a.78.78 0 0 0-.92-.6L9.06 4.77c-.4.09-.54.15-.68.25a.8.8 0 0 0-.27.33c-.08.18-.1.35-.1.88v.67l7.97-1.67V4.2Z" id="music_outline_20__Icon-Color" fill="currentColor" fillRule="nonzero"></path></g></g></g></svg></span>
                            <span className="attachment_icon" onClick={() => setIsAttachingFile(true)}><svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M17.2 6.78a2 2 0 0 1 .24.58c.06.23.06.48.06.97v2.97c0 2.52 0 3.78-.49 4.74a4.5 4.5 0 0 1-1.97 1.97c-.96.49-2.22.49-4.74.49h-.6c-2.52 0-3.78 0-4.74-.49a4.5 4.5 0 0 1-1.97-1.97c-.49-.96-.49-2.22-.49-4.74V8.7c0-2.52 0-3.78.49-4.74a4.5 4.5 0 0 1 1.97-1.97c.96-.49 2.22-.49 4.74-.49h.97c.5 0 .74 0 .97.06.2.04.4.13.58.23.2.13.37.3.72.65l3.62 3.62c.35.35.52.52.65.72zM10.3 17h-.6c-1.28 0-2.16 0-2.83-.06-.66-.05-1-.15-1.23-.27a3 3 0 0 1-1.31-1.3 3.24 3.24 0 0 1-.27-1.24C4 13.46 4 12.58 4 11.3V8.7c0-1.28 0-2.16.06-2.83.05-.66.15-1 .27-1.23a3 3 0 0 1 1.3-1.31c.24-.12.58-.22 1.24-.27C7.54 3 8.42 3 9.7 3h.3v1.28c0 .67 0 1.23.04 1.67.03.47.12.88.31 1.28.32.6.81 1.1 1.42 1.42.4.2.81.28 1.28.31.44.04 1 .04 1.67.04H16v2.3c0 1.28 0 2.16-.06 2.83-.05.66-.15 1-.27 1.23a3 3 0 0 1-1.3 1.31c-.24.12-.58.22-1.24.27-.67.06-1.55.06-2.83.06zm5.57-9.5h-1.12c-.71 0-1.2 0-1.58-.03a1.88 1.88 0 0 1-.71-.16c-.33-.17-.6-.44-.77-.77a1.88 1.88 0 0 1-.16-.7 21.6 21.6 0 0 1-.03-1.59V3.13l.01.01.37.36 3.62 3.62.36.37.01.01z" fill="currentColor" fillRule="evenodd"></path></svg></span>
                            <select className='select_miyuli' value={categoryId} onChange={x => setCategoryId(x.target.value)}>
                                {categories.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                            </select>
                            {isAttachingImage && <AttachImageModal onFileSelected={(file) => { !images.find(x => x.id === file.id) && setImages([...images, file]); setIsAttachingImage(false) }} onClose={() => setIsAttachingImage(false)} />}
                            {isAttachingVideo && <AttachVideoModal onFileSelected={(file) => { !videos.find(x => x.id === file.id) && setVideos([...videos, file]); setIsAttachingVideo(false) }} onClose={() => setIsAttachingVideo(false)} />}
                            {isAttachingAudio && <AttachAudioModal onFileSelected={(file) => { !audios.find(x => x.id === file.id) && setAudios([...audios, file]); setIsAttachingAudio(false) }} onClose={() => setIsAttachingAudio(false)} />}
                            {isAttachingFile && <AttachFileModal onFileSelected={(file) => { !files.find(x => x.id === file.id) && setFiles([...files, file]); setIsAttachingFile(false) }} onClose={() => setIsAttachingFile(false)} />}
                        </div>
                        <div className='post_actions_right'>
                            <div className="post_settings_wrap">
                                <span className="attachment_icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="m7.22 3.38.01-.03a4.15 4.15 0 0 1 .17-.48c.36-.82.95-1.29 1.86-1.36l.16-.01h1.21c1.05.03 1.74.6 2.1 1.7l.05.18.05.16c.01.07.03.14.06.2l.05.14.03.02.06-.02.11-.04.14-.06a5.36 5.36 0 0 1 .17-.08l.03-.01a4.23 4.23 0 0 1 .43-.15c.93-.27 1.68-.08 2.32.61l.1.13.72.88c.63.83.61 1.72 0 2.68l-.12.16-.1.14-.12.18-.06.1-.03.05v.02l.08.05.11.06.13.08c1.21.61 1.71 1.42 1.52 2.54l-.03.16-.22.92c-.13.59-.24.87-.67 1.25a2.13 2.13 0 0 1-1.05.52h-.01a3.92 3.92 0 0 1-.44.06l-.2.02H15.63l-.16.01-.16.02.01.13.01.08.03.15c.07.32.1.62.1.9a2.04 2.04 0 0 1-1.13 1.87l-.15.08-1.02.5c-.9.4-1.72.23-2.48-.47a3.93 3.93 0 0 1-.15-.14l-.13-.14-.11-.13a2.94 2.94 0 0 0-.15-.17l-.09-.08-.04-.04-.08.08-.09.1-.1.1c-.83.99-1.7 1.34-2.77.93l-.15-.06-.91-.45-.28-.13a1.78 1.78 0 0 1-.87-.92 2.15 2.15 0 0 1-.2-1.01v-.02c0-.19.02-.39.06-.6l.04-.2.04-.2.01-.15-.1-.02-.12-.01h-.15a4.14 4.14 0 0 1-.86-.1h-.01a2.05 2.05 0 0 1-1.61-1.53l-.05-.16-.25-1.1c-.2-1.03.2-1.82 1.19-2.41l.17-.1.15-.08.19-.1.13-.1v-.01l-.05-.1-.07-.1-.09-.13a5.2 5.2 0 0 1-.29-.42c-.54-.9-.53-1.72.05-2.52l.1-.14.72-.87c.68-.8 1.56-.96 2.64-.56l.18.08.16.07a2.9 2.9 0 0 0 .19.08l.12.04.03-.02.03-.07.04-.12.04-.15.04-.16Zm4.24.84.01.04.05.14a1.5 1.5 0 0 0 .75.83l.03.01a1.5 1.5 0 0 0 1.13.08l.06-.02a1.47 1.47 0 0 0 .07-.02l.12-.04.06-.03.13-.06.04-.01a2.7 2.7 0 0 1 .41-.16c.27-.08.41-.06.47-.04.06.01.16.05.32.22l.07.09.69.84c.13.18.15.29.15.35 0 .09-.03.27-.23.58l-.08.12-.08.1a4.4 4.4 0 0 0-.18.27l-.02.02-.06.1v.01l-.01.02-.03.05a1.5 1.5 0 0 0-.18 1.06v.01a1.5 1.5 0 0 0 .65.96l.08.05.05.04.1.06.07.03.13.08.04.01c.45.24.62.43.67.52.04.06.09.16.04.42l-.02.12-.2.89c-.07.28-.1.35-.11.37h-.01a.97.97 0 0 1-.1.11.65.65 0 0 1-.36.16 2.36 2.36 0 0 1-.25.04h-.16l-.13.01h-.08a4.55 4.55 0 0 0-.28.02l-.15.02a1.5 1.5 0 0 0-1.32 1.63l.01.12v.07l.02.09.01.06.03.15v.05c.06.23.07.42.07.55 0 .2-.04.3-.07.35a.72.72 0 0 1-.28.24l-.1.05-.98.47c-.2.1-.32.09-.38.07-.08-.01-.23-.06-.46-.28a2.38 2.38 0 0 1-.08-.07l-.1-.1-.09-.11a4.39 4.39 0 0 0-.21-.24l-.02-.01-.08-.09a1.43 1.43 0 0 0-.04-.03l-.04-.04a1.5 1.5 0 0 0-2.05.01l-.08.08a1.43 1.43 0 0 0-.04.04l-.1.1a1.53 1.53 0 0 0-.04.04l-.1.12-.03.03c-.31.37-.53.5-.64.53-.08.03-.19.05-.42-.03l-.1-.04-.86-.42-.24-.12a1.19 1.19 0 0 1-.13-.08v-.01a1.08 1.08 0 0 1-.09-.15.67.67 0 0 1-.06-.34l.04-.36.04-.18a4.38 4.38 0 0 0 .06-.35l.01-.15a1.5 1.5 0 0 0-.43-1.22 1.5 1.5 0 0 0-.86-.43h-.1a1.4 1.4 0 0 0-.06-.02h-.13a1.54 1.54 0 0 0-.06-.01h-.19a2.66 2.66 0 0 1-.55-.07c-.22-.05-.3-.11-.35-.15a.7.7 0 0 1-.17-.32L3.26 12l-.24-1.05c-.04-.22 0-.33.02-.38.04-.08.15-.23.46-.42l.13-.08.12-.06a4.43 4.43 0 0 0 .31-.18l.14-.09a1.5 1.5 0 0 0 .65-.94v-.02a1.5 1.5 0 0 0-.17-1.07l-.05-.09a1.49 1.49 0 0 0-.04-.06l-.07-.11a1.5 1.5 0 0 0-.04-.06l-.09-.12a1.52 1.52 0 0 0-.02-.03c-.31-.4-.37-.65-.38-.76 0-.06 0-.18.15-.4L4.2 6l.68-.83c.16-.18.27-.21.33-.23.1-.02.28-.03.63.1l.13.06.13.05a4.42 4.42 0 0 0 .31.13l.12.04a1.5 1.5 0 0 0 1.14-.05l.03-.02a1.5 1.5 0 0 0 .76-.82l.03-.08.02-.07.04-.12.02-.06.04-.14.01-.04.03-.12.12-.32c.1-.23.19-.32.24-.36.04-.03.13-.09.34-.1l.1-.01h1.14c.24.01.34.07.39.11.07.06.2.2.3.54l.05.14.03.13.1.3ZM10 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 1.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd"></path></svg></span>
                                <div className='miyuli_dropdown'>
                                    <div className='miyuli_dropdown_row' onClick={() => setCommentsDisabled(!commentsDisabled)}>{commentsDisabled ? t("enableComments") : t("disableComments")}</div>
                                </div>
                            </div>
                            <button className='btn_miyuli' onClick={() => createPost()}>{t("publish")}</button>
                        </div>
                    </div>
                </>
                    :
                    <div className='text-center p-2'>{'🔒 ' + t("createPostAuthRequired")}</div>
            }
        </PageBlock >

    );
}

export default CreatePost;
