import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const uploadVideosHandler = async function (params, { rejectWithValue }) {
    const fd = new FormData();
    fd.append('file', params.file);
    return axios
        .post(`video/UploadVideos/${params.communityId || ''}`, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => response.data)
        .catch((error) => {
            return rejectWithValue(axiosErrorToRejectValue(error));
        });
}

export const uploadVideosOnly = createAsyncThunk(
    'video/uploadVideosOnly',
    uploadVideosHandler
);

export const uploadVideos = createAsyncThunk(
    'video/uploadVideos',
    uploadVideosHandler
);

export const updateVideo = createAsyncThunk(
    'video/updateVideo',
    async function ({ video }, { rejectWithValue }) {
        return axios
            .patch(`video`, video)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getForEdit = createAsyncThunk(
    'video/getForEdit',
    async function (id, { rejectWithValue }) {
        return axios
            .get(`video/edit/` + id)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const uploadThumbnail = createAsyncThunk(
    'video/uploadThumbnail',
    async function ({ file }, { rejectWithValue }) {
        return axios
            .post(`video/uploadThumbnail`, { file }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getRecommendedVideos = createAsyncThunk(
    'video/getRecommendedVideos',
    async function (params, { rejectWithValue }) {
        return axios
            .get(`video`, { params })
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getVideosData = createAsyncThunk(
    'video/getVideosData',
    async function (params, { rejectWithValue }) {
        return axios
            .get(`video/VideosData`, { params })
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getAuthorVideos = createAsyncThunk(
    'video/getAuthorVideos',
    async function (params, { rejectWithValue }) {
        return axios
            .get(`video/author`, { params })
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getAddedVideos = createAsyncThunk(
    'video/getAddedVideos',
    async function (params, { rejectWithValue }) {
        return axios
            .get(`video/Added`, { params })
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getUploadedVideos = createAsyncThunk(
    'video/getUploadedVideos',
    async function (params, { rejectWithValue }) {
        return axios
            .get(`video/Uploaded`, { params })
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getLiked = createAsyncThunk(
    'video/getLiked',
    async function (params, { rejectWithValue }) {
        return axios
            .get(`video/liked`, { params })
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getSubscriptions = createAsyncThunk(
    'video/getSubscriptions',
    async function (params, { rejectWithValue }) {
        return axios
            .get(`video/subscriptions`, { params })
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getVideo = createAsyncThunk(
    'video/getVideo',
    async function (id, { rejectWithValue }) {
        return axios.get(`video/${id}`)
            .then(response => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const createComment = createAsyncThunk(
    'video/createComment',
    async function (comment, { rejectWithValue }) {
        return axios.post(`video/CreateComment`, comment)
            .then(response => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const likeVideo = createAsyncThunk(
    'video/likeVideo',
    async function (data, { dispatch, rejectWithValue }) {
        dispatch(likeAction(data))
        return axios.post(`video/like/${data.id}?like=${data.like}`)
            .then(response => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const deleteVideo = createAsyncThunk(
    'video/deleteVideo',
    async function (id, { rejectWithValue }) {
        return axios.delete(`video/${id}`)
            .then(response => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const switchAddedVideo = createAsyncThunk(
    'video/switchAddedVideo',
    async function (data, { rejectWithValue }) {
        return axios.post(`video/switchAddedVideo/${data.id}?state=${data.state}`)
            .then(response => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const deleteVideoComment = createAsyncThunk(
    'posts/deleteVideoComment',
    async function (comment, { rejectWithValue }) {
        return axios.post(`video/DeleteComment/${comment.id}`)
            .then(response => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);



const videoSlice = createSlice({
    name: "video",
    initialState: {
        video: {},
        videos: [],
        editing: false,
        videosEdit: null,
        hasMore: true,
        errors: {},
        saved: {},
    },
    reducers: {
        switchEditingMode(items, action) {
            items.editing = action.payload;
        },
        removeThumbnail(items, { payload }) {
            items.videosEdit[payload].thumbnail = items.videosEdit[payload].defaultThumbnails[0];
            items.videosEdit[payload].thumbnailId = items.videosEdit[payload].defaultThumbnails[0].id;
        },
        disposeVideo(items, action) {
            items.video = {};
            delete items.errors.video;
        },
        disposeVideosEdit(items, action) {
            items.videosEdit = null;
            items.saved = {};
            items.editing = false;
        },
        disposeVideos(items, action) {
            items.author = null;
            items.videos = [];
            items.hasMore = true;
            items.errors = {};
        },
        dispose(items, action) {
            items.author = null;
            items.videos = [];
            items.video = null;
            items.editing = false;
            items.uploading = 0;
        },
        likeAction(items, action) {
            items.video.likesCount += action.payload.like
            items.video.isLiked = action.payload.like
        },
        forceVideoModal(items, action) {
            items.forceVideoModal = action.payload;
        },
        unforceVideo(items) {
            items.forceVideoModal = null;
        },
        clearErrorVideos(items, action) {
            delete items.errors.main;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRecommendedVideos.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(getRecommendedVideos.fulfilled, (state, { payload }) => {
                state.videos = state.videos.concat(payload);
                state.hasMore = payload.length > 0;
                state.seed = payload.seed;
                state.isFetching = false;
            })
            .addCase(getRecommendedVideos.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getVideosData.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(getVideosData.fulfilled, (state, { payload }) => {
                state.author = payload;
                state.isFetching = false;
            })
            .addCase(getVideosData.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getAuthorVideos.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(getAuthorVideos.fulfilled, (state, { payload }) => {
                state.videos = state.videos.concat(payload);
                state.hasMore = payload.length > 0;
                state.isFetching = false;
            })
            .addCase(getAuthorVideos.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getUploadedVideos.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(getUploadedVideos.fulfilled, (state, action) => {
                state.videos = state.videos.concat(action.payload);
                state.hasMore = action.payload.length > 0;
                state.isFetching = false;
            })
            .addCase(getUploadedVideos.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getVideo.pending, (state, { payload }) => {
                delete state.errors.photo;
            })
            .addCase(getVideo.fulfilled, (state, { payload }) => {
                Object.assign(state.video, payload);
            })
            .addCase(getVideo.rejected, (state, { payload }) => {
                state.errors.video = true;
            })
            .addCase(getLiked.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(getLiked.fulfilled, (state, action) => {
                state.videos = state.videos.concat(action.payload);
                state.hasMore = action.payload.length > 0;
                state.isFetching = false;
            })
            .addCase(getLiked.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getAddedVideos.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(getAddedVideos.fulfilled, (state, { error, payload }) => {
                state.videos = state.videos.concat(payload);
                state.hasMore = payload.length > 0;
                state.isFetching = false;
            })
            .addCase(getAddedVideos.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getSubscriptions.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(getSubscriptions.fulfilled, (state, { error, payload }) => {
                state.videos = state.videos.concat(payload);
                state.hasMore = payload.length > 0;
                state.isFetching = false;
            })
            .addCase(getSubscriptions.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(uploadThumbnail.fulfilled, (state, { meta, payload }) => {
                state.videosEdit[meta.arg.videoIndex].thumbnail = payload;
            })
            .addCase(uploadVideos.fulfilled, (state, action) => {
                state.videosEdit = action.payload;
                state.uploading = false;
            })
            .addCase(updateVideo.fulfilled, (state, { meta }) => {
                state.saved[meta.arg.videoIndex] = true;
                state.uploading = false;
            })
            .addCase(deleteVideo.fulfilled, (state, action) => {
                const index = state.videos.findIndex(x => x.id === action.payload.id);
                state.video.isDeleted = true;
                if (index > -1) {
                    state.videos.splice(index, 1);
                }
            })
            .addCase(updateVideo.rejected, (state, { meta }) => {
                state.saved[meta.arg.videoIndex] = false;
            })
            .addCase(updateVideo.pending, (state, { meta }) => {
                state.saved[meta.arg.videoIndex] = null;
            })
            .addCase(uploadVideos.pending, (state, action) => {
                state.uploading = true;
                state.editing = true;
                state.videosEdit = null;
            })
            .addCase(uploadVideos.rejected, (state, action) => {
                state.uploading = false;
                state.editing = false;
            })
            .addCase(getForEdit.fulfilled, (state, action) => {
                state.videosEdit = [action.payload];
                state.uploading = false;
            })
            .addCase(getForEdit.pending, (state, action) => {
                state.uploading = true;
                state.editing = true;
            })
            .addCase(getForEdit.rejected, (state, action) => {
                state.uploading = false;
                state.editing = false;
            })
            .addCase(likeVideo.fulfilled, (state, action) => {
                state.video.likesCount = action.payload;
                return state
            })
            .addCase(likeVideo.rejected, (state, action) => {
                const args = action.meta.arg;
                state.video.isLiked = !state.video.isLiked
                state.video.likesCount += !args.like ? 1 : -1;
                return state
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.video.comments.push(action.payload);
                state.video.commentsCount++;
                return state
            })
            .addCase(switchAddedVideo.fulfilled, (state, action) => {
                state.video.isAdded = action.payload;
            })
            .addCase(deleteVideoComment.fulfilled, (state, action) => {
                let comments = state.video.comments;
                state.video.commentsCount--;
                let deleteIndex = comments.findIndex(x => x.id === action.payload.id);
                comments.splice(deleteIndex, 1);
            })
    }

})

export const { clearErrorVideos, clear, disposeVideo, disposeVideos, disposeVideosEdit, dispose, removeThumbnail, likeAction, switchEditingMode, unforceVideo, forceVideoModal } = videoSlice.actions;

export default videoSlice.reducer