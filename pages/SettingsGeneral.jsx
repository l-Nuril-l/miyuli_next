"use client";
import Alert from '@/components/Alert';
import GeneralSettings from '@/components/settings/blocks/GeneralSettings';
import SettingsDateOfBirthRow from '@/components/settings/rows/SettingsDateOfBirthRow';
import SettingsEmailRow from '@/components/settings/rows/SettingsEmailRow';
import SettingsFullNameRow from '@/components/settings/rows/SettingsFullNameRow';
import SettingsLoginRow from '@/components/settings/rows/SettingsLoginRow';
import SettingsPasswordRow from '@/components/settings/rows/SettingsPasswordRow';
import SettingsPhoneNumberRow from '@/components/settings/rows/SettingsPhoneNumberRow';
import { clearErrors, disposeSettings, getSettingsAccount } from '@/lib/features/account';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import AlertTypes from '../enums/AlertTypes';



const SettingsGeneral = () => {
    const success = useAppSelector(s => s.account.accountUpdateSuccess)
    const authStore = useAppSelector(s => s.auth.session)
    const accountStore = useAppSelector(s => s.account)
    const dispatch = useAppDispatch();
    const t = useTranslations()

    useEffect(() => {
        if (accountStore.errors.settings) return;
        var promise = dispatch(getSettingsAccount(authStore.id))
        return () => {
            promise.abort();
        };
    }, [authStore.id, dispatch, accountStore.errors.settings]);

    useEffect(() => {
        return () => {
            dispatch(disposeSettings())
        };
    }, [dispatch]);

    return (
        <>
            {accountStore.settings && <div className="settings_body">
                <Alert type={AlertTypes.SUCCESS} text={success} />
                <SettingsFullNameRow></SettingsFullNameRow>
                <SettingsPasswordRow></SettingsPasswordRow>
                <SettingsEmailRow></SettingsEmailRow>
                <SettingsPhoneNumberRow></SettingsPhoneNumberRow>
                <SettingsLoginRow></SettingsLoginRow>
                <SettingsDateOfBirthRow></SettingsDateOfBirthRow>
                <GeneralSettings></GeneralSettings>
            </div>}
            {accountStore.isFetching && <div className='loader'></div>}
            {accountStore.errors.settings && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                <div>{t(handleCommonErrorCases(accountStore.errors.settings))}</div>
                <div><button className='btn_miyuli' onClick={() => dispatch(clearErrors())}>{t('tryAgain')}</button></div>
            </div>}
            <div className="settings_footer">
                <span className='mx-1'>{t("youCan")}</span>
                <span role="button"> {t("deletePage")}.</span>
            </div>
        </>
    );
}

export default SettingsGeneral;
