
import { searchAccounts } from '@/lib/features/search';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import InfiniteScroll from 'react-infinite-scroller';
import AccountRow from './AccountRow';

const AccountsInfinite = ({ text }) => {

    const searchStore = useAppSelector(s => s.search);
    const dispatch = useAppDispatch();
    return (
        <>
            <InfiniteScroll
                loadMore={() => !searchStore.errors.main && !searchStore.isFetching && dispatch(searchAccounts({ text, page: searchStore.page }))}
                hasMore={searchStore.hasMore}
            >
                {searchStore.accounts.map(x => <AccountRow key={x.id} account={x}></AccountRow>)}
            </InfiniteScroll>
        </>

    );
}

export default AccountsInfinite;
