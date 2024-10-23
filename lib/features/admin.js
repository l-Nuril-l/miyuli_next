import { axiosErrorToRejectValue } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const getInitialState = () => { return {} }

export const clearAudiosAdmin = createAsyncThunk(
    'admin/clearAudios',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`admin/audios`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const clearVideosAdmin = createAsyncThunk(
    'admin/clearVideos',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`admin/videos`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);
export const clearImagesAdmin = createAsyncThunk(
    'admin/clearImages',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`admin/images`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);
export const clearFilesAdmin = createAsyncThunk(
    'admin/clearFiles',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.get(`admin/files`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

const todoSlice = createSlice({
    name: "todo",
    initialState: getInitialState(),
    reducers: {
        adminAction(items, action) { },
    },
    extraReducers: (builder) => {
        builder.addCase(clearAudiosAdmin.fulfilled, (state, action) => {
        })
    }
})

export const { adminAction } = todoSlice.actions;

export default todoSlice.reducer