
import Link from 'next/link';
import Avatar from './Avatar';

const CommunityCard = (props) => {
    const { community, size = 80 } = props;
    if (community)
        return (
            <Link href={`/community/${community.id}`} className={`row_card ${props.className || ""}`}>
                <Avatar className="avatar_element" crop={community.avatarCrop} size={size} avatar={community.avatar}> </Avatar>
                <div className='row_card_content'>
                    <div className='name' role="button">{community.name}</div>
                    <div className='status'>{community.status}</div>
                </div>
            </Link>
        );
}

export default CommunityCard;
