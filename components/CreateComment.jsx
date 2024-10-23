"use client";
import { isEmptyOrSpaces } from '@/lib/functions';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Avatar from './Avatar';
import './CreateComment.scss';
import EmojiPicker from './EmojiPicker';




const CreateComment = (props) => {
    const { createComment, data } = props
    const authStore = useAppSelector((s) => s.auth.account)

    const t = useTranslations()
    const dispatch = useAppDispatch();

    const [value, setValue] = useState("");

    const createCommentAndClear = () => {
        if (isEmptyOrSpaces(value)) return;
        dispatch(createComment({ text: value, ...data }));
        setValue('')
    }

    return (
        <div className="page_block mb-0">
            {authStore ? <div className='make_post'>
                <Avatar crop={authStore?.avatarCrop} avatar={authStore?.avatar}> </Avatar>
                <TextareaAutosize placeholder={t("writeComment")} required value={value} onChange={x => setValue(x.target.value)} className='post_input' />
                <div className='emoji_icons'>
                    <EmojiPicker value={value} onChange={setValue} />
                    <div onClick={() => createCommentAndClear()} className='send_msg_btn'><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="send_24__Page-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="send_24__send_24"><path id="send_24__Rectangle-76" d="M0 0h24v24H0z"></path><path d="M5.74 15.75a39.14 39.14 0 00-1.3 3.91c-.55 2.37-.95 2.9 1.11 1.78 2.07-1.13 12.05-6.69 14.28-7.92 2.9-1.61 2.94-1.49-.16-3.2C17.31 9.02 7.44 3.6 5.55 2.54c-1.89-1.07-1.66-.6-1.1 1.77.17.76.61 2.08 1.3 3.94a4 4 0 003 2.54l5.76 1.11a.1.1 0 010 .2L8.73 13.2a4 4 0 00-3 2.54z" id="send_24__Mask" fill="currentColor"></path></g></g></svg></div>
                </div>
            </div> :
                <div className='text-center p-2'>{'🔒 ' + t("commentAuthRequired")}</div>}
        </div>

    );
}

export default CreateComment;
