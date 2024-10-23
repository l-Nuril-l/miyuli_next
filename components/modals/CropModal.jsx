
import { updateAvatar } from '@/lib/features/auth';
import { cropCommunityAvatar, cropCommunityCover } from '@/lib/features/community';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import ImageCrop from './ImageCrop';
import Modal from './Modal';


const CropModal = (props) => {
    const t = useTranslations()
    const API_URL = useAppSelector((s) => s.miyuli.API_URL)
    const { onClose, onCrop, isOpen, communityId, imageId, initialCrop, cover } = props;
    const dispatch = useAppDispatch();

    const onCropAction = (crop) => {
        onCrop ? onCrop(crop) : dispatch(communityId > 0 ? cover ? cropCommunityCover({ crop, communityId }) : cropCommunityAvatar({ crop, communityId }) : updateAvatar({ crop }));
        onClose();
    }

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t('cropping')}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className='modal_body'>
                <ImageCrop initialCrop={initialCrop} onCrop={onCropAction} onBack={onClose}>
                    <img
                        className="modal_image_preview"
                        src={API_URL + "photo/" + imageId}
                        alt="CropImage"
                    />
                </ImageCrop>

            </div>
        </div>
    </Modal>
}

export default CropModal;