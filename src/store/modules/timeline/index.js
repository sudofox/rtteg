import {createSlice} from "@reduxjs/toolkit";

export const timelineSlice = createSlice({
  name: "timeline",
  initialState: {
    postTimeline: {
      timelineData: [],
      timelineId: null,
      offset: 0,
      userMap: [],
    },
    commentTimeline: {
      timelineData: [],
      timelineId: null,
      offset: 0,
      userMap: [],
    },
  },
  reducers: {
    addTimelineData(state, action) {
      const timelineData = state[action.payload.field].timelineData;
      state[action.payload.field].timelineData = [
        action.payload.data,
        ...timelineData,
      ];
    },
    setTimelineData(state, action) {
      state[action.payload.field].timelineData = action.payload.data;
    },
    setTimelineId(state, action) {
      state[action.payload.field].timelineId = action.payload.data;
    },
    setOffset(state, action) {
      state[action.payload.field].offset = action.payload.data;
    },
    setUserMap(state, action) {
      state[action.payload.field].userMap = action.payload.data;
    },
    resetTimeline(state, action) {
      state[action.payload.field] = {
        timelineData: [],
        timelineId: null,
        offset: 0,
        userMap: [],
      };
    },
  },
});

export const {
  addTimelineData,
  setTimelineData,
  setTimelineId,
  setOffset,
  setUserMap,
  resetTimeline,
} = timelineSlice.actions;

export default timelineSlice.reducer;
