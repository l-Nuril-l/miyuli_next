"use client";
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import DropDownArrowSvg from '../assets/DropDownArrowSvg';
import './ScrollToTop.scss';

const ScrollToTop = () => {
    const t = useTranslations()
    const pathname = usePathname()
    const isVideo = pathname?.startsWith('/video');
    const [oldScroll, setOldScroll] = useState(0);
    const [isZoneSST, setIsZoneSST] = useState(false);

    // console.log(oldScroll, isZoneSST)
    useEffect(() => {
        const handleScroll = (e) => {
            const isZoneSST = window.scrollY > 300;
            setIsZoneSST(isZoneSST);
            if (isZoneSST) setOldScroll(0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={classNames("stt", ((isZoneSST || (oldScroll !== 0)) && !isVideo) && "stt_active")} onClick={() => { setOldScroll(window.scrollY); window.scrollTo({ top: isZoneSST ? 0 : oldScroll }) }}>
            <div className="bg">
                <div className="stt_content">
                    <DropDownArrowSvg transform={`rotate(${180 * isZoneSST})`} width={18} height={12} />
                    {isZoneSST && <span className="text leading-4">{t("goUp")}</span>}
                </div>
            </div>
        </div >

    );
}

export default ScrollToTop;
