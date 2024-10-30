import { beautifyDate } from "@/lib/functions";
import { useAppSelector } from '@/lib/hooks';
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";

const ChatCard = ({ chat, communityId }) => {
    const authStore = useAppSelector((s) => s.auth.session);
    const router = useRouter()
    const t = useTranslations();
    const target = chat.chatTypeId === 3 ? chat : communityId ? chat.accounts[0] : chat.communities[0] || chat.accounts.find(x => x.id !== authStore.id) || chat.accounts[0];

    return (
        <li key={chat.id} className='chat_item' onClick={() => router.push(`?sel=${(chat.chatTypeId === 3 ? 'c' : '') + target.id}`)}>
            <div className='avatar_chat_item_container'>
                <Avatar
                    size={50}
                    crop={target.avatarCrop}
                    avatar={target.avatar} />
            </div>
            <div className='chat_text'>
                <div className='chat_name'>
                    <h6>{target.name}</h6>
                    <div className='label'>{chat.lastMessage && beautifyDate(chat.lastMessage.createdDate, t)}</div>
                </div>
                <div className='last_msg label'>{chat.lastMessage?.text}</div>
            </div>
        </li>
    );
}

export default ChatCard;
