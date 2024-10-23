"use client";
import { changePhoneNumber } from '@/lib/features/account';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import SettingForm from '../SettingForm';
import SettingPreview from '../SettingPreview';
import SettingRow from '../SettingRow';




export default function SettingsPhoneNumberRow() {

    const dispatch = useAppDispatch();
    const [settingsAreaIsOpen, setSettingsAreaIsOpen] = useState(false);

    const account = useAppSelector(s => s.account.settings)
    const error = useAppSelector(s => s.account.errors.changePhoneNumberError)
    const [phoneNumber, setPhoneNumber] = useState(account.phoneNumber || "");
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
        dispatch(changePhoneNumber({ phoneNumber }))
    }

    return (
        <div className='settings_line'>
            {!settingsAreaIsOpen ?
                <SettingPreview label={t("phoneNumber")} text={account.phoneNumber} open={setSettingsAreaIsOpen}></SettingPreview>
                :
                <SettingForm handler={verifyAndHandle} errors={showErrors} close={setSettingsAreaIsOpen}>
                    <SettingRow label={t('phoneNumber')}>
                        <input type="tel" required minLength="5" maxLength="32" className='input' value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value) }} />
                    </SettingRow>
                    <SettingRow>
                        <button className="btn_miyuli flat_button" type='submit'>{t("changePhoneNumber")}</button>
                    </SettingRow>
                </SettingForm>
            }
        </div>
    );
}
