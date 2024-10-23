import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getDefaultEmptyState = () => ({
    images: [],
    albums: [],
    album: null,
    isFetching: false,
    hasMore: true,
    author: null,
    errors: {}
})

const getInitialState = () => ({
    ...getDefaultEmptyState(),
    photo: {},
    modal: getDefaultEmptyState(),
})

export const getPhotoData = createAsyncThunk(
    'photo/photoData',
    async function (id, { rejectWithValue }) {
        return axios.get(`photo/photoData/${id}`)
            .then((r) => r.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getPhotoDataModal = createAsyncThunk(
    'photo/photoDataModal',
    async function (id, { rejectWithValue }) {
        return axios.get(`photo/photoData/${id}`)
            .then((r) => r.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getPhotos = createAsyncThunk(
    'photo/photos',
    async function (params, { rejectWithValue }) {
        return axios.get(`photo/photos`, { params })
            .then((r) => r.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getImagesModal = createAsyncThunk(
    'photo/imagesModal',
    async function (params, { rejectWithValue }) {
        return axios.get(`photo/photos`, { params })
            .then((r) => r.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getAlbumsData = createAsyncThunk(
    'photo/albumsData',
    async function (id, { rejectWithValue }) {
        return axios.get(`photo/albumsData/${id}`)
            .then((r) => r.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getAlbums = createAsyncThunk(
    'photo/getAlbums',
    async function (data, { rejectWithValue }) {
        return axios.get(`photo/albums/${data.id}?page=${data.page}`)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getAlbumsModal = createAsyncThunk(
    'photo/getAlbumsModal',
    async function (data, { rejectWithValue }) {
        return axios.get(`photo/albums/${data.id}?page=${data.page}`)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const createAlbum = createAsyncThunk(
    'photo/createAlbum',
    async function (album, { rejectWithValue }) {
        return axios.post(`photo/CreateAlbum`, album)
            .then((r) => r.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getPhoto = createAsyncThunk(
    'photo/getPhoto',
    async (arr, { rejectWithValue }) => {
        return axios.get(`photo/Image/${arr[0]}/${arr[1]}`)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const switchImage = createAsyncThunk(
    'photo/switchImage',
    async (params, { rejectWithValue }) => {
        return axios.get(`photo/switch`, { params })
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getAlbum = createAsyncThunk(
    'photo/getAlbum',
    function (id, { rejectWithValue }) {
        return axios.get(`photo/album/${id}`)
            .then((r) => r.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getAlbumModal = createAsyncThunk(
    'photo/getAlbumModal',
    function (id, { rejectWithValue }) {
        return axios.get(`photo/album/${id}`)
            .then((r) => r.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getAlbumImages = createAsyncThunk(
    'photo/getAlbumImages',
    function (params, { rejectWithValue }) {
        return axios.get(`photo/albumImages`, { params })
            .then((r) => r.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

const uploadImagesHandler = function (params, { rejectWithValue }) {
    return axios.post(`photo/upload`, params, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            return rejectWithValue(axiosErrorToRejectValue(error));
        });
}

export const uploadImages = createAsyncThunk(
    'photo/uploadImages',
    uploadImagesHandler
);

export const uploadImagesOnly = createAsyncThunk(
    'photo/uploadImagesOnly',
    uploadImagesHandler
);

export const uploadImagesInAlbum = createAsyncThunk(
    'photo/uploadImagesInAlbum',
    async function (params, { rejectWithValue }) {
        return axios.post(`photo/uploadInAlbum/${params.albumId ?? ""}`, params, {
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

export const updateDescription = createAsyncThunk(
    'photo/updateDescription',
    async function (photo, { rejectWithValue }) {
        return axios.put(`photo`, photo)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const sendComment = createAsyncThunk(
    'photo/sendComment',
    async function (comment, { rejectWithValue }) {
        return axios
            .post(`photo/sendComment`, comment)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const likePhoto = createAsyncThunk(
    'photo/likePhoto',
    async function (data, { dispatch, rejectWithValue }) {
        dispatch(likeAction(data));
        return axios
            .post(`photo/like/${data.id}?like=${data.like}`)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const moveToAlbum = createAsyncThunk(
    'photo/moveToAlbum',
    async function (id, { getState, rejectWithValue }) {
        return axios
            .post(`photo/moveToAlbum/${id}/${getState().photo.photo.id}`)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const addToSavedImages = createAsyncThunk(
    'photo/addToSavedImages',
    async function (id, { getState, rejectWithValue }) {
        return axios
            .post(`photo/addToSaved/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const deleteImage = createAsyncThunk(
    'photo/deleteImage',
    async function (id, { rejectWithValue }) {
        return axios
            .delete(`photo/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const deleteImageComment = createAsyncThunk(
    'posts/deleteImageComment',
    async function (comment, { rejectWithValue }) {
        return axios
            .post(`image/DeleteComment/${comment.id}`)
            .then(() => comment)
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

const photoSlice = createSlice({
    name: "photo",
    initialState: getInitialState(),
    reducers: {
        dispose(items, action) {
            items = null;
        },
        photoFromAlbum(items, action) {
            items.photo.fromAlbum = action.payload;
        },
        disposePhoto(items, action) {
            items.photo = {};
            delete items.errors.photo;
        },
        disposeAlbum(items, action) {
            items.album = null;
        },
        disposePhotoModal(items, action) {
            items.modal = getDefaultEmptyState();
        },
        disposePhotoData(items, action) {
            Object.assign(items, getDefaultEmptyState());
        },
        likeAction(items, action) {
            //var image = items.images.find(x => x.id === action.payload.id);

            items.photo.likesCount += action.payload.like
            items.photo.isLiked = action.payload.like
        },
        clearErrorImages(items, action) {
            delete items.errors.main;
            delete items.errors.images;
            delete items.modal.errors.main;
            delete items.modal.errors.images;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPhotoData.pending, (state, { type, payload }) => {
                state.isFetching = true
            })
            .addCase(getPhotoData.fulfilled, (state, { payload }) => {
                state.isFetching = false;
                state.hasMore = payload.images.length > 0;
                Object.assign(state, payload);
            })
            .addCase(getPhotoData.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getPhotoDataModal.pending, (state, { type, payload }) => {
                state.modal.isFetching = true
            })
            .addCase(getPhotoDataModal.fulfilled, (state, { payload }) => {
                state.modal.isFetching = false;
                state.modal.hasMore = payload.images.length > 0;
                Object.assign(state.modal, payload);
            })
            .addCase(getPhotoDataModal.rejected, (state, action) => {
                state.modal.isFetching = false;
                state.modal.errors.main = rejectActionToError(action)
            })
            .addCase(getPhotos.pending, (state, { payload }) => {
                state.isFetching = true
            })
            .addCase(getPhotos.fulfilled, (state, { payload }) => {
                state.isFetching = false;
                state.hasMore = payload.length > 0;
                state.images = state.images.concat(payload);
            })
            .addCase(getPhotos.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getImagesModal.pending, (state, { payload }) => {
                state.modal.isFetching = true
            })
            .addCase(getImagesModal.fulfilled, (state, { payload }) => {
                state.modal.isFetching = false;
                state.modal.hasMore = payload.length > 0;
                state.modal.images = state.modal.images.concat(payload);
            })
            .addCase(getImagesModal.rejected, (state, action) => {
                state.modal.isFetching = false;
                state.modal.errors.main = rejectActionToError(action)
            })
            .addCase(getAlbumsData.fulfilled, (state, { payload }) => {
                state.modal = payload;
            })
            .addCase(getAlbums.fulfilled, (state, action) => {
                state.albums = action.payload
            })
            .addCase(getAlbumsModal.fulfilled, (state, action) => {
                state.modal.albums = action.payload
            })
            .addCase(createAlbum.fulfilled, (state, action) => {
                if (state.albums.length < 6)
                    state.albums.push(action.payload)
            })
            .addCase(getPhoto.pending, (state, { payload }) => {
                delete state.errors.photo;
            })
            .addCase(getPhoto.fulfilled, (state, { payload }) => {
                Object.assign(state.photo, payload);
            })
            .addCase(getPhoto.rejected, (state, { payload }) => {
                state.errors.photo = true;
            })
            .addCase(switchImage.fulfilled, (state, { payload }) => {
                Object.assign(state.photo, payload);
                state.photo.isDeleted = false;
            })
            .addCase(getAlbum.pending, (state, { payload }) => {
                state.isFetching = true;
            })
            .addCase(getAlbum.fulfilled, (state, { payload }) => {
                state.album = payload;
                state.isFetching = false;
                state.hasMore = payload.images.length > 0;
            })
            .addCase(getAlbum.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(getAlbumModal.pending, (state, { payload }) => {
                state.modal.isFetching = true;
            })
            .addCase(getAlbumModal.fulfilled, (state, { payload }) => {
                state.modal.album = payload;
                state.modal.isFetching = false;
                state.modal.hasMore = payload.images.length > 0;
            })
            .addCase(getAlbumModal.rejected, (state, action) => {
                state.modal.isFetching = false;
                state.modal.errors.main = rejectActionToError(action)
            })
            .addCase(getAlbumImages.pending, (state, { payload }) => {
                state.isFetching = true;
            })
            .addCase(getAlbumImages.fulfilled, (state, { payload }) => {
                state.hasMore = payload.length > 0;
                state.isFetching = false;
                state.album.images = state.album.images.concat(payload);
            })
            .addCase(getAlbumImages.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(likePhoto.fulfilled, (state, { payload }) => {
                state.photo.likesCount = payload;
            })
            .addCase(likePhoto.rejected, (state, action) => {
                const args = action.meta.arg;
                state.photo.isLiked = !state.photo.isLiked
                state.photo.likesCount += !args.like ? 1 : -1;
            })
            .addCase(sendComment.fulfilled, (state, action) => {
                state.photo.comments.push(action.payload);
                state.photo.commentsCount++;
            })
            .addCase(uploadImages.fulfilled, (state, action) => {
                if (state.modal.author && !state.modal.album) {
                    state.modal.images = action.payload.concat(state.modal.images);
                }
                else if (state.author) {
                    state.images = action.payload.concat(state.images);
                    state.imagesCount += action.payload.length;
                }
            })
            .addCase(uploadImagesInAlbum.fulfilled, (state, action) => {
                if (action.payload[0].albumId && state.modal?.album && action.payload[0].albumId === state.modal.album.id) {
                    state.modal.album.images = action.payload.concat(state.modal.album.images);
                    //state.modal.imagesCount += action.payload.images.length;
                }
                else if (state.album) {
                    state.album.images = action.payload.concat(state.album.images);
                }
            })
            .addCase(deleteImage.fulfilled, (state, action) => {
                for (const images of [state.images, state.album?.images, state.modal.images, state.modal.album?.images]) {
                    const index = images?.findIndex(x => x.id === action.meta.arg);
                    if (index > -1) state.images.splice(index, 1);
                }
                if (state.photo.id == action.meta.arg) state.photo.isDeleted = true;
                // state.imagesCount -= action.payload.length;
            })
            .addCase(deleteImageComment.fulfilled, (state, action) => {
                let comments = state.photo.comments;
                state.photo.commentsCount--;
                let deleteIndex = comments.findIndex(x => x.id === action.payload.id);
                comments.splice(deleteIndex, 1);
            })

    }
})

export const { clearErrorImages, disposePhoto, likeAction, disposePhotoData, disposePhotoModal, disposeAlbum, photoFromAlbum } = photoSlice.actions;

export default photoSlice.reducer