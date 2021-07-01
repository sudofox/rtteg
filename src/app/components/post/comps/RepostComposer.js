import React, {useState, useEffect} from "react";
import {connect} from "react-redux";
import {postConstants} from "../_constants";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import Util from "src/core/Util";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import clsx from "clsx";
import Global from "src/system/Global";
import GMentionsInput from "src/styles/components/GMentionsInput";
import {GDisplayFiles} from "src/styles/components/GDisplayFiles";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import {PostToolsGroup} from "src/app/pages/post/PostToolsGroup";
import {GLoader} from "src/styles/components/GLoader";
import {PreviewContent} from "src/app/components/PreviewContent";
import {AvatarLink} from "src/app/components/AvatarLink";
import {repostSubmit} from "../store";
import XObject from "src/core/model/XObject";
import {PopupDialogNew} from "src/app/components/PopupDialogNew";
import {GButton} from "src/styles/components/GButton";
import {PostFeedItem} from "src/app/components/post/comps/PostFeedItem";
import {t} from "src/i18n/utils";
import XMPost from "src/core/model/post/XMPost";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {scrollHelper} from "src/util/scrollUtils";
import {breakpoints} from "src/util/BrowserUtils";
import {GBackTitle} from "src/styles/components/GBackTitle";
import {addPost} from "../../timeline/store";
import {CommentFeedItem} from "src/app/components/post/comps/CommentFeedItem";
import {handleSameText} from "src/util/TextUtil";
import {parsePost} from "src/util/FeedUtils";
import {uniqueKey} from "src/util/Global";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: 0,
      textAlign: "left",
      "&.comment-wrapper": {
        "& .post-composer": {
          border: "none",
          width: "100%",
          display: "flex",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: theme.spacing(1.875),
          paddingBottom: theme.spacing(2.25),
          position: "relative",
          boxShadow: "none",
        },
        "& > .comment-reposted-post": {
          overflow: "hidden",
          position: "relative",
          border: `${theme.notchedOutline.border}`,
          borderRadius: 10,
          marginLeft: theme.spacing(8.625),
          marginTop: theme.spacing(0.625),
        },
        "& .post-avatar": {
          borderRadius: "50%",
          overflow: "hidden",
          width: theme.spacing(7),
          height: theme.spacing(7),
          position: "absolute",
          left: 0,
          "& .avatar": {
            width: "100%",
            height: "100%",
          },
        },
        "& .post-box": {
          flexGrow: 1,
          paddingTop: theme.spacing(1.875),
          paddingLeft: theme.spacing(8.625),
          width: "100%",
          minHeight: "auto",
          "& form": {
            display: "flex",
            flexDirection: "column",
          },
          "& textarea": {
            width: "100%",
            border: 0,
            resize: "none",
            backgroundColor: "transparent",
            margin: theme.spacing(0, 1.25),
            padding: 0,
            fontSize: 19,
            "&:focus": {
              outline: "none",
            },
          },
        },
        "& .action-bar": {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: theme.spacing(0.625),
          marginLeft: theme.spacing(8.625),
          padding: theme.spacing(1.875, 0),
          [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(2.5),
          },
          "& .action-buttons": {
            marginTop: 0,
            marginLeft: theme.spacing(1.25),
            "& button": {
              height: 39,
              minWidth: 77,
              borderRadius: 100,
            },
          },
          "& .text-length-limit": {
            textAlign: "right",
            width: theme.spacing(10),
            marginLeft: "auto",
            color: theme.palette.text.gray,
            "&.is-exceed": {
              color: theme.palette.error.light,
            },
          },
        },
      },
    },
    repostHasFiles: {
      "&.post-composer": {
        paddingBottom: "0 !important",
      },
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      userInfo: state.auth.session?.userinfo,
    };
  },
  {repostSubmit, addPost},
);

