"use client";
import PageBlock from "@/components/PageBlock";
import SelectSearch from '@/components/SelectSearch';
import ChangeLanguage from '@/components/header/ChangeLanguage';
import ChangeTheme from '@/components/header/ChangeTheme';
import { clearErrors, signInGoogle, signUp } from "@/lib/features/auth";
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import "@/styles/Auth.scss";
import { yupResolver } from '@hookform/resolvers/yup';
import { GoogleLogin } from '@react-oauth/google';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from 'react-hook-form';
import * as yup from "yup";




const Page1Schema = (t) => yup.object({
    name: yup.string().min(2, t("validation.minCharacters", { value: 2 })).max(32, t("validation.maxCharacters", { value: 32 })).required(),
    surname: yup.string().min(2, t("validation.minCharacters", { value: 2 })).max(32, t("validation.maxCharacters", { value: 32 })).required(),
    email: yup.string().email(t("validation.notValidEmail")).required(t("validation.requiredField")),
    dateOfBirth: yup
        .date()
        .typeError(t('validation.requiredField'))
        .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), t('validation.tooOld'))
        .max(new Date(new Date().setFullYear(new Date().getFullYear() - 14)), t('validation.min14Years')),
}).required();
const Page2Schema = (t) => yup.object({
    password: yup.string().min(8, t("validation.minCharacters", { value: 8 })).max(256, t("validation.maxCharacters", { value: 256 })).required()
        .matches(/[a-z]/, t("validation.lowercase"))
        .matches(/[A-Z]/, t("validation.uppercase"))
        .matches(/[0-9]/, t("validation.number"))
        .matches(/[\W_]/, t("validation.specialCharacter")),
    password2: yup.string().oneOf([yup.ref('password'), null], t('validation.passwordDoNotMatch')).required(),
    login: yup.string()
        .transform((value, originalValue) => {
            if (!value) return null;
            return originalValue;
        })
        .nullable()
        .optional()
        .min(5, t("validation.minCharacters", { value: 5 }))
        .max(32, t("validation.maxCharacters", { value: 32 }))
        .test("checkLoginAvailability", t("validation.loginTakenOrUnavailable"), async (value) => {
            if (!value) return true;
            return true;
        }),
    phoneNumber: yup.string()
        .transform((value, originalValue) => {
            if (!value) return null;
            return originalValue;
        })
        .nullable()
        .optional()
        .min(10, t("validation.minCharacters", { value: 12 }))
        .max(16, t("validation.maxCharacters", { value: 16 })),
}).required();
const Page3Schema = (t) => yup.object({

    country: yup.string(),
    address: yup.string(),
    sex: yup.string(),
}).required();
const schema = (t) => Page1Schema(t).concat(Page2Schema(t)).concat(Page3Schema(t));


