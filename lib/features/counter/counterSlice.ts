import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: "counter", initialState: 0, reducers: {
        initializeCount(state, action) {
            state = action.payload
            return state
        },
    }
})

export const counterReducer = counterSlice.reducer;
export const { initializeCount } = counterSlice.actions;