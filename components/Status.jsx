"use client";
import { updateStatus } from '@/lib/features/account';
import { updateCommunityStatus } from '@/lib/features/community';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import useClickOutside from '../hooks/useClickOutside';
import EmojiPicker from './EmojiPicker';
import Linkify from './Linkify';

const Status = ({ status, communityId, disabled }) => {

    const [statusIsEditing, setStatusIsEditing] = useState(false);
    const [statusText, setStatus] = useState(status);

    const dispatch = useAppDispatch();
    const t = useTranslations()

    useEffect(() => {
        setStatus(status)
    }, [statusIsEditing, status]);

    const clickOutsideStatus = useClickOutside(() => setStatusIsEditing(false))

    return (
        <div ref={clickOutsideStatus} className={`status_wrap${disabled ? " status_disabled" : ""}`}>
            <div onClick={() => setStatusIsEditing(!disabled)} className='page_status p-1'>{status !== "" ? <Linkify>{status}</Linkify> : disabled ? "" : t("setStatus")}</div>
            {statusIsEditing && <div className='status_editing_wrap'>
                <div className="status_input_wrap">
                    <input className='status_input input w-100' maxLength={128} value={statusText} onChange={(e) => setStatus(e.target.value)} />
                    <EmojiPicker absolute value={statusText} onChange={setStatus} />
                </div>
                <button className='btn_miyuli mt-1' onClick={() => { dispatch(communityId ? updateCommunityStatus({ status: statusText, communityId }) : updateStatus(statusText)).then(() => setStatusIsEditing(false)) }}>
                    {t("save")}
                </button>
            </div>
            }
        </div>
    );
}

export default Status;
