"use client";
import PageBlock from '@/components/PageBlock';
import ChangeLanguage from '@/components/header/ChangeLanguage';
import ChangeTheme from '@/components/header/ChangeTheme';
import { clearErrors, resetPassword } from "@/lib/features/auth";
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch } from '@/lib/hooks';
import "@/styles/Auth.scss";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useEffect, useState } from 'react';



export default function ResetPassword() {

    const t = useTranslations()
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [reset, setReset] = useState(false);
    const [fail, setFail] = useState(false);

    useEffect(() => {
        return () => {
            dispatch(clearErrors())
        };
    }, [dispatch]);

    return (
        <div>
            <PageBlock className="page_block sign_in reset_password">
                <div className="form_logo"><img className="logo" src="/miyuli.purple-50.png" alt="logo" /></div>
                <h2 className="login_header">{t('passwordRecovery')}</h2>
                {reset && <div className="msg ok_msg">
                    <div className="msg_text">{t("resetMsgSentIfAccExists")}</div>
                </div>}
                {fail && <div className="msg error">
                    <div className="msg_text">{t(handleCommonErrorCases("Network Error"))}</div>
                </div>}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(resetPassword({ email })).unwrap().then(x => setReset(true)).catch(setFail(true));
                }} className="login_form">
                    <input className="input w-100" required name="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder={t('email')} />
                    <button className="btn_miyuli w-100 mt-2" type="submit">
                        <span className="FlatButton__in">
                            <span className="FlatButton__content">
                                {t("resetPassword")}
                            </span>
                        </span>
                    </button>
                </form>
            </PageBlock>

            <div className="page_block sign_footer">
                <Link href='/login' onClick={() => dispatch(clearErrors())}>
                    <button className="btn_miyuli register_btn" type="button">
                        <span className="FlatButton__in">
                            <span className="FlatButton__content">
                                {t("signIn")}
                            </span>
                        </span>
                    </button>
                </Link>
                <Link href='/register' onClick={() => dispatch(clearErrors())}>
                    <button className="btn_miyuli register_btn mt-2" type="button">
                        <span className="FlatButton__in">
                            <span className="FlatButton__content">
                                {t("register")}
                            </span>
                        </span>
                    </button>
                </Link>
            </div>
            <div className='switchers'>
                <ChangeTheme />
                <ChangeLanguage />
            </div>
        </div>
    )
}
