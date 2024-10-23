"use client";

import { addFriend, deleteFriend } from '@/lib/features/friends';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import ActionsHSvg from '../../assets/ActionsHSvg';
import Avatar from '../Avatar';
import ConditionalWrap from '../ConditionalWrap';

const AccountRow = (props) => {
    const mobile = useMediaQuery({ query: '(max-width: 359px)' })
    const { account, minimize } = props;
    const dispatch = useAppDispatch()
    const t = useTranslations()
    const authStore = useAppSelector(s => s.auth.session)

    const friendBtnHandler = () => {
        dispatch(account.friendState % 2 === 1 ? deleteFriend(account.id) : addFriend(account.id))
    }

    return (
        <li className='card_row' key={account.id}>
            <div className="card_row_avatar_container">
                <Avatar size={80} crop={account.avatarCrop} avatar={account.avatar}> </Avatar>
            </div>
            <div className='py-2 flex-grow-1'>
                <Link href={`/id/${account.id}`} className='text_primary_a'>{account.name} {account.surname}</Link>
                <div>
                    <div>
                        <Link href={`/im?sel=${account.id}`} className='text_primary_a'>{t("message")}</Link>
                    </div>
                </div>
            </div>

            <ConditionalWrap
                condition={!minimize && !mobile}
                wrap={(children) => {
                    return (authStore?.id !== account.id && <div className="action">
                        <button onClick={() => friendBtnHandler()} className='btn_miyuli'>{children}</button>
                    </div>)
                }}>
                <div>
                    <ConditionalWrap
                        condition={minimize || mobile}
                        wrap={(children) => {
                            return <div className="action actions_action">
                                <ActionsHSvg></ActionsHSvg>
                                <div className='miyuli_dropdown'>{children}</div></div>
                        }}>
                        <div onClick={() => (minimize || mobile) && friendBtnHandler()} className={minimize || mobile ? 'miyuli_dropdown_row' : `btn_miyuli_in`}>{account.friendState === 3 ? t("deleteFriend") : account.friendState === 2 ? t("acceptFriendRequest") : account.friendState === 1 ? t("cancelFriendRequest") : t("sendFriendRequest")}</div>
                    </ConditionalWrap>
                </div>
            </ConditionalWrap>
        </li>
    );
}

export default AccountRow;