export const RepostComposer = connector(_RepostComposer);
function _RepostComposer({
  item,
  shst,
  userInfo,
  postId,
  isPopup,
  history,
  trigger,
  repostSubmit,
  propOnSubmit,
  addPost,
  hideDropdown,
  closeRepostMenu,
  alreadyReposted,
  open,
}) {
  const [text, setText] = useState("");
  const [gifFile, setGifFile] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [acceptType, setAcceptType] = useState("");
  const [allFiles, setAllFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(-1);
  const [metaDataLoading, setMetaDataLoading] = useState(false);
  const [textareaMaxHeight, setTextareaMaxHeight] = useState(500);
  const [closeComposer, setCloseComposer] = useState(false);

  const fn = () => () => {};
  const [removeFileFunc, setRemoveFileFunc] = useState(fn);
  const [insertEmojiFunc, setInsertEmojiFunc] = useState(fn);
  const [fetchMetadataFunc, setFetchMetadataFunc] = useState(fn);
  const [uploadFilesFunc, setUploadFilesFunc] = useState(fn);
  const [triggerFocusFunc, setTriggerFocusFunc] = useState(fn);

  const [popupDialogOpen, setPopupDialogOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const [closeFunc, setCloseFunc] = useState(null);

  const classes = useStyles();

  const textLengthLimit = postConstants.COMPOSER_MAX_TEXT_LENGTH;

  const sharedPost = item.getSharedPost();

  const resetAll = () => {
    setText("");
    setAllFiles([]);
    removeFileFunc && removeFileFunc("all", acceptType);
    setMetaData(null);
    setGifFile(null);
    setAcceptType("");
  };

  const onCancel = () => {
    if (typeof closeFunc !== "function" || isLoading) {
      return;
    }

    if (isEmpty()) {
      resetAll();
      closeRepostMenu();
      setPopupDialogOpen(false);
      closeFunc();
    } else {
      GConfirmAlert({
        title: t("getter_fe.post.tips.discard_getter"),
        text: t("getter_fe.post.tips.can_not_be_undone"),
        close: {
          text: t("getter_fe.post.button.cancel"),
          type: "default",
          callback: (close) => {
            setPopupDialogOpen(true);
            close();
          },
        },
        confirm: {
          text: t("getter_fe.post.button.discard"),
          type: "danger",
          callback: (close) => {
            resetAll();
            setTimeout(() => {
              setPopupDialogOpen(false);
              closeRepostMenu();
              closeFunc();
              close();
            }, 64);
            scrollHelper.unlock();
          },
        },
      });
    }
  };

  const handleSubmitError = (next, tips) => {
    GConfirmAlert({
      title: t("getter_fe.post.tips.getter_failed_to_post"),
      text: tips || t("getter_fe.post.tips.please_try_again"),
      close: {
        text: t("getter_fe.post.button.cancel"),
        type: "default",
      },
      confirm: {
        text: t("getter_fe.post.tips.try_again"),
        type: "confirm",
        callback: (close) => {
          next();
          close();
        },
      },
    });
  };

  const getRepostId = (xPostItem) => {
    let repostId = xPostItem.getTargetId();
    return xPostItem.aux.post[repostId].rpstIds[0];
  };
  const getSrcPostId = () => {};

  const handleSubmit = async (filesUploaded) => {
    /**
     * TODO: Code below will be used when the timeline uses redux
     */

    // let data = {
    //   txt: text,
    //   udate: Date.now(),
    //   cdate: Date.now(),
    //   uid: userInfo ? userInfo._id : "",
    //   rpstIds: [postId],
    // };

    // if (filesUploaded && acceptType === postConstants.FILE_TYPE_IMAGE) {
    //   let imgUrls = [];

    //   for (let i = 0; i < filesUploaded.length; i++) {
    //     const imgUrl = filesUploaded[i].ori;

    //     imgUrls.push(imgUrl);
    //   }

    //   data = {...data, imgs: imgUrls};
    // }

    // if (filesUploaded && acceptType === postConstants.FILE_TYPE_VIDEO) {
    //   data = {
    //     ...data,
    //     vid: filesUploaded[0].m3u8,
    //     ovid: filesUploaded[0].ori,
    //     main: filesUploaded[0].screen,
    //     vid_dur: filesUploaded[0].duration,
    //     vid_wid: filesUploaded[0].width,
    //     vid_hgt: filesUploaded[0].height,
    //   };
    // }

    // await repostSubmit(data);

    let postProcess = (err, result) => {
      setIsLoading(false);
      setProgress(-1);

      closeRepostMenu && closeRepostMenu();

      if (err) {
        if (err.data.emsg?.includes("limit")) {
          toast.info(
            <NotifMessage message={t("getter_fe.post.errors.maxLimit")} />,
            {
              type: toast.TYPE.ERROR,
            },
          );
        } else {
          toast.info(
            <NotifMessage message={t("getter_fe.post.errors.submitPost")} />,
            {
              type: toast.TYPE.ERROR,
            },
          );
        }
        return;
      }

      // if (this.props[PROP_ON_SUBMIT] != null)
      //   this.props[PROP_ON_SUBMIT](embeddedPostId, text);

      closeFunc();
      resetAll();

      const _id = XObject.GetId(result);
      toast.info(
        <NotifMessage
          message={
            <div className="notifmesage-with-link">
              <span>
                {_id
                  ? t("getter_fe.post.tips.getter_was_send")
                  : t("getter_fe.post.tips.getter_was_repost")}
              </span>
              {_id && (
                <Link
                  className={clsx("toastlink", "text-link")}
                  to={`/post/${_id}`}
                >
                  {t("getter_fe.post.button.read_it")}
                </Link>
              )}
            </div>
          }
        />,
        {
          type: toast.TYPE.SUCCESS,
        },
      );

      if (canPost(true)) {
        let xPostItem = result.createXPostItem();

        xPostItem.data.domId = uniqueKey(xPostItem.data.activity.pstid);
        xPostItem.data.isNewPost = true;

        addPost(parsePost(result.data));

        let repostId = getRepostId(xPostItem);
        localStorage.setItem(postConstants.LS_REPOST_ID, repostId);
      }
    };

    if (metaDataLoading) {
      setIsWaiting(true);
      return;
    } // waiting metadata return result

    if (!filesUploaded?.length && handleSameText(text, `prevRepost${postId}`)) {
      setIsLoading(false);
      return;
    }

    resetAll();

    let embeddedPostId = postId;
    const appService = Global.GetPortal().getAppService();

    if (canPost(true)) {
      const {title, imageUrl, url, description} = metaData || {};

      let newPostObj = XMPost.CreateFromOriginalInfo(embeddedPostId);
      newPostObj.setText(text);
      if (title || imageUrl) {
        title && newPostObj.setPreviewTitle(title);
        imageUrl && newPostObj.setPreviewImageURL(imageUrl);
        url && newPostObj.setPreviewURL(url);
        description && newPostObj.setPreviewDescription(description);
      }
      appService.submitRepost(newPostObj, filesUploaded, null, postProcess);
    } else {
      item?.classname === "Comment"
        ? appService.userSharesComment(embeddedPostId, postProcess)
        : appService.userSharesPost(embeddedPostId, text, postProcess);
    }
  };

  const onSubmit = () => {
    setIsLoading(true);

    if (acceptType === "") {
      let gifUrl = null;

      if (gifFile) {
        gifUrl = [{ori: gifFile?.images?.original?.url}];
      }
      handleSubmit(gifUrl);
    } else {
      setProgress(0);

      uploadFilesFunc &&
        uploadFilesFunc((realUrls, progress, error) => {
          if (error) {
            setIsLoading(false);
            return;
          }
          setProgress(progress || 99);
          if (realUrls && realUrls[0]?.ori) {
            handleSubmit(realUrls);
          } else if (realUrls && realUrls[0]) {
            setIsLoading(false);
            handleSubmitError(onSubmit, realUrls[0]);
          }
        });
    }

    propOnSubmit(canPost(true));
  };

  const onTextChange = (e) => {
    let text = e.target.value;

    setText(text);

    setMetaDataLoading(true);

    text &&
      fetchMetadataFunc &&
      fetchMetadataFunc(text, (error, result) => {
        setMetaData(result);
        setMetaDataLoading(false);
      });
  };

  /**
   * Answers the question whether there is enough input
   * to allow user to post (enble post button)
   *
   * This overrides parent
   *
   * NOTE: User is ALLOWED to post without any text and images.
   * It will be treated as a straight share. But if user
   * has images but no text, then we assume user is reposting
   * with content and they must enter some text.
   *
   * @return {boolean} true if can post
   */
  const canPost = (isQuoted) => {
    let currentText = text || "";
    let cleanedData = currentText.trim();
    const minLength = isQuoted ? 1 : 0;
    return allFiles.length ||
      gifFile ||
      (cleanedData.length >= minLength && cleanedData.length <= textLengthLimit)
      ? true
      : false;
  };

  /**
   * Check if there is no text input
   *
   * @return {boolean}
   */
  const isEmpty = () => {
    return Util.StringIsEmpty(text) === true;
  };

  /**
   * Callback from FileUploader whenever file selection
   * has changed. This is used when submitting
   *
   * @param {Files[]} files
   */
  const updateFilesSelected = (files, displayFiles, type) => {
    setAllFiles(displayFiles);
    setAcceptType(type);
  };

  const getActionButtons = () => {
    let submitButton = (
      <GButton
        onClick={
          alreadyReposted &&
          text.trim().length <= 0 &&
          !allFiles.length &&
          !gifFile
            ? () => {
                setCloseComposer(true);
                closeRepostMenu();
              }
            : onSubmit
        }
        disabled={
          text.trim().length > textLengthLimit || !canPost() || isLoading
        }
      >
        {t("getter_fe.post.button.repost")}
      </GButton>
    );
    let actionButtons = <div className="action-buttons">{submitButton}</div>;

    return actionButtons;
  };

  const getTextareaMaxHeight = () => {
    let maxHeight;
    /**
     * TODO: remove setTimeout and move getTextareaMaxHeight to upper comp
     */
    setTimeout(() => {
      const commentRepostedPost = window.document.getElementById(
        "commentRepostedPost",
      );
      if (commentRepostedPost) {
        maxHeight =
          window.document.body.offsetHeight * 0.8 -
          commentRepostedPost?.offsetHeight -
          210;
        setTextareaMaxHeight(Math.max(maxHeight, 120));
      }
    }, 700);
  };

  useEffect(() => {
    if (isLoading && !metaDataLoading && isWaiting) {
      handleSubmit();
      setIsWaiting(false);
    }
  }, [isLoading, metaDataLoading, isWaiting]);

  useEffect(() => {
    setPopupDialogOpen(open);
  }, [open]);

  let commentBox = (
    <GMentionsInput
      value={text}
      onChange={onTextChange}
      placeholder={t("getter_fe.post.placeholder.comment_here")}
      style={{maxHeight: textareaMaxHeight}}
      setupInsertEmoji={(insertEmoji) => {
        setInsertEmojiFunc(() => {
          return insertEmoji;
        });
      }}
      setupTriggerFocus={(triggerFocus) => {
        setTriggerFocusFunc(() => {
          return triggerFocus;
        });
      }}
      id="textarea-repost"
    />
  );

  let avatarUrl = userInfo ? userInfo.ico : null;

  let comp = (
    <div className={`${classes.root} comment-wrapper`}>
      {isLoading && <GLoader progress={progress} />}
      <div
        className={clsx(
          "post-composer",
          (allFiles.length || gifFile) && classes.repostHasFiles,
        )}
      >
        <div className="post-avatar">
          <AvatarLink
            avatarUrl={userInfo && avatarUrl}
            styleClasses="avatar"
            userId={userInfo?._id}
            username={userInfo?.nickname}
          />
        </div>
        <div className="post-box">
          {commentBox}
          <GDisplayFiles
            files={allFiles}
            type={acceptType}
            onDelete={removeFileFunc}
            gif={gifFile}
            onGifDelete={() => setGifFile(null)}
          />
          <PreviewContent
            previewMetaData={metaData}
            setupFetchMetadata={(fetchMetadata) => {
              setFetchMetadataFunc(() => {
                return fetchMetadata;
              });
            }}
            scene="post"
          />
        </div>
      </div>
      <div className="comment-reposted-post" id="commentRepostedPost">
        {item.classname === "Comment" || item.data?.action === "pub_cm" ? (
          <CommentFeedItem comment={item} scene="repost" />
        ) : (
          <PostFeedItem
            item={item}
            scene="repost"
            hasMounted={getTextareaMaxHeight}
            sharedObj={sharedPost}
            postId={item.getPostId()}
            hasFiles={allFiles.length || gifFile}
          />
        )}
      </div>
      <div className="action-bar">
        <PostToolsGroup
          onSelectFiles={updateFilesSelected}
          onSelectGiphy={(gif) => {
            setGifFile(gif);
          }}
          onSelectEmoji={(e, {emoji}) => {
            insertEmojiFunc(emoji);
          }}
          onCloseEmoji={() => {
            triggerFocusFunc && triggerFocusFunc();
          }}
          setupDeleteFile={(removeFile) => {
            setRemoveFileFunc(() => {
              return removeFile;
            });
          }}
          setupUploadFiles={(uploadFiles) =>
            setUploadFilesFunc(() => {
              return uploadFiles;
            })
          }
          gif={gifFile}
        />
        <div
          style={{whiteSpace: "nowrap"}}
          className={`text-length-limit ${
            !canPost() && !isEmpty() && "is-exceed"
          }`}
        >
          {!isEmpty() && !canPost()
            ? `${textLengthLimit - (text || "").trim().length}`
            : `${(text || "").trim().length} / ${textLengthLimit}`}
        </div>

        {!breakpoints(600) && getActionButtons()}
      </div>
    </div>
  );

  if (isPopup) {
    comp = (
      <div style={{position: "absolute"}} onClick={onCancel}>
        <PopupDialogNew
          open={popupDialogOpen}
          trigger={trigger}
          headerContent={t("getter_fe.post.button.repost")}
          onCancel={onCancel}
          contentStyle={{marginTop: "max(15px, 5vh)"}}
          className="popup-repost"
          onOpen={() => {
            if (hideDropdown) {
              hideDropdown();
            }
            scrollHelper.lock();
          }}
          showCloseIcon
          setCloseFunc={setCloseFunc}
          customHeader={
            breakpoints(600) ? (
              <GBackTitle
                className="mobile-GBackTitle-with-post"
                handleClick={onCancel}
                rightPart={getActionButtons()}
              />
            ) : null
          }
          isLoading={isLoading}
        >
          {comp}
        </PopupDialogNew>
      </div>
    );
  }

  return comp;
}
