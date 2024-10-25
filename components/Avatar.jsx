"use client";
import { useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import { useQueryState } from 'nuqs';
import NoAvatar from './NoAvatar';

const Avatar = ({ avatar, size = 32, className, open, onClick, children, crop }) => {
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const [searchParamZ, setSearchParamZ] = useQueryState('z')
    const handler = (e) => {
        e.preventDefault()
        if (open) {
            setSearchParamZ(`photo${-avatar.communityId || avatar.accountId}_${avatar.id}`)
        }
    }

    return (
        <div onClick={onClick} className={`avatar avatar_${size} ${className ? className : ""}`}>
            {avatar?.id ? <Image width={size ?? 100} height={size ?? 100} className='avatar_image' onClick={(e) => handler(e)} alt="avatar" src={API_URL + "photo/" + avatar.id + '?' + new URLSearchParams(crop).toString()} /> :
                <NoAvatar></NoAvatar>}
            {children}
        </div>
    );
}

export default Avatar;
