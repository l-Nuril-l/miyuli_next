"use client";
import { changePassword, changePasswordError } from '@/lib/features/account';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import SettingForm from '../SettingForm';
import SettingPreview from '../SettingPreview';
import SettingRow from '../SettingRow';



export default function SettingsPasswordRow() {

    const dispatch = useAppDispatch();
    const [settingsAreaIsOpen, setSettingsAreaIsOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const t = useTranslations()

    const credentials = {
        'OldPassword': oldPassword,
        'NewPassword': newPassword,
    }

    const error = useAppSelector(s => s.account.errors.changePasswordError)

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
        if (newPassword !== repeatPassword) { dispatch(changePasswordError("newPasswordRepeatedWrong")); return }
        if (newPassword.length < 8) { dispatch(changePasswordError("newPasswordIncorrect")); return }
        dispatch(changePassword(credentials))
    }

    return (
        <div className='settings_line'>
            {!settingsAreaIsOpen ?
                <SettingPreview label={t("password")} text={'password'} open={setSettingsAreaIsOpen}></SettingPreview>
                :
                <SettingForm handler={verifyAndHandle} errors={showErrors} close={setSettingsAreaIsOpen}>
                    <SettingRow label={t('oldPassword')}>
                        <input type="password" autoComplete='current-password' required maxLength="256" className='input' value={oldPassword} onChange={(e) => { setOldPassword(e.target.value) }} />
                    </SettingRow>
                    <SettingRow label={t('newPassword')}>
                        <input type="password" autoComplete='new-password' required minLength="8" maxLength="256" className='input' value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
                    </SettingRow>
                    <SettingRow label={t('repeatPassword')}>
                        <input type="password" autoComplete='new-password' required minLength="8" maxLength="256" className='input' value={repeatPassword} onChange={(e) => { setRepeatPassword(e.target.value) }} />
                    </SettingRow>
                    <SettingRow>
                        <button className="btn_miyuli flat_button" type='submit'>{t("changePassword")}</button>
                    </SettingRow>
                </SettingForm>
            }
        </div>
    );
}
