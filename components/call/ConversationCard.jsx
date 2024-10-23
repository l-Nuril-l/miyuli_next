import Avatar from '../Avatar';
import './ConservationCard.scss';

const ConversationCard = ({ account, stream, muted, disabled, display, tag }) => {
    if ((display && !stream) || (display && disabled)) return null;
    return (
        <div className="conversation_card">
            {((stream && !disabled) || display) ?
                <video onClick={e => e.target.requestFullscreen()} className="conversation_video" key={stream.id} autoPlay playsInline ref={ref => {
                    if (ref) {
                        ref.srcObject = stream
                        if (muted) ref.volume = 0
                    }
                }}></video>
                :
                <Avatar avatar={account.avatar} crop={account.crop} className="conversation_avatar"></Avatar>
            }
            <div className="watermark">{account.name + ' ' + account.surname} </div>
        </div>
    );
}

export default ConversationCard;
