"use client";
import { disposeChats } from '@/lib/features/messenger';
import { useAppDispatch } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Chat from './Chat';
import Chats from './Chats';
import './Messenger.scss';



export default function Messenger() {
    const searchParams = useSearchParams();
    const targetChatId = searchParams.get("sel");
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(disposeChats())
        };
    }, [dispatch]);

    return (
        <main className='chat_main'>
            {!targetChatId ?
                <Chats /> : <Chat />}
        </main>
    )
}
