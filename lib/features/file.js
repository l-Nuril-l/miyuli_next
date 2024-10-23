import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getInitialState = () => ({
    files: [],
    isFetching: false,
    errors: {},
    hasMore: true
})

export const getFiles = createAsyncThunk(
    'file/getFiles',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`file/getFiles`, { params })
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

export const deleteFile = createAsyncThunk(
    'file/deleteFile',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.delete(`file/` + id)
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

export const updateFile = createAsyncThunk(
    'file/updateFile',
    async function (data, { rejectWithValue }) {
        try {
            const response = await axios.patch(`file`, data)
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

let uploadFilesHandler = async function (params, { rejectWithValue }) {
    try {
        const response = await axios.post(`file/uploadFiles`, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(axiosErrorToRejectValue(error));
    }
};

export const uploadFiles = createAsyncThunk(
    'file/uploadFiles',
    uploadFilesHandler
)

export const uploadFilesOnly = createAsyncThunk(
    'file/uploadFilesOnly',
    uploadFilesHandler
)

export const downloadFile = createAsyncThunk(
    'file/downloadFile',
    async function ({ id, name }, { rejectWithValue }) {
        try {
            // const responseFile = await axios.get(`file/GetFile/` + id);
            // const response = await axios.get(`file/DownloadFile/` + id, {
            //     responseType: 'blob'
            // });
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.type = "_blank";
            link.href = axios.defaults.baseURL + 'file/DownloadFile/' + id;
            link.setAttribute('download', name); //responseFile.data.name
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

const fileSlice = createSlice({
    name: "file",
    initialState: getInitialState(),
    reducers: {
        disposeFiles(items, action) {
            return getInitialState();
        },
        clearErrorFiles(items, action) {
            delete items.errors.main;
            delete items.errors.upload;
        },
        clearErrorFilesModal(items, action) {
            delete items.modal.errors.main;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getFiles.pending, (state, { payload }) => { state.isFetching = true })
            .addCase(getFiles.fulfilled, (state, action) => {
                state.files = state.files.concat(action.payload)
                state.hasMore = action.payload.length > 0
                state.isFetching = false
            })
            .addCase(getFiles.rejected, (state, action) => {
                state.isFetching = false;
                state.errors.main = rejectActionToError(action)
            })
            .addCase(uploadFiles.fulfilled, (state, { payload }) => {
                state.files = state.files.concat(payload);
                state.errors.upload = "uploadFileSuccess";
            })
            .addCase(uploadFiles.rejected, (state, action) => {
                state.errors.upload = rejectActionToError(action);
            })
            .addCase(updateFile.fulfilled, (state, { payload }) => {
                const pos = state.files.findIndex(x => x.id === payload.id);
                if (pos !== -1)
                    state.files[pos] = payload;
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                const pos = state.files.findIndex(x => x.id === action.meta.arg);
                if (pos !== -1) state.files.splice(pos, 1)
            })
    }
})

export const { clearErrorFilesModal, disposeFiles, clearErrorFiles } = fileSlice.actions;

export default fileSlice.reducer