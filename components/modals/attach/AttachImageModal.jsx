"use client";
import { clearErrorImages, disposeAlbum, disposePhotoModal, getAlbumModal, getAlbumsModal, getImagesModal, getPhotoDataModal, uploadImages, uploadImagesInAlbum } from '@/lib/features/photo';
import { handleCommonErrorCases } from "@/lib/functions";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from "react-infinite-scroller";
import CloseSvg from "../../../assets/CloseSvg";
import UploadImageSvg from "../../../assets/UploadImageSvg";
import AlbumCard from '../../AlbumCard';
import ImageCard from '../../ImageCard';
import PageBlock from '../../PageBlock';
import Modal from "../Modal";
import "./AttachImageModal.scss";



const AttachImageModal = ({ onFileSelected, onClose }) => {
    const imagesStore = useAppSelector(s => s.photo.modal)
    const authStore = useAppSelector(s => s.auth.session)
    const t = useTranslations();
    const [search, setSearch] = useState("");
    const [albumId, setAlbumId] = useState(0);

    const dispatch = useAppDispatch();

    const promisesRef = useRef({});

    useEffect(() => {
        if (imagesStore.errors.main) return;
        var promises = promisesRef.current
        if (albumId > 0) promisesRef.current.modal = dispatch(getAlbumModal(albumId))
        else promisesRef.current.general = dispatch(getPhotoDataModal(authStore.id))
        return () => {
            if (albumId > 0) dispatch(disposeAlbum())
            Object.values(promises).forEach(x => x.abort());
        };
    }, [dispatch, authStore.id, albumId, imagesStore.errors.main]);

    useEffect(() => {
        return () => {
            dispatch(disposePhotoModal())
        };
    }, [dispatch]);

    const getMore = () => {
        const args = {
            id: authStore.id,
            after: imagesStore.images[imagesStore.images.length - 1]?.id
        }
        promisesRef.current.files = dispatch(getImagesModal(args))
    }

    const changeAlbumsPage = (pg) => {
        setAlbumsPage(pg)
        dispatch(getAlbumsModal({ id: authStore.id, page: pg }))
    }
    const [albumsPage, setAlbumsPage] = useState(1);
    const getAlbumPagination = () => {
        let res = [];
        let pg = albumsPage;
        for (let i = pg - (pg > 4 ? 4 : pg - 1); i < Math.ceil(imagesStore.albumsCount / 6) + 1 && i < pg + 10 - (pg > 4 ? 4 : pg - 1); i++) {
            res.push(<button key={i} onClick={() => changeAlbumsPage(i)} className="btn_miyuli" type="button">{Math.floor(i)}</button>)
        }
        return res;
    }

    const modalRef = useRef(null);
    const modalAlbumRef = useRef(null);
    const inputFile = useRef(null)

    return <>
        <Modal ref={modalAlbumRef} isOpen={albumId > 0} onClose={() => setAlbumId(0)}>
            <div className='modal_miyuli'>
                {imagesStore.album &&
                    <PageBlock className="album m-0">
                        <div className='page_block_header'>
                            <a href={`/albums${imagesStore.album.accountId}`} onClick={(e) => { e.preventDefault(); setAlbumId(0) }} className='header_item_left'><span role="button">{imagesStore.album.account.name}</span> {imagesStore.album.name}</a>
                            <div className='header_item_right'>
                                <button onClick={() => { inputFile.current.click() }} className='btn_miyuli'>{t("addPhotos")}</button>
                                <input onChange={(e) => dispatch(uploadImagesInAlbum({ files: [...e.target.files], albumId: imagesStore.album.id }))} type='file' ref={inputFile} accept="image/jpeg,image/png,image/gif,image/heic,image/heif,image/webp" multiple style={{ display: 'none' }} />
                            </div>
                        </div>
                        <div className='text-center'>
                            <h6 className='mt-1'>{imagesStore.album.name}</h6>
                            <div>{imagesStore.album.description}</div>
                        </div>
                        <InfiniteScroll
                            className='photos_container'
                            loadMore={() => !imagesStore.errors.main && !imagesStore.isFetching ? getMore() : null}
                            hasMore={imagesStore.hasMore}
                            initialLoad={true}
                            useWindow={false}
                            getScrollParent={() => modalAlbumRef.current}
                        >
                            {imagesStore.album.images?.map(x => <ImageCard onClick={() => { onFileSelected(x); onClose() }} key={x.id} image={x} />)}
                        </InfiniteScroll>
                        {imagesStore.album.images.length === 0 && <div className="photos_no_content">{t("albumNoPhotos")}</div>}
                        {imagesStore.isFetching && <div className='loader'></div>}
                        {imagesStore.errors.album && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                            <div>{t(handleCommonErrorCases(imagesStore.errors.main))}</div>
                            <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorImages())}>{t('tryAgain')}</button></div>
                        </div>}
                    </PageBlock>}
                {imagesStore.isFetching && <div className='loader'></div>}
                {imagesStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(imagesStore.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorImages())}>{t('tryAgain')}</button></div>
                </div>}
            </div>
        </Modal>
        <Modal ref={modalRef} isOpen={albumId === 0} onClose={onClose}>
            <div className='modal_miyuli attach_image_modal'>
                <div className='modal-header modal_header'>
                    <div>{t("attachingImage")}</div>
                    <div className="d-flex gap-3 align-items-center">
                        <UploadImageSvg className="svg_button" onClick={() => { inputFile.current.click() }} width={24} height={24} />
                        <input onChange={(e) => dispatch(uploadImages({ files: [...e.target.files] }))} type='file' ref={inputFile} accept="image/jpeg,image/png,image/gif,image/heic,image/heif,image/webp" multiple style={{ display: 'none' }} />
                        <div role="button" onClick={() => onClose()}>╳</div>
                    </div>
                </div>
                <div className="search_wrap">
                    <input className='input search_icon search_miyuli ' type="text" value={search} placeholder={t("searchFiles")}
                        onChange={(e) => setSearch(e.target.value)} />
                    {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
                </div>

                <div className='albums_container'>
                    {imagesStore.albums?.map(x => <AlbumCard onClick={(e, albumId) => { e.preventDefault(); setAlbumId(albumId) }} key={x.id} album={x} />)}
                    {!imagesStore.albums && <div className="albums_no_content">{t("noAlbums")}</div>}
                </div>
                <div className='pagination'>
                    {getAlbumPagination()}
                </div>
                <InfiniteScroll
                    className='images_container'
                    loadMore={() => !imagesStore.errors.main && !imagesStore.isFetching ? getMore() : null}
                    hasMore={imagesStore.hasMore}
                    useWindow={false}
                    getScrollParent={() => modalRef.current}
                >
                    {imagesStore.images.map(x => <ImageCard onClick={() => { onFileSelected(x); onClose() }} key={x.id} image={x} />)}
                </InfiniteScroll>
                {!imagesStore.images && <div className="images_no_content">{t("noImages")}</div>}
                {imagesStore.isFetching && <div className='loader'></div>}
                {imagesStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(imagesStore.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorImages())}>{t('tryAgain')}</button></div>
                </div>}
            </div>
        </Modal>
    </>;
}

export default AttachImageModal;
