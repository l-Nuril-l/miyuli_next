"use client";
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import DropDownArrowSvg from '../assets/DropDownArrowSvg';
import './ScrollToTop.scss';

const ScrollToTop = () => {
    const t = useTranslations()
    const [active, setActive] = useState(false);
    const pathname = usePathname()
    const isVideo = pathname?.startsWith('/video');
    const [oldScroll, setOldScroll] = useState(0);
    const [isZoneSST, setIsZoneSST] = useState(false);

    useEffect(() => {
        setIsZoneSST(window.scrollY > 300)
    }, [])

    // console.log(oldScroll, isZoneSST)
    useEffect(() => {
        const handleScroll = (e) => {
            const isZoneSST = window.scrollY > 300;
            setActive(isZoneSST || (oldScroll !== 0));
            if (isZoneSST && (oldScroll !== 0)) setOldScroll(0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [oldScroll]);

    return (
        <div className={classNames("stt", (active && !isVideo) && "stt_active")} onClick={() => { setOldScroll(window.scrollY); window.scrollTo({ top: isZoneSST ? 0 : oldScroll }) }}>
            <div className="bg">
                <div className="stt_content">
                    <DropDownArrowSvg transform={`rotate(${180 * isZoneSST})`} width={18} height={12} />
                    {isZoneSST && <span className="text">{t("goUp")}</span>}
                </div>
            </div>
        </div >

    );
}

export default ScrollToTop;
