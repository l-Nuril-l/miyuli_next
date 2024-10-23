import { axiosErrorToRejectValue } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";

const getInitialState = () => {
    return {
        staff: [],
        roles: []
    };
}

export const getStaff = createAsyncThunk(
    'role/getStaff',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios
                .get(`role/getStaff`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const switchAccountRole = createAsyncThunk(
    'role/switchAccountRole',
    async (params, { rejectWithValue }) => {
        try {
            const response = await axios
                .post(`role/switchAccountRole`, JSON.stringify(params));
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const giveAccountRole = createAsyncThunk(
    'role/giveAccountRole',
    async (params, { rejectWithValue }) => {
        try {
            const response = await axios
                .post(`role/giveAccountRole`, JSON.stringify(params));
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

const roleSlice = createSlice({
    name: "role",
    initialState: getInitialState(),
    reducers: {
        disposeStaff(items, action) {
            items.accounts = {}
            items.roles = []
            items.staff = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getStaff.pending, (state, action) => { })
            .addCase(getStaff.rejected, (state, action) => { })
            .addCase(getStaff.fulfilled, (state, { payload }) => {
                state.account = payload.account
                state.staff = payload.accounts
                state.roles = payload.roles
            })
            .addCase(switchAccountRole.fulfilled, (state, { payload }) => {
                var index = state.staff.findIndex(x => x.id === payload.id)

                if (index !== -1) {
                    payload.roles.length === 0 ? state.staff.splice(index, 1) : state.staff[index] = payload
                }
                else
                    state.staff.unshift(payload)
            })
            .addCase(giveAccountRole.fulfilled, (state, { payload }) => {
                var index = state.staff.findIndex(x => x.id === payload.id)
                index !== -1 ? state.staff[index] = payload : state.staff.unshift(payload)
            })

    }
})

export const { disposeStaff } = roleSlice.actions

export default roleSlice.reducer