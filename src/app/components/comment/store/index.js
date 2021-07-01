import {createSlice, createAsyncThunk, createAction} from "@reduxjs/toolkit";
import {CommentApi} from "../api";
import {commentsConstants} from "../_constants";

const NS = "userComments";

const initialState = {
  commentFeed: {
    data: [],
    likedComments: [],
    sharedComments: [],
    offset: 0,
    isLoading: false,
    error: false,
    success: false,
    reachEnd: false,
  },
};

export const fetchUserComments = createAsyncThunk(
  "Comment/fetchUserComments",
  CommentApi.fetchUserComments,
);
export const clearUserComments = createAction(`${NS}/clearUserComments`);
export const incrementOffset = createAction(`${NS}/incrementOffset`);

export const userCommentsSlice = createSlice({
  name: NS,
  initialState,
  reducers: {
    resetTimelineStatus: (state) => {
      state.commentFeed.error = false;
      state.commentFeed.isLoading = false;
      state.commentFeed.success = false;
      state.commentFeed.reachEnd = false;
    },
    resetTimelineData: (state) => {
      state.commentFeed.data = [];
      state.commentFeed.likedComments = [];
      state.commentFeed.sharedComments = [];
    },
    clearUserComments: (state) => {
      state.commentFeed.data = [];
      state.commentFeed.offset = 0;
      state.commentFeed.reachEnd = false;
    },
    incrementOffset: (state) => {
      state.commentFeed.offset++;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserComments.pending, (state) => {
      state.commentFeed.success = false;
      state.commentFeed.isLoading = true;
      state.commentFeed.error = false;
      state.commentFeed.reachEnd = false;
    });

    builder.addCase(fetchUserComments.fulfilled, (state, {payload}) => {
      if (
        payload &&
        payload.posts &&
        payload.posts.length + payload.nbrRemoved <
          commentsConstants.MAX_BATCH_SIZE
      ) {
        state.commentFeed.reachEnd = true;
      }

      if (payload && payload.posts) {
        state.commentFeed.error = false;
        state.commentFeed.success = true;

        const newPosts = [...state.commentFeed.data, ...payload.posts];
        let newlikedComments = [];
        let newsharedComments = [];
        if (payload.likedComments) {
          newlikedComments = [
            ...state.commentFeed.likedComments,
            ...payload.likedComments,
          ];
        }
        if (payload.sharedComments) {
          newsharedComments = [
            ...state.commentFeed.sharedComments,
            ...payload.sharedComments,
          ];
        }

        state.commentFeed.data = newPosts;
        state.commentFeed.likedComments = newlikedComments;
        state.commentFeed.sharedComments = newsharedComments;
      } else {
        state.commentFeed.error = true;
        state.commentFeed.success = false;
        state.commentFeed.reachEnd = false;
      }

      state.commentFeed.isLoading = false;
    });

    builder.addCase(fetchUserComments.rejected, (state) => {
      state.commentFeed.success = false;
      state.commentFeed.isLoading = false;
      state.commentFeed.error = true;
      state.commentFeed.reachEnd = false;
    });
  },
});
