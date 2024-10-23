import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getInitialState = () => {
    return {
        friends: [],
        isFetching: false,
        hasMore: true,
        errors: {}
    };
}

export const addFriend = createAsyncThunk(
    'friends/addFriend',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.post(`friends/addFriend/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const deleteFriend = createAsyncThunk(
    'friends/deleteFriend',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.post(`friends/deleteFriend/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const fetchFriends = createAsyncThunk(
    'auth/fetchFriends',
    async function (data, { rejectWithValue }) {
        try {
            const response = await axios.get(`friends/${data.id}`, { params: data });
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const getFriendsForChat = createAsyncThunk(
    'account/getFriendsForChat',
    async function (params, { rejectWithValue }) {
        return axios.get(`chat/friends`, { params })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const fetchFriendInRequests = createAsyncThunk(
    'auth/fetchFriendInRequests',
    async function (data, { rejectWithValue }) {
        try {
            const response = await axios.get(`friends/incoming/${data.id}`, { params: data });
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const fetchFriendOutRequests = createAsyncThunk(
    'auth/fetchFriendOutRequests',
    async function (data, { rejectWithValue }) {
        try {
            const response = await axios.get(`friends/outgoing`, { params: data });
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

const friendsSlice = createSlice({
    name: "friends",
    initialState: getInitialState(),
    reducers: {
        clearFriends(items, action) {
            return getInitialState()
        },
        clearErrorFriends(items, action) {
            delete items.errors.main;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFriends.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(fetchFriends.fulfilled, (state, action) => {
                state.friends = state.friends.concat(action.payload)
                state.friends.type = 3
                state.hasMore = action.payload.length > 0
                state.isFetching = false
            })
            .addCase(fetchFriends.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getFriendsForChat.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(getFriendsForChat.fulfilled, (state, action) => {
                state.friends = state.friends.concat(action.payload)
                state.hasMore = action.payload.length > 0
                state.isFetching = false
            })
            .addCase(getFriendsForChat.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(fetchFriendInRequests.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(fetchFriendInRequests.fulfilled, (state, action) => {
                state.friends = state.friends.concat(action.payload)
                state.friends.type = 2
                state.hasMore = action.payload.length > 0
                state.isFetching = false
            })
            .addCase(fetchFriendInRequests.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(fetchFriendOutRequests.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(fetchFriendOutRequests.fulfilled, (state, action) => {
                state.friends = state.friends.concat(action.payload)
                state.friends.type = 1
                state.hasMore = action.payload.length > 0
                state.isFetching = false
            })
            .addCase(fetchFriendOutRequests.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(addFriend.fulfilled, (state, action) => {
                let i = state.friends.findIndex((it) => it.id === action.meta.arg);
                if (i === -1) return;
                state.friends[i].friendState = state.friends[i].friendState === 2 ? 3 : 1;
            })
            .addCase(deleteFriend.fulfilled, (state, action) => {
                let i = state.friends.findIndex((it) => it.id === action.meta.arg);
                if (i === -1) return;
                state.friends[i].friendState = 0;
            })
    }
})

export const { clearErrorFriends, clearFriends } = friendsSlice.actions

export default friendsSlice.reducer