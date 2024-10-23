import { setUserLocale } from '@/actions/locale';
import { useTransition } from 'react';
import { Dropdown } from 'react-bootstrap';
import GlobeSvg from '../../assets/GlobeSvg';
import { CustomToggle } from './Profile';

const ChangeLanguage = ({ toggle }) => {
    const [isPending, startTransition] = useTransition();
    function onChange(value) {
        const locale = value;
        startTransition(() => {
            setUserLocale(locale);
        });
    }
    return (
        <Dropdown onSelect={x => onChange(x)}>
            <Dropdown.Toggle as={toggle ?? CustomToggle()}>
                <div className="menu_item_icon">
                    <GlobeSvg />
                </div>
                {("language")}
            </Dropdown.Toggle>

            <Dropdown.Menu >
                <Dropdown.Item eventKey="en">Eng</Dropdown.Item>
                <Dropdown.Item eventKey="ru">Rus</Dropdown.Item>
                <Dropdown.Item eventKey="uk">Ukr</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ChangeLanguage;
