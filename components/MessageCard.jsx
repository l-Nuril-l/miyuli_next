"use client";
import { useRouter } from 'next/navigation';


import { deleteMessage } from '@/lib/features/messenger';
import { useAppDispatch } from '@/lib/hooks';
import Link from "next/link";
import AudioCard from './AudioCard';
import Avatar from './Avatar';
import FileCard from './FileCard';
import ImageCard from './ImageCard';
import Linkify from './Linkify';
import "./MessageCard.scss";
import MessageEditing from './MessageEditing';
import VideoCard from './VideoCard';

const MessageCard = ({ message, access, editing, onAction, onStartEdit }) => {
    const x = (message.community !== null) ? message.community : message.account
    const router = useRouter()
    const dispatch = useAppDispatch()
    return (

        <div key={x.id} className='message'>
            <div className="px-2 message_svg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M8 15A7 7 0 118 1a7 7 0 010 14zM6 7.94a.75.75 0 10-1 1.12l1.46 1.3c.44.38 1.1.33 1.49-.1l.04-.05 2.9-3.75a.75.75 0 10-1.19-.92L7.1 8.91 6 7.94z"></path></svg></div>
            <Avatar crop={x?.avatarCrop} avatar={x?.avatar}> </Avatar>

            <div className='message_content'>
                <div className="message_actions">
                    {access && <>
                        <div className="action edit_action" onClick={() => onStartEdit()}><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 16 16"><path fill="currentColor" d="m9.49 3.95 2.56 2.56-6.14 6.14a4.82 4.82 0 0 1-2 1.2l-2.1.64a.24.24 0 0 1-.3-.3l.64-2.1a4.82 4.82 0 0 1 1.2-2L9.5 3.95Zm3.67-2.13 1.02 1.02c.4.4.42 1.03.08 1.45l-1.17 1.18-2.56-2.56 1.1-1.1c.42-.42 1.1-.42 1.53 0Z" /></svg></div>
                        <div className="action delete_action" onClick={() => dispatch(deleteMessage(message.id))}><svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.84 4H2.75a.75.75 0 0 0 0 1.5h.55l.9 9.25c.05.52.1.96.16 1.31.06.37.16.71.35 1.03a2.9 2.9 0 0 0 1.25 1.13c.33.16.68.22 1.06.25.36.03.8.03 1.32.03h3.32c.53 0 .96 0 1.32-.03.38-.03.73-.1 1.06-.25a2.9 2.9 0 0 0 1.25-1.13c.19-.32.29-.66.35-1.03.06-.35.1-.79.16-1.31l.9-9.25h.55a.75.75 0 0 0 0-1.5h-4.09a3.25 3.25 0 0 0-6.32 0Zm1.58 0h3.16a1.75 1.75 0 0 0-3.16 0Zm6.78 1.5H4.8l.9 9.07c.05.56.08.94.13 1.23.05.28.1.42.17.52a1.4 1.4 0 0 0 .6.55c.1.04.25.08.53.1.3.03.68.03 1.24.03h3.26c.56 0 .94 0 1.23-.02.29-.03.43-.07.54-.11a1.4 1.4 0 0 0 .6-.55c.06-.1.11-.24.16-.52.05-.3.1-.67.15-1.23l.89-9.07Zm-2.89 2a.75.75 0 0 1 .69.81l-.5 6a.75.75 0 0 1-1.5-.12l.5-6a.75.75 0 0 1 .81-.69Zm-4.62 0a.75.75 0 0 1 .8.69l.5 6a.75.75 0 0 1-1.49.13l-.5-6a.75.75 0 0 1 .69-.82Z" clipRule="evenodd" /></svg></div>
                    </>}
                    <div className="action share_action"><svg height={16} viewBox="0 0 24 24" width={16} xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z" /><path d="M12 3.73c-1.12.07-2 1-2 2.14v2.12h-.02a9.9 9.9 0 0 0-7.83 10.72.9.9 0 0 0 1.61.46l.19-.24a9.08 9.08 0 0 1 5.84-3.26l.2-.03.01 2.5a2.15 2.15 0 0 0 3.48 1.69l7.82-6.14a2.15 2.15 0 0 0 0-3.38l-7.82-6.13c-.38-.3-.85-.46-1.33-.46zm.15 1.79c.08 0 .15.03.22.07l7.82 6.14a.35.35 0 0 1 0 .55l-7.82 6.13a.35.35 0 0 1-.57-.28V14.7a.9.9 0 0 0-.92-.9h-.23l-.34.02c-2.28.14-4.4.98-6.12 2.36l-.17.15.02-.14a8.1 8.1 0 0 1 6.97-6.53.9.9 0 0 0 .79-.9V5.87c0-.2.16-.35.35-.35z" fill="currentColor" fillRule="nonzero" /></g></svg></div>
                </div>
                <div className='d-flex'>
                    <Link href={message.communityId ? `/community/${x.id}` : `/id/${x.id}`} className='text_primary_a'>{x?.name}</Link><div className='message_time'>{new Date(message.createdDate).toLocaleTimeString()}</div>
                </div>

                {editing ?
                    <MessageEditing onAction={onAction} message={message}></MessageEditing>
                    :
                    <div className='text-break'><Linkify>{message.text}</Linkify></div>
                }


                <div className='message_attachments'>
                    {message.attachedCommunity && <div className='attached_community'>
                        <Avatar className="avatar_element" size={80} crop={message.attachedCommunity?.avatarCrop} avatar={message.attachedCommunity?.avatar} onClick={() => router.push(`/community/${message.attachedCommunity?.id}`)}> </Avatar>
                        <div>
                            <Link href={`/community/${message.attachedCommunity?.id}`} role="button">{message.attachedCommunity?.name}</Link>
                            <div>{message.attachedCommunity?.status}</div>
                        </div>
                    </div>}
                    <div>
                        {message.images.length > 0 && <div className='attached_images'>
                            {message.images.map((x) => <ImageCard key={x.id} image={x}></ImageCard>)}
                        </div>}
                        {message.videos.length > 0 && <div className='attached_videos'>
                            {message.videos.map((x) => <VideoCard off className="video_holder" key={x.id} video={x}></VideoCard>)}
                        </div>}
                    </div>
                    {message.audios.length > 0 && <div className='attached_audios'>
                        {message.audios.map((x) => <AudioCard key={x.id} audio={x}></AudioCard>)}
                    </div>}
                    {message.files.length > 0 && <div className='attached_files'>
                        {message.files.map((x) => <FileCard key={x.id} file={x}></FileCard>)}
                    </div>}
                </div>

            </div>
        </div>

    );
}

export default MessageCard;
