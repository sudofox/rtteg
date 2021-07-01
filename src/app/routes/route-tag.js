import React from "react";
import Global from "src/system/Global";
import {NewUIPage} from "../base/NewUIPage";
import {HashtagSearchFeed} from "src/app/components/HashtagSearchFeed";

export const NewHashtag = ({match}) => {
  const {id: hashtagId} = match.params;
  const hashtagName = `#${hashtagId.slice(3)}`;
  const title = `Hashtag: ${hashtagName}`;
  const description = `What's trending via hashtag #${hashtagName}`;

  return (
    <NewUIPage id={hashtagName} title={title} description={description}>
      <HashtagSearchFeed phrase={hashtagId} />
    </NewUIPage>
  );
};