export default function SignUp() {
    const [page, setPage] = useState(1);
    const t = useTranslations()
    const currentSchema = page === 1 ? Page1Schema(t) : page === 2 ? Page2Schema(t) : schema(t);
    const { register, handleSubmit, formState: { errors }, trigger, control } = useForm({
        defaultValues: {
            dateOfBirth: new Date().toISOString().substring(0, 10)
        },
        resolver: yupResolver(currentSchema)
    });
    const dispatch = useAppDispatch();
    const authStore = useAppSelector(s => s.auth);
    const router = useRouter()


    const getAlertWithErrors = useCallback(() => {
        return authStore.rejected
            .split(" ")
            .map((x) => handleCommonErrorCases(x));
    }, [authStore?.rejected]);

    useEffect(() => {
        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch]);

    const onSubmit = (data) => {
        if (page < 3) {
            trigger().then((isValid) => {
                if (isValid) setPage(page + 1);  // Переход на следующую страницу
            });
            return;
        }

        dispatch(signUp({
            ...data,
            email: data.email.toLowerCase(),
            sex: data.sex === "true" ? true : data.sex === "false" ? false : null,
        })).then(e => (e.meta.requestStatus === "fulfilled") && router.push("/"));
    };

    return (
        <div className='sign_up_page'>
            {authStore?.rejected && (
                <Alert className="m-3" key="errors" variant="danger">
                    {getAlertWithErrors().map((x, i) => (
                        <div key={i}>{t(x)}</div>
                    ))}
                </Alert>
            )}
            <PageBlock className="sign_up">
                <div>
                    <div>
                        <div className='text-center'><img className="logo" src="/miyuli.purple-50.png" alt="logo" /></div>
                        <div className='h2 text-center'>
                            <span className='logo_text mx-3'>MIYULI</span>
                        </div>
                    </div>
                    <div className='h3 text-center logo_text'>{t('REGISTRATION')}<span className='text-nowrap'> {page} / 3</span></div>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="overflow-x-hidden">
                        <div className="registration_slides" style={{ "--page": page }}>
                            <div><Row>
                                <Col>
                                    <Form.Group className="mb-3 required" controlId="signUpName">
                                        <Form.Label>{t('name')} </Form.Label>
                                        <Form.Control
                                            {...register("name")}
                                            className={classNames("input")}
                                            isInvalid={!!errors.name}
                                            autoComplete="given-name"
                                            type="text"
                                            placeholder={t('name')}
                                        />
                                        {errors.name && <span className="invalid-feedback">{errors.name.message}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3 required" controlId="signUpSurname">
                                        <Form.Label>{t('surname')} </Form.Label>
                                        <Form.Control
                                            {...register("surname")}
                                            className={classNames("input")}
                                            isInvalid={!!errors.surname}
                                            autoComplete="family-name"
                                            type="text"
                                            placeholder={t('surname')}
                                        />
                                        {errors.surname && <span className="invalid-feedback">{errors.surname.message}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 required" controlId="signUpBirth">
                                            <Form.Label>{t('dateOfBirth')} </Form.Label>
                                            <Form.Control
                                                {...register("dateOfBirth")}
                                                className={classNames("input")}
                                                isInvalid={!!errors.dateOfBirth}
                                                type="date"
                                                placeholder={t('dateOfBirth')}
                                            />
                                            {errors.dateOfBirth && <span className="invalid-feedback">{errors.dateOfBirth.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3 required" controlId="signUpEmail">
                                            <Form.Label>{t('email')} </Form.Label>
                                            <Form.Control
                                                {...register("email")}
                                                className={classNames("input")}
                                                isInvalid={!!errors.email}
                                                autoComplete="email"
                                                type="email"
                                                placeholder={t('email')}
                                            />
                                            {errors.email && <span className="invalid-feedback">{errors.email.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="signUpLogin">
                                            <Form.Label>{t('login')} </Form.Label>
                                            <Form.Control
                                                {...register("login")}
                                                className={classNames("input")}
                                                isInvalid={!!errors.login}
                                                autoComplete="username"
                                                type="text"
                                                placeholder={t('login')}
                                            />
                                            {errors.login && <span className="invalid-feedback">{errors.login.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="signUpPhoneNumber">
                                            <Form.Label>{t('phoneNumber')} </Form.Label>
                                            <Form.Control
                                                {...register("phoneNumber")}
                                                className={classNames("input")}
                                                isInvalid={!!errors.phoneNumber}
                                                autoComplete="tel"
                                                type="tel"
                                                placeholder={t('phoneNumber')}
                                            />
                                            {errors.phoneNumber && <span className="invalid-feedback">{errors.phoneNumber.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3 required" controlId="signUpPassword">
                                            <Form.Label>{t('password')}</Form.Label>
                                            <Form.Control
                                                {...register("password")}
                                                className={classNames("input")}
                                                isInvalid={!!errors.password}
                                                autoComplete="current-password"
                                                type="password"
                                                placeholder={t('password')}
                                            />
                                            {errors.password && <span className="invalid-feedback">{errors.password.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3 required" controlId="signUpRepeatPassword">
                                            <Form.Label>{t('repeatPassword')}</Form.Label>
                                            <Form.Control
                                                {...register("password2")}
                                                className={classNames("input")}
                                                isInvalid={!!errors.password2}
                                                autoComplete="new-password"
                                                type="password"
                                                placeholder={t('repeatPassword')}
                                            />
                                            {errors.password2 && <span className="invalid-feedback">{errors.password2.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                            <div>



                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="signUpCountry">
                                            <Form.Label>{t('country')} </Form.Label>
                                            <Controller
                                                control={control}
                                                name="ReactDatepicker"
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <SelectSearch onSelect={onChange}
                                                        onBlur={onBlur} />
                                                )}
                                            />

                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="signUpAddress">
                                            <Form.Label>{t('address')} </Form.Label>
                                            <Form.Control
                                                {...register("address")}
                                                className="input"
                                                isInvalid={!!errors.address}
                                                autoComplete="street-address"
                                                type="text"
                                                placeholder={t('address')}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3" controlId="signUpSex">
                                    <Form.Label>{t('sex')}</Form.Label>
                                    <Form.Select
                                        {...register("sex")}
                                        className="input"
                                        isInvalid={!!errors.sex}
                                        aria-label="sex"
                                    >
                                        <option value="">{t("notSet")}</option>
                                        <option value="true">{t('male')}</option>
                                        <option value="false">{t('female')}</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center gap-2">
                        {page > 1 && <button onClick={(e) => { e.preventDefault(); setPage(page - 1) }} className="btn_miyuli">
                            {t('prev')}
                        </button>}
                        {page < 3 && <button className="btn_miyuli">
                            {t('next')}
                        </button>}
                        {page === 3 && <button disabled={authStore.processing} className="btn_miyuli register_btn" type="submit">
                            {t('register')}
                        </button>}
                    </div>
                </Form>

            </PageBlock >

            <PageBlock className="sign_footer">
                <div className="text-center">{t("instantRegistration")}</div>
                <div className="text-center">{t("passwordEmail")}</div>
                <div className="other_sign">
                    <div id="signInDiv">
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                dispatch(signInGoogle(credentialResponse.credential)).then(() => router.push("/"))
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            useOneTap
                        />
                    </div>
                </div>

                <div className="text-center">{t("alreadyRegistered")}?</div>
                <Link href='/login' className="btn_miyuli register_btn">
                    {t('login')}
                </Link>
            </PageBlock>

            <div className='switchers'>
                <ChangeTheme />
                <ChangeLanguage />
            </div>
        </div >
    );
}
