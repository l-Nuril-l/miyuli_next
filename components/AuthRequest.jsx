
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import './AuthRequest.scss';

const AuthRequest = ({ children }) => {
    const t = useTranslations()
    return (
        <div className='auth_request_container'>
            <div className='auth_request_content'>
                <div className='title'>
                    {t("moreOptionsAfterSigningIn")}
                </div>
                <div className='text'>
                    {t(children)}
                </div>
                <div className='actions'>
                    <Link href="/login" className='btn_miyuli d-inline-flex'>{t("signIn")}</Link>
                    <Link href="/register" className='mx-2'>{t("signUp")}</Link>
                </div>
            </div>
        </div>
    );
}

export default AuthRequest;
