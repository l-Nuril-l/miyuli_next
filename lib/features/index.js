import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from 'redux-logger';
import accountReducer from "./account";
import audioReducer from "./audio";
import authReducer from "./auth";
import callReducer from "./call";
import communityReducer from "./community";
import fileReducer from "./file";
import filtersReducer from "./filters";
import friendsReducer from "./friends";
import messengerReducer from "./messenger";
import { handleUnauthorizedMiddleware } from "./middlewares/handleUnauthorizedMiddleware";
import miyuliReducer from "./miyuli";
import photoReducer from "./photo";
import postsReducer from "./posts";
import roleReducer from "./role";
import searchReducer from "./search";
import themeReducer from "./theme";
import todoReducer from "./todo";
import videoReducer from "./video";

const logger = createLogger({
  predicate: (getState, action) => !action.type.includes('audio/volume')
  //...other options
});

const store = configureStore({
  reducer: {
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
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger).concat(handleUnauthorizedMiddleware),
});

export default store;