"use client";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';


import { changeDateOfBirth } from '@/lib/features/account';
import { useState } from 'react';
import SettingForm from '../SettingForm';
import SettingPreview from '../SettingPreview';
import SettingRow from '../SettingRow';


export default function SettingsDateOfBirthRow() {

    const dispatch = useAppDispatch();
    const t = useTranslations()


    const error = useAppSelector(s => s.account.errors.changeDateOfBirthError)
    const account = useAppSelector(s => s.account.settings)
    const [dateOfBirth, setDateOfBirth] = useState(account.dateOfBirth.split('T')[0]);
    const [settingsAreaIsOpen, setSettingsAreaIsOpen] = useState(false);

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
        dispatch(changeDateOfBirth({ dateOfBirth: dateOfBirth }))
    }

    return (
        <div className='settings_line'>
            {!settingsAreaIsOpen ?
                <SettingPreview label={t("dateOfBirth")} text={new Date(account.dateOfBirth).toLocaleDateString()} open={setSettingsAreaIsOpen}></SettingPreview>
                :
                <SettingForm handler={verifyAndHandle} errors={showErrors} close={setSettingsAreaIsOpen}>
                    <SettingRow label={t('dateOfBirth')}>
                        <input type="date" maxLength="32" className='input' value={dateOfBirth} onChange={(e) => { setDateOfBirth(e.target.value) }} />
                    </SettingRow>
                    <SettingRow>
                        <button className="btn_miyuli flat_button" type='submit'>{t("changeDateOfBirth")}</button>
                    </SettingRow>
                </SettingForm>

            }
        </div>
    );
}
