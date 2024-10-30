
import { leaveCommunity, sendCommunityRequest } from '@/lib/features/community';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Avatar from '../Avatar';

const CommunityRow = (props) => {
    const { community } = props;
    const dispatch = useAppDispatch()
    const t = useTranslations()

    return (
        <li className='card_row' key={community.id}>
            <div className="card_row_avatar_container">
                <Avatar size={80} crop={community.avatarCrop} avatar={community.avatar}></Avatar>
            </div>
            <div className='py-2 flex-grow-1 overflow-hidden text-truncate'>
                <Link href={`/community${community.id}`} className='text_primary_a' >{community.name} {community.surname}</Link>
                <div>
                    <div className='group_row_labeled'>{community.status}</div>
                    <div className='group_row_labeled'>{t("member", { count: community.accountsCount })}</div>
                </div>
            </div>
            {community.isSubscribed && <div className="p-2"><button className='btn_miyuli mt-0' onClick={() => dispatch(leaveCommunity(community.id))}>{t("leave")}</button></div>}
            {!community.isSubscribed && <div className="p-2"><button className='btn_miyuli mt-0' onClick={() => dispatch(sendCommunityRequest(community.id))}>{t("subscribe")}</button></div>}
        </li>
    );
}

export default CommunityRow;
