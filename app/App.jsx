"use client";
import ConditionalWrap from "@/components/ConditionalWrap";
import Header from '@/components/Header';
import NavigationButtons from '@/components/NavigationButtons';
import useWindowSize from '@/hooks/useWindowSize';
import { setIsDragging } from '@/lib/features/miyuli';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import StickyBox from 'react-sticky-box';

function App({ wide = false, disableAside = false, children }) {
  const theme = useAppSelector((s) => s.theme);
  const t = useTranslations();
  const authStore = useAppSelector(d => d.auth)
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mobile = useMediaQuery({ query: '(max-width: 768px)' })
  const size = useWindowSize()
  const fixSize = 12;
  const fixedSize = size[0] - fixSize;

  return (
    <div className={`App ${theme.theme}`} onDragOver={e => e.preventDefault()} onDrop={() => dispatch(setIsDragging(false))} onDragEnter={(e) => !e.currentTarget.contains(e.relatedTarget) && dispatch(setIsDragging(true))} onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget) && dispatch(setIsDragging(false))}>
      <Header width={fixedSize} wide={wide} navigation={disableAside}></Header>
      {/* style убирает подергивание сайта при появлении скрола */}
      <div style={{ width: mobile ? "100%" : fixedSize }} className={classNames('page_layout', wide && 'page_layout_wide', size[0] === 0 && 'page_layout_fix')}>
        <ConditionalWrap
          condition={!wide && !disableAside}
          wrap={(children) => {
            return <div className={`page_content${mobile || disableAside ? '' : " aside_grid"}`}>
              {children}
            </div>
          }}>
          <>
            {!disableAside && !mobile && <aside className='side_bar'>
              <StickyBox offsetTop={parseInt(process.env.NEXT_PUBLIC_HEADER_HEIGHT)} offsetBottom={typeof window !== 'undefined' && window.innerHeight}>
                <ul className='side_bar_ul'>
                  {!authStore?.session ?
                    <li>
                      <button className="btn_miyuli w-100 mb-1" onClick={() => router.push('/login')}><div className="btn_miyuli_in">{t('signIn')}</div></button>
                      <button className="btn_miyuli w-100 mb-1" onClick={() => router.push('/register')}><div className="btn_miyuli_in">{t('signUp')}</div></button>
                    </li>
                    : []}
                  <NavigationButtons></NavigationButtons>
                </ul>
              </StickyBox>
            </aside>}
            {children}
          </>
        </ConditionalWrap >
      </div>
    </div >
  );
}

export default App;
