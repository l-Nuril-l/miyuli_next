import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosErrorToRejectValue, rejectActionToError } from '../functions';

export const getRecommendations = createAsyncThunk(
    'audio/getRecommendations',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`audio/recommendations`, { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const getAudios = createAsyncThunk(
    'audio/getAudios',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`audio`, { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const getPlaylistAudios = createAsyncThunk(
    'audio/getPlaylistAudios',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`audio`, { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const getAttachAudios = createAsyncThunk(
    'audio/getAttachAudios',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`audio`, { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const getAudio = createAsyncThunk(
    'audio/getAudio',
    async function ({ id }, { rejectWithValue }) {
        try {
            const response = await axios.get(`audio/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const applyAudioCache = createAsyncThunk(
    'audio/applyAudioCache',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`audio/${params.id}`);
            return Object.assign(params, response.data);
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const getPlaylistAudio = createAsyncThunk(
    'audio/getPlaylistAudio',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.get(`audio/getPlaylistAudio/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const switchAudio = createAsyncThunk(
    'audio/switchAudio',
    async function (data, { fulfillWithValue, rejectWithValue }) {
        try {
            await axios.post(`audio/switch/${data.id}?state=${data.state}`);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

const uploadAudiosHandler = async function (params, { rejectWithValue }) {
    return axios.post(`audio/upload/` + (params.communityId || ""), params, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            return response.data;
        })
        .catch((error) => {
            return rejectWithValue(axiosErrorToRejectValue(error));
        });
}

export const uploadAudios = createAsyncThunk(
    'audio/uploadAudios',
    uploadAudiosHandler
);

export const uploadAudiosOnly = createAsyncThunk(
    'audio/uploadAudiosOnly',
    uploadAudiosHandler
);

export const createAudioPlaylist = createAsyncThunk(
    'audio/createAudioPlaylist',
    async function (params, { rejectWithValue }) {
        return axios.post(`audioplaylist`, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const editAudioPlaylist = createAsyncThunk(
    'audio/editAudioPlaylist',
    async function (params, { rejectWithValue }) {
        return axios.patch(`audioplaylist/` + params.id, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getPlaylists = createAsyncThunk(
    'audio/getPlaylists',
    async function (params, { rejectWithValue }) {
        return axios.get(`audioplaylist`, { params })
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const skip = createAsyncThunk(
    'audio/skip',
    async function (_, { getState, rejectWithValue }) {
        return axios.post(`audio/switch`, getDetails(getState))
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const previous = createAsyncThunk(
    'audio/previous',
    async function (_, { getState, rejectWithValue }) {
        return axios.post(`audio/switch`, {
            ...getDetails(getState),
            reverse: true
        })
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getPlaylist = createAsyncThunk(
    'audio/getPlaylist',
    async function (id, { getState, rejectWithValue }) {
        return axios.get(`audioplaylist/${id}`)
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const toTop = createAsyncThunk(
    'audio/toTop',
    async function (params, { rejectWithValue }) {
        return axios.post(`audio/toTop`, null, { params })
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const toBottom = createAsyncThunk(
    'audio/toBottom',
    async function (params, { rejectWithValue }) {
        return axios.post(`audio/toBottom`, null, { params })
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const switchPlaylist = createAsyncThunk(
    'audio/switchPlaylist',
    async function (params, { rejectWithValue }) {
        return axios.post(`audioplaylist/switch`, null, { params })
            .then(response => response.data)
            .catch((error) => { return rejectWithValue(axiosErrorToRejectValue(error)); });
    }
)

export const reorder = createAsyncThunk(
    'audio/reorder',
    async function ({ result, playlistId }, { getState, rejectWithValue }) {
        const audios = playlistId > 0 ? getState().audio.playlist.audios : getState().audio.page.audios;
        return axios.post(`audio/reorder`, null, {
            params: {
                sourceId: audios[result.source.index].ordinalNumber,
                destinationId: audios[result.destination.index].ordinalNumber,
                playlistId
            }
        })
            .then(_ => result)
            .catch((error) => { return rejectWithValue(axiosErrorToRejectValue(error)); });
    }
)

export const editAudio = createAsyncThunk(
    'audio/editAudio',
    async function (audio, { rejectWithValue }) {
        return axios.patch(`audio/` + audio.id, audio, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => response.data)
            .catch((error) => { return rejectWithValue(axiosErrorToRejectValue(error)); });
    }
)

export const deleteAudio = createAsyncThunk(
    'audio/deleteAudio',
    async function (audioId, { rejectWithValue }) {
        return axios.delete(`audio/` + audioId)
            .then(response => response.data)
            .catch((error) => { return rejectWithValue(axiosErrorToRejectValue(error)); });
    }
)

const getDetails = (getState) => {
    return {
        audioId: getState().audio.audio.id,
        authorId: getState().audio.authorId,
        playlistId: getState().audio.playlistId,
        search: getState().audio.search,
        guid: getState().audio.shuffle ? "00000000-0000-0000-0000-000000000000" : null
    }
}



const getInitialState = () => {
    var state = {
        audio: null,
        muted: false,
        loop: false,
        shuffle: false,
        volume: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()) ? 100 : 10,
        volumeScaleType: localStorage.getItem("volumeScaleType") || "linear",
        duration: 0,
        isPlaying: false,
        search: null,

        page: {
            playlists: [],
            audios: [],
            isFetching: false,
            hasMore: true,
            errors: {},
            playlistId: null,
            author: null, // attach
            authorId: null,
        },
        attach: {
            audios: [],
            isFetching: false,
            hasMore: true,
            errors: {},
        },
        playlist: {
            audios: [],
            isFetching: false,
            hasMore: true,
            errors: {}
        },
        showFormPlaylistModal: null,
        formPlaylistModalCommunityId: null,
    }
    return state;
}

const audiosSlice = createSlice({
    name: "audio",
    initialState: getInitialState(),
    reducers: {
        showEditPlaylistModal(items, action) {
            items.showFormPlaylistModal = action.payload.id || 0
            items.formPlaylistModalCommunityId = action.payload.communityId || 0
        },
        closeEditPlaylistModal(items, action) {
            items.showFormPlaylistModal = null
            items.formPlaylistModalCommunityId = null
        },
        clearAttachAudios(items, action) {
            items.attach.audios = []
            items.attach.hasMore = true;
        },
        clearAudios(items, action) {
            items.page.audios = []
            items.page.hasMore = true;
            items.page.errors = {};
        },
        clearAudioData(items, action) {
            items.page.audios = []
            items.page.playlists = []
            items.page.author = null;
            items.page.hasMore = true;
            items.page.errors = {};
        },
        clearPlaylist(items, action) {
            items.playlist = {
                isFetching: false,
                hasMore: true,
                audios: [],
                errors: {}
            }
        },
        clearPlaylistAudios(items, action) {
            Object.assign(items.playlist,
                {
                    hasMore: true,
                    audios: [],
                })
        },
        loop(items, action) {
            items.loop = !items.loop;
        },
        shuffle(items, action) {
            items.shuffle = !items.shuffle;
        },
        mute(items, action) {
            items.muted = !items.muted;
        },
        volume(items, action) {
            items.volume = action.payload;
            items.muted = false;
        },
        play(items, action) {
            items.isPlaying = true;
        },
        pause(items, action) {
            items.isPlaying = false;
        },
        stop(items, action) {
            localStorage.removeItem("audio");
            items.audio = null;
            items.duration = 0;
            items.isPlaying = false;
            items.authorId = null;
            items.playlistId = null;
            items.search = null;
        },
        setDownloadProgress(items, action) {
            items.downloadProgress = action.payload
        },
        setAudio(items, { payload }) {
            items.audio = payload;
            const splitted = payload.duration.split(':');
            const duration = (parseInt(splitted[0]) * 60 + parseInt(splitted[1]))
            items.duration = duration
            items.isPlaying = true;
        },
        switchVolumeScaleType(items, action) {
            items.volumeScaleType = action.payload
            localStorage.setItem("volumeScaleType", action.payload)
        },
        clearErrorAudios(items, action) {
            delete items.page.errors.main;
            delete items.attach.errors.main;
            delete items.playlist.errors.main;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRecommendations.pending, (state, { payload }) => {
                state.page.isFetching = true;
                state.page.errors = {}
            })
            .addCase(getRecommendations.fulfilled, (state, { payload }) => {
                state.page.audios = [...state.page.audios, ...payload];
                state.page.hasMore = payload.length > 0;
                state.page.isFetching = false;
            })
            .addCase(getRecommendations.rejected, (state, action) => {
                state.page.isFetching = false;
                state.page.errors.main = rejectActionToError(action)
            })
            .addCase(getAttachAudios.pending, (state, action) => {
                state.attach.isFetching = true;
            })
            .addCase(getAttachAudios.fulfilled, (state, { payload }) => {
                state.attach.audios = [...state.attach.audios, ...payload.audios];
                state.attach.hasMore = payload.audios.length > 0;
                state.attach.author = payload.author;
                state.attach.isFetching = false;
            })
            .addCase(getAttachAudios.rejected, (state, action) => {
                state.attach.isFetching = false;
                state.attach.errors.main = rejectActionToError(action)
            })
            .addCase(getAudios.pending, (state, { payload, error }) => {
                state.page.isFetching = true;
            })
            .addCase(getAudios.fulfilled, (state, { payload }) => {
                state.page.audios = [...state.page.audios, ...payload.audios];
                state.page.author = payload.author;
                state.page.hasMore = payload.audios.length > 0;
                state.page.isFetching = false;
            })
            .addCase(getAudios.rejected, (state, action) => {
                state.page.isFetching = false;
                state.page.errors.main = rejectActionToError(action)
            })
            .addCase(uploadAudios.pending, (state, action) => {
                delete state.page.errors.upload;
            })
            .addCase(uploadAudios.rejected, (state, action) => {
                state.page.errors.upload = rejectActionToError(action)
            })
            .addCase(getPlaylistAudios.pending, (state, { payload }) => {
                state.playlist.isFetching = true;
                state.playlist.errors = {}
            })
            .addCase(getPlaylistAudios.fulfilled, (state, { payload }) => {
                state.playlist.audios = [...state.playlist.audios, ...payload.audios];
                state.playlist.hasMore = payload.audios.length > 0;
                state.playlist.isFetching = false;
            })
            .addCase(getPlaylistAudios.rejected, (state, action) => {
                state.playlist.isFetching = false;
                state.playlist.errors.main = rejectActionToError(action)
            })
            .addCase(getAudio.pending, (state, action) => {
                state.isPlaying = false;
            })
            .addCase(getAudio.fulfilled, (state, action) => {
                state.authorId = action.meta.arg.authorId ?? null;
                state.playlistId = action.meta.arg.playlistId ?? null;
                state.search = action.meta.arg.search ?? null;
                state.shuffle = null;
                audiosSlice.caseReducers.setAudio(state, action);
                state.isPlaying = true;
            })
            .addCase(applyAudioCache.fulfilled, (state, action) => {
                state.authorId = action.meta.arg.authorId ?? null;
                state.playlistId = action.meta.arg.playlistId ?? null;
                state.search = action.meta.arg.search ?? null;
                audiosSlice.caseReducers.setAudio(state, action);
                state.volume = action.meta.arg.volume ?? 0.1;
                state.isPlaying = action.payload.isPlaying;
            })
            .addCase(getPlaylistAudio.pending, (state, action) => {
                state.isPlaying = false;
                state.authorId = null;
            })
            .addCase(getPlaylistAudio.fulfilled, (state, action) => {
                state.playlistId = action.meta.arg ?? null;

                if (action.payload.id === state.audio?.id)
                    state.isPlaying = true;
                else
                    audiosSlice.caseReducers.setAudio(state, action);
            })
            .addCase(skip.fulfilled, (state, action) => {
                audiosSlice.caseReducers.setAudio(state, action);
            })
            .addCase(previous.fulfilled, (state, action) => {
                audiosSlice.caseReducers.setAudio(state, action);
            })
            .addCase(switchAudio.fulfilled, (state, { payload }) => {
                var res = state.page.audios.find(x => x.id === payload.id)
                if (res) res.isAdded = payload.state;
            })
            .addCase(editAudio.fulfilled, (state, { meta }) => {
                var res = state.page.audios.find(x => x.id === meta.arg.id)
                if (res) {
                    res.name = meta.arg.name;
                    res.artist = meta.arg.artist;
                    res.lyrics = meta.arg.lyrics;
                }
            })
            .addCase(deleteAudio.fulfilled, (state, { meta }) => {
                var index = state.page.audios.findIndex(x => x.id === meta.arg);
                if (index === -1) return;
                state.page.audios.splice(index, 1);
            })
            .addCase(reorder.fulfilled, (state, action) => {
                const { source, destination } = action.payload;
                let disappearance = destination.index > source.index;
                let largeIndex = disappearance ? destination.index : source.index;
                let smallIndex = disappearance ? source.index : destination.index;
                let audios = action.meta.arg.playlistId > 0 ? state.playlist.audios : state.page.audios;
                let destOrdNum = audios[destination.index].ordinalNumber;


                for (let i = smallIndex; i <= largeIndex; i++) {
                    audios[i].ordinalNumber += disappearance ? 1 : -1;
                }

                const [reorderedItem] = audios.splice(source.index, 1);
                reorderedItem.ordinalNumber = destOrdNum;
                audios.splice(destination.index, 0, reorderedItem);
            })
            .addCase(getPlaylists.fulfilled, (state, { payload }) => {
                state.page.playlists = payload;
            })
            .addCase(getPlaylist.fulfilled, (state, { payload }) => {
                Object.assign(state.playlist, payload);
                state.playlist = { ...state.playlist, ...payload };
            })
            .addCase(createAudioPlaylist.fulfilled, (state, { payload }) => {
                state.page.playlists.push(payload);
            })
            .addCase(switchPlaylist.fulfilled, (state, action) => {
                var res = state.page.playlists.find(x => x.id === action.meta.arg.id)
                if (res) res.isAdded = action.payload;
            })
            .addCase(editAudioPlaylist.fulfilled, (state, action) => {
                var res = state.page.playlists.find(x => x.id === action.meta.arg.id)
                if (!res) return;
                res.title = action.meta.arg.title;
                res.description = action.meta.arg.description;
                res.coverId = action.payload.coverId;
            })
            .addCase(toTop.fulfilled, (state, action) => {
                let audios = action.meta.arg.playlistId ? state.playlist.audios : state.page.audios
                let pushingElement = audios.splice(audios.findIndex(x => x.ordinalNumber === action.meta.arg.ordinalNumber), 1)[0];
                pushingElement.ordinalNumber = action.payload + 1
                audios.unshift(pushingElement)
                for (const x of audios) {
                    if (x.ordinalNumber > action.meta.arg.ordinalNumber)
                        x.ordinalNumber -= 1
                    else
                        break;
                }
            })
            .addCase(toBottom.fulfilled, (state, action) => {
                let audios = action.meta.arg.playlistId ? state.playlist.audios : state.page.audios
                let pushingElement = audios.splice(audios.findIndex(x => x.ordinalNumber === action.meta.arg.ordinalNumber), 1)[0];
                pushingElement.ordinalNumber = 0
                audios.push(pushingElement)
                for (const x of audios) {
                    if (x.ordinalNumber < action.meta.arg.ordinalNumber)
                        x.ordinalNumber += 1
                }
            })
    }

})

export const { clearAudioData, clearErrorAudios, clearPlaylistAudios, setDownloadProgress, clearPlaylist, showEditPlaylistModal, closeEditPlaylistModal, clearAttachAudios, clearAudios, pause, stop, play, audio, loop, shuffle, mute, volume, switchVolumeScaleType } = audiosSlice.actions;

export default audiosSlice.reducer