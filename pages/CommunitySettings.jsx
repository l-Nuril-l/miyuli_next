"use client";
import Alert from '@/components/Alert';
import PageBlock from '@/components/PageBlock';
import SettingsLoginRow from '@/components/settings/rows/SettingsLoginRow';
import SettingsNameRow from '@/components/settings/rows/SettingsNameRow';
import { clearErrorCommunity, disposeCommunity, getCommunity } from '@/lib/features/community';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import AlertTypes from '../enums/AlertTypes';
import './Settings.scss';


const CommunitySettings = () => {
    const success = useAppSelector(s => s.community.errors.communityUpdateSuccess)
    const authStore = useAppSelector(s => s.auth.session)
    const communityStore = useAppSelector(s => s.community)
    const params = useParams()
    const id = params.id.replace(/^id/, '')
    const dispatch = useAppDispatch();
    const t = useTranslations()

    useEffect(() => {
        if (communityStore.errors.main) return;
        var promise = dispatch(getCommunity(id))
        return () => {
            promise.abort();
            dispatch(disposeCommunity())
        };
    }, [authStore.id, dispatch, id, communityStore.errors.main]);

    return (
        <div className='settings_panel'>
            <PageBlock>
                <div className="settings_header">{t("settings")}</div>
                {communityStore.community && <div className="settings_body">
                    <Alert type={AlertTypes.SUCCESS} text={success} />
                    <SettingsNameRow></SettingsNameRow>
                    <SettingsLoginRow communityId={communityStore.community.id}></SettingsLoginRow>
                </div>}
                {communityStore.isFetching && <div className='loader'></div>}
                {communityStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(communityStore.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorCommunity())}>{t('tryAgain')}</button></div>
                </div>}
                <div className="settings_footer">
                    <span className='mx-1'>{t("youCan")}</span>
                    <span role="button"> {t("deleteCommunity")}.</span>
                </div>
            </PageBlock>
        </div>
    );
}

export default CommunitySettings;
