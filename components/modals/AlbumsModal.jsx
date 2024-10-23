"use client";
import { disposePhotoModal, getAlbumsData, getAlbumsModal, moveToAlbum } from '@/lib/features/photo';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import ImageCard from '../ImageCard';
import Modal from './Modal';




const AlbumsModal = (props) => {
    const t = useTranslations()
    const { onClose } = props;
    const dispatch = useAppDispatch();
    const store = useAppSelector(s => s.photo.modal)
    const authStore = useAppSelector(s => s.auth.session)
    const [albumsPage, setAlbumsPage] = useState(1);

    useEffect(() => {
        dispatch(getAlbumsData(authStore.id))
        return () => {
            dispatch(disposePhotoModal())
        };
    }, [dispatch, authStore.id]);

    const moveToAlbumAction = (id) => {
        dispatch(moveToAlbum(id));
        onClose();
    }


    const changeAlbumsPage = (pg) => {
        setAlbumsPage(pg)
        dispatch(getAlbumsModal({ id: authStore.id, page: pg }))
    }

    const getAlbumPagination = () => {
        let res = [];
        let pg = albumsPage;
        for (let i = pg - (pg > 4 ? 4 : pg - 1); i < Math.ceil(store.albumsCount / 6) + 1 && i < pg + 10 - (pg > 4 ? 4 : pg - 1); i++) {
            res.push(<button key={i} onClick={() => changeAlbumsPage(i)} className="btn_miyuli" type="button">{Math.floor(i)}</button>)
        }
        return res;
    }

    return <Modal onClose={onClose}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t('albums')}</div>
            </div>
            <div className='modal-body modal_body'>
                {store?.albums &&
                    <>
                        <div className='albums_container'>
                            {store.albums.map(x => <div key={x.id} className="album_holder" onClick={() => moveToAlbumAction(x.id)}>
                                {x.images?.length ?
                                    <ImageCard className='image' alt="AccountAlbum" image={x.images[0]} />
                                    :
                                    <img className='no_img_camera_icon' alt='NoImgCameraIcon' src='/images/icons/camera_big.png'></img>
                                }
                                <div className='album_info'>
                                    <div className='album_name'>{x.name}</div>
                                    <div className='album_count'>{x.imagesCount}</div>
                                </div>
                            </div>
                            )}
                        </div>
                        <div className='pagination'>
                            {getAlbumPagination()}
                        </div>
                    </>
                }
            </div>
            <div className='modal-footer modal_footer'>
                <button onClick={() => onClose()} className='btn_miyuli'>{t('close')}</button>
            </div>
        </div>
    </Modal>
}

export default AlbumsModal;