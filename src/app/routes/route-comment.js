import React from "react";

import {NewCommentPageView} from "../pages/post/NewCommentPageView";
import {NewUIPage} from "../base/NewUIPage";

export const NewComment = ({match}) => {
  const {id: commentId} = match.params;

  return <NewCommentPageView commentId={commentId} />;
};
