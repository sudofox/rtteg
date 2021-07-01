import React, {useState} from "react";

const TimelineContext = React.createContext({
  timelineData: [],
  timelineId: null,
  offset: 0,
});

export const TimelineProvider = ({children}) => {
  const [timelineData, setTimelineData] = useState([]);
  const [timelineId, setTimelineId] = useState(null);
  const [offset, setOffset] = useState(0);

  /**
   * add data to timeline locally
   * @param {XMPostItem} data
   */
  const addData = (data) => {
    setTimelineData([data, ...timelineData]);
  };

  const resetData = () => {
    setTimelineData([]);
    setOffset(0);
    setTimelineId(null);
  };

  const contextValue = {
    timelineData,
    timelineId,
    setTimelineData,
    setTimelineId,
    offset,
    setOffset,
    addData,
    resetData,
  };

  return (
    <TimelineContext.Provider value={contextValue}>
      {children}
    </TimelineContext.Provider>
  );
};

export default TimelineContext;
