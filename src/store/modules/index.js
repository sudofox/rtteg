// https://github.com/reduxjs/redux-toolkit/blob/2afd0f9/docs/usage/usage-with-typescript.md#getting-the-state-type
import {combineReducers} from "@reduxjs/toolkit";
import {authSlice} from "src/app/components/auth/store";
import {postSlice} from "src/app/components/post/store";
import {timelineSliceNew} from "src/app/components/timeline/store";
import {userCommentsSlice} from "src/app/components/comment/store";
import {timelineSlice} from "./timeline";
import {statusSlice} from "./status";

export const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [timelineSlice.name]: timelineSlice.reducer,
  [statusSlice.name]: statusSlice.reducer,
  [postSlice.name]: postSlice.reducer,
  [timelineSliceNew.name]: timelineSliceNew.reducer,
  [userCommentsSlice.name]: userCommentsSlice.reducer,
});
