import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {StatusApi} from "./api";

export const getBlockedUsers = createAsyncThunk(
  "status/getBlockedUsers",
  StatusApi.getBlockedUsers,
);

export const currentUserBlockedUser = createAsyncThunk(
  "status/currentUserBlockedUser",
  StatusApi.currentUserBlockedUser,
);

export const currentUserMutesUser = createAsyncThunk(
  "status/currentUserMutesUser",
  StatusApi.currentUserMutesUser,
);

export const currentUserFollowsUser = createAsyncThunk(
  "status/currentUserFollowsUser",
  StatusApi.currentUserFollowsUser,
);

export const toggleMute = createAsyncThunk(
  "status/toggleMute",
  StatusApi.toggleMute,
);

export const toggleFollowing = createAsyncThunk(
  "status/toggleFollowing",
  StatusApi.toggleFollowing,
);

export const toggleBlock = createAsyncThunk(
  "status/toggleBlock",
  StatusApi.toggleBlock,
);

export const statusSlice = createSlice({
  name: "status",
  initialState: {
    following: {},
    muted: {},
    blocked: {},
    postStats: {},
    commentStats: {},
    loading: false,
  },
  reducers: {
    changeFollowingStatus(state, action) {
      const {userId, status} = action.payload;
      state.following[userId] = status;
    },
    setFollowingStatus(state, action) {
      const {status} = action.payload;
      state.following = status;
    },
    changeMutedStatus(state, action) {
      const {userId, status} = action.payload;
      state.muted[userId] = status;
    },
    setMutedStatus(state, action) {
      const {status} = action.payload;
      state.muted = status;
    },
    changeBlockedStatus(state, action) {
      const {userId, status} = action.payload;
      state.blocked[userId] = status;
    },
    setBlockedStatus(state, action) {
      const {status} = action.payload;
      state.blocked = status;
    },
    changePostStats(state, action) {
      const {postId, stats} = action.payload;
      let postStats = {};
      if (state.postStats[postId] !== undefined) {
        postStats = state.postStats[postId];
      }
      state.postStats[postId] = {
        ...postStats,
        ...stats,
      };
    },
    setPostStats(state, action) {
      const {postId, stats} = action.payload;
      state.postStats[postId] = stats;
    },
    changeCommentStats(state, action) {
      const {commentId, stats} = action.payload;
      let commentStats = {};
      if (state.commentStats[commentId] !== undefined) {
        commentStats = state.commentStats[commentId];
      }
      state.commentStats[commentId] = {
        ...commentStats,
        ...stats,
      };
    },
    setCommentStats(state, action) {
      const {commentId, stats} = action.payload;
      state.commentStats[commentId] = stats;
    },
    resetUsersStatus(state) {
      state.following = {};
      state.muted = {};
      state.blocked = {};
      state.postStats = {};
      state.commentStats = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBlockedUsers.fulfilled, (state, {payload}) => {
      payload?.forEach((userId) => (state.blocked[userId] = true));
    });
    builder.addCase(currentUserBlockedUser.fulfilled, (state, {payload}) => {
      if (payload) {
        const [blocked, targetId] = payload;
        state.blocked[targetId] = blocked;
      }
    });
    builder.addCase(currentUserMutesUser.fulfilled, (state, {payload}) => {
      if (payload) {
        const [muted, targetId] = payload;
        state.muted[targetId] = muted;
      }
    });
    builder.addCase(currentUserFollowsUser.fulfilled, (state, {payload}) => {
      if (payload) {
        const [following, targetId] = payload;
        state.following[targetId] = following;
      }
    });
    builder.addCase(toggleMute.fulfilled, (state, {payload}) => {
      if (payload) {
        const [muted, targetId] = payload;
        state.muted[targetId] = muted;
      }
    });
    builder.addCase(toggleFollowing.fulfilled, (state, {payload}) => {
      if (payload) {
        const [following, targetId] = payload;
        state.following[targetId] = following;
      }
    });
    builder.addCase(toggleBlock.fulfilled, (state, {payload}) => {
      if (payload) {
        const [blocked, targetId] = payload;
        state.blocked[targetId] = blocked;
      }
    });
  },
});

export const {
  changeFollowingStatus,
  setFollowingStatus,
  changeMutedStatus,
  setMutedStatus,
  changeBlockedStatus,
  setBlockedStatus,
  resetUsersStatus,
  changePostStats,
  setPostStats,
  changeCommentStats,
  setCommentStats,
} = statusSlice.actions;
