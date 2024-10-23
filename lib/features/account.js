import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { updateSessionAvatarAndCrop } from './auth';

export const fetchAccount = createAsyncThunk(
    'account/fetchAccount',
    async function (id, { rejectWithValue }) {
        return axios.get(`accounts/ProfileByIdOrLogin/${id}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const getSettingsAccount = createAsyncThunk(
    'account/getSettingsAccount',
    async function (id, { rejectWithValue }) {
        return axios.get(`accounts/ProfileByIdOrLogin/${id}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const uploadAvatar = createAsyncThunk(
    'account/uploadAvatar',
    async function (params, { dispatch, rejectWithValue }) {
        try {
            const response = await axios.post(`accounts/UploadAvatar`, params, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(updateSessionAvatarAndCrop(response.data));
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const addFriend = createAsyncThunk(
    'account/addFriend',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.post(`friends/addFriend/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const deleteFriend = createAsyncThunk(
    'account/deleteFriend',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.post(`friends/deleteFriend/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const updateStatus = createAsyncThunk(
    'account/updateStatus',
    async function (status, { rejectWithValue }) {
        try {
            await axios.patch(`accounts/updateStatus`, { status });
            return status;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const changeLogin = createAsyncThunk(
    'account/changeLogin',
    async function (data, { rejectWithValue }) {
        try {
            const response = await axios.patch(`accounts/changeLogin`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const changePhoneNumber = createAsyncThunk(
    'account/changePhoneNumber',
    async function (data, { rejectWithValue }) {
        try {
            const response = await axios.patch(`accounts/changePhoneNumber`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const changeFullName = createAsyncThunk(
    'account/changeFullName',
    async function (data, { rejectWithValue }) {
        try {
            const response = await axios.patch(`accounts/changeFullName`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const changePassword = createAsyncThunk(
    'account/changePassword',
    async function (credentials, { rejectWithValue }) {
        try {
            const response = await axios.post(`accounts/ChangePassword`, credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const changeEmail = createAsyncThunk(
    'account/changeEmail',
    async function (email, { rejectWithValue }) {
        try {
            const response = await axios.patch(`accounts/changeEmail`, email);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const changeDateOfBirth = createAsyncThunk(
    'account/changeDateOfBirth',
    async function (birthOfBirth, { rejectWithValue }) {
        try {
            const response = await axios.patch(`accounts/changeDateOfBirth`, birthOfBirth);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const patchAccount = createAsyncThunk(
    'account/patchAccount',
    async function (params, { rejectWithValue }) {
        try {
            const response = await axios.patch(`accounts`, params);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const getPaymentInfo = createAsyncThunk(
    'account/getPaymentInfo',
    async function (_, { rejectWithValue }) {
        try {
            const response = await axios.get(`accounts/PaymentInfo`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const captureOrder = createAsyncThunk(
    'account/captureOrder',
    async function (resourceID, { rejectWithValue }) {
        try {
            const response = await axios.post("payment/paypal/capture-order", resourceID);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

const accountSlice = createSlice({
    name: "account",
    initialState: {
        account: null,
        errors: {},
        isFetching: false,
    },
    reducers: {
        initializeProfile(items, action) {
            items.account = action.payload
        },
        disposeAccount(items, action) {
            items.account = null
        },
        disposeSettings(items, action) {
            items.settings = null
            delete items.errors.settings;
        },
        disposePaymentInfo(items, action) {
            items.paymentInfo = null
            delete items.errors.paymentInfo;
        },
        setAccount(items, action) {
            items.account = action.payload
        },
        updateProfileAvatar(items, { payload }) {
            items.account.avatar = payload.avatar
            items.account.avatarCrop = payload.avatarCrop
        },
        clearErrors(items, action) {
            items.errors = {};
            delete items.accountUpdateSuccess;
        },
        changePasswordError(items, action) {
            items.errors.changePasswordError = action.payload;
        },
        clearErrorAccount(items, action) {
            delete items.errors.main;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccount.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(fetchAccount.fulfilled, (state, action) => {
                state.account = action.payload
                state.isFetching = false;
                delete state.errors.main;
            })
            .addCase(fetchAccount.rejected, (state, action) => {
                state.errors.main = rejectActionToError(action)
                state.isFetching = false;
            })
            .addCase(getSettingsAccount.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(getSettingsAccount.fulfilled, (state, action) => {
                state.settings = action.payload
                state.isFetching = false;
                delete state.errors.settings;
            })
            .addCase(getSettingsAccount.rejected, (state, action) => {
                state.errors.settings = rejectActionToError(action)
                state.isFetching = false;
            })
            .addCase(getPaymentInfo.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(getPaymentInfo.fulfilled, (state, action) => {
                state.paymentInfo = action.payload
                state.isFetching = false;
                delete state.errors.paymentInfo;
            })
            .addCase(getPaymentInfo.rejected, (state, action) => {
                state.errors.paymentInfo = rejectActionToError(action)
                state.isFetching = false;
            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                state.account.status = action.payload
            })
            .addCase(captureOrder.fulfilled, (state, action) => {
                state.paymentInfo.balance = action.payload.balance;
                var index = state.paymentInfo.transactions.findIndex(x => x.resourceID === action.meta.arg)
                if (index != -1)
                    state.paymentInfo.transactions[index] = action.payload.transaction
                else
                    state.paymentInfo.transactions.unshift(action.payload.transaction);
            })
            .addCase(changePassword.pending, (state, action) => { delete state.errors.changePasswordError; })
            .addCase(changePassword.rejected, (state, action) => {
                if (action.payload?.errors) state.errors.changePasswordError = Object.entries(action.payload.errors)[0][1];
                else state.errors.changePasswordError = action.payload || "networkError"
            })
            .addCase(changePassword.fulfilled, (state, action) => { state.accountUpdateSuccess = "passwordChanged"; state.settings.login = action.meta.arg.login })
            .addCase(changeFullName.pending, (state, action) => { delete state.errors.changeFullNameError })
            .addCase(changeFullName.rejected, (state, action) => {
                if (action.payload?.errors) state.errors.changeFullNameError = Object.entries(action.payload.errors)[0][1];
                else state.errors.changeFullNameError = action.payload || "networkError"
            })
            .addCase(changeFullName.fulfilled, (state, action) => {
                state.accountUpdateSuccess = "fullNameChanged"; state.settings.name = action.meta.arg.name; state.settings.surname = action.meta.arg.surname
            })
            .addCase(changeLogin.pending, (state, action) => { delete state.errors.changeLoginError })
            .addCase(changeLogin.rejected, (state, action) => {
                if (action.payload?.errors) state.errors.changeLoginError = Object.entries(action.payload.errors)[0][1];
                else state.errors.changeLoginError = action.payload || "networkError"
            })
            .addCase(changeLogin.fulfilled, (state, action) => { state.accountUpdateSuccess = "loginChanged"; })
            .addCase(changePhoneNumber.pending, (state, action) => { delete state.errors.changePhoneNumberError })
            .addCase(changePhoneNumber.rejected, (state, action) => {
                if (action.payload?.errors) state.errors.changePhoneNumberError = Object.entries(action.payload.errors)[0][1];
                else state.errors.changePhoneNumberError = action.payload || "networkError"
            })
            .addCase(changePhoneNumber.fulfilled, (state, action) => { state.accountUpdateSuccess = "phoneNumberChanged"; })
            .addCase(changeEmail.pending, (state, action) => { delete state.errors.changeEmailError })
            .addCase(changeEmail.rejected, (state, action) => {
                if (action.payload?.errors) state.errors.changeEmailError = Object.entries(action.payload.errors)[0][1];
                else state.errors.changeEmailError = action.payload || "networkError"
            })
            .addCase(changeEmail.fulfilled, (state, action) => { state.accountUpdateSuccess = "emailChanged"; state.settings.email = action.meta.arg.email })
            .addCase(changeDateOfBirth.pending, (state, action) => { delete state.errors.changeDateOfBirthError })
            .addCase(changeDateOfBirth.rejected, (state, action) => {
                if (action.payload?.errors) state.errors.changeDateOfBirthError = Object.entries(action.payload.errors)[0][1];
                else state.errors.changeDateOfBirthError = action.payload || "networkError"
            })
            .addCase(changeDateOfBirth.fulfilled, (state, action) => { state.accountUpdateSuccess = "dateOfBirthChanged"; state.settings.dateOfBirth = action.meta.arg.dateOfBirth })
            .addCase(patchAccount.pending, (state, action) => { delete state.errors.patchAccountError })
            .addCase(patchAccount.rejected, (state, action) => {
                if (action.payload?.errors) state.errors.patchAccountError = Object.entries(action.payload.errors)[0][1];
                else state.errors.patchAccountError = action.payload || "networkError"
            })
            .addCase(patchAccount.fulfilled, (state, action) => { state.patchAccountSuccess = "saved"; })
            .addCase(addFriend.fulfilled, (state, action) => {
                state.account.friendState = 1;
            })
            .addCase(deleteFriend.fulfilled, (state, action) => {
                state.account.friendState = 0;
            })
    }
})

export const { disposePaymentInfo, clearErrorAccount, setAccount, updateProfileAvatar, clearErrors, changePasswordError, disposeAccount, disposeSettings, initializeProfile } = accountSlice.actions;

export default accountSlice.reducer