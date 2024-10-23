"use client";
import FileCard from '@/components/FileCard';
import PageBlock from '@/components/PageBlock';
import UploadFile from '@/components/modals/upload/UploadFile';
import { clearErrorFiles, disposeFiles, getFiles } from '@/lib/features/file';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDebounce } from 'react-use';
import CloseSvg from '../assets/CloseSvg';
import './Files.scss';



const Files = () => {
    const fileStore = useAppSelector(s => s.file)
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );
    const [uploadModal, setUploadModal] = useState(false);
    const dispatch = useAppDispatch()
    const t = useTranslations()
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

    return (
        <main className='files'>
            <UploadFile onClose={() => setUploadModal(false)} isOpen={uploadModal}></UploadFile>

            <PageBlock>
                <div className='page_block_header'>
                    <div className='header_item_left'>{t("files")}</div>
                    <div className='header_item_right'>
                        <button className='btn_miyuli' onClick={() => setUploadModal(true)}>{t("uploadFile")}</button>
                    </div>
                </div>
                <div className="search_wrap">
                    <input className='input search_icon search_miyuli' type="text" value={search} placeholder={t("searchFiles")}
                        onChange={(e) => setSearch(e.target.value)} />
                    {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
                </div>

                <InfiniteScroll
                    className='items_container'
                    loadMore={() => !fileStore.errors.main && !fileStore.isFetching ? getMore() : null}
                    hasMore={fileStore.hasMore}
                >
                    {fileStore.files?.map(x => <FileCard key={x.id} file={x}></FileCard>)}
                    {fileStore.isFetching && <div className='loader'></div>}
                </InfiniteScroll>
                {!fileStore.hasMore && !fileStore.files.length && <div className="p-2 text-center">{t("noFiles")}</div>}
                {fileStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(fileStore.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorFiles())}>{t('tryAgain')}</button></div>
                </div>}
            </PageBlock>
        </main>
    );
}

export default Files;
