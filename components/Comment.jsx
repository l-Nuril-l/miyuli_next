"use client";
import { deleteImageComment } from '@/lib/features/photo';
import { deletePostComment } from '@/lib/features/posts';
import { deleteVideoComment } from '@/lib/features/video';
import { beautifyDate } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import CloseSvg from '../assets/CloseSvg';
import Avatar from './Avatar';
import Linkify from './Linkify';

const Comment = ({ comment, ownerId, location }) => {
    const date = new Date(comment.creationTime);
    const authStore = useAppSelector(s => s.auth.session)
    const router = useRouter()
    const dispatch = useAppDispatch();
    const t = useTranslations()

    const removeComment = useCallback((e) => {
        if (window.confirm(t("deletionConfirmation"))) {
            switch (location) {
                case "video":
                    dispatch(deleteVideoComment(comment))
                    break;
                case "image":
                    dispatch(deleteImageComment(comment))
                    break;
                case "post":
                    dispatch(deletePostComment(comment))
                    break;
                default:
                    break;
            }

        }
        e.stopPropagation()
    }, [dispatch, comment, t, location])

    return (
        <div className='comment'>
            <div className='comment_header'>
                <Avatar onClick={() => router.push(`/id${comment.authorId}`)} className="avatar_element" crop={comment.account?.avatarCrop} avatar={comment.account?.avatar}></Avatar>
            </div>
            <div className='comment_body'>
                <div className='comment_author'>
                    <div className='comment_author_name' onClick={() => router.push(`/id${comment.accountId}`)}>
                        <Link href={`/id${comment.accountId}`}>{comment.account.name} {comment.account.surname}</Link>
                        {
                            (authStore?.id === comment.accountId || authStore?.id === ownerId) &&
                            <div className="delete_action" onClick={(e) => removeComment(e)}>
                                <CloseSvg />
                            </div>
                        }
                    </div>
                </div>
                <div className="comment_text"><Linkify>{comment.text}</Linkify></div>
                <div className='comment_author_time'>{beautifyDate(date, t)}</div>
            </div>
        </div>
    );
}

export default Comment;
