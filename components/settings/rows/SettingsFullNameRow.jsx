"use client";
import { changeFullName } from '@/lib/features/account';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import SettingForm from '../SettingForm';
import SettingPreview from '../SettingPreview';
import SettingRow from '../SettingRow';



export default function SettingsFullNameRow() {

    const dispatch = useAppDispatch();
    const [settingsAreaIsOpen, setSettingsAreaIsOpen] = useState(false);
    const account = useAppSelector(s => s.account.settings)
    const [name, setName] = useState(account.name || '');
    const [surname, setSurname] = useState(account.surname || '');
    const t = useTranslations()

    const error = useAppSelector(s => s.account.errors.changeFullNameError)

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
        dispatch(changeFullName({ name, surname }))
    }

    return (
        <div className='settings_line'>
            {!settingsAreaIsOpen ?
                <SettingPreview label={t("fullName")} text={account.name + ' ' + account.surname} open={setSettingsAreaIsOpen}></SettingPreview>
                :
                <SettingForm handler={verifyAndHandle} errors={showErrors} close={setSettingsAreaIsOpen}>
                    <SettingRow label={t('name')}>
                        <input type="text" required minLength="2" maxLength="32" className='input' value={name} onChange={(e) => { setName(e.target.value) }} />
                    </SettingRow>
                    <SettingRow label={t('surname')}>
                        <input type="text" required minLength="2" maxLength="32" className='input' value={surname} onChange={(e) => { setSurname(e.target.value) }} />
                    </SettingRow>
                    <SettingRow>
                        <button className="btn_miyuli flat_button" type='submit'>{t("changeFullName")}</button>
                    </SettingRow>
                </SettingForm>
            }
        </div>
    );
}
