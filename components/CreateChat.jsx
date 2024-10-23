"use client";
import { clearFriends, fetchFriends } from "@/lib/features/friends";
import { createChat } from "@/lib/features/messenger";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import CloseSvg from "../assets/CloseSvg";
import AccountItem from "./AccountItem";
import Avatar from "./Avatar";



const CreateChat = () => {
    const friendsStore = useAppSelector(s => s.friends)
    const t = useTranslations()
    const [search, setSearch] = useState("");
    const [name, setName] = useState("");
    const dispatch = useAppDispatch();
    const authStore = useAppSelector(s => s.auth.session)
    const promisesRef = useRef({});
    const router = useRouter()

    const getMore = () => {
        const args = {
            id: authStore.id,
            search,
            after: friendsStore.friends[friendsStore.friends.length - 1]?.id
        }

        promisesRef.current.friends = dispatch(fetchFriends(args))
    }

    useEffect(() => {
        var promises = promisesRef.current
        return () => {
            Object.values(promises).forEach(x => x.abort());
            dispatch(clearFriends())
        }
    }, [dispatch]);

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
        <form onSubmit={e => { e.preventDefault(); dispatch(createChat({ name, accounts })).unwrap().then(x => router.push(`?sel=c${x.id}`)) }} className="create_chat">
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
                    <AccountItem key={x.id} account={x} state={accounts.includes(x.id)} onCheck={checkHandler}></AccountItem>
                )}
                {friendsStore.isFetching && <div className='loader'></div>}
            </InfiniteScroll>

            <div className="create_chat_bottom">
                <Avatar size={50} crop={authStore.avatarCrop} avatar={authStore.avatar}></Avatar>
                <input className="input" minLength={1} value={name} onChange={e => setName(e.target.value)} placeholder={t('enterChatName')}></input>
                <button type="submit" disabled={accounts.length < 2} className="btn_miyuli">{t("create")}</button>
            </div>
        </form>
    );
}

export default CreateChat;
