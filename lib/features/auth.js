import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { deleteCookie, setCookie } from 'cookies-next';
import { jwtDecode } from "jwt-decode";
import { setAccount } from './account';


export const getAuthInitialState = (initialData) => {
    var sessionJson = initialData?.session ?? null;
    var roles = []
    var authData = JSON.parse(sessionJson)
    if (sessionJson) {
        axios.defaults.headers.common['Authorization'] = "Bearer " + authData.access_token;
        let raw_roles = jwtDecode(authData.access_token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        roles = Array.isArray(raw_roles) ? raw_roles : (raw_roles ? [raw_roles] : [])
    }

    return {
        isAuthenticated: !!authData,
        session: authData || null,
        rejected: null,
        roles: roles,
        processing: false,
        account: initialData?.account
    };
}

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async function (email, { rejectWithValue }) {
        return axios.post(`Auth/ResetPassword`, email).then((r) => {
            return r.data;
        }).catch(e => {
            return rejectWithValue(axiosErrorToRejectValue(e))
        });
    }
)

export const validateResetToken = createAsyncThunk(
    'auth/validateResetToken',
    async function (token, { rejectWithValue }) {
        return axios.get(`Auth/ResetPassword/${token}`).then((r) => {
            return r.data;
        }).catch(e => {
            return rejectWithValue(axiosErrorToRejectValue(e))
        });
    }
)

export const setNewPasswordWithResetToken = createAsyncThunk(
    'auth/setNewPasswordWithResetToken',
    async function (data, { rejectWithValue }) {
        return axios.patch(`Auth/ResetPassword`, data).then((r) => {
            return r.data;
        }).catch(e => {
            return rejectWithValue(axiosErrorToRejectValue(e))
        });
    }
)

export const signIn = createAsyncThunk(
    'auth/signIn',
    async function (credentials, { rejectWithValue }) {
        return axios.post(`Auth/login`, credentials).then(r => {
            setCookie("auth", JSON.stringify(r.data));
            setCookie("token", r.data.access_token);
            return r.data;
        }).catch(e => {
            return rejectWithValue(axiosErrorToRejectValue(e))
        });
    }
)

export const signInGoogle = createAsyncThunk(
    'auth/signInGoogle',
    async function ({ credential, remember }, { rejectWithValue }) {
        return axios.post(`Auth/google`, {}, { params: { jwt: credential, remember } }).then((r) => {
            setCookie("auth", JSON.stringify(r.data));
            setCookie("token", r.data.access_token);
            return r.data;
        }).catch(e => {
            return rejectWithValue(axiosErrorToRejectValue(e))
        });
    }
)

export const signUp = createAsyncThunk(
    'auth/signUp',
    async function (credentials, { dispatch, rejectWithValue }) {
        return axios.post(`Auth/register`, credentials).then((r) => {
            dispatch(signIn({ "login": credentials.login, "password": credentials.password }))
            dispatch(setAccount(r.data))
            return r.data;
        }).catch(e => {
            return rejectWithValue(axiosErrorToRejectValue(e))
        });
    }
)

export const getSelf = createAsyncThunk(
    'auth/getSelf',
    async function (credentials, { rejectWithValue }) {
        return axios.post(`auth/self`, credentials).then((r) => {
            return r.data;
        }).catch(e => {
            return rejectWithValue(axiosErrorToRejectValue(e))
        });
    }
)

export const updateAvatar = createAsyncThunk(
    'auth/updateAvatar',
    async function (params, { rejectWithValue }) {
        return axios.patch(`accounts/UpdateAvatar`, params).then((r) => {
            return r.data;
        }).catch(e => {
            return rejectWithValue(axiosErrorToRejectValue(e))
        });
    }
)

export const test401 = createAsyncThunk(
    'auth/test401',
    async function (params, { rejectWithValue }) {
        return axios.get(`test/401`, params).then((r) => {
            return r.data;
        }).catch(e => {
            return rejectWithValue(axiosErrorToRejectValue(e))
        });
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: getAuthInitialState(),
    reducers: {
        logout(items, action) {
            deleteCookie("auth");
            deleteCookie("token");
            items.isAuthenticated = false;
            items.session = null;
            items.roles = [];
            delete axios.defaults.headers.common['Authorization'];
        },
        updateSessionAvatarAndCrop(items, action) {
            Object.assign(items.account, action.payload);
        },
        clearErrors(items, action) {
            items.rejected = null;
        },
        testJWT(items, action) {
            axios.defaults.headers.common['Authorization'] = items.session.access_token.replace('f', 'a').replace('i', 'l').replace('u', 'r').replace('e', '!');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateAvatar.fulfilled, (state, { payload }) => {
                state.account.avatar = payload.avatar
                state.account.avatarCrop = payload.avatarCrop
            })
            .addCase(signIn.pending, (state, action) => { state.processing = true })
            .addCase(signIn.fulfilled || signInGoogle.fulfilled, (state, action) => {
                state.session = action.payload
                let raw_roles = jwtDecode(action.payload.access_token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                state.roles = Array.isArray(raw_roles) ? raw_roles : [raw_roles]
                axios.defaults.headers.common['Authorization'] = "Bearer " + action.payload.access_token;
                state.processing = false
                state.isAuthenticated = true
            })
            .addCase(signIn.rejected, (state, action) => {
                state.processing = false
                state.rejected = rejectActionToError(action)
            })
            .addCase(signInGoogle.fulfilled, (state, action) => {
                state.session = action.payload
                let raw_roles = jwtDecode(action.payload.access_token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                state.roles = Array.isArray(raw_roles) ? raw_roles : [raw_roles]
                axios.defaults.headers.common['Authorization'] = "Bearer " + action.payload.access_token;
                state.isAuthenticated = true
            })
            .addCase(signInGoogle.rejected, (state, action) => {
                state.rejected = rejectActionToError(action)
            })
            .addCase(signUp.pending, (state, action) => { state.processing = true })
            .addCase(signUp.fulfilled, (state, action) => {
                state.processing = false
                state.session = action.payload
            })
            .addCase(signUp.rejected, (state, action) => {
                state.rejected = rejectActionToError(action)
                state.processing = false
            })
            .addCase(getSelf.pending, (state, action) => {
                state.processing = true;
            })
            .addCase(getSelf.fulfilled, (state, action) => {
                state.processing = false;
                state.account = { ...action.payload }
            })
            .addCase(getSelf.rejected, (state, action) => {
                state.processing = false;
            })
            .addCase(setNewPasswordWithResetToken.rejected, (state, action) => {
                state.rejected = rejectActionToError(action)
            })
    }
})

export const { updateSessionAvatarAndCrop, logout, clearErrors } = authSlice.actions

export default authSlice.reducer