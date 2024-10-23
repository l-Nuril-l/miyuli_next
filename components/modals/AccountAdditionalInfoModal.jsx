import { useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import ProfileInfoStat from '../ProfileInfoStat';
import Modal from './Modal';

const AccountAdditionalInfoModal = (props) => {
    const t = useTranslations()
    const { isOpen, onClose } = props;
    const accountStore = useAppSelector(s => s.account.account)

    return <Modal isOpen={isOpen} onClose={onClose}>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t('additionalInfo')}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div className='modal-body modal_body'>
                <div className='profile_info'>
                    <div className="block_name">{t('statistics')}</div>
                    <ProfileInfoStat account={accountStore} />
                    <div className="block_name">{t("personalInformation")}</div>
                    <div className="profile_info_row">
                        <div className='label'>{t("login")}:</div>
                        <div className='text'>{accountStore.login}</div>
                    </div>
                    <div className="profile_info_row">
                        <div className='label'>{t("dateOfBirth")}:</div>
                        <div className='text'>{new Date(accountStore.dateOfBirth).toLocaleDateString()}</div>
                    </div>
                    {accountStore.bio && <div className="profile_info_row">
                        <div className='label'>{t("bio")}:</div>
                        <div className='text'>{accountStore.bio}</div>
                    </div>}
                    {accountStore.sex && <div className="profile_info_row">
                        <div className='label'>{t("sex")}:</div>
                        <div className='text'>{t(accountStore.sex ? "male" : "female")}</div>
                    </div>}
                    {accountStore.country && <div className="profile_info_row">
                        <div className='label'>{t("country")}:</div>
                        <div className='text'>{accountStore.country}</div>
                    </div>}
                    {accountStore.address && <div className="profile_info_row">
                        <div className='label'>{t("address")}:</div>
                        <div className='text'>{accountStore.address}</div>
                    </div>}
                </div>
            </div>
        </div>
    </Modal>
}

export default AccountAdditionalInfoModal;