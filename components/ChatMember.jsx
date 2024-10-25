import { chatKick, chatPrivilege, leaveChat } from "@/lib/features/messenger";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import classNames from "classnames";
import { useTranslations } from "next-intl";
import ActionsHSvg from "../assets/ActionsHSvg";
import Avatar from "./Avatar";

const ChatMember = ({ chatId, account, isAdmin, asAdmin, asOwner, isOwner, onLeave }) => {
    const who = useAppSelector(s => s.auth.session.id);
    const isMe = who === account.id;
    const t = useTranslations()
    const dispatch = useAppDispatch();
    return (
        <a href={'/' + (account.login ?? 'id' + account.id)} className="list_item_wrap" onClick={(e) => { e.preventDefault(); }}>
            <div className="list_item">
                <div className="d-flex">
                    <div className="list_item_photo"><Avatar size={32} crop={account.avatarCrop} avatar={account.avatar}></Avatar></div>
                    <div className="list_item_name">{account.name + ' ' + account.surname}</div>
                </div>
                <div className={classNames("aside", "label", "gap-3")}>
                    {isAdmin && <div className="div">{t(isOwner ? "startedTheChat" : "admin", { count: 1 })}</div>}
                    {(isAdmin || asAdmin || isMe) && <div className="action actions_action">
                        <ActionsHSvg />
                        <div className="miyuli_dropdown">
                            {asOwner && !isMe && <div onClick={() => dispatch(chatPrivilege({ id: chatId, accountId: account.id, admin: !isAdmin }))} className="miyuli_dropdown_row">{t(isAdmin ? "unmakeAdmin" : "makeAdmin")}</div>}
                            {(asOwner || (asAdmin && !isAdmin)) && !isMe && <div onClick={() => dispatch(chatKick({ id: chatId, accountId: account.id }))} className="miyuli_dropdown_row">{t("kick")}</div>}
                            {isMe && <div onClick={() => dispatch(leaveChat({ id: chatId })).unwrap().then(() => onLeave())} className="miyuli_dropdown_row">{t("leave")}</div>}
                        </div>
                    </div>}
                </div>
            </div>
        </a>
    );
}

export default ChatMember;
