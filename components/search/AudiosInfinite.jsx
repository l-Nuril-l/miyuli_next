
import { searchAudios } from '@/lib/features/search';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import InfiniteScroll from 'react-infinite-scroller';
import AudioCard from '../AudioCard';

const AudiosInfinite = ({ text }) => {

    const searchStore = useAppSelector(s => s.search);
    const dispatch = useAppDispatch();
    return (
        <InfiniteScroll
            loadMore={() => !searchStore.errors.main && !searchStore.isFetching && dispatch(searchAudios({ text, page: searchStore.page }))}
            hasMore={searchStore.hasMore}
            loader={<div className="loader" key={0}>Loading ...</div>}>
            {searchStore.audios.map(x => <AudioCard search={text} key={x.id} audio={x}></AudioCard>)}
        </InfiniteScroll>
    );
}

export default AudiosInfinite;
