import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getInitialState = () => {
    return {
        community: null,
        communities: [],
        isFetching: false,
        errors: {},
        hasMore: true
    };
}

export const sendCommunityRequest = createAsyncThunk(
    'community/sendCommunityRequest',
    async function (id, { rejectWithValue }) {
        return axios.post(`community/SendRequest/${id}`).then(response => response.data).catch((error) => {
            return rejectWithValue(axiosErrorToRejectValue(error));
        });
    }
);

export const cancelCommunityRequest = createAsyncThunk(
    'community/cancelCommunityRequest',
    async function (id, { rejectWithValue }) {
        return axios.post(`community/CancelRequest/${id}`).then(response => response.data).catch((error) => {
            return rejectWithValue(axiosErrorToRejectValue(error));
        });
    }
);

export const getCommunity = createAsyncThunk(
    'community/getCommunity',
    async function (id, { rejectWithValue }) {
        return axios.get(`community/${id}`).then(response => response.data).catch((error) => {
            return rejectWithValue(axiosErrorToRejectValue(error));
        });
    }
);

export const acceptCommunityRequest = createAsyncThunk(
    'community/acceptCommunityRequest',
    async function (id, { rejectWithValue }) {
        return axios.post(`community/AcceptRequest/${id}`).then(response => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const deleteCommunity = createAsyncThunk(
    'community/deleteCommunity',
    async function (id, { rejectWithValue }) {
        return axios.delete(`community/${id}`)
            .then(response => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const leaveCommunity = createAsyncThunk(
    'community/leaveCommunity',
    async function (id, { rejectWithValue }) {
        return axios.post(`community/leave/${id}`).then(response => response.data).catch((error) => {
            return rejectWithValue(axiosErrorToRejectValue(error));
        });
    }
);

export const getCommunities = createAsyncThunk(
    'community/getCommunities',
    async function (data) {
        return axios.get(`community/GetByAccount/` + data.id, { params: data }).then(response => response.data);
    }
);

export const getCommunitiesAdmin = createAsyncThunk(
    'community/getCommunityAdmin',
    async function (data) {
        return axios.get(`community/GetOwnedByAccount`, { params: data }).then(response => response.data);
    }
);

export const fetchCommunityInRequests = createAsyncThunk(
    'community/fetchCommunityInRequests',
    async function (id, { rejectWithValue }) {
        return axios.get(`community/incoming/` + id).then(response => response.data).catch((error) => {
            return rejectWithValue(axiosErrorToRejectValue(error));
        });
    }
);

export const fetchCommunityOutRequests = createAsyncThunk(
    'community/fetchCommunityOutRequests',
    async function (_, { rejectWithValue }) {
        return axios.get(`community/outgoing`)
            .then(response => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const uploadCommunityAvatar = createAsyncThunk(
    'community/uploadCommunityAvatar',
    async function (params, { rejectWithValue }) {
        return axios.post(`community/uploadAvatar/${params.communityId}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => response.data)
            .catch(error => { return rejectWithValue(axiosErrorToRejectValue(error)) });
    }
);

export const cropCommunityAvatar = createAsyncThunk(
    'community/cropCommunityAvatar',
    async function ({ communityId, crop }, { rejectWithValue }) {
        return axios.post(`community/cropAvatar/${communityId}`, crop)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const cropCommunityCover = createAsyncThunk(
    'community/cropCommunityCover',
    async function ({ communityId, crop }, { rejectWithValue }) {
        return axios.post(`community/cropCover/${communityId}`, crop)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const uploadCover = createAsyncThunk(
    'community/uploadCover',
    async function (params, { rejectWithValue }) {
        return axios.post(`community/uploadCover/${params.communityId}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const updateCommunityStatus = createAsyncThunk(
    'community/updateCommunityStatus',
    async function ({ status, communityId }, { fulfillWithValue, rejectWithValue }) {
        return axios.patch(`community/updateStatus/${communityId}`, { status })
            .then(() => fulfillWithValue(status))
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const deleteAvatar = createAsyncThunk(
    'community/deleteAvatar',
    async function (id, { rejectWithValue }) {
        return axios.post(`community/deleteAvatar/${id}`)
            .then(() => { })
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const deleteCover = createAsyncThunk(
    'community/deleteCover',
    async function (id, { rejectWithValue }) {
        return axios.post(`community/deleteCover/${id}`)
            .then(() => { })
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const createCommunity = createAsyncThunk(
    'community/createCommunity',
    async function (community, { rejectWithValue }) {
        return axios.post(`community`, community)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const changeLogin = createAsyncThunk(
    'community/changeLogin',
    async function (data, { rejectWithValue }) {
        return axios.patch(`community/changeLogin`, data)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const changeName = createAsyncThunk(
    'community/changeName',
    async function (data, { rejectWithValue }) {
        return axios.patch(`community/changeName`, data)
            .then(response => response.data)
            .catch(error => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

const communitySlice = createSlice({
    name: "community",
    initialState: getInitialState(),
    reducers: {
        disposeCommunity(items, action) {
            items.community = null
        },
        disposeCommunities(items, action) {
            items.communities = []
            items.hasMore = true;
            items.errors = {}
        },
        clearErrorCommunities(items, action) {
            delete items.errors.main;
        },
        clearErrorCommunity(items, action) {
            delete items.errors.main;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(cropCommunityAvatar.fulfilled, (state, action) => {
            state.community.avatarCrop = action.payload;
        })
            .addCase(cropCommunityCover.fulfilled, (state, action) => {
                state.community.coverCrop = action.payload;
            })
            .addCase(getCommunities.pending, (state, action) => {
                state.isFetching = true; delete state.errors.main
            })
            .addCase(getCommunities.fulfilled, (state, action) => {
                state.communities = state.communities.concat(action.payload)
                state.hasMore = action.payload.length > 0
                state.isFetching = false
            })
            .addCase(getCommunities.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getCommunitiesAdmin.pending, (state, action) => { state.isFetching = true })
            .addCase(getCommunitiesAdmin.fulfilled, (state, action) => {
                state.communities = state.communities.concat(action.payload)
                state.hasMore = action.payload.length > 0
                state.isFetching = false
            })
            .addCase(getCommunitiesAdmin.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(cancelCommunityRequest.fulfilled, (state, action) => {
                state.communities.splice(state.findIndex((it) => it.id === action.meta.arg), 1)
                state.community.isSubscribed = action.payload
            })
            .addCase(acceptCommunityRequest.fulfilled, (state, action) => {
                state.communities.splice(state.findIndex((it) => it.id === action.meta.arg), 1)
            })
            .addCase(deleteCommunity.fulfilled, (state, action) => {
                state.communities.splice(state.findIndex((it) => it.id === action.meta.arg), 1)
            })
            .addCase(getCommunity.pending, (state, action) => {
                state.community = null;
                state.isFetching = true;
            })
            .addCase(getCommunity.fulfilled, (state, action) => {
                state.community = action.payload
                state.isFetching = false;
            })
            .addCase(getCommunity.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(sendCommunityRequest.fulfilled, (state, action) => {
                state.community.isSubscribed = action.payload
            })
            .addCase(uploadCover.fulfilled, (state, action) => {
                state.community.coverId = action.payload.id
                state.community.cover = action.payload
                state.community.coverCrop = action.meta.arg.crop
            })
            .addCase(uploadCommunityAvatar.fulfilled, (state, action) => {
                state.community.avatarId = action.payload.id
                state.community.avatar = action.payload
                state.community.avatarCrop = action.meta.arg.crop
            })
            .addCase(deleteAvatar.fulfilled, (state, action) => {
                state.community.avatarId = null
                state.community.avatar = null
            })
            .addCase(deleteCover.fulfilled, (state, action) => {
                state.community.coverId = null
                state.community.cover = null
            })
            .addCase(updateCommunityStatus.fulfilled, (state, action) => {
                state.community.status = action.payload
            })
            .addCase(changeName.pending, (state, action) => { delete state.errors.changeNameError })
            .addCase(changeName.rejected, (state, action) => {
                if (action.payload?.errors) state.errors.changeNameError = Object.entries(action.payload.errors)[0][1];
                else state.errors.changeNameError = action.payload || "networkError"
            })
            .addCase(changeName.fulfilled, (state, action) => {
                state.errors.communityUpdateSuccess = "nameChanged"; state.community.name = action.meta.arg.name;
            })
            .addCase(changeLogin.pending, (state, action) => { delete state.errors.changeLoginError })
            .addCase(changeLogin.rejected, (state, action) => {
                if (action.payload?.errors) state.errors.changeLoginError = Object.entries(action.payload.errors)[0][1];
                else state.errors.changeLoginError = action.payload || "networkError"
            })
            .addCase(changeLogin.fulfilled, (state, action) => { state.errors.communityUpdateSuccess = "loginChanged"; })
    }
})

export const { clearErrorCommunity, clearErrorCommunities, disposeCommunities, disposeCommunity } = communitySlice.actions

export default communitySlice.reducer