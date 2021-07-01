import React, {useState, useEffect} from "react";
import GAxios from "src/util/GAxios";
import Global from "src/system/Global";
import {TopicTrendsPage} from "../pages/admin/TopicTrendsPage";
import {NewUIPage} from "src/app/base/NewUIPage";

export const AdminTopicTrendsRoute = () => {
  const [data, setData] = useState(null);
  const api = Global.GetPortal().getAppService();

  useEffect(() => {
    const config = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/admin/config/trending/hashtags`,
    };

    GAxios(config, (res) => {
      setData(res?.data?.result);
    });
  }, []);

  if (!api.userHasAdminRole()) {
    return null;
  }

  return (
    <NewUIPage>
      <TopicTrendsPage content={data} />
    </NewUIPage>
  );
};
