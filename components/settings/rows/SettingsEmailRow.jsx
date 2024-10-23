"use client";
import { changeEmail } from '@/lib/features/account';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import SettingForm from '../SettingForm';
import SettingPreview from '../SettingPreview';
import SettingRow from '../SettingRow';




export default function SettingsEmailRow() {

    const dispatch = useAppDispatch();
    const [settingsAreaIsOpen, setSettingsAreaIsOpen] = useState(false);

    const account = useAppSelector(s => s.account.settings)
    const error = useAppSelector(s => s.account.errors.changeEmailError)
    const [email, setEmail] = useState(account.email || "");
    const t = useTranslations()

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
        dispatch(changeEmail({ email }))
    }

    return (
        <div className='settings_line'>
            {!settingsAreaIsOpen ?
                <SettingPreview label={t("email")} text={account.email} open={setSettingsAreaIsOpen}></SettingPreview>
                :
                <SettingForm handler={verifyAndHandle} errors={showErrors} close={setSettingsAreaIsOpen}>
                    <SettingRow label={t('email')}>
                        <input type="email" required minLength="5" maxLength="32" className='input' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    </SettingRow>
                    <SettingRow>
                        <button className="btn_miyuli flat_button" type='submit'>{t("changeEmail")}</button>
                    </SettingRow>
                </SettingForm>
            }
        </div>
    );
}
