"use client";
import AddAccountsToChat from '@/components/AddAccountsToChat';
import AttachmentContainer from '@/components/AttachmentContainer';
import AudioCard from '@/components/AudioCard';
import Avatar from '@/components/Avatar';
import DragHere from '@/components/DragHere';
import EmojiPicker from '@/components/EmojiPicker';
import FileCard from '@/components/FileCard';
import ImageCard from '@/components/ImageCard';
import MessageCard from '@/components/MessageCard';
import MessageSystem from '@/components/MessageSystem';
import PageBlock from '@/components/PageBlock';
import VideoCard from '@/components/VideoCard';
import ChatSettingsModal from '@/components/modals/ChatSettingsModal';
import AttachAudioModal from '@/components/modals/attach/AttachAudioModal';
import AttachFileModal from '@/components/modals/attach/AttachFileModal';
import AttachImageModal from '@/components/modals/attach/AttachImageModal';
import AttachVideoModal from '@/components/modals/attach/AttachVideoModal';
import { uploadAudiosOnly } from '@/lib/features/audio';
import { getAccountCall, setOutgoingCall } from '@/lib/features/call';
import { uploadFilesOnly } from '@/lib/features/file';
import { clearErrorChats, disposeChat, fetchChat, fetchMessages, leaveChat, sendMessage } from '@/lib/features/messenger';
import { uploadImagesOnly } from '@/lib/features/photo';
import { uploadVideosOnly } from '@/lib/features/video';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ActionsHSvg from '../assets/ActionsHSvg';
import BackSvg from '../assets/BackSvg';
import CallSvg from '../assets/CallSvg';
import { ConnectionContext } from '../contexts';



