"use client";
import { clearErrorFiles, disposeFiles, getFiles } from '@/lib/features/file';
import { handleCommonErrorCases } from "@/lib/functions";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from "react-infinite-scroller";
import { useDebounce } from 'react-use';
import CloseSvg from "../../../assets/CloseSvg";
import FileCard from '../../FileCard';
import Modal from "../Modal";
import UploadFile from '../upload/UploadFile';
import "./AttachFileModal.scss";



const AttachFileModal = ({ onFileSelected, onClose }) => {

    const dispatch = useAppDispatch()

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );
    const t = useTranslations();
    const fileStore = useAppSelector(s => s.file)

    const promisesRef = useRef({});

    const getMore = () => {
        const args = {
            search,
            after: fileStore.files[fileStore.files.length - 1]?.id
        }

        promisesRef.current.files = dispatch(getFiles(args))
    }

    useEffect(() => {
        var promises = promisesRef.current
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposeFiles());
        }
    }, [dispatch, debouncedSearch]);

    const [uploadModal, setUploadModal] = useState(false);

    return <Modal onClose={onClose}>
        <UploadFile onClose={() => setUploadModal(false)} isOpen={uploadModal}></UploadFile>
        <div className='modal_miyuli'>
            <div className='modal-header modal_header'>
                <div>{t("attachingFile")}</div>
                <div role="button" onClick={() => onClose()}>╳</div>
            </div>
            <div role="button" className='upload_file_area' onClick={() => setUploadModal(true)}>
                + {t("uploadFile")}
            </div>
            <div className="search_wrap">
                <input className='input search_icon search_miyuli ' type="text" value={search} placeholder={t("searchFiles")}
                    onChange={(e) => setSearch(e.target.value)} />
                {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
            </div>

            <div className="infinite_scroll_container">
                <InfiniteScroll
                    className='files_container'
                    loadMore={() => !fileStore.errors.main && !fileStore.isFetching ? getMore() : null}
                    hasMore={fileStore.hasMore}
                    initialLoad={true}
                    useWindow={false}
                >
                    {fileStore.files?.map(x => <div key={x.id} onClick={() => onFileSelected(x)} className="attach_file_container">
                        <FileCard off file={x}></FileCard>
                        <div className='attach_text'>{t("attach")}</div>
                        {fileStore.isFetching && <div className='loader'></div>}
                    </div>)}
                    {!fileStore.hasMore && !fileStore.files.length && <div className="files_no_content">{t("noFiles")}</div>}
                    {fileStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                        <div>{t(handleCommonErrorCases(fileStore.errors.main))}</div>
                        <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorFiles())}>{t('tryAgain')}</button></div>
                    </div>}
                </InfiniteScroll>
            </div>
        </div>
    </Modal>;
}

export default AttachFileModal;
