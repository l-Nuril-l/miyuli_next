
import { searchCommunities } from '@/lib/features/search';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import InfiniteScroll from 'react-infinite-scroller';
import CommunityRow from '../CommunityRow';

const CommunitiesInfinite = ({ text }) => {

    const searchStore = useAppSelector(s => s.search);
    const dispatch = useAppDispatch();
    return (
        <>
            <InfiniteScroll
                loadMore={() => !searchStore.errors.main && !searchStore.isFetching && dispatch(searchCommunities({ text, page: searchStore.page }))}
                hasMore={searchStore.hasMore}
            >
                {searchStore.communities.map(x => <CommunityRow key={x.id} community={x}></CommunityRow>)}
            </InfiniteScroll>
        </>

    );
}

export default CommunitiesInfinite;
