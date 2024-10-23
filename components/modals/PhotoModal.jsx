"use client";
import { updateAvatar } from '@/lib/features/auth';
import { addToSavedImages, deleteImage, disposePhoto, getPhoto, likePhoto, sendComment, switchImage } from '@/lib/features/photo';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useRef, useState } from 'react';
import useAdminPermissionsCheck from '../../hooks/useAdminPermissionsCheck';
import Avatar from '../Avatar';
import Comment from '../Comment';
import CreateComment from '../CreateComment';
import ImageCard from '../ImageCard';
import AlbumsModal from './AlbumsModal';
import CropModal from './CropModal';
import Modal from './Modal';
import './PhotoModal.scss';
import ShareModal from './ShareModal';





const PhotoModal = () => {
    const [searchParamZ, setSearchParamZ] = useQueryState('z')
    const [albumsModalIsOpen, setAlbumsModalIsOpen] = useState(false);
    const t = useTranslations()
    const dispatch = useAppDispatch();
    const photoStore = useAppSelector(s => s.photo)
    const { isAdmin } = useAdminPermissionsCheck();
    const date = new Date(photoStore.photo?.created);
    const photo = photoStore.photo;
    const router = useRouter()
    const promisesRef = useRef({});
    const locale = useLocale();

    useEffect(() => {
        let params = searchParamZ?.slice(5).split("_");
        if (!params) return;
        promisesRef.current.photo = dispatch(getPhoto(params))
    }, [dispatch, searchParamZ]);


    const onClose = useCallback(() => {
        setSearchParamZ(null);
        dispatch(disposePhoto())
        Object.values(promisesRef.current).forEach(x => x.abort());
    }, [dispatch, setSearchParamZ])

    const getDestinationLink = () => {
        if (photo.uploadedBy?.login) return photo.uploadedBy.login;
        return (photo.uploadedBy.isCommunity ? `/community/` : `/id/`) + photo.uploadedBy.id
    }

    const [shareModalVisible, setShareModalVisible] = useState(false);

    const switchAction = (dir) => {
        promisesRef.current.switch?.abort();
        promisesRef.current.switch = dispatch(switchImage({
            id: photo.id,
            authorId: photo.uploadedBy.isCommunity ? -photo.uploadedBy.id : photo.uploadedBy.id,
            direction: dir,
            albumId: photo.fromAlbum,
        }))
        promisesRef.current.switch.then(({ type, payload }) => {
            if (type.endsWith("fulfilled") && 'URLSearchParams' in window) {
                // var searchParams = new URLSearchParams(window.location.search);
                setSearchParamZ(`photo${payload.uploadedBy.isCommunity === true ? -payload.communityId : payload.accountId}_${payload.id}`);
                // var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                // history.pushState(null, '', newRelativePathQuery);
            }
        })
    }

    useEffect(() => {
        if (photoStore.errors.photo === true) onClose();
    }, [photoStore.errors.photo, onClose]);

    const [direction, setDirection] = useState(true);
    const [isEnabledCropForAvatarImage, setIsEnabledCropForAvatarImage] = useState(false);

    return <Modal onClose={onClose}>
        {!photo.id ? <div className='loader'></div> :
            <div className='modal_miyuli modal_photo'>
                <div className='modal_left'>
                    <div className="image_holder" onMouseLeave={() => setDirection(null)} onMouseMove={(e) => { setDirection(e.clientX - e.currentTarget.getClientRects()[0].x > (e.currentTarget.clientWidth / 3)) }} onClick={(e) => { switchAction(direction) }}>
                        {photo.isDeleted && <div className='deleted'>{t("deleted")}</div>}
                        <div className={classNames("pm_nav_btn pm_nav_btn-left", direction === false && "pm_nav_btn-active")}></div>
                        <ImageCard className='modal_image' off image={photo} alt="ModalImage"></ImageCard>
                        <div className={classNames("pm_nav_btn pm_nav_btn-right", direction === true && "pm_nav_btn-active")}></div>
                    </div>
                    <div className='pm_bottom_info'>
                        <div>{t("photo")}</div>
                        <div className='pm_bottom_actions'>
                            {photo.uploadedBy.access ?
                                <>
                                    <div className="pm_bottom_action" onClick={() => dispatch(deleteImage(photo.id))}><span>{t("delete" + (photo.isDeleted ? "d" : ""))}</span></div>
                                    <span className="divider"></span>
                                    <div className="pm_bottom_action" onClick={() => setAlbumsModalIsOpen(true)}>{t("moveToAlbum")}</div>
                                    <span className="divider"></span>
                                    <div className="pm_bottom_action" onClick={() => setIsEnabledCropForAvatarImage(true)}>{t("setAsAvatar")}</div>
                                    <CropModal isOpen={isEnabledCropForAvatarImage} imageId={photo.id} onCrop={(avatarCrop) => { dispatch(updateAvatar({ id: photo.id, crop: avatarCrop, accountId: photo.accountId, communityId: photo.communityId })) }} onClose={() => { setIsEnabledCropForAvatarImage(false) }}></CropModal>
                                    {albumsModalIsOpen && <AlbumsModal onClose={() => setAlbumsModalIsOpen(false)}></AlbumsModal>}
                                </>
                                :
                                <>
                                    {isAdmin && <>
                                        <div className="pm_bottom_action admin_access" onClick={() => dispatch(deleteImage(photo.id))}><span>{t("delete")}</span></div>
                                        <span className="divider"></span>
                                    </>}
                                    <div className="pm_bottom_action" onClick={() => dispatch(addToSavedImages(photo.id))}>{t("addToSavedImages")}</div>
                                </>
                            }
                        </div>
                    </div>

                </div>
                <div className='modal_right'>
                    <div className='scroll'>
                        <div className='im_header'>
                            <Avatar className="avatar_element" size={50} crop={photo.uploadedBy.avatarCrop} avatar={photo.uploadedBy.avatar} onClick={() => router.push(getDestinationLink())}> </Avatar>
                            <div className='d-flex flex-wrap flex-column'>
                                <Link href={getDestinationLink()}>{photo.uploadedBy.name}</Link>
                                <div className='photo_date'>{date.getDate()} {date.toLocaleDateString(locale, { month: 'short' })} {date.getFullYear()} в {date.getHours()}:{String(date.getMinutes()).padStart(2, '0')}</div>
                            </div>
                        </div>
                        <div className='pm_actions'>
                            <div className='modal_action_btn' onClick={() => dispatch(likePhoto({ id: photoStore.photo?.id, like: !photoStore.photo?.isLiked }))}>
                                {!photoStore.photo?.isLiked ?
                                    <div className="post_like_icon">
                                        <svg height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M16 4a5.95 5.95 0 0 0-3.89 1.7l-.12.11-.12-.11A5.96 5.96 0 0 0 7.73 4 5.73 5.73 0 0 0 2 9.72c0 3.08 1.13 4.55 6.18 8.54l2.69 2.1c.66.52 1.6.52 2.26 0l2.36-1.84.94-.74c4.53-3.64 5.57-5.1 5.57-8.06A5.73 5.73 0 0 0 16.27 4zm.27 1.8a3.93 3.93 0 0 1 3.93 3.92v.3c-.08 2.15-1.07 3.33-5.51 6.84l-2.67 2.08a.04.04 0 0 1-.04 0L9.6 17.1l-.87-.7C4.6 13.1 3.8 11.98 3.8 9.73A3.93 3.93 0 0 1 7.73 5.8c1.34 0 2.51.62 3.57 1.92a.9.9 0 0 0 1.4-.01c1.04-1.3 2.2-1.91 3.57-1.91z" fill="currentColor" fillRule="nonzero"></path></g></svg>
                                    </div>
                                    :
                                    <div className="post_like_icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path xmlns="http://www.w3.org/2000/svg" d="M11.08 2.5A3.92 3.92 0 0115 6.42c0 2.19-.88 3.28-4.6 6.18L8.73 13.9c-.43.33-1.01.33-1.44 0L5.6 12.6C1.88 9.7 1 8.6 1 6.42A3.92 3.92 0 014.92 2.5c1.16 0 2.2.55 3.08 1.6.89-1.05 1.92-1.6 3.08-1.6z" fill="#ff3347" /></svg>
                                    </div>}
                                <div className="action_text">{photo.likesCount}</div>
                            </div>
                            <div className='modal_action_btn' onClick={() => setShareModalVisible(true)}>
                                <div className="post_like_icon">
                                    <svg height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"></path><path d="M12 3.73c-1.12.07-2 1-2 2.14v2.12h-.02a9.9 9.9 0 0 0-7.83 10.72.9.9 0 0 0 1.61.46l.19-.24a9.08 9.08 0 0 1 5.84-3.26l.2-.03.01 2.5a2.15 2.15 0 0 0 3.48 1.69l7.82-6.14a2.15 2.15 0 0 0 0-3.38l-7.82-6.13c-.38-.3-.85-.46-1.33-.46zm.15 1.79c.08 0 .15.03.22.07l7.82 6.14a.35.35 0 0 1 0 .55l-7.82 6.13a.35.35 0 0 1-.57-.28V14.7a.9.9 0 0 0-.92-.9h-.23l-.34.02c-2.28.14-4.4.98-6.12 2.36l-.17.15.02-.14a8.1 8.1 0 0 1 6.97-6.53.9.9 0 0 0 .79-.9V5.87c0-.2.16-.35.35-.35z" fill="currentColor" fillRule="nonzero"></path></g></svg>
                                </div>
                                <div className="action_text">{photo.repostsCount}</div>
                            </div>
                            {shareModalVisible && <ShareModal attachedImageId={photo.id} onClose={() => setShareModalVisible(false)}></ShareModal>}
                        </div>
                        <div className='pm_description'>{photo.description}</div>
                        <div className='pm_comments_wrap'>
                            <div className="pm_comments_summary">{photo.commentsCount} {t("comment", { count: photo.commentsCount })}</div>
                            <div className="pm_comments">
                                {photo.comments.map(x => <Comment location="image" key={x.id} comment={x}></Comment>)}
                            </div>
                        </div>
                    </div>

                    <div className='mv_create_comment'><CreateComment data={{ imageId: photo.id }} createComment={sendComment}></CreateComment></div>
                </div>

            </div>}
    </Modal>
}

export default PhotoModal;
