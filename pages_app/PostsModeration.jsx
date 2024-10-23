"use client";
import Post from '@/components/Post';
import { acceptPostReport, disposePostReports, getPostReports, rejectPostReport } from '@/lib/features/posts';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import useAdminPermissionsCheck from '../hooks/useAdminPermissionsCheck';
import './PostsModeration.scss';

const PostsModeration = () => {
    const dispatch = useAppDispatch()
    const postStore = useAppSelector(s => s.posts)
    const t = useTranslations()
    const { isModerator, isAdmin } = useAdminPermissionsCheck();
    useEffect(() => {
        dispatch(getPostReports());
        return () => {
            dispatch(disposePostReports())
        };
    }, [dispatch]);
    return (
        <>
            <main className="post_moderation">{postStore.posts.map(x => <div key={x.id}>
                <Post post={x}></Post>
                {(isModerator || isAdmin) &&
                    <div className='moderation_zone'>
                        <button className="btn_miyuli" onClick={() => dispatch(rejectPostReport(x.id))}>{t("rejectPostReport")}</button>
                        <button className="btn_miyuli" onClick={() => dispatch(acceptPostReport(x.id))}>{t("acceptPostReport")}</button>
                    </div>}
            </div>)}</main>
        </>
    );
}

export default PostsModeration;