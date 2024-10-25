"use client";
import Audio from '@/components/header/Audio';
import Notifications from "@/components/header/Notifications";
import Profile from '@/components/header/Profile';
import Search from '@/components/header/Search';
import { useAppSelector } from '@/lib/hooks';
import classNames from "classnames";
import { hasCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import './Header.scss';
import Navigation from './header/Navigation';
const Header = (props) => {
    const { wide: isWide, navigation: nav, width } = props;

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    const t = useTranslations()
    const authStore = useAppSelector(s => s.auth)
    const audio = useAppSelector(s => s.audio.audio)
    const pathname = usePathname();
    const isVideo = pathname?.startsWith('/video');

    const getHeaderLogo = () => {
        if (isVideo)
            return <li className='header_nav_logo'>
                <Link href="/video" className='d-flex h_100 align-items-center'>
                    <img className='logo' src="/miyuli.purple-50.png" alt='logo' />
                    <h4 className='logo_text'>VIDEO</h4>
                </Link>
            </li>

        return <li className='header_nav_logo'>
            <Link href={hasCookie('auth') ? 'feed' : '/'} className='d-flex h_100 align-items-center'>
                <img className='logo' src="/miyuli.purple-50.png" alt='logo' />
                <h4 className='logo_text'>MIYULI</h4>
            </Link>
        </li>
    }

    return (
        <header className="App_header">
            <div className={classNames(width <= 0 && 'page_layout_fix w-100')} style={{ width, height: 'inherit' }}>
                <ul className={classNames('top_nav', isWide && "top_nav_wide")}>
                    {(nav || isVideo || isMobile) && <li className='header_navigation'>
                        <Navigation></Navigation>
                    </li>}
                    {getHeaderLogo()}
                    <li className='header_nav_search'>
                        <Search></Search>
                    </li>
                    {!authStore?.session && audio &&
                        <li className='header_nav_audio'>
                            <Audio></Audio>
                        </li>}
                    {authStore?.session ?
                        <>
                            <li className='header_nav_notify'>
                                <Notifications></Notifications>
                            </li>
                            <li className='header_nav_audio'>
                                <Audio></Audio>
                            </li>
                            <li>
                                <Profile></Profile>
                            </li>
                        </>
                        : <li className='auth_header'>
                            <Link href={'/login'} className='top_btn px-1'>{t("signIn")}</Link>
                            <Link href={'/register'} className='top_btn px-1' >{t("signUp")}</Link>
                        </li>}
                </ul>
            </div>
        </header>
    );
}

export default Header;
