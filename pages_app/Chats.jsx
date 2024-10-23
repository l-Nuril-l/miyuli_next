"use client";
import ChatCard from '@/components/ChatCard';
import CreateChat from '@/components/CreateChat';
import PageBlock from '@/components/PageBlock';
import { clearErrorChats, disposeChats, fetchChats } from '@/lib/features/messenger';
import { handleCommonErrorCases } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDebounce } from 'react-use';



const Chats = () => {
    const messengerStore = useAppSelector((s) => s.messenger)
    const authStore = useAppSelector((s) => s.auth.session);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );
    const t = useTranslations()
    const params = useParams();
    const communityId = params.id?.replace(/^gim/, '');
    const dispatch = useAppDispatch();

    const promisesRef = useRef({});
    const init = useRef(true)

    const getMore = () => {
        const args = {
            id: (communityId && -communityId) ?? authStore.id,
            search: debouncedSearch,
            after: messengerStore.chats[messengerStore.chats.length - 1]?.lastMessage.createdDate,
        }
        promisesRef.current.chats = dispatch(fetchChats(args))
    }

    useEffect(() => {
        if (init.current) {
            init.current = false;
            return
        }
        var promises = promisesRef.current
        dispatch(disposeChats())
        return () => {
            Object.values(promises).forEach(x => x.abort());
        }
    }, [dispatch, debouncedSearch, communityId]);

    const [isCreatingChat, setIsCreatingChat] = useState(false);

    return (
        <PageBlock>
            <div className='block_search_container'>
                <input className='input search_icon search_miyuli ' type="text" value={search} placeholder={t("search")}
                    onChange={(e) => setSearch(e.target.value)} />
                <button className='svg_btn' onClick={() => setIsCreatingChat(p => !p)}>
                    <svg fill="none" height="28" viewBox="0 0 28 28" width="28" xmlns="http://www.w3.org/2000/svg"><path d="M20 13a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4v-4a1 1 0 0 1 1-1zm-10 5a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm5-6a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm7-6a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z" fill="currentColor"></path></svg>
                </button>
            </div>
            {isCreatingChat ? <CreateChat></CreateChat> :
                <>
                    <InfiniteScroll
                        className='chats'
                        loadMore={() => !messengerStore.errors.main && !messengerStore.isFetching ? getMore() : null}
                        hasMore={messengerStore.hasMore}
                    >
                        {messengerStore.chats?.map(x =>
                            <ChatCard key={x.id} chat={x} communityId={communityId} />
                        )}
                        {messengerStore.isFetching && <div className='loader'></div>}
                    </InfiniteScroll>
                    {!messengerStore.hasMore && !messengerStore.chats.length && <div className="p-2 text-center">{t("noChats")}</div>}
                    {messengerStore.errors.main && <div className='p-2 gap-2 d-flex flex-column align-items-center'>
                        <div>{t(handleCommonErrorCases(messengerStore.errors.main))}</div>
                        <div><button className='btn_miyuli' onClick={() => dispatch(clearErrorChats())}>{t('tryAgain')}</button></div>
                    </div>}
                </>}
        </PageBlock>
    );
}

export default Chats;
