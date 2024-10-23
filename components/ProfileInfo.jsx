"use client";
import { formatLastLoginDate } from '@/lib/functions';
import { useAppSelector } from '@/lib/hooks';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AccountAdditionalInfoModal from './modals/AccountAdditionalInfoModal';
import ProfileInfoStat from './ProfileInfoStat';
import Status from './Status';




const ProfileInfo = () => {
    const t = useTranslations()
    const authStore = useAppSelector((s) => s.auth.session)
    const account = useAppSelector((s) => s.account.account)
    const [additionalInfoModal, setAdditionalInfoModal] = useState(false);
    return (
        account && <div className='page_block profile_info_block'>
            <div className='page_info_wrap pb-3'>
                <div className='page_top'>
                    <div className='page_top_in'>
                        <h1 className='page_name'>{account.name} {account.surname}</h1>
                        <div className='page_online'>{!account.online ? formatLastLoginDate(account.lastOnlineAt, t) : 'online'}</div>
                    </div>
                    <Status disabled={authStore?.id !== account.id} status={account.status}></Status>
                </div>

                <div className='profile_info'>
                    {account.login && <div className="profile_info_row">
                        <div className='label'>{t("login")}:</div>
                        <div className='text'>{account.login}</div>
                    </div>}
                    <div className="profile_info_row">
                        <div className='label'>{t("dateOfBirth")}:</div>
                        <div className='text'>{DateTime.fromISO(account.dateOfBirth).toFormat('dd.MM.yyyy')}</div>
                    </div>
                    {account.sex && <div className="profile_info_row">
                        <div className='label'>{t("sex")}:</div>
                        <div className='text'>{t(account.sex ? "male" : "female")}</div>
                    </div>}
                </div>

                <div className='learn_more' role='button' onClick={() => setAdditionalInfoModal(true)}>{t('learnMore')}</div>
                <AccountAdditionalInfoModal isOpen={additionalInfoModal} onClose={() => setAdditionalInfoModal(false)} />
            </div>
            <ProfileInfoStat account={account} />

        </div>
    );
}

export default ProfileInfo;
