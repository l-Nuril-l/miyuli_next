import { useTranslations } from 'next-intl';
import Modal from './Modal';


const TemplateModal = (props) => {
    const t = useTranslations()
    const { isOpen, onClose } = props;
    const dispatch = useAppDispatch();

    const onAction = () => {
        dispatch();
        onClose();
    }

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t('template')}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className='modal-body modal_body'>

            </div>
            <div className='modal-footer modal_footer'>
                <div onClick={() => onClose()}>{t('cancel')}</div>
                <button onClick={() => onAction()} className='btn_miyuli'>{t('ok')}</button>
            </div>
        </div>
    </Modal>
}

export default TemplateModal;