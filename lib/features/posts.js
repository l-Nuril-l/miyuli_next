import { axiosErrorToRejectValue, rejectActionToError } from '@/lib/functions';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendPost = createAsyncThunk(
    'posts/sendPost',
    async function (post, { rejectWithValue, dispatch, getState }) {
        return axios.post(`post`, post)
            .then(response => {
                ((post.accountId !== null && getState().account.account?.id === post.accountId)
                    ||
                    (post.communityId !== null && getState().community.community?.id === post.communityId))
                    && dispatch(newPost(response.data))
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const likePost = createAsyncThunk(
    'posts/likePost',
    async function (params, { dispatch, rejectWithValue, fulfillWithValue }) {
        dispatch(likeAction(params))
        return axios.post(`post/LikePost/${params.id}?like=${params.like}`)
            .then(likes => {
                return fulfillWithValue({ id: params.id, likes: likes.data });
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const suggestCommunityPost = createAsyncThunk(
    'posts/suggestCommunityPost',
    async function (post, { rejectWithValue, dispatch }) {
        return axios.post(`post/suggest`, post)
            .then(response => {
                dispatch(newPost(response.data))
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async function (params, { rejectWithValue }) {
        return axios.get(`post/GetByAccount/${params.id}`, { params })
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const fetchCommunityPosts = createAsyncThunk(
    'posts/fetchCommunityPosts',
    async function (params, { rejectWithValue }) {
        return axios.get(`post/GetByCommunity/${params.id}`, { params })
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const fetchFeedPosts = createAsyncThunk(
    'posts/fetchFeedPosts',
    async function (filters, { rejectWithValue, getState }) {
        return axios.post(`post/GetFeed`, filters)
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async function (id, { rejectWithValue, getState }) {
        return axios.delete(`post/${id}`)
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const reportPost = createAsyncThunk(
    'posts/reportPost',
    async function (id, { rejectWithValue }) {
        return axios.post(`post/report/${id}`)
            .then(response => {
                return response.data;
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const switchComments = createAsyncThunk(
    'posts/switchComments',
    async function (params, { rejectWithValue, getState }) {
        return axios.post(`post/switchComments/${params.id}?state=${params.state}`)
            .then((response) => {
                return { id: params.id, "state": response.data };
            })
            .catch((error) => {
                return rejectWithValue(axiosErrorToRejectValue(error));
            });
    }
);

export const sendComment = createAsyncThunk(
    'posts/sendComment',
    async function (comment, { rejectWithValue }) {
        try {
            const response = await axios.post(`post/SendComment`, comment);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const loadMoreComments = createAsyncThunk(
    'posts/loadMoreComments',
    async function (data, { rejectWithValue }) {
        try {
            const response = await axios.post(`post/MoreComments`, data);
            return ({ response: response.data, id: data.id });
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const deletePostComment = createAsyncThunk(
    'posts/deletePostComment',
    async function (comment, { rejectWithValue }) {
        try {
            const response = await axios.post(`post/DeleteComment/${comment.id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const getPostReports = createAsyncThunk(
    'posts/getPostReports',
    async function (_, { rejectWithValue }) {
        try {
            const response = await axios.get(`post/Reports`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const deletePostAdmin = createAsyncThunk(
    'posts/deletePostAdmin',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.delete(`post/admin/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const acceptPostReport = createAsyncThunk(
    'posts/acceptPostReport',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.post(`post/acceptReport/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

export const rejectPostReport = createAsyncThunk(
    'posts/rejectPostReport',
    async function (id, { rejectWithValue }) {
        try {
            const response = await axios.post(`post/rejectReport/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(axiosErrorToRejectValue(error));
        }
    }
);

const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        isFetching: false,
        hasMore: true,
        errors: {}
    },
    reducers: {
        disposePosts(items, action) {
            items.posts = [];
            items.hasMore = true;
            delete items.errors.main;
        },
        disposePostReports(items, action) {
            items.posts = [];
        },
        newPost(items, action) {
            items.posts.unshift(action.payload);
        },
        likeAction(items, action) {
            var post = items.posts.find(x => x.id === action.payload.id);
            post.likesCount += action.payload.like
            post.isLiked = action.payload.like
        },
        clearErrorPosts(items, action) {
            delete items.errors.main;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPostReports.fulfilled, (state, action) => {
            state.posts = action.payload;
        })
            .addCase(fetchPosts.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.isFetching = false
                state.hasMore = action.payload.length > 0;
                state.posts = [...state.posts, ...action.payload]
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.isFetching = false
                state.errors.main = rejectActionToError(action)
            })
            .addCase(fetchCommunityPosts.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(fetchCommunityPosts.fulfilled, (state, action) => {
                state.isFetching = false
                state.hasMore = action.payload.length > 0;
                state.posts = [...state.posts, ...action.payload]
            })
            .addCase(fetchCommunityPosts.rejected, (state, action) => {
                state.isFetching = false
                state.errors.main = rejectActionToError(action)
            })
            .addCase(fetchFeedPosts.pending, (state, action) => {
                state.isFetching = true
            })
            .addCase(fetchFeedPosts.fulfilled, (state, action) => {
                state.isFetching = false
                state.hasMore = action.payload.length > 0;
                state.posts = [...state.posts, ...action.payload]
            })
            .addCase(fetchFeedPosts.rejected, (state, action) => {
                state.isFetching = false
                state.errors.main = rejectActionToError(action)
            })
            .addCase(switchComments.fulfilled, (state, action) => {
                state.posts.find(x => x.id === action.payload.id).commentsDisabled = action.payload.state;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts.splice(state.posts.findIndex(x => x.id === action.payload.id), 1);
            })
            .addCase(deletePostAdmin.fulfilled, (state, action) => {
                state.posts.splice(state.posts.findIndex(x => x.id === action.meta.arg), 1);
            })
            .addCase(sendComment.fulfilled, (state, action) => {
                const post = state.posts.find(x => x.id === action.payload.postId);
                post.comments.unshift(action.payload);
                post.commentsCount += 1;

            })
            .addCase(deletePostComment.fulfilled, (state, action) => {
                const post = state.posts.find(x => x.id === action.payload.postId);
                post.commentsCount -= 1;
                let deleteIndex = post.comments.findIndex(x => x.id === action.payload.id);
                post.comments.splice(deleteIndex, 1);
            })
            .addCase(likePost.fulfilled, (state, action) => {
                state.posts.find(x => x.id === action.payload.id).likesCount = action.payload.likes;
                return state
            })
            .addCase(likePost.rejected, (state, action) => {
                const args = action.meta.arg;
                const post = state.posts.find(x => x.id === args.id)
                post.isLiked = !post.isLiked
                post.likesCount += post.like ? 1 : -1;
            })
            .addCase(loadMoreComments.fulfilled, (state, action) => {
                state.posts.find(x => x.id === action.payload.id).comments = state.posts.find(x => x.id === action.payload.id).comments.concat(action.payload.response);
                return state
            })
    }
})

export const { clearErrorPosts, newPost, likeAction, disposePosts, disposePostReports } = postsSlice.actions;

export default postsSlice.reducer