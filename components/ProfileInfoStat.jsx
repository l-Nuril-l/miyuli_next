import { useTranslations } from "next-intl";

const ProfileInfoStat = ({ account }) => {
    const t = useTranslations()
    return (
        <div className='counts_module'>
            <div className='page_counter'>
                <div className="count">{account.friendsCount ?? 0}</div>
                <div className="label">{t('friends')}</div>
            </div>
            <div className='page_counter'>
                <div className="count">{account.communitiesCount ?? 0}</div>
                <div className="label">{t('communities')}</div>
            </div>
            <div className='page_counter'>
                <div className="count">{account.imagesCount ?? 0}</div>
                <div className="label">{t('images')}</div>
            </div>
            <div className='page_counter'>
                <div className="count">{account.audiosCount ?? 0}</div>
                <div className="label">{t('audios')}</div>
            </div>
            <div className='page_counter'>
                <div className="count">{account.videosCount ?? 0}</div>
                <div className="label">{t('videos')}</div>
            </div>
        </div>
    );
}

export default ProfileInfoStat;
