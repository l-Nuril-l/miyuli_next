"use client";
import PageBlock from '@/components/PageBlock';
import AccountRow from '@/components/search/AccountRow';
import AccountsInfinite from '@/components/search/AccountsInfinite';
import { clearErrorFriends, clearFriends, fetchFriendInRequests, fetchFriendOutRequests, fetchFriends } from '@/lib/features/friends';
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
import './Friends.scss';



const Friends = () => {

    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const [searchParamSection, setSearchParamSection] = useQueryState('section')
    const friendsStore = useAppSelector(s => s.friends)
    const authStore = useAppSelector(s => s.auth.session)
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );
    const target = searchParams.id || authStore.id;
    const section = searchParamSection;
    const t = useTranslations()
    const promisesRef = useRef({});

    const getMore = () => {
        const args = {
            id: target,
            search: debouncedSearch,
            after: friendsStore.friends[friendsStore.friends.length - 1]?.id
        }

        switch (section) {
            case "all_requests":
                promisesRef.current.friends = dispatch(fetchFriendInRequests(args))
                break;
            case "out_requests":
                promisesRef.current.friends = dispatch(fetchFriendOutRequests(args))
                break;
            default:
                promisesRef.current.friends = dispatch(fetchFriends(args))
                break;
        }
    }

    useEffect(() => {
        var promises = promisesRef.current
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(clearFriends())
            dispatch(disposeSearch())
        }
    }, [searchParams, dispatch, authStore.id, target, search]);

    const sections = ['all', 'all_requests', 'out_requests']
    const names = ['friends', 'incoming', 'outgoing']

    return (
        <main className='friends_main'>
            <PageBlock>
                <ul className='page_block_header'>
                    {sections.map((x, i) => {
                        if (x === 'out_requests' && target !== authStore.id) return <></>;
                        return <li key={i} className={`header_item${(section === x || ((section === null || !sections.includes(section)) && x === 'all') ? " active" : "")}`} onClick={() => { setSearchParamSection(x); }}>
                            <div >{t(names[i])}</div>
                        </li>
                    })}
                </ul>
                <div className="search_wrap">
                    <input className='input search_icon search_miyuli ' type="text" value={search} placeholder={t("searchFriends")}
                        onChange={(e) => setSearch(e.target.value)} />
                    {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
                </div>

                <InfiniteScroll
                    className='friends_list'
                    loadMore={() => !friendsStore.errors.main && !friendsStore.isFetching ? getMore() : null}
                    hasMore={friendsStore.hasMore}
                >
                    {friendsStore.friends.map(x =>
                        <AccountRow key={x.id} account={x} minimize={section == 'all'}></AccountRow>
                    )}
                    {friendsStore.isFetching && <div className='loader'></div>}
                </InfiniteScroll>
                {!friendsStore.hasMore && !friendsStore.friends.length && <div className="p-2 text-center">{t("noFriends")}</div>}
                {friendsStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                    <div>{t(handleCommonErrorCases(friendsStore.errors.main))}</div>
                    <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorFriends())}>{t('tryAgain')}</button></div>
                </div>}
            </PageBlock>

            {!friendsStore.hasMore && <PageBlock>
                <div className='page_block_header'><div className='header_item_left'>{t("globalSearch")}</div></div>
                <AccountsInfinite text={search}></AccountsInfinite>
            </PageBlock>}
        </main>
    );
}

export default Friends;
