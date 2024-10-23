"use client";
import { changeLogin as changeAccountLogin } from '@/lib/features/account';
import { changeLogin } from '@/lib/features/community';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import SettingForm from '../SettingForm';
import SettingPreview from '../SettingPreview';
import SettingRow from '../SettingRow';




export default function SettingsLoginRow({ communityId }) {

    const dispatch = useAppDispatch();
    const [settingsAreaIsOpen, setSettingsAreaIsOpen] = useState(false);
    const t = useTranslations()

    const error = useAppSelector(s => (communityId ? s.community : s.account).errors.changeLoginError)
    const target = useAppSelector(s => communityId ? s.community.community : s.account.settings)
    const [login, setLogin] = useState(target.login);

    const showErrors = () => {
        if (error === undefined) return
        return (
            <div className="msg error">
                <div className="msg_text">{t(error)}</div>
            </div>
        )
    }

    const verifyAndHandle = (e) => {
        e.preventDefault()
        dispatch(communityId ? changeLogin({ communityId, login }) : changeAccountLogin({ login }))
    }

    return (
        <div className='settings_line'>
            {!settingsAreaIsOpen ?
                <SettingPreview label={t("login")} text={target.login} open={setSettingsAreaIsOpen}></SettingPreview>
                :
                <SettingForm handler={verifyAndHandle} errors={showErrors} close={setSettingsAreaIsOpen}>
                    <SettingRow label={t('login')}>
                        <input type="text" maxLength="32" className='input' value={login} onChange={(e) => { setLogin(e.target.value) }} />
                    </SettingRow>
                    <SettingRow>
                        <button className="btn_miyuli flat_button" type='submit'>{t("changeLogin")}</button>
                    </SettingRow>
                </SettingForm>

            }
        </div>
    );
}
