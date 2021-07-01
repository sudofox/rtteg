import {
  createSlice,
  createAsyncThunk,
  createAction,
  current,
} from "@reduxjs/toolkit";
import {TimelineApi} from "../api";
import {timelineConstants} from "../_constants";
import {ActivityLogProps} from "src/core/model/ModelConsts";
import {uniqueKey} from "src/util/Global";

const NS = "timelineNew";

const initialState = {
  userFeed: {
    data: [],
    dataToDisplay: [],
    offset: 0,
    likedPosts: [],
    sharedPosts: [],
    postStats: {},
    isLoading: false,
    error: false,
    reachEnd: false,
    nbrRemoved: 0,
    users: {},
    lastStart: 0,
  },
  refreshProfileFeed: false,
  pinnedPosts: [],
  itemsHeight: [],
  totalHeight: 0,
  topOffset: 0,
  popularUsers: {
    data: [],
    query: {
      offset: 0,
      max: 16,
      incl: "userinfo|followings",
    },
    isInitialized: false,
    isLoading: false,
    reachEnd: false,
    totalCount: 0,
    removedCount: 0,
    followCount: 0,
  },
};

export const getUserFeed = createAsyncThunk(
  "timeline/getUserFeed",
  TimelineApi.getUserFeed,
);

export const getPinnedPost = createAsyncThunk(
  "timeline/getPinnedPost",
  TimelineApi.getPinnedPost,
);

export const resetTimelineStatus = createAction(`${NS}/resetTimelineStatus`);
export const updateDataToDisplay = createAction(`${NS}/updateDataToDisplay`);
export const resetUserFeedOffset = createAction(`${NS}/resetUserFeedOffset`);
export const addItemHeight = createAction(`${NS}/addItemHeight`);
export const setTopOffset = createAction(`${NS}/setTopOffset`);
export const resetTimelineData = createAction(`${NS}/resetTimelineData`);
export const addPost = createAction(`${NS}/addPost`);
export const removePost = createAction(`${NS}/removePost`);
export const removeRepost = createAction(`${NS}/removeRepost`);
export const resetRefreshProfileFeed = createAction(
  `${NS}/resetRefreshProfileFeed`,
);
export const addLikedPost = createAction(`${NS}/addLikedPost`);
export const removeLikedPost = createAction(`${NS}/removeLikedPost`);
export const addSharedPost = createAction(`${NS}/addSharedPost`);
export const removeSharedPost = createAction(`${NS}/removeSharedPost`);
export const setPostStatus = createAction(`${NS}/setPostStatus`);
export const resetPinnedPost = createAction(`${NS}/resetPinnedPost`);
export const removePinnedPost = createAction(`${NS}/removePinnedPost`);
export const updatePostLikedCount = createAction(`${NS}/updatePostLikedCount`);
export const updatePostCommentCount = createAction(
  `${NS}/updatePostCommentCount`,
);
export const updatePostRepostCount = createAction(
  `${NS}/updatePostRepostCount`,
);
export const setPostCounts = createAction(`${NS}/setPostCounts`);
export const incrementOffset = createAction(`${NS}/incrementOffset`);

export const resetPuStatus = createAction(`${NS}/resetPuStatus`);
export const setPuIsLoading = createAction(`${NS}/setPuIsLoading`);
export const setPuReachEnd = createAction(`${NS}/setPuReachEnd`);
export const setPuData = createAction(`${NS}/setPuData`);
export const setPuOffset = createAction(`${NS}/setPuOffset`);
export const setPuTotalCount = createAction(`${NS}/setPuTotalCount`);
export const setPuRemovedCount = createAction(`${NS}/setPuRemovedCount`);
export const removePuByUserId = createAction(`${NS}/removePuByUserId`);

