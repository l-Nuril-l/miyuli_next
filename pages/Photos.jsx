"use client";
import AlbumCard from '@/components/AlbumCard';
import ImageCard from '@/components/ImageCard';
import PageBlock from '@/components/PageBlock';
import CreateAlbum from '@/components/modals/CreateAlbum';
import { clearErrorImages, disposePhotoData, getAlbums, getPhotoData, getPhotos, uploadImages } from '@/lib/features/photo';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import './Photos.scss';

const Photos = () => {
    const photoStore = useAppSelector(s => s.photo)
    const [createAlbumModalIsOpen, setCreateAlbumModalIsOpen] = useState(false);
    const params = useParams()
    const id = params.id.replace(/albums/, '')
    const [albumsPage, setAlbumsPage] = useState(1);
    const t = useTranslations()
    const dispatch = useAppDispatch();

    const promisesRef = useRef({});
    useEffect(() => {
        var promises = promisesRef.current
        promisesRef.current.general = dispatch(getPhotoData(id))
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposePhotoData())
        };
    }, [dispatch, id]);
    const getMore = () => {
        const args = {
            id,
            after: photoStore.images[photoStore.images.length - 1]?.id
        }
        promisesRef.current.files = dispatch(getPhotos(args))
    }

    const changeAlbumsPage = (pg) => {
        setAlbumsPage(pg)
        dispatch(getAlbums({ id: id, page: pg }))
    }

    const getAlbumPagination = () => {
        let res = [];
        let pg = albumsPage;
        for (let i = pg - (pg > 4 ? 4 : pg - 1); i < Math.ceil(photoStore.albumsCount / 6) + 1 && i < pg + 10 - (pg > 4 ? 4 : pg - 1); i++) {
            res.push(<button key={i} onClick={() => changeAlbumsPage(i)} className="btn_miyuli" type="button">{Math.floor(i)}</button>)
        }
        return res;
    }

    const inputFile = useRef(null)

    return (
        <main className="photos_page">
            <PageBlock>
                <div className='page_block_header'>
                    <div className='header_item_left'>{t("myAlbums")}
                        <span className='header_item_count'>{photoStore?.albumsCount}</span>
                    </div>

                    <div className='header_item_right'>
                        <button className='btn_miyuli' onClick={() => setCreateAlbumModalIsOpen(true)}>{t("createAlbum")}</button>
                        <CreateAlbum communityId={(photoStore.author?.isCommunity && photoStore.author.id) || null} isOpen={createAlbumModalIsOpen} onClose={() => setCreateAlbumModalIsOpen(false)}></CreateAlbum>
                        <button onClick={() => { inputFile.current.click() }} className='btn_miyuli'>{t("addPhotos")}</button>
                        <input onChange={(e) => dispatch(uploadImages({ files: [...e.target.files], communityId: photoStore.author?.isCommunity ? photoStore.author.id : null }))} type='file' ref={inputFile} accept="image/jpeg,image/png,image/gif,image/heic,image/heif,image/webp" multiple style={{ display: 'none' }} />
                    </div>
                </div>
                {photoStore.albums.length > 0 &&
                    <>
                        <div className='albums_container'>
                            {photoStore.albums.map(x => <AlbumCard key={x.id} album={x}></AlbumCard>)}
                        </div>
                        <div className='pagination'>
                            {getAlbumPagination()}
                        </div>
                    </>
                }
            </PageBlock>


            <PageBlock>
                <div className='page_block_header'>
                    <div className='header_item_left'>{t("myPhotos")}
                        <span className='header_item_count'>{photoStore?.imagesCount}</span>
                    </div>
                    <div className='header_item_right'>
                    </div>
                </div>

                <InfiniteScroll
                    className='photos_container'
                    loadMore={() => !photoStore.errors.main && !photoStore.isFetching ? getMore() : null}
                    hasMore={photoStore.hasMore}
                    initialLoad={false}
                >
                    {photoStore.images?.map(x => <ImageCard key={x.id} className="photo_holder" image={x} />)}
                    {photoStore.isFetching && <div className='loader'></div>}
                    {!photoStore.hasMore && !photoStore.images.length && <div className="p-2 w-100 text-center">{t("noImages")}</div>}
                </InfiniteScroll>
            </PageBlock>
            {photoStore.errors.main && <PageBlock className='p-2 gap-2 d-flex flex-column align-items-center'>
                <div>{t(handleCommonErrorCases(photoStore.errors.main))}</div>
                <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorImages())}>{t('tryAgain')}</button></div>
            </PageBlock>}
        </main>
    );
}

export default Photos;
