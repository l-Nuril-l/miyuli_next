import "./MessageCard.scss";

const MessageSystem = ({ message }) => {
    const x = (message.community !== null) ? message.community : message.account
    return (
        <div key={x.id} className='message label text-center'>
            <div className='message_content'>
                <div className='text-break'>{message.text}</div>
            </div>
        </div>
    );
}

export default MessageSystem;
