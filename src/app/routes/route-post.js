import React from "react";

import {NewPostPageView} from "../pages/post/NewPostPageView";

export const NewPost = ({match}) => {
  const {id: postId} = match.params;

  return <NewPostPageView postId={postId} />;
};
