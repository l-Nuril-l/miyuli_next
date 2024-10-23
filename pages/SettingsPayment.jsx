"use client";
import PayPalCheckout from "@/components/settings/PayPalCheckout";
import SettingRow from "@/components/settings/SettingRow";
import { captureOrder, disposePaymentInfo, getPaymentInfo } from "@/lib/features/account";
import { clearErrors } from "@/lib/features/auth";
import { beautifyDate, handleCommonErrorCases } from "@/lib/functions";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from "react";
import RefreshSvg from "../assets/Refresh";



const SettingsPayment = () => {
    const [value, setValue] = useState(1);
    const accountStore = useAppSelector(s => s.account)
    const t = useTranslations()

    const [{ isResolved }, paypalDispatch] = usePayPalScriptReducer();
    const dispatch = useAppDispatch();
    const promisesRef = useRef({});

    useEffect(() => {
        !isResolved && paypalDispatch({
            type: "setLoadingStatus",
            value: "pending",
        });
    }, [isResolved, paypalDispatch]);

    useEffect(() => {
        let promises = promisesRef.current;
        promisesRef.current.settings = dispatch(getPaymentInfo());
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposePaymentInfo());
        };
    }, [dispatch]);

    return (<>
        {
            accountStore.paymentInfo && <div className="settings_body">
                <div className="settings_line">
                    <SettingRow label={t('balance')}>
                        {accountStore.paymentInfo.balance}
                    </SettingRow>
                    <SettingRow label={t('replenishment')}>
                        <input className="input" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                    </SettingRow>
                </div>
                <div className="settings_line">
                    <PayPalCheckout value={value} />
                </div>
                <div className="transactions_container">
                    {accountStore.paymentInfo.transactions?.map(x => <div className="transaction_line" key={x.id}>
                        <div>{x.summary}</div>
                        <div>{x.resourceID}</div>
                        <div>+{x.value}</div>
                        <div>
                            {x.status}
                            {x.status === "Awaiting Payment" && <span onClick={() => {
                                dispatch(captureOrder(x.resourceID))
                            }}><RefreshSvg /></span>}
                        </div>
                        <div>{beautifyDate(x.dateTime, t)}</div>
                    </div>)}
                </div>
            </div >
        }
        {accountStore.isFetching && <div className='loader'></div>}
        {
            accountStore.errors.paymentInfo && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                <div>{t(handleCommonErrorCases(accountStore.errors.paymentInfo))}</div>
                <div><button className='btn_miyuli' onClick={() => dispatch(clearErrors())}>{t('tryAgain')}</button></div>
            </div>
        }
    </>)
}

export default SettingsPayment;
