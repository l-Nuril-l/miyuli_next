"use client";
import PageBlock from '@/components/PageBlock';
import ChangeLanguage from '@/components/header/ChangeLanguage';
import ChangeTheme from '@/components/header/ChangeTheme';
import { useAsyncRouter } from '@/hooks/useAsyncRouter';
import { clearErrors, signIn, signInGoogle } from "@/lib/features/auth";
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { handleSignIn } from "@/services/actions";
import "@/styles/Auth.scss";
import { GoogleLogin } from '@react-oauth/google';
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { Alert } from "react-bootstrap";

export default function SignInPage() {

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const t = useTranslations()
    const dispatch = useAppDispatch();
    const authStore = useAppSelector(s => s.auth);
    const router = useRouter()
    const { asyncRefresh } = useAsyncRouter()

    const getAlertWithErrors = useCallback(() => {
        var res = [];
        authStore.rejected.split(" ").map(x => res.push(handleCommonErrorCases(x)))
        return res;
    }, [authStore?.rejected])

    useEffect(() => {
        return () => {
            dispatch(clearErrors())
        };
    }, [dispatch]);

    async function handleSubmit(e) {
        startTransition(async () => {
            await handleSignIn(e);
        });
    }

    return (
        <div>
            <PageBlock className="page_block sign_in">
                <div className="form_logo"><img className="logo" src="/miyuli.purple-50.png" alt="logo" /></div>
                <h2 className="login_header">MIYULI</h2>
                <div id="login_message">
                    {authStore?.rejected ? <Alert key="errors" variant="danger">
                        {getAlertWithErrors().map((x, i) => <div key={i}>{t(x)}</div>)}
                    </Alert> : ""}
                </div>
                <form className="login_form" onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(signIn({ identifier, password, remember })).unwrap().then((e) => handleSignIn(e)).then(() => router.push('/feed'))
                }}>
                    <input className="input w-100" minLength="5" maxLength="256" required name="login" autoComplete="username" value={identifier} onChange={e => setIdentifier(e.target.value)} type="text" placeholder={t('signInTypes')} />
                    <input className="input w-100 mt-1" minLength="8" maxLength="256" required name="password" autoComplete="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder={t('password')} />
                    <div className="remember_checkbox" >
                        <input className="remember_input" type="checkbox" name="remember" id="index_remember_input" value={remember} />
                        <label onClick={() => setRemember(!remember)} className="remember_label" htmlFor="index_remember_input">
                            {remember === false ?
                                <span className="checkbox_off">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.05 2.53C4.79 2.13 5.52 2 7.13 2h5.74c1.61 0 2.34.14 3.08.53.65.35 1.17.87 1.52 1.52.4.74.53 1.47.53 3.08v5.74c0 1.61-.14 2.34-.53 3.08a3.64 3.64 0 0 1-1.52 1.52c-.74.4-1.47.53-3.08.53H7.13c-1.61 0-2.34-.14-3.08-.53a3.64 3.64 0 0 1-1.52-1.52c-.4-.74-.53-1.47-.53-3.08V7.13c0-1.61.14-2.34.53-3.08.35-.65.87-1.17 1.52-1.52Zm3.08.97c-1.53 0-1.96.14-2.38.36-.38.2-.69.5-.9.9-.21.4-.35.84-.35 2.37v5.74c0 1.53.14 1.96.36 2.38.2.38.5.69.9.9.4.21.84.35 2.37.35h5.74c1.53 0 1.96-.14 2.38-.36.38-.2.69-.5.9-.9.21-.4.35-.84.35-2.37V7.13c0-1.53-.14-1.96-.36-2.38-.2-.38-.5-.69-.9-.9-.4-.21-.84-.35-2.37-.35H7.13Z" fill="currentColor"></path></svg>
                                </span>
                                :
                                <span className="checkbox_on">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2.44 4.18C2 5.04 2 6.16 2 8.4v3.2c0 2.24 0 3.36.44 4.22a4 4 0 0 0 1.74 1.74c.86.44 1.98.44 4.22.44h3.2c2.24 0 3.36 0 4.22-.44a4 4 0 0 0 1.74-1.74c.44-.86.44-1.98.44-4.22V8.4c0-2.24 0-3.36-.44-4.22a4 4 0 0 0-1.74-1.74C14.96 2 13.84 2 11.6 2H8.4c-2.24 0-3.36 0-4.22.44a4 4 0 0 0-1.74 1.74Zm12.2 3.8a.9.9 0 1 0-1.28-1.27L8.7 11.38 6.64 9.33a.9.9 0 0 0-1.28 1.27l2.7 2.69a.9.9 0 0 0 1.27 0l5.3-5.3Z" fill="currentColor"></path></svg>
                                </span>
                            }
                            <span className="checkbox_name">{t("remember")}</span>
                        </label>
                    </div>
                    <button disabled={authStore.processing} className="btn_miyuli w-100" type="submit">
                        <span className="FlatButton__in">
                            <span className="FlatButton__content">
                                {t("signIn")}
                            </span>
                        </span>
                    </button>

                    <div className="other_sign">
                        <div id="signInDiv">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    dispatch(signInGoogle({ credential: credentialResponse.credential, remember })).then(() => router.push("/"))
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                useOneTap
                            />
                        </div>
                    </div>
                </form>
            </PageBlock>

            <div className="page_block sign_footer">
                <Link href='/register' onClick={() => dispatch(clearErrors())}>
                    <button className="btn_miyuli register_btn" type="button">
                        <span className="FlatButton__in">

                            <span className="FlatButton__content">
                                {t("register")}
                            </span>

                        </span>
                    </button>
                </Link>
                <Link href={"/reset_password"} className="forgot_password" role="button">
                    {t("forgotPassword")}?
                </Link>
            </div>

            <div className='switchers'>
                <ChangeTheme />
                <ChangeLanguage />
            </div>
        </div >
    )
}
