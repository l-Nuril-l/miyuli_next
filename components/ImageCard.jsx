"use client";
import { photoFromAlbum } from '@/lib/features/photo';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import classNames from 'classnames';
import { useQueryState } from 'nuqs';


const ImageCard = (props) => {
    const { image, onClick, className, ref, crop, album, off } = props;
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const dispatch = useAppDispatch();
    const [searchParamZ, setSearchParamZ] = useQueryState('z')

    const openPhotoHandler = (e) => {
        album != undefined && dispatch(photoFromAlbum(album.id)) // for switch
        setSearchParamZ(`photo${album ? -album.communityId || album.accountId : e.communityId != null ? -e.communityId : e.accountId}_${image.id}`)
    }

    return (
        <div ref={ref} className={classNames('image_holder', className)} onClick={() => off ? {} : onClick ? onClick() : openPhotoHandler(image)}>
            <img className='w-100 h-100 image_holder_img' alt="ImageCard" src={API_URL + "photo/" + image.id + (crop ? ('?' + new URLSearchParams(crop).toString()) : '')} />
        </div>
    );
}

export default ImageCard;
