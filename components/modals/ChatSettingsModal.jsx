"use client";
import { disposeChatInfo, getChatInfo, getChatMembers, leaveChat, renameChat, uploadChatAvatar } from "@/lib/features/messenger";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import classNames from "classnames";
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Avatar from "../Avatar";
import ChatMember from "../ChatMember";
import EditableLabel from "../EditableLabel";
import PageBlock from "../PageBlock";
import "./ChatSettingsModal.scss";
import Modal from "./Modal";
import UploadImage from "./upload/UploadImage";




const ChatSettingsModal = ({ isOpen, onClose, onLeave, chatId }) => {
    const chatInfoStore = useAppSelector(s => s.messenger.chatInfo)
    const dispatch = useAppDispatch();
    const t = useTranslations()
    const promisesRef = useRef({});

    useEffect(() => {
        var promises = promisesRef.current
        promises.main = dispatch(getChatInfo({ id: chatId }))
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposeChatInfo())
        }
    }, [dispatch, chatId]);

    const [showAdmins, setShowAdmins] = useState(false);

    const chat = chatInfoStore.chat;
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const who = useAppSelector(s => s.auth.session.id);

    const getMore = () => {
        const args = {
            id: chatId,
            search: null,
            admins: showAdmins,
            after: chat.accounts[chat.accounts.length - 1]?.id
        }
        promisesRef.current.main = dispatch(getChatMembers(args))
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {!chat?.id ? <div className='loader'></div> :
                <div className='modal_miyuli modal_chat_settings'>
                    <div className='modal-header modal_header'>
                        <div>{t('information')}</div>
                        <div role="button" onClick={() => onClose()}>╳</div>
                    </div>
                    <header className="header">
                        <Avatar size={50} avatar={chat.avatar} avatarCrop={chat.avatarCrop} onClick={() => { setIsAvatarModalOpen(true) }} />
                        <UploadImage onUpload={(params) => dispatch(uploadChatAvatar(Object.assign({ id: chat.id }, params)))} isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} />
                        <div className="content">
                            <EditableLabel text={chat.name} onAction={(name) => dispatch(renameChat({ id: chat.id, name }))} className="title"></EditableLabel>
                            <div className="labeled">{chat.accountsCount ?? 0} {t("members")}</div>
                        </div>
                    </header>
                    <div className="chat_info page_block">
                        <div className="page_block_header">
                            <div className={classNames("header_item", !showAdmins && "active")} onClick={() => setShowAdmins(false)}>{t("members")} {chat.accountsCount}</div>
                            <div className={classNames("header_item", showAdmins && "active")} onClick={() => setShowAdmins(true)}>{t("admin_other")} {chat.adminsCount}</div>
                        </div>
                        <InfiniteScroll
                            className='list_items_container'
                            loadMore={() => !chatInfoStore.errors.main && !chatInfoStore.isFetching ? getMore() : null}
                            hasMore={chatInfoStore.hasMore}
                        >
                            {chat[showAdmins ? "admins" : "accounts"].map(x => <ChatMember onLeave={onLeave} isOwner={x.id === chat.ownerId} chatId={chat.id} asOwner={who === chat.ownerId} asAdmin={chat.admins.some(x => x.id === who)} isAdmin={chat.admins.some(a => a.id === x.id)} key={x.id} account={x} />)}
                            {chatInfoStore.isFetching && <div className='loader'></div>}
                        </InfiniteScroll>
                    </div>
                    <PageBlock className='leave_chat'><div onClick={() => dispatch(leaveChat({ id: chat.id })).unwrap().then(() => onLeave())} role="button">{t("leaveChat")}</div></PageBlock>
                </div>}
        </Modal>
    );
}

export default ChatSettingsModal;
