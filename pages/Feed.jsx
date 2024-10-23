"use client";
import CreatePost from '@/components/CreatePost';
import PageBlock from '@/components/PageBlock';
import Post from '@/components/Post';
import { clearErrorPosts, disposePosts, fetchFeedPosts } from '@/lib/features/posts';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import './Feed.scss';



const Feed = () => {

    const dispatch = useAppDispatch();
    const postStore = useAppSelector((s) => s.posts)

    const categories = useAppSelector((s) => s.filters.categories)
    const [categoryId, setCategoryId] = useState(1);
    const t = useTranslations()


    const promisesRef = useRef({});
    useEffect(() => {
        var promises = promisesRef.current
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(disposePosts());
        }
    }, [dispatch, categoryId]);

    const morePosts = () => {
        promisesRef.current.posts = dispatch(fetchFeedPosts({ categoryId, id: postStore.posts[postStore.posts.length - 1]?.id }))
    }

    return (
        <main className='feed_main'>
            <CreatePost></CreatePost>
            <PageBlock className='d-flex justify-content-between p-2'>
                <div>{t("filtration")}:</div>
                <select className='select_miyuli' value={categoryId} onChange={x => setCategoryId(x.target.value)}>
                    {categories.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
            </PageBlock>
            <InfiniteScroll
                loadMore={() => !postStore.errors.main && !postStore.isFetching ? morePosts() : null}
                hasMore={postStore.hasMore}
            >
                {postStore.posts?.map(x =>
                    <Post key={x.id} post={x}></Post>
                )}
                {postStore.isFetching && <div className='loader'></div>}
            </InfiniteScroll>
            {!postStore.hasMore && !postStore.posts.length && <PageBlock className="p-2 text-center">{t("noFeed")}</PageBlock>}
            {postStore.errors.main && <PageBlock className='p-2 gap-2 d-flex flex-column align-items-center'>
                <div>{t(handleCommonErrorCases(postStore.errors.main))}</div>
                <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorPosts())}>{t('tryAgain')}</button></div>
            </PageBlock>}
        </main>
    );
}

export default Feed;
