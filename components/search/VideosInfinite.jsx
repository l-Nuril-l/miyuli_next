
import { searchVideos } from '@/lib/features/search';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import InfiniteScroll from 'react-infinite-scroller';
import VideoCard from '../VideoCard';

const VideosInfinite = ({ text }) => {

    const searchStore = useAppSelector(s => s.search);
    const dispatch = useAppDispatch();
    return (
        <InfiniteScroll
            loadMore={() => dispatch(searchVideos({ text, page: searchStore.page }))}
            hasMore={searchStore.hasMore}
            loader={<div className="loader" key={0}>Loading ...</div>}>
            <div className="videos_container">
                {searchStore.videos.length > 0 && <div className="videos_wrap">{searchStore.videos.map(x => <VideoCard off key={x.id} video={x}></VideoCard>)}</div>}
            </div>
        </InfiniteScroll>
    );
}

export default VideosInfinite;
