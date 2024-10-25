import classNames from "classnames";
import Avatar from "./Avatar";

const AccountItem = ({ account, onCheck, state, disabled }) => {
    return (
        <a href={'/' + (account.login ?? 'id' + account.id)} className="list_item_wrap" onClick={(e) => { e.preventDefault(); onCheck(account.id, !state) }}>
            <div className="list_item">
                <div className="d-flex">
                    <div className="list_item_photo"><Avatar size={32} crop={account.avatarCrop} avatar={account.avatar}></Avatar></div>
                    <div className="list_item_name">{account.name + ' ' + account.surname}</div>
                </div>
                <div className={classNames("list_checkbox", state === true && "list_checkbox_on", disabled && "disabled")}></div>
            </div>
        </a>
    );
}

export default AccountItem;
