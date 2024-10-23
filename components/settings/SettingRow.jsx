import { useTranslations } from "next-intl";


const SettingRow = ({ label, children }) => {
    const t = useTranslations()
    return (
        <div className="settings_row">
            <div className="settings_label">{label}</div>
            <div className="settings_labeled">
                {children}
            </div>
        </div>
    );
}

export default SettingRow;
