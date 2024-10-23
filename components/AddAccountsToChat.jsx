"use client";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

import { clearErrorFriends, clearFriends, getFriendsForChat } from '@/lib/features/friends';
import { addAccountsToChat } from '@/lib/features/messenger';
import { handleCommonErrorCases } from '@/lib/functions';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDebounce } from 'react-use';
import CloseSvg from '../assets/CloseSvg';
import AccountItem from './AccountItem';
import PageBlock from './PageBlock';

const AddAccountsToChat = ({ onBack }) => {
    const dispatch = useAppDispatch();
    const friendsStore = useAppSelector(s => s.friends);
    const chatStore = useAppSelector(s => s.messenger.chat);
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
    const promisesRef = useRef({});

    const getMore = () => {
        const args = {
            id: chatStore?.id,
            search: debouncedSearch,
            after: friendsStore.friends[friendsStore.friends.length - 1]?.id
        }
        promisesRef.current.main = dispatch(getFriendsForChat(args))
    }

    useEffect(() => {
        var promises = promisesRef.current
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(clearFriends())
        };
    }, [dispatch, debouncedSearch, chatStore?.id]);

    const [accounts, setAccounts] = useState([]);
    const checkHandler = useCallback((accId, state) => {
        var index = accounts.indexOf(accId);
        if (state) {
            if (index === -1) {
                setAccounts([...accounts, accId])
            }
        }
        else {
            if (index !== -1) {
                setAccounts(accounts.filter(x => x !== accId))
            }
        }
    }, [accounts])

    return (
        <PageBlock className='add_accounts'>
            <ul className='page_block_header'>
                <div className='header_item_left'>{t("selectPeople")}</div>
                <div role='button' className='header_item_right' onClick={onBack}>
                    <CloseSvg height={24} width={24} />
                </div>
            </ul>
            <div className="search_wrap">
                <input className='input search_icon search_miyuli ' type="text" value={search} placeholder={t("searchFriends")}
                    onChange={(e) => setSearch(e.target.value)} />
                {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
            </div>

            <InfiniteScroll
                className='list_items_container'
                loadMore={() => !friendsStore.errors.main && !friendsStore.isFetching ? getMore() : null}
                hasMore={friendsStore.hasMore}
            >
                {friendsStore.friends.map(x =>
                    <AccountItem key={x.id} disabled={x.isInChat} state={x.isInChat || accounts.includes(x.id)} onCheck={checkHandler} account={x}></AccountItem>
                )}
                {friendsStore.isFetching && <div className='loader'></div>}
            </InfiniteScroll>
            {!friendsStore.hasMore && !friendsStore.friends.length && <div className="p-2 text-center">{t("noFriends")}</div>}
            {friendsStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                <div>{t(handleCommonErrorCases(friendsStore.errors.main))}</div>
                <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorFriends())}>{t('tryAgain')}</button></div>
            </div>}
            <div className='page_block_footer'>
                <div className="footer_left"></div>
                <div className="footer_right">
                    <button className='btn_miyuli' onClick={() => { dispatch(addAccountsToChat({ id: chatStore?.id, values: accounts })).unwrap().then(onBack) }}>{t("addMembers")}</button>
                </div>
            </div>
        </PageBlock>
    );
}

export default AddAccountsToChat;
