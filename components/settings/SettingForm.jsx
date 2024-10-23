import { useTranslations } from "next-intl";


const SettingForm = ({ handler, errors, close, children }) => {
    const t = useTranslations()
    return (
        <>
            {errors()}
            <form className='settings_change_form' onSubmit={(e) => { handler(e) }}>
                <div>
                    {children}
                </div>
                {close && <span role="button" className="settings_right_control" onClick={() => close(false)}>{t('cancel')}</span>}
            </form>
        </>
    );
}

export default SettingForm;
