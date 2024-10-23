import { useTranslations } from "next-intl";


const SettingPreview = ({ label, text, open }) => {
    const t = useTranslations()
    return (
        <div className='d-flex'>
            <div className="settings_info_block">
                <div className="settings_label">{label}</div>
                <div className="settings_labeled_text">{text}</div>
            </div>
            <span role="button" className="settings_right_control" onClick={() => open(true)}>{t('edit')}</span>
        </div>
    );
}

export default SettingPreview;