export const timelineSliceNew = createSlice({
  name: NS,
  initialState,
  reducers: {
    resetTimelineStatus: (state) => {
      state.userFeed.error = false;
      state.userFeed.isLoading = false;
      state.userFeed.success = false;
      state.userFeed.reachEnd = false;
    },
    resetUserFeedOffset: (state) => {
      if (state.userFeed.offset !== 0) {
        state.userFeed.offset = 0;
      }
    },
    resetTimelineData: (state) => {
      state.userFeed.data = [];
      state.userFeed.dataToDisplay = [];
      state.userFeed.offset = 0;
      state.userFeed.lastStart = 0;
      state.userFeed.likedPosts = [];
      state.userFeed.sharedPosts = [];
      state.itemsHeight = [];
      state.totalHeight = 0;
    },
    updateDataToDisplay: (state, action) => {
      let {start, end, scrollDirection} = action.payload;
      let lastStart = state.userFeed.lastStart;
      lastStart =
        lastStart === 0 &&
        (scrollDirection === scrollDirection) ===
          timelineConstants.SCROLL_TYPE_UP
          ? 100000
          : lastStart;
      if (
        scrollDirection === timelineConstants.SCROLL_TYPE_DOWN &&
        start - lastStart > 2
      ) {
        state.userFeed.lastStart = start;
        state.userFeed.dataToDisplay = [...state.userFeed.data].slice(
          start,
          end,
        );
      }

      if (
        scrollDirection === timelineConstants.SCROLL_TYPE_UP &&
        lastStart - start > 2
      ) {
        state.userFeed.lastStart = start;
        state.userFeed.dataToDisplay = [...state.userFeed.data].slice(
          start,
          end,
        );
      }
    },

    addItemHeight: (state, action) => {
      if (!action.payload) return;

      const {itemId, itemHeight, index, isNewPost} = action.payload;
      const obj = {
        itemId: itemId,
        height: itemHeight,
        index: index,
        isNewPost: isNewPost,
      };

      let heights = [...state.itemsHeight];

      let newheights;
      if (!heights.some((e) => e.itemId === itemId)) {
        newheights = isNewPost
          ? [...[obj], ...heights]
          : [...heights, ...[obj]];

        // re order items
        newheights.map((heightItem, idx) => {
          heightItem.index = idx;
          return heightItem;
        });

        state.itemsHeight = newheights;
        state.totalHeight = state.totalHeight + itemHeight;
      } else {
        if (
          heights.some((e) => e.itemId === itemId && e.height !== itemHeight)
        ) {
          newheights = heights.map((elem) => {
            if (elem.itemId === itemId) {
              elem.height = itemHeight;
            }

            return elem;
          });

          let newTotal = heights.reduce(function (prev, itm) {
            return prev + itm.height;
          }, 0);

          state.itemsHeight = newheights;
          state.totalHeight = newTotal;
        }
      }
    },
    setTopOffset: (state, action) => {
      if (!action.payload) return;

      state.topOffset = action.payload;
    },
    addPost(state, action) {
      // update the Index

      let posts = [action.payload, ...state.userFeed.data];
      let postsToDisplay = [action.payload, ...state.userFeed.dataToDisplay];

      posts.map((post, idx) => {
        post.index = idx;
        return post;
      });

      postsToDisplay.map((post, idx) => {
        post.index = idx;
        return post;
      });

      state.userFeed.data = posts;
      state.userFeed.dataToDisplay = postsToDisplay;

      state.refreshProfileFeed = true;
    },

    removePost(state, action) {
      const postId = action.payload;

      const data = [...state.userFeed.data];
      const dataToDisplay = [...state.userFeed.dataToDisplay];
      let itemsHeight = [...state.itemsHeight];

      const newData = data.filter((post) => post.id !== postId);

      const newDataToDisplay = dataToDisplay.filter(
        (post) => post.id !== postId,
      );

      let domIds = data.filter((post) => post.id === postId);

      for (let i = 0; i < domIds.length; i++) {
        const domId = domIds[i].domId;

        itemsHeight = itemsHeight.filter((item) => item.itemId !== domId);
      }

      state.userFeed.data = newData;
      state.userFeed.dataToDisplay = newDataToDisplay;
      state.itemsHeight = itemsHeight;
    },
    removeRepost(state, action) {
      const postId = action.payload;

      const data = [...state.userFeed.data];
      const dataToDisplay = [...state.userFeed.dataToDisplay];
      let itemsHeight = [...state.itemsHeight];

      const newData = data.filter((post) => {
        const postItemAction = post.action;

        if (
          postItemAction === ActivityLogProps.SHARES_POST ||
          postItemAction === ActivityLogProps.SHARES_COMMENT
        ) {
          return post.id !== postId;
        } else {
          return true;
        }
      });

      const newDataToDisplay = dataToDisplay.filter((post) => {
        const postItemAction = post.action;
        if (
          postItemAction === ActivityLogProps.SHARES_POST ||
          postItemAction === ActivityLogProps.SHARES_COMMENT
        ) {
          return post.id !== postId;
        } else {
          return true;
        }
      });

      const domId = data.filter((post) => {
        const postItemAction = post.action;

        return (
          post.id === postId &&
          (postItemAction === ActivityLogProps.SHARES_POST ||
            postItemAction === ActivityLogProps.SHARES_COMMENT)
        );
      });

      itemsHeight =
        domId[0] &&
        itemsHeight.filter((item) => {
          return item.itemId !== domId[0].domId;
        });

      state.userFeed.data = newData;
      state.userFeed.dataToDisplay = newDataToDisplay;
      state.itemsHeight = itemsHeight;
    },
    resetRefreshProfileFeed(state) {
      state.refreshProfileFeed = false;
    },
    addLikedPost(state, action) {
      const newPostId = action.payload;

      const data = [...state.userFeed.likedPosts];

      if (!data.includes(newPostId)) {
        data.push(newPostId);
        state.userFeed.likedPosts = data;
      }
    },
    removeLikedPost(state, action) {
      const postId = action.payload;

      const data = [...state.userFeed.likedPosts];

      const newData = data.filter((id) => id !== postId);

      state.userFeed.likedPosts = newData;
    },
    addSharedPost(state, action) {
      const newPostId = action.payload;

      const data = [...state.userFeed.sharedPosts];

      if (!data.includes(newPostId)) {
        data.push(newPostId);
        state.userFeed.sharedPosts = data;
      }
    },
    removeSharedPost(state, action) {
      const postId = action.payload;

      const data = [...state.userFeed.sharedPosts];

      const newData = data.filter((id) => id !== postId);

      state.userFeed.sharedPosts = newData;
    },
    setPostStatus(state, action) {
      state.userFeed.likedPosts = [
        ...(action.payload.likes || []),
        ...state.userFeed.likedPosts,
      ];
      state.userFeed.sharedPosts = [
        ...(action.payload.shares || []),
        ...state.userFeed.sharedPosts,
      ];
    },
    resetPinnedPost(state, action) {
      state.pinnedPosts = [];
    },
    updatePostLikedCount(state, action) {
      const {postId, count} = action.payload;
      state.userFeed.postStats[postId].numLikes = count;
    },
    updatePostCommentCount(state, action) {
      const {postId, count} = action.payload;
      state.userFeed.postStats[postId].numComments = count;
    },
    updatePostRepostCount(state, action) {
      const {postId, count} = action.payload;
      state.userFeed.postStats[postId].numShares = count;
    },
    setPostCounts(state, action) {
      const {postId, counts} = action.payload;
      state.userFeed.postStats[postId] = counts;
    },
    removePinnedPost(state, action) {
      const pstId = action.payload;

      let posts = [...state.pinnedPosts];

      let newPosts = posts.filter((post) => post.id !== pstId);

      state.pinnedPosts = newPosts;
    },
    incrementOffset(state) {
      state.userFeed.offset =
        state.userFeed.offset + timelineConstants.MAX_BATCH_SIZE;
    },
    resetPuStatus(state, action) {
      state.popularUsers.error = action.payload.error;
      state.popularUsers.isLoading = false;
      state.popularUsers.success = action.payload.success;
      state.popularUsers.reachEnd = action.payload.reachEnd;
    },
    setPuIsLoading(state, action) {
      state.popularUsers.isLoading = action.payload;
    },
    setPuReachEnd(state, action) {
      state.popularUsers.reachEnd = action.payload;
    },
    setPuData(state, action) {
      state.popularUsers.data = [...state.popularUsers.data, ...action.payload];
    },
    setPuOffset(state) {
      state.popularUsers.query.offset =
        state.popularUsers.query.offset + state.popularUsers.query.max;
    },
    setPuTotalCount(state, action) {
      state.popularUsers.totalCount =
        state.popularUsers.totalCount + action.payload;
      if (state.popularUsers.totalCount >= 8) {
        state.popularUsers.isInitialized = true;
      }
    },
    setPuRemovedCount(state, action) {
      state.popularUsers.removedCount =
        state.popularUsers.removedCount + action.payload;
    },
    removePuByUserId(state, action) {
      const newData = state.popularUsers.data.filter(
        ({_id}) => action.payload !== _id,
      );
      state.popularUsers.data = newData;
      state.popularUsers.followCount = state.popularUsers.followCount + 1;
    },
  },
  extraReducers: (builder) => {
    // Doc: https://redux-toolkit.js.org/usage/usage-with-typescript#type-safety-with-extrareducers

    builder.addCase(getUserFeed.pending, (state) => {
      state.userFeed.isLoading = true;
      state.userFeed.error = false;
      state.userFeed.reachEnd = false;
    });

    builder.addCase(getUserFeed.fulfilled, (state, {payload}) => {
      const {
        likedPosts,
        posts,
        removed,
        users,
        sharedPosts,
        offset,
        postStats,
      } = payload;

      if ((posts && posts.length + removed) <= timelineConstants.MAX_BATCH_SIZE) {
        state.userFeed.reachEnd = true;
      }

      if (posts) {
        state.userFeed.error = false;
        state.userFeed.success = true;

        posts.map((post, idx) => {
          post.domId = uniqueKey(post.id);
          post.index =
            offset === 0
              ? idx
              : idx + (offset - timelineConstants.MAX_BATCH_SIZE);
          return post;
        });

        state.userFeed.postStats = {
          ...state.userFeed.postStats,
          ...postStats,
        };

        if (offset - timelineConstants.MAX_BATCH_SIZE === 0) {
          state.userFeed.dataToDisplay = posts.slice(0, 12);
        }

        state.userFeed.data = [...state.userFeed.data, ...posts];
        state.userFeed.users = {...state.userFeed.users, ...users};
        state.userFeed.offset = offset;
        state.userFeed.nbrRemoved = removed;
        state.userFeed.timestamp = payload.timestamp;
      } else {
        state.userFeed.error = true;
        state.userFeed.success = false;
        state.userFeed.reachEnd = false;
      }

      state.userFeed.likedPosts = [...state.userFeed.likedPosts, ...likedPosts];
      state.userFeed.sharedPosts = [
        ...state.userFeed.sharedPosts,
        ...sharedPosts,
      ];

      state.userFeed.isLoading = false;
    });

    builder.addCase(getUserFeed.rejected, (state) => {
      state.userFeed.isLoading = false;
      state.userFeed.error = true;
      state.userFeed.reachEnd = false;
    });

    builder.addCase(getPinnedPost.fulfilled, (state, {payload}) => {
      if (!payload) {
        return;
      }

      state.pinnedPosts = [payload];
    });
  },
});
