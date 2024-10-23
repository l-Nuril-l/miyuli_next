"use client";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';


import VideoEdit from '@/components/VideoEdit';
import { disposeVideosEdit } from '@/lib/features/video';
import { useEffect } from 'react';


const VideosEdit = () => {
    const videoStore = useAppSelector(s => s.video)
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(disposeVideosEdit())
        };
    }, [dispatch]);

    return (
        <div className="video_edit_wrapper">
            {videoStore.videosEdit.map((video, i) => <VideoEdit videoIndex={i} key={video.id} />)}
        </div>
    );
}

export default VideosEdit;
