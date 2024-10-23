"use client";
import CommunityRow from '@/components/CommunityRow';
import PageBlock from '@/components/PageBlock';
import CreateCommunity from '@/components/modals/CreateCommunity';
import CommunitiesInfinite from '@/components/search/CommunitiesInfinite';
import { clearErrorCommunities, disposeCommunities, getCommunities, getCommunitiesAdmin } from '@/lib/features/community';
import { disposeSearch } from '@/lib/features/search';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDebounce } from 'react-use';
import CloseSvg from '../assets/CloseSvg';
import './Communities.scss';



const Communities = () => {
    const dispatch = useAppDispatch();
    const authStore = useAppSelector(s => s.auth.session)
    const searchParams = useSearchParams();
    const [searchParamTab, setSearchParamTab] = useQueryState('tab')
    const target = searchParams.id || authStore.id;
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );
    const communityStore = useAppSelector(s => s.community)
    const t = useTranslations()
    const promisesRef = useRef({});

    const getMore = () => {
        const args = {
            id: target,
            search: debouncedSearch,
            after: communityStore.communities[communityStore.communities.length - 1]?.id
        }

        switch (searchParamTab) {
            case "admin":
                promisesRef.current.communities = dispatch(getCommunitiesAdmin(args))
                break;
            default:
                promisesRef.current.communities = dispatch(getCommunities(args))
                break;
        }
    }

    useEffect(() => {
        var promises = promisesRef.current
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposeCommunities())
            dispatch(disposeSearch())
        }
    }, [searchParams, dispatch, authStore.id, target, searchParamTab, search]);

    const sections = [null, 'admin']
    const names = ['communities', 'control']
    const [creatingCommunity, setCreatingCommunity] = useState(false);

    return (
        <main className='communities_main'>
            <PageBlock>
                <ul className='page_block_header'>
                    {sections.map((x, i) => {
                        if (x === 'admin' && target !== authStore.id) return <></>;
                        return <li key={i} className={"header_item" + (searchParamTab === x || ((searchParamTab === null || !sections.includes(searchParamTab)) && x === null) ? " active" : "")} onClick={() => { if (!x) setSearchParamTab(null); else setSearchParamTab(x) }}>
                            <div >{t(names[i])}</div>
                        </li>
                    })}
                    <div className="header_item_right">
                        <div className="btn_miyuli" onClick={() => setCreatingCommunity(true)}>{t("createCommunity")}</div>
                        <CreateCommunity isOpen={creatingCommunity} onClose={() => setCreatingCommunity(false)}></CreateCommunity>
                    </div>
                </ul>
                <div className="search_wrap">
                    <input className='input search_icon search_miyuli ' type="text" value={search} placeholder={t("searchCommunities")}
                        onChange={(e) => setSearch(e.target.value)} />
                    {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
                </div>

                <InfiniteScroll
                    className='communities_list'
                    loadMore={() => !communityStore.errors.main && !communityStore.isFetching ? getMore() : null}
                    hasMore={communityStore.hasMore}
                >
                    {communityStore.communities.map(x =>
                        <CommunityRow key={x.id} community={x} tab={searchParamTab}></CommunityRow>
                    )}
                    {communityStore.isFetching && <div className='loader'></div>}
                </InfiniteScroll>
                {!communityStore.hasMore && !communityStore.communities.length && <div className="p-2 text-center">{t("noCommunities")}</div>}
                {communityStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(communityStore.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorCommunities())}>{t('tryAgain')}</button></div>
                </div>}
            </PageBlock>

            {!communityStore.hasMore && <PageBlock>
                <div className='page_block_header'><div className='header_item_left'>{t("globalSearch")}</div></div>
                <CommunitiesInfinite text={search}></CommunitiesInfinite>
            </PageBlock>}
        </main>
    );
}

export default Communities;
