import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { addFriend, deleteFriend } from './friends';

const getInitialState = () => ({
    short: null,
    // {
    //     accounts: [],
    //     communities: [],
    //     audios: []
    // },
    accounts: [],
    accountsCount: null,
    communities: [],
    communitiesCount: null,
    audios: [],
    audiosCount: null,
    videos: [],
    videosCount: null,
    hasMore: true,
    errors: {},
    isFetching: false,
    page: 1
})

export const searchShort = createAsyncThunk(
    'search/searchShort',
    async function (text, { rejectWithValue }) {
        try {
            const response = await axios.get(`search/searchShort/` + text);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

export const search = createAsyncThunk(
    'search/search',
    async function (text, { rejectWithValue }) {
        try {
            const response = await axios.get(`search/search/` + text);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

export const searchAccounts = createAsyncThunk(
    'search/searchAccounts',
    async function ({ text, page = 1 }, { rejectWithValue }) {
        try {
            const response = await axios.get(`search/accounts/` + text + `?page=` + page);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

export const searchCommunities = createAsyncThunk(
    'search/searchCommunities',
    async function ({ text, page = 1 }, { rejectWithValue }) {
        try {
            const response = await axios.get(`search/communities/` + text + `?page=` + page);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

export const searchAudios = createAsyncThunk(
    'search/searchAudios',
    async function ({ text, page = 1 }, { rejectWithValue }) {
        try {
            const response = await axios.get(`search/audios/` + text + `?page=` + page);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

export const searchVideos = createAsyncThunk(
    'search/searchVideos',
    async function ({ text, page = 1 }, { rejectWithValue }) {
        try {
            const response = await axios.get(`search/videos/` + text + `?page=` + page);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

const searchSlice = createSlice({
    name: "search",
    initialState: getInitialState(),
    reducers: {
        disposeShort(items, action) {
            items.short = null;
        },
        disposeSearch(items, action) {
            items.accounts = [];
            items.communities = [];
            items.audios = [];
            items.videos = [];
            items.hasMore = true;
            items.page = 1;
        },
        clearErrorSearch(items, action) {
            delete items.errors.search;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchShort.fulfilled, (state, { payload }) => {
                state.short = payload;
            })
            .addCase(search.pending, (state, { payload }) => {
                state.isFetching = true;
            })
            .addCase(search.fulfilled, (state, { payload }) => {
                state.isFetching = false;
                Object.assign(state, payload);
                state.hasMore = false;
            })
            .addCase(search.rejected, (state, action) => {
                state.isFetching = false
                state.errors.search = rejectActionToError(action);
            })
            .addCase(searchAccounts.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(searchAccounts.fulfilled, (state, { payload }) => {
                state.accounts = [...state.accounts, ...payload];
                state.hasMore = payload.length > 0;
                state.isFetching = false;
                state.page++;
            })
            .addCase(searchAccounts.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.search = rejectActionToError(action);
            })
            .addCase(searchCommunities.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(searchCommunities.fulfilled, (state, { payload }) => {
                state.communities = [...state.communities, ...payload];
                state.hasMore = payload.length > 0;
                state.isFetching = false;
                state.page++;
            })
            .addCase(searchCommunities.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.search = rejectActionToError(action);
            })

            .addCase(searchAudios.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(searchAudios.fulfilled, (state, { payload }) => {
                state.audios = [...state.audios, ...payload];
                state.hasMore = payload.length > 0;
                state.isFetching = false;
                state.page++;
            })
            .addCase(searchAudios.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.search = rejectActionToError(action);
            })

            .addCase(searchVideos.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(searchVideos.fulfilled, (state, { payload }) => {
                state.videos = [...state.videos, ...payload];
                state.hasMore = payload.length > 0;
                state.isFetching = false;
                state.page++;
            })
            .addCase(searchVideos.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.search = rejectActionToError(action);
            })

            .addCase(addFriend.fulfilled, (state, action) => {
                let i = state.accounts.findIndex((it) => it.id === action.meta.arg);
                if (i !== -1) state.accounts[i].friendState = 1;
            })
            .addCase(deleteFriend.fulfilled, (state, action) => {
                let i = state.accounts.findIndex((it) => it.id === action.meta.arg);
                if (i !== -1) state.accounts[i].friendState = 0;
            })
    }
})

export const { clearErrorSearch, disposeShort, disposeSearch } = searchSlice.actions;

export default searchSlice.reducer