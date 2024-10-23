"use client";
import { changeName } from '@/lib/features/community';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import SettingForm from '../SettingForm';
import SettingPreview from '../SettingPreview';
import SettingRow from '../SettingRow';




export default function SettingsNameRow() {

    const dispatch = useAppDispatch();
    const [settingsAreaIsOpen, setSettingsAreaIsOpen] = useState(false);

    const community = useAppSelector(s => s.community.community)
    const error = useAppSelector(s => s.community.errors.changeNameError)
    const [name, setName] = useState(community.name || "");
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
        dispatch(changeName({ communityid: community.id, name }))
    }

    return (
        <div className='settings_line'>
            {!settingsAreaIsOpen ?
                <SettingPreview label={t("name")} text={community.name} open={setSettingsAreaIsOpen}></SettingPreview>
                :
                <SettingForm handler={verifyAndHandle} errors={showErrors} close={setSettingsAreaIsOpen}>
                    <SettingRow label={t('name')}>
                        <input type="text" required minLength="5" maxLength="32" className='input' value={name} onChange={(e) => { setName(e.target.value) }} />
                    </SettingRow>
                    <SettingRow>
                        <button className="btn_miyuli flat_button" type='submit'>{t("changeName")}</button>
                    </SettingRow>
                </SettingForm>
            }
        </div>
    );
}
