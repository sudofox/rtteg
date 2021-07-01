import {createSlice, createAsyncThunk, createAction} from "@reduxjs/toolkit";
import {PostApi} from "../api";

const NS = "post";

const initialState = {
  postSubmit: {
    data: {},
    isLoading: false,
    error: false,
    success: false,
  },
  repostSubmit: {
    data: {},
    isLoading: false,
    error: false,
    success: false,
  },
  commentSubmit: {
    data: {},
    isLoading: false,
    error: false,
    success: false,
  },
  popupRepost: {
    popupDialogOpen: false,
    postId: "",
    item: {},
    sharedObj: {},
    user: {},
    originalUser: {},
    embededPost: {},
    embededUser: {},
    loggedinUserId: "",
    hideDropdown: () => {},
    handleStats: () => {},
    toggleOpen: () => {},
  },
  popupComment: {
    popupDialogOpen: false,
    postId: "",
    item: {},
    sharedObj: {},
    user: {},
    originalUser: {},
    embededPost: {},
    embededUser: {},
    loggedinUserId: "",
    alreadyReposted: {},
    hideDropdown: () => {},
    propOnSubmit: () => {},
    toggleOpen: () => {},
  },
  popupImages: {
    open: false,
    postId: null,
    item: null,
    sharedObj: {},
    imageURLs: [],
    headerContent: {},
    currentIndex: null,
    type: "post",
    xStats: null,
    hidePostStatLine: false,
    onClose: () => {},
  },
};

export const postSubmit = createAsyncThunk(
  "post/postSubmit",
  PostApi.postSubmit,
);

export const repostSubmit = createAsyncThunk(
  "post/repostSubmit",
  PostApi.repostSubmit,
);

export const commentSubmit = createAsyncThunk(
  "post/commentSubmit",
  PostApi.commentSubmit,
);

export const setPopupComment = createAction(`${NS}/setPopupComment`);
export const togglePopupComment = createAction(`${NS}/togglePopupComment`);
export const setPopupRepost = createAction(`${NS}/setPopupRepost`);
export const togglePopupRepost = createAction(`${NS}/togglePopupRepost`);
export const setPopupImages = createAction(`${NS}/setPopupImages`);

export const postSlice = createSlice({
  name: NS,
  initialState,
  reducers: {
    setPopupComment: (state, {payload}) => {
      state.popupComment = payload;
    },
    togglePopupComment: (state, {payload}) => {
      state.popupComment.popupDialogOpen = payload;
    },
    setPopupRepost: (state, {payload}) => {
      state.popupRepost = payload;
    },
    togglePopupRepost: (state, {payload}) => {
      state.popupRepost.popupDialogOpen = payload;
    },
    setPopupImages: (state, {payload}) => {
      state.popupImages = payload;
    },
  },
  extraReducers: (builder) => {
    // Doc: https://redux-toolkit.js.org/usage/usage-with-typescript#type-safety-with-extrareducers

    builder.addCase(postSubmit.pending, (state) => {
      state.postSubmit.success = false;
      state.postSubmit.isLoading = true;
      state.postSubmit.error = false;
    });

    builder.addCase(postSubmit.fulfilled, (state, {payload}) => {
      state.postSubmit.isLoading = false;

      if (payload) {
        state.postSubmit.error = false;
        state.postSubmit.success = true;
        state.postSubmit.data = payload;
      } else {
        state.postSubmit.error = true;
        state.postSubmit.success = false;
      }
    });

    builder.addCase(postSubmit.rejected, (state) => {
      state.postSubmit.success = false;
      state.postSubmit.isLoading = false;
      state.postSubmit.error = true;
    });

    builder.addCase(repostSubmit.pending, (state) => {
      state.repostSubmit.success = false;
      state.repostSubmit.isLoading = true;
      state.repostSubmit.error = false;
    });

    builder.addCase(repostSubmit.fulfilled, (state, {payload}) => {
      state.repostSubmit.isLoading = false;

      if (payload) {
        state.repostSubmit.error = false;
        state.repostSubmit.success = true;
        state.repostSubmit.data = payload;
      } else {
        state.repostSubmit.error = true;
        state.repostSubmit.success = false;
      }
    });

    builder.addCase(repostSubmit.rejected, (state) => {
      state.repostSubmit.success = false;
      state.repostSubmit.isLoading = false;
      state.repostSubmit.error = true;
    });

    builder.addCase(commentSubmit.pending, (state) => {
      state.commentSubmit.success = false;
      state.commentSubmit.isLoading = true;
      state.commentSubmit.error = false;
    });

    builder.addCase(commentSubmit.fulfilled, (state, {payload}) => {
      state.commentSubmit.isLoading = false;

      if (payload) {
        state.commentSubmit.error = false;
        state.commentSubmit.success = true;
        state.commentSubmit.data = payload;
      } else {
        state.commentSubmit.error = true;
        state.commentSubmit.success = false;
      }
    });

    builder.addCase(commentSubmit.rejected, (state) => {
      state.commentSubmit.success = false;
      state.commentSubmit.isLoading = false;
      state.commentSubmit.error = true;
    });
  },
});
