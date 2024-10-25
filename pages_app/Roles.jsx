"use client";
import Avatar from '@/components/Avatar';
import PageBlock from '@/components/PageBlock';
import { disposeStaff, getStaff, giveAccountRole, switchAccountRole } from '@/lib/features/role';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CloseSvg from '../assets/CloseSvg';
import "./Roles.scss";



const Roles = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const roleStore = useAppSelector(s => s.role)
    const authStore = useAppSelector(s => s.auth)
    const t = useTranslations()

    const [roleId, setRoleId] = useState(2);
    const [email, setEmail] = useState("@gmail.com");
    useEffect(() => {
        dispatch(getStaff());
        return () => {
            dispatch(disposeStaff())
        };
    }, [dispatch]);
    return (
        <>
            <main className="role_page">
                <div className="d-flex gap-2 mb-2">
                    <PageBlock className="authorized_as_block w-100 p-2">
                        <div className="account_card">
                            <Avatar className="avatar_element" size={50} crop={roleStore.account?.avatar} avatar={roleStore.account?.avatar} onClick={() => router.push(`/id${roleStore.account.id}`)}> </Avatar>
                            <div className='card_data'>
                                <div>{roleStore.account?.name} {roleStore.account?.surname} <span className='label'>({t("itsYou")})</span></div>
                                <div className="label">{roleStore.account?.email}</div>
                            </div>
                        </div>
                        <div className='card_roles'>
                            <div>{t("yourRoles")}:&nbsp;</div>
                            {roleStore.account?.roles.map((x, i) => <div key={x.id}><span>{i !== 0 && ", "}{x.name}</span></div>)}
                        </div>
                    </PageBlock>
                    <PageBlock className='w-100 mb-0 p-2'>
                        <div className='text-center'>{t('allAvailableRoles')}</div>
                        {roleStore.roles.map((x, i) => <span key={x.id}>{i !== 0 && ", "}{x.name}</span>)}
                    </PageBlock>
                </div>

                <div className='text-center'>{t("giveRole")}</div>
                <PageBlock className="p-2 mt-0 mb-2">
                    <div className="d-flex justify-content-evenly">
                        <div>
                            <label htmlFor='email'>{t("email")}:</label>
                            <input id="email" className='input mx-2' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="roles">{t("chooseRole")}:</label>
                            <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className='input mx-2' name="roles" id="roles">
                                {roleStore.roles.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                            </select>
                            <button className='btn_miyuli d-inline' onClick={() => { dispatch(giveAccountRole({ email: email, roleId: roleId })) }}>{t("give")}</button>
                        </div>
                    </div>
                </PageBlock>
                <div className='text-center'>{t("staff")}</div>
                {roleStore.staff.map(x => <PageBlock key={x.id} className="p-2 mt-0 mb-2">
                    <div className="account_card">
                        <Avatar className="avatar_element" size={50} crop={x.avatarCrop} avatar={x.avatar} onClick={() => router.push(`/id${x.id}`)}> </Avatar>
                        <div className='card_data'>
                            <div>{x.name} {x.surname} {x.id === authStore.session.id && <span className='label'>({t("itsYou")})</span>}</div>
                            <div className="label">{x.email}</div>
                        </div>
                    </div>
                    <div className='card_roles'>
                        <div>{t("roles")}:&nbsp;</div>
                        {x.roles.map((y) =>
                            <span key={y.id} className='role_card'>
                                <div className="role_card_text">{y.name}</div>
                                <div className="role_card_delete" onClick={() => { dispatch(switchAccountRole({ accountId: x.id, roleId: y.id, state: false })) }}><CloseSvg width={12} height={12} /></div>
                            </span>
                        )}
                    </div>
                </PageBlock>)}
            </main>
        </>
    );
}

export default Roles;
