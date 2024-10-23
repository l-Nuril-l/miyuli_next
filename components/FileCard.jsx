"use client";
import { deleteFile, downloadFile } from '@/lib/features/file';
import { beautifyDate, bytesToSize } from '@/lib/functions';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import CloseSvg from '../assets/CloseSvg';
import EditSvg from '../assets/EditSvg';
import "./FileCard.scss";
import FileModal from './modals/FileModal';

const FileCard = ({ file, off }) => {
    const dispatch = useAppDispatch()
    const [editModal, setEditModal] = useState(false);
    const t = useTranslations();

    return (
        <div className='file_row'>
            <div className='file_item_icon file_icon' onClick={() => dispatch(downloadFile({ id: file.id, name: file.name }))}></div>
            <div className='file_card_content'>
                <div className='file_name' role="button" onClick={() => dispatch(downloadFile({ id: file.id, name: file.name }))}>{file.name}</div>
                <div className='file_info'>{bytesToSize(file.size)}, {beautifyDate(file.creationTime, t)}</div>
            </div>
            {!off && <div className='file_card_actions'>
                <div className="card_action" onClick={() => { setEditModal(true) }}><EditSvg /></div>
                <div className="card_action" onClick={() => { dispatch(deleteFile(file.id)) }}><CloseSvg width={16} height={16} /></div>
            </div>}
            {editModal && <FileModal file={file} onClose={() => setEditModal(false)}></FileModal>}
        </div>
    );
}

export default FileCard;
