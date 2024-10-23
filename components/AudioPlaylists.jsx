"use client";
import { useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import AudioPlaylistCard from './AudioPlaylistCard';
import PageBlock from './PageBlock';

const AudioPlaylistsContainer = () => {
    const audio = useAppSelector((s) => s.audio.page)
    const ref = useRef();
    const t = useTranslations()

    const scroll = (value) => {
        ref.current.scroll({
            left: ref.current.scrollLeft + value,
            behavior: 'smooth'
        })
    }

    const [scrollButtons, setScrollButtons] = useState({});

    useEffect(() => {
        setScrollButtons({ left: ref.current.scrollLeft !== 0, right: ref.current.scrollWidth - ref.current?.scrollLeft !== ref.current?.offsetWidth })
    }, [audio.playlists]);


    return (
        <PageBlock className="playlists_block">
            <h6 className='p-3'>{t("playlists")}</h6>
            <div className='playlists_wrap'>
                {scrollButtons.left && <button className='playlists_wrap__button button--left' onClick={() => scroll(-200)}><svg fill="none" height="16" viewBox="0 0 12 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m4.77 8 3.37 3.36a.9.9 0 1 1-1.28 1.28l-4-4a.9.9 0 0 1 0-1.28l4-4a.9.9 0 1 1 1.28 1.28z" fill="currentColor"></path></svg></button>}
                <div onScroll={() => { setScrollButtons({ left: ref.current.scrollLeft !== 0, right: ref.current.scrollWidth - ref.current?.scrollLeft !== ref.current?.offsetWidth }) }} ref={ref} className="page_block playlists_container">
                    {audio.playlists.map(x => <AudioPlaylistCard key={x.id} playlist={x}></AudioPlaylistCard>)}
                </div>
                {scrollButtons.right && <button className='playlists_wrap__button button--right' onClick={() => scroll(200)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 12 16"><path fill="currentColor" d="M7.23 8 3.86 4.64a.9.9 0 0 1 1.28-1.28l4 4a.9.9 0 0 1 0 1.28l-4 4a.9.9 0 0 1-1.28-1.28L7.23 8Z"></path></svg></button>}
            </div>
        </PageBlock>
    );
}

export default AudioPlaylistsContainer;
