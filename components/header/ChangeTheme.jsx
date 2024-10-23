
import { MIYULI_THEMES, change } from '@/lib/features/theme';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { Dropdown } from 'react-bootstrap';
import { CustomToggle } from './Profile';

const ChangeTheme = ({ toggle }) => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(s => s.theme)
    const t = useTranslations()

    return (
        <Dropdown onSelect={x => dispatch(change(x))}>
            <Dropdown.Toggle as={toggle ?? CustomToggle()} onMouseUp={() => { dispatch(change()) }}>
                <div className="menu_item_icon"><svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="M10.8 6.05a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM14.45 8.2a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM4.3 9.45a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM7.85 4.8a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"></path><path clipRule="evenodd" d="M14.18 14.04c2.14.23 4.32-.75 4.32-4.04A8.47 8.47 0 0010 1.5 8.47 8.47 0 001.5 10a8.47 8.47 0 008.5 8.5c1.13 0 2.25-1 1.98-2.43l-.17-.68c-.25-.94-.43-1.6 1.08-1.49l1.29.14zm.16-1.5l-.25-.02-1.1-.12a3.34 3.34 0 00-1.74.27 2 2 0 00-1.1 1.68 3.8 3.8 0 00.22 1.47l.14.54c.02.13 0 .22 0 .28a.44.44 0 01-.1.17.57.57 0 01-.41.19 6.97 6.97 0 01-7-7 6.97 6.97 0 017-7 6.97 6.97 0 017 7c0 1.3-.41 1.87-.77 2.15-.42.32-1.07.48-1.9.4z" fillRule="evenodd"></path></g></svg></div>
                {t("theme")}: {theme.theme}
            </Dropdown.Toggle>

            <Dropdown.Menu >
                {Object.values(MIYULI_THEMES).map(x =>
                    <Dropdown.Item key={x} eventKey={x}>{(x)}</Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ChangeTheme;
