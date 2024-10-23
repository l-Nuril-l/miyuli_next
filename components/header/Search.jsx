"use client";
import { disposeShort, searchShort } from '@/lib/features/search';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useDebounce } from 'react-use';
import CloseSvg from '../../assets/CloseSvg';
import useClickOutside from "../../hooks/useClickOutside";
import AccountCard from '../AccountCard';
import AudioCard from '../AudioCard';
import CommunityCard from '../CommunityCard';
import './Search.scss';




export default function Search() {

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );
    const [open, setOpen] = useState(false);
    const t = useTranslations()
    const dropdown = useRef();
    const searchStore = useAppSelector(s => s.search.short)

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

    const clickOutside = useClickOutside(() => setOpen(false))
    const dispatch = useAppDispatch()


    const click = useCallback((e) => {
        if (dropdown.current?.contains(e.target))
            return
        setOpen(!open);
    }, [open])

    useEffect(() => {
        dispatch(debouncedSearch ? searchShort(debouncedSearch) : disposeShort());
    }, [debouncedSearch, dispatch]);

    return (
        <div className={isMobile ? 'top_btn' : ""} onClick={(e) => click(e)} ref={clickOutside}>
            {isMobile ?
                <svg fill="none" height="24" viewBox="0 0 20 20" width="24" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M9.5 4.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM3 9.5a6.5 6.5 0 1 1 11.6 4.04l3.18 3.18a.75.75 0 1 1-1.06 1.06l-3.18-3.18A6.5 6.5 0 0 1 3 9.5z" fill="currentColor" fillRule="evenodd"></path></svg>
                :
                <div className="search_wrap">
                    <input className='input top_search search_icon' type="text" value={search} placeholder={t("search")}
                        onChange={(e) => setSearch(e.target.value)} />
                    {search && <CloseSvg className='search_clear' onClick={() => setSearch("")} />}
                </div>
            }
            <div ref={dropdown} className={`top_dropdown search_dropdown ${open ? "show" : ""}`}>
                {isMobile && <input className='input top_search search_icon' type="text" value={search} placeholder={t("search")}
                    onChange={(e) => setSearch(e.target.value)} />}
                {searchStore && <div>
                    {searchStore.accounts.length > 0 && <div className='sub_head'>{t("peoples")}</div>}
                    {searchStore.accounts.map(x => <AccountCard key={x.id} size={50} account={x}></AccountCard>)}
                    {searchStore.communities.length > 0 && <div className='sub_head'>{t("communities")}</div>}
                    {searchStore.communities.map(x => <CommunityCard key={x.id} size={50} community={x}></CommunityCard>)}
                    {searchStore.audios.length > 0 && <div className='sub_head'>{t("music")}</div>}
                    {searchStore.audios.map(x => <AudioCard search={debouncedSearch} key={x.id} audio={x}></AudioCard>)}

                </div>}
                <Link href={`search?text=${search}`} className='search_all_results' onClick={() => setOpen(false)}>
                    <span className="search_all_text">{t(searchStore ? 'showAllResults' : 'toSearchPage')}</span>
                    <span><svg width="12" height="16" viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg"><g id="chevron_16__Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="chevron_16__chevron_16"><path id="chevron_16__Bounds" d="M0 0h12v16H0z"></path><path d="M7.23 8L3.86 4.64a.9.9 0 111.28-1.28l4 4a.9.9 0 010 1.28l-4 4a.9.9 0 11-1.28-1.28L7.23 8z" id="chevron_16__Mask" fill="currentColor" fillRule="nonzero"></path></g></g></svg></span>
                </Link>
            </div>
        </div>
    )
}
