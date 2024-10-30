"use client";

import AudioPlaylistModal from '@/components/modals/AudioPlaylistModal';
import FormAudioPlaylist from '@/components/modals/FormAudioPlaylist';
import PhotoModal from '@/components/modals/PhotoModal';
import VideoModal from '@/components/modals/VideoModal';
import { useAppSelector } from '@/lib/hooks';
import { useQueryState } from 'nuqs';
import "./ModalDefault.scss";

const ModalService = () => {
    const [searchParamZ, setSearchParamZ] = useQueryState('z')
    const showFormPlaylistModal = useAppSelector(x => x.audio.showFormPlaylistModal)
    const forceVideoModal = useAppSelector(x => x.video.forceVideoModal)

    var modalName = searchParamZ?.match(/^[a-z_]+/i);
    const getModal = () => {
        if (forceVideoModal) return <VideoModal></VideoModal>
        if (!modalName) return;
        switch (modalName[0]) {
            case "photo": {
                return <PhotoModal></PhotoModal>
            }
            case "video": {
                return <VideoModal></VideoModal>
            }
            case "audio_playlist": {
                return <AudioPlaylistModal></AudioPlaylistModal>
            }
        }
    }

    return (
        <>
            {getModal()}
            {Number.isInteger(showFormPlaylistModal) && <FormAudioPlaylist isOpen={true} />}
        </>
    );
}

export default ModalService;
