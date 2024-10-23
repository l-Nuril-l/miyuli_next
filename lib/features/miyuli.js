import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getMiyuliInitialState = (isMobileDevice) => {
    return {
        isDragging: false,
        API_URL: process.env.NEXT_PUBLIC_API,
        isMobileDevice: isMobileDevice ?? false
    }
};
//.addMatcher(isAnyOf (createTodoSuccess, updateTodoSuccess),
const miyuliSlice = createSlice({
    name: "miyuli",
    initialState: getMiyuliInitialState(),
    reducers: {
        setIsDragging(items, action) {
            items.isDragging = action.payload;
        },
        switchAPI(items, action) {
            items.API_URL = action.payload
            axios.defaults.baseURL = action.payload
        }
    }
})

export const { setIsDragging, switchAPI } = miyuliSlice.actions;

export default miyuliSlice.reducer