import classNames from "classnames";

const PageBlock = (props) => {
    return (
        <div {...props} className={classNames('page_block', props.className)}>
            {props.children}
        </div>
    );
}

export default PageBlock;
