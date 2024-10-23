"use client";
import PageBlock from '@/components/PageBlock';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import './Settings.scss';
import SettingsGeneral from './SettingsGeneral';
import SettingsPayment from './SettingsPayment';

const Settings = () => {
    const t = useTranslations()

    const acts = ["settings", "paymentServices"];
    const [act, setAct] = useState(acts[0]);

    return (
        <div className='settings_panel'>
            <PageBlock>
                <ul className="page_block_header">
                    {acts.map(x =>
                        <li key={x} className={`header_item ${x === act && 'active'}`} onClick={() => setAct(x)} ><div>{t(x)}</div></li>
                    )}
                </ul>
                {act === acts[0] && <SettingsGeneral />}
                {act === acts[1] && <SettingsPayment></SettingsPayment>}
            </PageBlock>
        </div>
    );
}

export default Settings;
