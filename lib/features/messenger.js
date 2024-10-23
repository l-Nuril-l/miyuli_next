import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendMessage = createAsyncThunk(
    'messenger/sendMessage',
    function (data, { rejectWithValue }) {
        return axios.post(`message`, data)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const editMessage = createAsyncThunk(
    'messenger/editMessage',
    function (data, { rejectWithValue, dispatch }) {
        return axios.patch(`message`, data)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const deleteMessage = createAsyncThunk(
    'messenger/deleteMessage',
    function (data, { rejectWithValue }) {
        return axios.delete(`message/${data}`)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const fetchChats = createAsyncThunk(
    'messenger/fetchChats',
    function (params, { rejectWithValue }) {
        return axios.get(`chat/chats/`, { params })
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const fetchChat = createAsyncThunk(
    'messenger/fetchChat',
    function (params, { rejectWithValue }) {
        return axios.get(`chat`, { params })
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const newMessage = createAsyncThunk(
    'messenger/newMessage',
    function (msgId, { rejectWithValue, dispatch, getState }) {
        return axios.get(`message/${msgId}`)
            .then(response => {
                var chats = getState().messenger.chats;
                chats.length && !chats.some(x => x.id == response.data.chatId) && dispatch(newChat({ id: response.data.chatId, byId: true, communityId: getState().messenger.asCommunityId }));
                return response.data
            })
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const newChat = createAsyncThunk(
    'messenger/newChat',
    function (params, { rejectWithValue }) {
        return axios.get(`chat`, { params })
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const leaveChat = createAsyncThunk(
    'messenger/leaveChat',
    function (params, { rejectWithValue }) {
        return axios.post(`chat/leave`, null, { params })
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const newEditMessage = createAsyncThunk(
    'messenger/newEditMessage',
    function (msgId, { rejectWithValue }) {
        return axios.get(`message/${msgId}`)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const fetchMessages = createAsyncThunk(
    'messenger/fetchMessages',
    function (params, { rejectWithValue }) {
        return axios.get(`message`, { params })
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const createChat = createAsyncThunk(
    'messenger/createChat',
    function (params, { rejectWithValue }) {
        return axios.post(`chat`, params)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const addAccountsToChat = createAsyncThunk(
    'messenger/addAccountsToChat',
    function (params, { rejectWithValue }) {
        return axios.post(`chat/AccountsToChat`, params)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getChatInfo = createAsyncThunk(
    'messenger/getChatInfo',
    function (params, { rejectWithValue }) {
        return axios.get(`chat/info`, { params })
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const renameChat = createAsyncThunk(
    'messenger/renameChat',
    function (params, { rejectWithValue }) {
        return axios.patch(`chat/rename`, params)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const uploadChatAvatar = createAsyncThunk(
    'chat/uploadChatAvatar',
    async function (params, { rejectWithValue }) {
        return axios.post(`chat/uploadAvatar/${params.id}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => response.data)
            .catch(error => { return rejectWithValue(axiosErrorToRejectValue(error)) });
    }
);

export const getChatMembers = createAsyncThunk(
    'chat/getChatMembers',
    async function (params, { rejectWithValue }) {
        return axios.get(`chat/members`, { params })
            .then(response => response.data)
            .catch(error => { return rejectWithValue(axiosErrorToRejectValue(error)) });
    }
);

export const chatKick = createAsyncThunk(
    'chat/chatKick',
    async function (params, { rejectWithValue }) {
        return axios.post(`chat/kick`, null, { params })
            .then(response => response.data)
            .catch(error => { return rejectWithValue(axiosErrorToRejectValue(error)) });
    }
);

export const chatPrivilege = createAsyncThunk(
    'chat/chatPrivilege',
    async function (params, { rejectWithValue }) {
        return axios.post(`chat/privilege`, null, { params })
            .then(response => response.data)
            .catch(error => { return rejectWithValue(axiosErrorToRejectValue(error)) });
    }
);

const getDefaultEmptyState = () => ({
    chats: [],
    messages: {},
    isFetching: false,
    hasMore: true,
    errors: {},
    chatInfo: {
        isFetching: false,
        hasMore: true,
        errors: {}
    }
})

const messengerSlice = createSlice({
    name: "messenger",
    initialState: {
        chat: null,
        ...getDefaultEmptyState(),
    },
    reducers: {
        disposeChatInfo(items, action) {
            items.chatInfo = {
                errors: {}
            };
        },
        addMessage(items, action) {
            items.messages.push(action.payload)
        },
        disposeChats(items, action) {
            Object.assign(items, getDefaultEmptyState());
            delete items.asCommunityId;
        },
        disposeChat(items, action) {
            delete items.messages[items.chat?.id];
            items.chat = null;
            items.hasMore = true;
            delete items.asCommunityId;
        },
        disposeMessages(items, action) {
            items.messages[action.payload] = [];
        },
        newDeleteMessage(items, { payload }) {
            let index = items.messages[payload.chatId]?.indexOf(x => x.id === payload.id)
            index > 0 && items.messages[payload.chatId].splice(index, 1)
            const chat = items.chats.find(x => x.id === payload.chatId);
            chat && chat.lastMessage.id === payload.id && (chat.lastMessage = {});
        },
        clearErrorChats(items, action) {
            delete items.errors.main;
            delete items.errors.messages;
        },
        renameChat(items, action) {
            const { name, id } = action.meta.arg
            if (items.chat?.id == id) {
                items.chat.name = name;
            }
            if (items.chatInfo.chat?.id == id) {
                items.chatInfo.chat.name = name;
            }
        },
        updateAvatar(items, action) {
            const { avatar, id, avatarCrop } = action.payload
            if (items.chat?.id == id) {
                items.chat.avatar = avatar;
                items.chat.avatarCrop = avatarCrop;
            }
            if (items.chatInfo.chat?.id == id) {
                items.chatInfo.chat.avatar = avatar;
                items.chatInfo.chat.avatarCrop = avatarCrop;
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadChatAvatar.fulfilled, (state, action) => {
                messengerSlice.caseReducers.updateAvatar(state, action);
            })
            .addCase(renameChat.fulfilled, (state, action) => {
                messengerSlice.caseReducers.renameChat(state, action);
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.messages[action.payload.chatId] = state.messages[action.payload.chatId].filter(x => x.id !== action.payload.id)
            })
            .addCase(editMessage.fulfilled, (state, { payload }) => {
                let msg = state.messages[payload.chatId].find(x => x.id === payload.id)
                if (msg) {
                    msg.text = payload.text
                    msg.local = true
                }
            })
            .addCase(fetchChats.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.chats = state.chats.concat(action.payload)
                state.hasMore = action.payload.length > 0
                state.isFetching = false
                if (action.meta.arg.id < 0) state.asCommunityId = action.meta.arg.id * -1
            })
            .addCase(newChat.fulfilled, (state, action) => {
                state.chats.unshift(action.payload)
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(fetchMessages.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(fetchMessages.fulfilled, (state, { payload, meta }) => {
                var target = state.messages[meta.arg.id];
                Array.isArray(target) ?
                    state.messages[meta.arg.id] = [...payload, ...target]
                    :
                    state.messages[meta.arg.id] = [...payload]
                state.isFetching = false
                state.hasMore = payload.length > 0;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.errors.messages = rejectActionToError(action);
                state.isFetching = false;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {

            })
            .addCase(leaveChat.fulfilled, (state, action) => {
                if (state.chat?.id === action.meta.arg.id)
                    delete state.chat;
                const index = state.chats.findIndex(x => x.id === action.meta.arg.id);
                if (index > -1) {
                    state.chats.splice(index, 1)[0];
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {

            })
            .addCase(newMessage.fulfilled, (state, { payload }) => {
                state.messages[payload.chatId]?.push(payload)
                const index = state.chats.findIndex(x => x.id === payload.chatId);
                if (index > -1) {
                    if (index != 0) {
                        var chat = state.chats.splice(index, 1)[0];
                        state.chats.unshift(chat);
                        chat.lastMessage = payload;
                    }
                    else state.chats[index].lastMessage = payload;
                }
            })
            .addCase(newEditMessage.fulfilled, (state, { payload }) => {
                let msg = state.messages[payload.chatId].find(x => x.id === payload.id)
                if (msg) {
                    msg.text = payload.text
                    delete msg.local;
                }
                const chat = state.chats.find(x => x.id === payload.chatId);
                chat && chat.lastMessage.id === payload.id && (chat.lastMessage = payload);
            })
            .addCase(fetchChat.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(fetchChat.fulfilled, (state, action) => {
                state.chat = action.payload
                state.isFetching = false
                state.asCommunityId = action.meta.arg.communityId * -1
            })
            .addCase(fetchChat.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getChatInfo.pending, (state, action) => {
                state.chatInfo.isFetching = true
            })
            .addCase(getChatInfo.fulfilled, (state, action) => {
                state.chatInfo.chat = action.payload
                state.chatInfo.isFetching = false
                state.chatInfo.hasMore = true
                state.chatInfo.asCommunityId = action.meta.arg.communityId * -1
            })
            .addCase(getChatInfo.rejected, (state, action) => {
                state.chatInfo.isFetching = false;
                state.chatInfo.errors.main = rejectActionToError(action)
            })
            .addCase(getChatMembers.pending, (state, action) => {
                state.chatInfo.isFetching = true
            })
            .addCase(getChatMembers.fulfilled, (state, action) => {
                state.chatInfo.chat.accounts = state.chatInfo.chat.accounts.concat(action.payload)
                state.chatInfo.isFetching = false
                state.chatInfo.hasMore = action.payload.length > 0
            })
            .addCase(getChatMembers.rejected, (state, action) => {
                state.chatInfo.isFetching = false;
                state.chatInfo.errors.main = rejectActionToError(action)
            })
            .addCase(chatKick.fulfilled, (state, action) => {
                const iAcc = state.chatInfo.chat.accounts.findIndex(x => x.id === action.meta.arg.accountId)
                const iAdm = state.chatInfo.chat.admins.findIndex(x => x.id === action.meta.arg.accountId)
                if (iAcc != -1) {
                    state.chatInfo.chat.accounts.splice(iAcc, 1);
                    state.chatInfo.chat.accountsCount--;
                }
                if (iAdm != -1) {
                    state.chatInfo.chat.admins.splice(iAdm, 1)
                    state.chatInfo.chat.adminsCount--;
                }
            })
            .addCase(chatPrivilege.fulfilled, (state, action) => {
                const iAcc = state.chatInfo.chat.accounts.findIndex(x => x.id === action.meta.arg.accountId)
                if (iAcc != -1) {
                    if (action.meta.arg.admin) {
                        state.chatInfo.chat.adminsCount++;
                        state.chatInfo.chat.admins.push(state.chatInfo.chat.accounts[iAcc])
                    } else {
                        const iAcc = state.chatInfo.chat.admins.findIndex(x => x.id === action.meta.arg.accountId)
                        state.chatInfo.chat.adminsCount--;
                        state.chatInfo.chat.admins.splice(iAcc, 1);
                    }
                }
            })
    }
})

export const { disposeChatInfo, clearErrorChats, addMessage, disposeMessages, newDeleteMessage, deleteMessageAction, editMessageAction, clearSended, disposeChat, disposeChats } = messengerSlice.actions;

export default messengerSlice.reducer