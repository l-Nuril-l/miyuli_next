import { useTranslations } from "next-intl";


const Alert = ({ type, text }) => {
    const t = useTranslations()
    if (text === undefined) return;
    return (
        <div className="msg ok_msg">
            <div className="msg_text">{t(text)}</div>
        </div>
    );
}

export default Alert;
