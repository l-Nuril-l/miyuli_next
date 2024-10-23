"use client";
import PageBlock from '@/components/PageBlock';
import ChangeLanguage from '@/components/header/ChangeLanguage';
import ChangeTheme from '@/components/header/ChangeTheme';
import { changePasswordError, clearErrors } from '@/lib/features/account';
import { clearErrors as clearErrorsAuth, setNewPasswordWithResetToken, validateResetToken } from "@/lib/features/auth";
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import "@/styles/Auth.scss";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';


export default function SetNewPassword() {
    const t = useTranslations()
    const dispatch = useAppDispatch();
    const params = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(false);
    const router = useRouter()

    useEffect(() => {
        dispatch(validateResetToken(params.token)).unwrap().then(() => {
            setIsTokenValid(true)
        }).catch(({ status }) => {
            (status === 400 || status === 404) && router.push('/')
        });
    }, [dispatch, params.token, router]);

    const verifyAndChangePassword = (e) => {
        e.preventDefault()
        dispatch(clearErrors())
        dispatch(clearErrorsAuth())


        if (newPassword !== repeatPassword) {
            dispatch(changePasswordError("newPasswordRepeatedWrong"));
            return
        }
        if ((newPassword?.length < 8)) {
            dispatch(changePasswordError("newPasswordIncorrect"));
            return
        }

        dispatch(setNewPasswordWithResetToken({ token: params.token, newPassword })).then(e => (e.meta.requestStatus === "fulfilled") && router.push('/login'))
    }

    const error = useAppSelector(s => s.account.errors.changePasswordError)
    const authStore = useAppSelector(s => s.auth)


    const getAlertWithErrors = useCallback(() => {
        var res = [];
        if (error !== undefined) res.push(error)
        authStore.rejected.split(" ").map(x => res.push(handleCommonErrorCases(x)))
        return (
            <Alert key="errors" variant="danger">
                {res.length > 0 && <div className="msg error">
                    {res.map((x, i) => <div key={i} className="msg_text">{t(x)}</div>)}
                </div>}
            </Alert>
        )
    }, [authStore?.rejected, error, t])

    return (
        <>
            {isTokenValid ? <div>
                <PageBlock className="page_block sign_in">
                    <div className="form_logo"><img className="logo" src="/miyuli.purple-50.png" alt="logo" /></div>
                    <h2 className="login_header">{t('passwordRecovery')}</h2>
                    <form className="login_form">
                        {getAlertWithErrors()}
                        <input className="input w-100" autoComplete="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder={t('password')} />
                        <input className="input w-100 mt-1" autoComplete="repeatPassword" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} type="password" placeholder={t('repeatPassword')} />
                        <button onClick={(e) => {
                            e.preventDefault();
                            dispatch(verifyAndChangePassword(e))
                        }} className="btn_miyuli w-100 mt-2" type="button">
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
            </div> :
                !authStore.rejected ? <div className='loader'></div> : <div>{getAlertWithErrors()}</div>
            }
        </>)
}
