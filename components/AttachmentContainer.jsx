import CloseSvg from "../assets/CloseSvg";


const AttachmentContainer = ({ onDetach, children }) => {
    return (
        <div className="attachment_container">
            {children}
            <div className='detach' onClick={() => onDetach()}><CloseSvg width={12} height={12} /></div>
        </div>);
}

export default AttachmentContainer;
