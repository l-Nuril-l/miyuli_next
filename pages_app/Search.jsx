"use client";
import AudioCard from '@/components/AudioCard';
import PageBlock from '@/components/PageBlock';
import VideoCard from '@/components/VideoCard';
import AccountRow from '@/components/search/AccountRow';
import AccountsInfinite from '@/components/search/AccountsInfinite';
import CommunitiesInfinite from '@/components/search/CommunitiesInfinite';
import CommunityRow from '@/components/search/CommunityRow';
import VideosInfinite from '@/components/search/VideosInfinite';
import { clearErrorSearch, disposeSearch, search as searchAction } from '@/lib/features/search';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import CloseSvg from '../assets/CloseSvg';
import './Search.scss';



const Search = () => {
    const [searchParamSection, setSearchParamSection] = useQueryState('section')
    const [searchParamText, setSearchParamText] = useQueryState('text')


    const [search, setSearch] = useState(searchParamText || "");
    const [debouncedSearch, setDebounced] = useState('');

    useDebounce(
        () => {
            setDebounced(search);
        },
        500,
        [search]
    );
    const searchStore = useAppSelector(s => s.search);
    const dispatch = useAppDispatch();
    const t = useTranslations()
    const promisesRef = useRef({});
    const section = searchParamSection;

    useEffect(() => {
        setSearch(searchParamText)
    }, [searchParamText, dispatch, section]);

    useEffect(() => {
        let promises = promisesRef.current;
        if (searchStore.errors.search) return;
        if (!section) promises.search = dispatch(searchAction(debouncedSearch))
        // var searchParams = new URLSearchParams(window.location.search);
        if (searchParamText !== debouncedSearch) {
            setSearchParamText(debouncedSearch);
            // var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            // history.pushState(null, '', newRelativePathQuery);
        }
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposeSearch())
        };
    }, [dispatch, debouncedSearch, section, searchStore.errors.search, searchParamText, setSearchParamText]);

    return (
        <div className="search_page">
            <PageBlock>
                <div className='page_block_header'>
                    <div className='header_item_left'>{section && <span onClick={() => { setSearchParamSection(null) }} role="button">{(t("back"))}</span>} <span>{(t("search"))}</span></div>
                </div>
                <div className="search_wrap">
                    <input className='input search_icon search_miyuli' type="text" value={search} placeholder={t("search")}
                        onChange={(e) => setSearch(e.target.value)} />
                    {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
                </div>

                {section === "people" && <AccountsInfinite text={debouncedSearch}></AccountsInfinite>}
                {section === "community" && <CommunitiesInfinite text={debouncedSearch}></CommunitiesInfinite>}
                {section === "audio" && <AccountsInfinite text={debouncedSearch}></AccountsInfinite>}
                {section === "video" && <VideosInfinite text={debouncedSearch}></VideosInfinite>}

                {!section && searchStore && <div className='sections'>
                    {searchStore.accounts.length > 0 && <div className='accounts_list'>
                        <hr />
                        <div className='page_block_sub_header'>
                            <div className="header_item_left">{t("peoples")}
                                <div className="label mx-2">{searchStore.accountsCount}</div>
                            </div>
                            <div role="button" onClick={() => { setSearchParamSection("people") }} className="header_item_right">{t("showAllResults") + ' >'}
                            </div>
                        </div>
                        {searchStore.accounts.map(x => <AccountRow key={x.id} account={x}></AccountRow>)}
                    </div>}
                    {searchStore.communities.length > 0 && <div className='communities_list'>
                        <hr />
                        <div className='page_block_sub_header'>
                            <div className="header_item_left">{t("communities")}
                                <div className="label mx-2">{searchStore.communitiesCount}</div>
                            </div>
                            <div role="button" onClick={() => { setSearchParamSection("community") }} className="header_item_right">{t("showAllResults") + ' >'}
                            </div>
                        </div>
                        {searchStore.communities.map(x => <CommunityRow key={x.id} size={50} community={x}></CommunityRow>)}
                    </div>}
                    {searchStore.audios.length > 0 && <div>
                        <hr />
                        <div className='page_block_sub_header'>
                            <div className="header_item_left">{t("music")}
                                <div className="label mx-2">{searchStore.audiosCount}</div>
                            </div>
                            <div role="button" onClick={() => { setSearchParamSection("audio") }} className="header_item_right">{t("showAllResults") + ' >'}
                            </div>
                        </div>
                        {searchStore.audios.map(x => <AudioCard search={debouncedSearch} key={x.id} audio={x}></AudioCard>)}
                    </div>}
                    {searchStore.videos.length > 0 && <div>
                        <hr />
                        <div className='page_block_sub_header'>
                            <div className="header_item_left">{t("video")}
                                <div className="label mx-2">{searchStore.videosCount}</div>
                            </div>
                            <div role="button" onClick={() => { setSearchParamSection("video") }} className="header_item_right">{t("showAllResults") + ' >'}
                            </div>
                        </div>
                        <div className="videos_container">
                            {searchStore.videos && <div className="videos_wrap">{searchStore.videos.map(x => <VideoCard off key={x.id} video={x}></VideoCard>)}</div>}
                        </div>
                    </div>}
                </div>}

                {searchStore.isFetching && <div className='loader'></div>}
                {searchStore.errors.search && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(searchStore.errors.search))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorSearch())}>{t('tryAgain')}</button></div>
                </div>}

            </PageBlock>
        </div>
    );
}

export default Search;
