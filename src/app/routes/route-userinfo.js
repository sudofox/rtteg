import React, {useEffect, useState} from "react";
import {NewUserFollowView} from "../pages/profile/follow/NewUserFollowView";
import {NewPublicUserView} from "../pages/profile/public_user_view/NewPublicUserView";

export const NewUserInfo = ({match}) => {
  const {id: username, view} = match.params;

  const [userInfo, setUserInfo] = useState(null);
  const [ousername, setOusername] = useState(username);

  useEffect(() => {
    if (userInfo) {
      const name = userInfo.getOriginalUsername();
      setOusername(name);
    }
  }, [userInfo]);

  if (view === "followers" || view === "following") {
    return <NewUserFollowView userId={username} content={view.toUpperCase()} />;
  }

  return (
    <NewPublicUserView
      userId={username}
      profileUsername={ousername}
      view={view}
      setLayoutUserInfo={setUserInfo}
    />
  );
};
