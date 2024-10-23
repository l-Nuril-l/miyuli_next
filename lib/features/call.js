import { axiosErrorToRejectValue } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const RTCStates = { NONE: 0, OFFER: 1, ANSWER: 2, CONNECTED: 3 };
// export const CallType = { DM: 0, GROUP: 1 }

const getInitialState = () => ({
    incomingCalls: [],
    outgoingCall: null,
    call: null,
    accounts: {},
    settings: {
        audio: true,
        video: false,
        display: false
    }
})


export const getAccountCall = createAsyncThunk(
    'call/getAccount',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.get(`accounts/${id}`)
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
)

const callSlice = createSlice({
    name: "call",
    initialState: getInitialState(),
    reducers: {
        setOutgoingCall(items, { payload }) {
            items.outgoingCall = payload
        },
        addIncomingCall(items, { payload }) {
            items.incomingCalls.push(payload)
        },
        callDeclined(items, { payload }) {
            if ((items.outgoingCall < 0 ? items.outgoingCall : items.outgoingCall) === payload)
                items.outgoingCall = null
        },
        callEnded(items, { payload }) {
            items.outgoingCall = null
            if (payload) {
                const index = items.incomingCalls.findIndex(x => payload < 0 ? x.chatId === payload : x.accountId === payload)
                if (index !== -1) items.incomingCalls.splice(index, 1)
            }
            if (payload === items.call) {
                items.call = null
            }
        },
        callAccepted(items, { payload }) {
            items.outgoingCall = null
            items.call = payload
        },
        callAccept(items, { payload }) {
            const index = items.incomingCalls.findIndex(x => x.chatId ? x.chatId === payload.chatId : x.accountId === payload.accountId)
            if (index !== -1) items.incomingCalls.splice(index, 1)
            items.call = payload.chatId ? -payload.chatId : payload.accountId
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAccountCall.fulfilled, (state, action) => { state.accounts[action.meta.arg] = action.payload })
    }
})

export const { callEnded, setOutgoingCall, addIncomingCall, callDeclined, callAccepted, callAccept } = callSlice.actions;

export default callSlice.reducer