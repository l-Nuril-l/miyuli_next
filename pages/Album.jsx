"use client";
import ImageCard from '@/components/ImageCard';
import PageBlock from '@/components/PageBlock';
import { disposeAlbum, getAlbum, getAlbumImages, uploadImagesInAlbum } from '@/lib/features/photo';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import './Album.scss';

const Album = () => {

    const photoStore = useAppSelector(s => s.photo)
    const params = useParams()
    const id = params.id.replace(/^album/, '')
    const albumId = id.split("_")[1];
    const router = useRouter()
    const t = useTranslations()
    const promisesRef = useRef({});

    const getMore = () => {
        const args = {
            id: albumId,
            after: photoStore.album.images[photoStore.album.images.length - 1]?.id
        }
        promisesRef.current.images = dispatch(getAlbumImages(args))
    }

    const dispatch = useAppDispatch();
    useEffect(() => {
        var promises = promisesRef.current
        promisesRef.current.album = dispatch(getAlbum(albumId))
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposeAlbum())
        };
    }, [dispatch, id, albumId]);


    const inputFile = useRef(null)
    return (
        <main className='album'>
            {photoStore.album &&
                <PageBlock>
                    <div className='page_block_header'>
                        <div className='header_item_left'><span role="button" onClick={() => router.push(`/albums/${-photoStore.album.communityId || photoStore.album.accountId}`)}>{photoStore.album.account.name}</span> <span className='mx-1'>{photoStore.album.name}</span></div>
                        <div className='header_item_right'>
                            <button onClick={() => { inputFile.current.click() }} className='btn_miyuli'>{t("addPhotos")}</button>
                            <input onChange={(e) => dispatch(uploadImagesInAlbum({ files: [...e.target.files], albumId: photoStore.album.id }))} type='file' ref={inputFile} accept="image/jpeg,image/png,image/gif,image/heic,image/heif,image/webp" multiple style={{ display: 'none' }} />
                        </div>
                    </div>
                    <div className='text-center'>
                        <h6 className='mt-1'>{photoStore.album.name}</h6>
                        <div>{photoStore.album.description}</div>
                    </div>
                    <div className='photos_container'>
                        {photoStore.images?.map(x => <ImageCard key={x.id} image={x} />)}
                        {!photoStore.images && <div className="photos_no_content">{t("albumNoPhotos")}</div>}
                    </div>

                    <InfiniteScroll
                        className='photos_container'
                        loadMore={() => !photoStore.errors.main && !photoStore.isFetching ? getMore() : null}
                        hasMore={photoStore.hasMore}
                        initialLoad={true}
                        loader={<div key={0} className='loader'></div>}
                    >
                        {photoStore.album.images?.map(x => <ImageCard key={x.id} album={photoStore.album} className="photo_holder" image={x} />)}
                    </InfiniteScroll>
                </PageBlock>}
        </main>
    );
}

export default Album;
