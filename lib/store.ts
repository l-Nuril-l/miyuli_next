import { StoreInitialVlaues } from '@/app/_providers/StoreProvider';
import accountReducer from '@/lib/features/account';
import audioReducer, { getAudioInitialState } from "@/lib/features/audio";
import authReducer, { getAuthInitialState } from "@/lib/features/auth";
import callReducer from "@/lib/features/call";
import communityReducer from "@/lib/features/community";
import fileReducer from "@/lib/features/file";
import filtersReducer from "@/lib/features/filters";
import friendsReducer from "@/lib/features/friends";
import messengerReducer from "@/lib/features/messenger";
import miyuliReducer, { getMiyuliInitialState } from "@/lib/features/miyuli";
import photoReducer from "@/lib/features/photo";
import postsReducer from "@/lib/features/posts";
import roleReducer from "@/lib/features/role";
import searchReducer from "@/lib/features/search";
import themeReducer, { getThemeInitialState } from "@/lib/features/theme";
import todoReducer from "@/lib/features/todo";
import videoReducer from "@/lib/features/video";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { handleUnauthorizedMiddleware } from "./middlewares/handleUnauthorizedMiddleware";

const logger = createLogger({
    predicate: (getState, action) => !action.type.includes('audio/volume') && typeof window !== 'undefined',
    //...other options
});

export const makeStore = (storeInitialValues: StoreInitialVlaues) => {
    const { isMobileDevice, auth, theme } = storeInitialValues;
    return configureStore({
        reducer: combineReducers({
            todo: todoReducer,
            account: accountReducer,
            theme: themeReducer,
            auth: authReducer,
            messenger: messengerReducer,
            friends: friendsReducer,
            audio: audioReducer,
            video: videoReducer,
            posts: postsReducer,
            community: communityReducer,
            photo: photoReducer,
            file: fileReducer,
            role: roleReducer,
            filters: filtersReducer,
            search: searchReducer,
            call: callReducer,
            miyuli: miyuliReducer,
        }),
        preloadedState: {
            auth: getAuthInitialState(auth),
            theme: getThemeInitialState(theme),
            miyuli: getMiyuliInitialState(isMobileDevice),
            audio: getAudioInitialState(isMobileDevice),
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger).concat(handleUnauthorizedMiddleware),
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']