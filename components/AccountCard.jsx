
import Link from 'next/link';
import Avatar from './Avatar';

const AccountCard = (props) => {
    const { account, size = 50 } = props;
    if (account)
        return (
            <Link href={`/id/${account.id}`} className={`row_card ${props.className || ""}`}>
                <Avatar className="avatar_element" size={size} crop={account.avatarCrop} avatar={account.avatar}></Avatar>
                <div className='row_card_content'>
                    <div className='name' role="button">{account.name} {account.surname}</div>
                    <div className='status'>{account.status}</div>
                </div>
            </Link>
        );
}

export default AccountCard;
