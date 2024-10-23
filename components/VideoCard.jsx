"use client";
import { deleteVideo, getForEdit } from '@/lib/features/video';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import classNames from 'classnames';
import { useLocale } from 'next-intl';
import { useQueryState } from 'nuqs';
import CloseSvg from '../assets/CloseSvg';
import EditSvg from '../assets/EditSvg';
import useAdminPermissionsCheck from '../hooks/useAdminPermissionsCheck';
import ImageCard from './ImageCard';
import './VideoCard.scss';

const VideoCard = ({ video, className, onClick, off }) => {
    const [searchParamZ, setSearchParamZ] = useQueryState('z')
    const [searchParamSection, setSearchParamSection] = useQueryState('section')

    const date = new Date(video.created);
    const dispatch = useAppDispatch();
    const authStore = useAppSelector(s => s.auth)
    const { isAdmin } = useAdminPermissionsCheck();
    const locale = useLocale();

    const open = () => {
        setSearchParamZ(`video${video.uploadedBy.isCommunity ? '-' : ''}${video.uploadedBy.id}_${video.id}`)
    }

    const editVideo = (e) => {
        e.stopPropagation()
        dispatch(getForEdit(video.id))
        setSearchParamSection("upload")
    }

    const clickX = (e) => {
        e.stopPropagation()
        dispatch(deleteVideo(video.id))
    }

    return (

        <div className={classNames('video_card', className)} onClick={() => onClick ? onClick() : open()}>
            <div className="video_card_thumbnail">
                <ImageCard className='video_card_thumb_image' image={video.thumbnail}></ImageCard>
                {!off && authStore.session && <div className='video_thumb_actions'>
                    {video.uploadedBy?.id === authStore.session.id &&
                        <div className="video_card_action_icon" onClick={(e) => editVideo(e)}><EditSvg /></div>}
                    {(video.uploadedBy?.id === authStore.session.id || video.isAdded || isAdmin) && <div className={classNames("video_card_action_icon", (isAdmin && !(video.uploadedBy?.id === authStore.session.id || video.isAdded)) && "admin_access")} onClick={(e) => clickX(e)}><CloseSvg width={16} height={16} /></div>}
                </div>}
                <div className="play_button"></div>
                <div className="video_time">
                    {video.duration}
                </div>
            </div>
            <div className="video_info">
                <div className="video_card_title">{video.title}</div>
                <div className="label">{date.getDate()} {date.toLocaleDateString(locale, { month: 'short' })} {date.getFullYear()} в {date.getHours()}:{String(date.getMinutes()).padStart(2, '0')}</div>
            </div>
        </div>
    );
}

export default VideoCard;
