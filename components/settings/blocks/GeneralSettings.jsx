"use client";
import { patchAccount } from '@/lib/features/account';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import SettingForm from '../SettingForm';
import SettingRow from '../SettingRow';



const GeneralSettings = () => {

    const account = useAppSelector(s => s.account.settings)
    const dispatch = useAppDispatch();
    const showErrors = () => {
        // if (error === undefined) return
        // return (
        //     <div className="msg error">
        //         <div className="msg_text">{t(error)}</div>
        //     </div>
        // )
    }

    const verifyAndHandle = (e) => {
        dispatch(patchAccount({
            bio,
            website,
            sex: sex === "true" ? true : sex === "false" ? false : null,
            country,
            address
        }))
        e.preventDefault()
    }

    const t = useTranslations()
    const [bio, setBio] = useState(account.bio);
    const [website, setWebsite] = useState(account.website);
    const [sex, setSex] = useState(`${account.sex}`);
    const [country, setCountry] = useState(account.country);
    const [address, setAddress] = useState(account.address);

    return (
        <div className='settings_line'>
            <SettingForm handler={verifyAndHandle} errors={showErrors}>
                <SettingRow label={t('bio')}>
                    <textarea type="text" maxLength={16384} className='input input-wide' placeholder={t("writeAboutYourself")} value={bio} onChange={(e) => { setBio(e.target.value) }} />
                </SettingRow>
                <SettingRow label={t('website')}>
                    <input type="url" maxLength={128} autoComplete='url' className='input input-wide' value={website} placeholder={t("website")} onChange={(e) => { setWebsite(e.target.value) }} />
                </SettingRow>
                <SettingRow label={t('country')}>
                    <input type="text" maxLength={128} autoComplete='country-name' className='input input-wide' value={country} placeholder={t("country")} onChange={(e) => { setCountry(e.target.value) }} />
                </SettingRow>
                <SettingRow label={t('address')}>
                    <input type="text" maxLength={128} autoComplete='street-address' className='input input-wide' value={address} placeholder={t("address")} onChange={(e) => { setAddress(e.target.value) }} />
                </SettingRow>
                <SettingRow label={t('sex')}>
                    <Form.Group className="mb-3" controlId="signUpSex">
                        <Form.Select value={sex} autoComplete='sex' onChange={(e) => setSex(e.target.value)} className='input input-wide' aria-label="sex">
                            <option>{t("notSet")}</option>
                            <option value={true}>{t('male')}</option>
                            <option value={false}>{t('female')}</option>
                        </Form.Select>
                    </Form.Group>
                </SettingRow>
                <SettingRow>
                    <button className="btn_miyuli flat_button" type='submit'>{t("save")}</button>
                </SettingRow>
            </SettingForm>
        </div>
    );
}

export default GeneralSettings;
