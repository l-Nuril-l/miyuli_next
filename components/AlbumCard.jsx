
import Link from 'next/link';
import './AlbumCard.scss';
import ImageCard from './ImageCard';

const AlbumCard = ({ album, onClick }) => {
    const x = album;
    return (

        <Link href={`/album/${-x.communityId || x.accountId}_${x.id}`} key={x.id} className="album_holder" onClick={(e) => onClick && onClick(e, x.id)}>
            {x.images?.length ?
                <ImageCard className='image' image={x.images[0]} off />
                :
                <img className='no_img_camera_icon' alt='NoImgCameraIcon' src='/images/icons/camera_big.png'></img>
            }
            <div className='album_info'>
                <div className='album_name'>{x.name}</div>
                <div className='album_count'>{x.imagesCount || 0}</div>
            </div>
        </Link>
    );
}

export default AlbumCard;