const Chat = () => {

    const messenger = useAppSelector((s) => s.messenger)
    const authStore = useAppSelector((s) => s.auth.session);
    const params = useParams();

    const communityId = params.id?.replace(/^gim/, '');

    const dispatch = useAppDispatch();
    const t = useTranslations()
    const router = useRouter()

    const [value, setValue] = useState("");
    const chatRef = useRef();

    const signalR = useContext(ConnectionContext);

    const searchParams = useSearchParams();
    const targetChatId = searchParams.get("sel").replace(/^c/, '');
    const isGroup = searchParams.get("sel")[0] === 'c';

    const openedChatId = messenger.chat?.id;
    const messages = messenger.messages[openedChatId];
    const isAccountChat = communityId === undefined;
    const isGroupChat = messenger.chat?.chatTypeId === 3;

    const targetCompanion = !messenger.chat ?
        null
        :
        isGroupChat
            ?
            messenger.chat
            :
            communityId
                ?
                messenger.chat?.accounts[0]
                :
                messenger.chat?.chatTypeId === 1
                    ?
                    messenger.chat?.accounts?.find(x => x.id.toString() === targetChatId)
                    :
                    messenger.chat?.communities[0];

    const smartCompanionId = isAccountChat ? targetCompanion?.id : targetCompanion?.id * -1;

    const scrollToEnd = useCallback(() => {
        if (chatRef && chatRef.current) {
            const { scrollHeight, clientHeight } = chatRef.current;
            chatRef.current.scrollTo({
                left: 0, top: scrollHeight - clientHeight,
                //behavior: 'smooth'
            })
        }
    }, [chatRef])

    const promisesRef = useRef({});

    // 1 - Chat
    useEffect(() => {
        let promises = promisesRef.current;
        const cleanup = () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposeChat())
        }

        if (messenger.errors.main) return cleanup;
        promises.chat = dispatch(fetchChat({ id: targetChatId, byId: isGroup, communityId: communityId && parseInt(communityId) }))
        return cleanup;
    }, [targetChatId, isAccountChat, isGroup, dispatch, communityId, messenger.errors.main])

    useEffect(() => {
        return () => {
            dispatch(clearErrorChats())
        };
    }, [dispatch]);

    useEffect(() => {
        if (messenger.chat?.id) {
            promisesRef.current.messages = dispatch(fetchMessages({ id: messenger.chat.id, byId: isGroupChat, communityId: communityId && parseInt(communityId) }))
            promisesRef.current.messages.then(() => scrollToEnd())
        }
    }, [messenger.chat?.id, isGroupChat, dispatch, scrollToEnd, communityId])

    //TODO: ON RECONNECT CHECK UPDATES

    // useEffect(() => {
    //     if (messenger.chat) signalR.onreconnected(() => signalR.invoke("JoinChatRoom", messenger.chat.id, messenger.chat.isGroup));
    //     if (messenger.chat && signalR.state === "Connected") signalR.invoke("JoinChatRoom", messenger.chat.id, messenger.chat.isGroup);
    //     else {
    //         const interval = setInterval(() => {
    //             if (messenger.chat && signalR.state === "Connected") signalR.invoke("JoinChatRoom", messenger.chat.id, messenger.chat.isGroup);
    //             clearInterval(interval)
    //         }, 1000);
    //         return () => {
    //             clearInterval(interval)
    //         }
    //     }
    // }, [messenger.chat, dispatch, signalR]);

    const moreMessages = useCallback(() => {
        let oldTop = chatRef.current.clientTop;
        let oldScroll = chatRef.current.scrollHeight;
        promisesRef.current.messages = dispatch(fetchMessages({ id: openedChatId, messageId: messages && messages[0].id, byId: isGroupChat }))
        promisesRef.current.messages.unwrap().then((r) => {
            chatRef.current.scrollTo({
                left: 0, top: chatRef.current.scrollHeight - oldScroll + oldTop,
                //behavior: 'smooth'
            })
        })
    }, [dispatch, openedChatId, messages, isGroupChat])

    const scrollHandler = useCallback((e) => {
        if (messenger.isFetching === false && messenger.hasMore === true && e.target.scrollTop < 100) {
            moreMessages();
        }
    }, [moreMessages, messenger.isFetching, messenger.hasMore])

    useEffect(() => {
        if (chatRef.current && chatRef.current.scrollHeight - chatRef.current.scrollTop - chatRef.current.offsetHeight < 100)
            chatRef.current.scrollTo({
                left: 0, top: chatRef.current.scrollHeight,
                //behavior: 'smooth'
            })
    }, [messages]);

    useEffect(() => {
        let chatVar = chatRef.current;
        chatVar?.addEventListener("scroll", scrollHandler)
        return () => {
            chatVar?.removeEventListener("scroll", scrollHandler);
        };
    }, [scrollHandler]);

    const sendAndClear = () => {
        if (!value.trim()) return;
        const msg = {
            text: value,
            chatId: openedChatId,
            communityId: communityId && parseInt(communityId),
            attachImagesWithIds: images.map(x => x.id),
            attachVideosWithIds: videos.map(x => x.id),
            attachAudiosWithIds: audios.map(x => x.id),
            attachFilesWithIds: files.map(x => x.id),
        }
        dispatch(sendMessage(msg));
        setValue("")
        setFiles([])
        setAudios([])
        setVideos([])
        setImages([])
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            sendAndClear()
        }
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

    const [files, setFiles] = useState([]);
    const [audios, setAudios] = useState([]);
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState([]);

    const [isAttachingFile, setIsAttachingFile] = useState(false);
    const [isAttachingAudio, setIsAttachingAudio] = useState(false);
    const [isAttachingVideo, setIsAttachingVideo] = useState(false);
    const [isAttachingImage, setIsAttachingImage] = useState(false);

    const [editingMessageId, setEditingMessageId] = useState(0);

    const [showInformationModal, setShowInformationModal] = useState(false);
    const [isAddingMembers, setIsAddingMembers] = useState(false);

    return isAddingMembers ? <AddAccountsToChat onBack={() => { setIsAddingMembers(false) }} />
        :
        <>
            {showInformationModal && <ChatSettingsModal onLeave={() => router.push(communityId ? `/gim/${communityId}` : "/im")} onClose={() => setShowInformationModal(false)} chatId={messenger.chat?.id} />}
            {!messenger.chat && messenger.isFetching && <div className='loader'></div>}
            {!messenger.isFetching && !messenger.errors.main && !messenger.chat === 0 && <div className="p-2 text-center">{t("noChat")}</div>}
            {
                messenger.errors.main && <PageBlock className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(messenger.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorChats())}>{t('tryAgain')}</button></div>
                </PageBlock>
            }
            {
                messenger.chat && <div className='chat'>
                    <div className='chat_header'>
                        <Link href={communityId ? `/gim/${communityId}` : "/im"} className='text_primary_a header_left'>
                            <BackSvg />
                            {t('back')}
                        </Link>
                        <div onClick={() => { isGroupChat && setShowInformationModal(true) }}>
                            {targetCompanion?.name}
                        </div>
                        <div className='header_right header_menu'>
                            <div className="actions_container">
                                <div className="action call_action" onClick={() => {
                                    dispatch(setOutgoingCall(smartCompanionId * (isGroupChat ? -1 : 1)))
                                    !isGroupChat && dispatch(getAccountCall(smartCompanionId)) //TODO: GET GROUP CHAT INFO
                                    signalR.invoke(isGroupChat ? "CallGroup" : "CallUser", smartCompanionId)
                                }}>
                                    <CallSvg></CallSvg>
                                    <div className="call_actions">
                                    </div>
                                </div>
                                <div className="action actions_action">
                                    <ActionsHSvg></ActionsHSvg>
                                    <div className='miyuli_dropdown'>
                                        {(isGroupChat) &&
                                            <div className='miyuli_dropdown_row' onClick={() => { setIsAddingMembers(true) }}>{t("addMembers")}</div>}
                                        {(isGroupChat) &&
                                            <div className='miyuli_dropdown_row' onClick={() => { dispatch(leaveChat({ id: messenger.chat.id })).then(() => router.push(communityId ? `/gim/${communityId}` : "/im")) }}>{t("leave")}</div>}
                                    </div>
                                </div>
                            </div>
                            <Avatar onClick={() => { isGroupChat && setShowInformationModal(true) }} crop={targetCompanion?.avatarCrop} avatar={targetCompanion?.avatar}></Avatar>
                        </div>
                    </div>
                    <div ref={chatRef} className='chat_body'>
                        <>
                            {!messenger.isFetching && messenger.errors.messages && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                                <div>{t(handleCommonErrorCases(messenger.errors.messages))}</div>
                                <div><button className='btn_miyuli' onClick={() => moreMessages()}>{t('tryAgain')}</button></div>
                            </div>}
                            {messenger.isFetching && <div className='loader'></div>}
                            {!messenger.errors.messages && messenger.messages[messenger.chat.id]?.length === 0 && <div className="p-2 label text-center">{t("noMessagesInChat")}</div>}
                            {messages?.map(x => {
                                return x.isSystem === true ? <MessageSystem key={x.id} message={x} /> :
                                    <MessageCard key={x.id} access={x.accountId === authStore.id} editing={editingMessageId === x.id} onAction={() => { setEditingMessageId(0) }} onStartEdit={() => { setEditingMessageId(x.id) }} message={x}></MessageCard>
                            }
                            )}
                        </>
                        <div className='message_fixer'></div>
                    </div>
                    <div className='chat_footer'>
                        <div className='chat_footer_input'>
                            <div className="file_upload_container">
                                <div className='file_upload_btn'></div>
                                <div className='miyuli_dropdown'>
                                    <div className='miyuli_dropdown_row' onClick={() => setIsAttachingImage(true)}>{t("photo")}</div>
                                    <div className='miyuli_dropdown_row' onClick={() => setIsAttachingVideo(true)}>{t("video")}</div>
                                    <div className='miyuli_dropdown_row' onClick={() => setIsAttachingAudio(true)}>{t("audios")}</div>
                                    <div className='miyuli_dropdown_row' onClick={() => setIsAttachingFile(true)}>{t("files")}</div>
                                    {isAttachingImage && <AttachImageModal onFileSelected={(file) => { setImages([...images, file]); setIsAttachingImage(false) }} onClose={() => setIsAttachingImage(false)} />}
                                    {isAttachingVideo && <AttachVideoModal onFileSelected={(file) => { setVideos([...videos, file]); setIsAttachingVideo(false) }} onClose={() => setIsAttachingVideo(false)} />}
                                    {isAttachingAudio && <AttachAudioModal onFileSelected={(file) => { setAudios([...audios, file]); setIsAttachingAudio(false) }} onClose={() => setIsAttachingAudio(false)} />}
                                    {isAttachingFile && <AttachFileModal onFileSelected={(file) => { setFiles([...files, file]); setIsAttachingFile(false) }} onClose={() => setIsAttachingFile(false)} />}
                                </div>
                            </div>
                            <div className='message_input_wrap'>
                                <DragHere onDrop={onDropHandler} />
                                <TextareaAutosize className='input input_message' type="text" value={value} placeholder={t("writeMsg")}
                                    onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} />
                                <EmojiPicker absolute value={value} onChange={setValue} />
                            </div>
                            <div className='send_msg_btn'><svg width="24" onClick={sendAndClear} height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="send_24__Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="send_24__send_24"><path id="send_24__Rectangle-76" d="M0 0h24v24H0z"></path><path d="M5.74 15.75a39.14 39.14 0 00-1.3 3.91c-.55 2.37-.95 2.9 1.11 1.78 2.07-1.13 12.05-6.69 14.28-7.92 2.9-1.61 2.94-1.49-.16-3.2C17.31 9.02 7.44 3.6 5.55 2.54c-1.89-1.07-1.66-.6-1.1 1.77.17.76.61 2.08 1.3 3.94a4 4 0 003 2.54l5.76 1.11a.1.1 0 010 .2L8.73 13.2a4 4 0 00-3 2.54z" id="send_24__Mask" fill="currentColor"></path></g></g></svg></div>
                        </div>
                        <div className="chat_attachments">
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
                                    <AudioCard audio={x}></AudioCard>
                                </AttachmentContainer>)}
                            </div>}
                            {files.length > 0 && <div className='attached_files'>
                                {files.map((x) => <AttachmentContainer key={x.id} onDetach={() => { setFiles(files.filter((f) => f.id !== x.id)) }}>
                                    <FileCard off file={x}></FileCard>
                                </AttachmentContainer>)}
                            </div>}
                        </div>
                    </div>
                </div >
            }
        </>
}

export default Chat;
