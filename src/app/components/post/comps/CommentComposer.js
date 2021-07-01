import React, {useState, useRef, useEffect} from "react";
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
import XObject from "src/core/model/XObject";
import {PopupDialogNew} from "src/app/components/PopupDialogNew";
import {GButton} from "src/styles/components/GButton";
import XMComment from "src/core/model/social/XMComment";
import {PostFeedItem} from "src/app/components/post/comps/PostFeedItem";
import {t} from "src/i18n/utils";
import eventBus from "src/util/EventUtils";
import {refreshHelper} from "src/util/refreshHelper";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {scrollHelper} from "src/util/scrollUtils";
import {breakpoints} from "src/util/BrowserUtils";
import {GBackTitle} from "src/styles/components/GBackTitle";
import {commentSubmit} from "../store";
import {handleSameText} from "src/util/TextUtil";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: 0,
      textAlign: "left",
      "&.comment-wrapper": {
        "& .comment-composer.post-composer": {
          paddingTop: theme.spacing(0.75),
          paddingLeft: 0,
          paddingRight: 0,
          border: "none",
          "& .post-box": {
            paddingLeft: theme.spacing(1.5),
            minHeight: "auto",
            width: theme.spacing(1.25), // setting width to small value seems to prevent overflowing
          },
          boxShadow: "none",
        },
        "& > .comment-replied-post": {
          position: "relative",
          "& .after": {
            position: "absolute",
            top: theme.spacing(9.75),
            left: theme.spacing(3),
            bottom: 0,
            width: theme.spacing(0.25),
            backgroundColor: theme.palette.text.gray,
            opacity: 0.4,
            borderRadius: theme.spacing(0.5),
          },
          "& .reply-to": {
            paddingLeft: theme.spacing(7.625),
            fontSize: "15px",
            color: theme.palette.text.gray,
            paddingBottom: theme.spacing(2.5),
            marginTop: theme.spacing(-1),
            fontWeight: 400,
            "& span": {
              color: theme.palette.text.link,
            },
            "& a": {
              color: theme.palette.text.link,
              fontWeight: 400,
              "&:hover": {
                textDecoration: "underline",
              },
            },
          },
        },
      },
    },
    avatar: {
      width: theme.spacing(6.25),
      height: theme.spacing(6.25),
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      userInfo: state.auth?.session?.userinfo,
    };
  },
  {commentSubmit},
);

export const CommentComposer = connector(_CommentComposer);

function _CommentComposer({
  userInfo,
  item,
  isPopup,
  trigger,
  postId,
  commentId,
  handleStats,
  sharedObj,
  hideDropdown,
}) {
  const [text, setText] = useState("");
  const [gifFile, setGifFile] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [acceptType, setAcceptType] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [filesToRestore, setFilesToRestore] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(-1);
  const [metaDataLoading, setMetaDataLoading] = useState(false);
  const [textareaMaxHeight, setTextareaMaxHeight] = useState(500);

  const fn = () => () => {};
  const [removeFileFunc, setRemoveFileFunc] = useState(fn);
  const [insertEmojiFunc, setInsertEmojiFunc] = useState(fn);
  const [fetchMetadataFunc, setFetchMetadataFunc] = useState(fn);
  const [uploadFilesFunc, setUploadFilesFunc] = useState(fn);
  const [triggerFocusFunc, setTriggerFocusFunc] = useState(fn);

  const [popupDialogOpen, setPopupDialogOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const [closeFunc, setCloseFunc] = useState(null);

  const textLengthLimit = postConstants.COMPOSER_MAX_TEXT_LENGTH;

  const classes = useStyles();

  const resetAll = () => {
    setText("");

    setAllFiles([]);
    setFilesToRestore([]);
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
              closeFunc();
              close();
            }, 64);
            scrollHelper.unlock();
          },
        },
      });
    }
  };

  const handleSubmit = async (filesUploaded) => {
    if (metaDataLoading) {
      setIsWaiting(true);
      return;
    } // waiting metadata return result

    /**
     * TODO: Code below will be used when the timeline uses redux
     */

    // let data = {
    //   txt: text,
    //   udate: Date.now(),
    //   cdate: Date.now(),
    //   uid: userInfo ? userInfo._id : "",
    //   pid: postId,
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

    // await commentSubmit(data);

    if (
      !filesUploaded?.length &&
      handleSameText(text, `prevComment${postId}`)
    ) {
      setIsLoading(false);
      return;
    }

    const {title, imageUrl, url, description} = metaData || {};

    let xComment = XMComment.CreateNew(commentId, postId);
    xComment.setText(text);
    if (title || imageUrl) {
      title && xComment.setPreviewTitle(title);
      imageUrl && xComment.setPreviewImageURL(imageUrl);
      url && xComment.setPreviewURL(url);
      description && xComment.setPreviewDescription(description);
    }

    if (
      filesUploaded &&
      filesUploaded.length === 1 &&
      /gif|png|jpg|jpeg/.test(filesUploaded[0].ori)
    ) {
      xComment.setVideoWidth(filesUploaded[0].width);
      xComment.setVideoHeight(filesUploaded[0].height);
    }

    const appService = Global.GetPortal().getAppService();
    appService.submitComment(
      postId,
      xComment,
      filesUploaded,
      null,
      (err, result) => {
        setIsLoading(false);
        setProgress(-1);

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

        resetAll();

        closeFunc();
        let posterId = item.getPosterId();

        let userFeed = userInfo
          ? {
              [userInfo._id]: userInfo,
              [posterId]: item?.aux?.uinf[posterId],
            }
          : null;
        let newFeed = {result, userFeed};
        eventBus.emit("commentPublish_" + postId, newFeed);

        refreshHelper.refresh(`PostCommentFeed`, result);
        const _id = XObject.GetId(result);
        handleStats();
        toast.info(
          <NotifMessage
            message={
              <div className={"notifmesage-with-link"}>
                <span>{t("getter_fe.post.tips.reply_was_send")}</span>
                {_id ? (
                  <Link
                    className={clsx("toastlink", "text-link")}
                    to={`/comment/${_id}`}
                  >
                    {t("getter_fe.post.button.read_it")}
                  </Link>
                ) : null}
              </div>
            }
          />,
          {
            type: toast.TYPE.SUCCESS,
          },
        );
      },
    );
  };

  const onSubmit = () => {
    setIsLoading(true);

    if (acceptType === "") {
      let gifUrl = null;

      if (gifFile) {
        gifUrl = [
          {
            ori: gifFile?.images?.original?.url,
            width: gifFile?.images?.original?.width,
            height: gifFile?.images?.original?.height,
          },
        ];
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
  };

  const onTextChange = (e) => {
    let text = e.target.value;

    setText(text);

    setMetaDataLoading(true);

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
   * @return {boolean} true if can post
   */
  const canPost = () => {
    let currentText = text || "";
    let noData = Util.StringIsEmpty(currentText, true);
    let cleanedData = currentText.trim();
    return allFiles.length ||
      gifFile ||
      (!noData &&
        cleanedData.length > 0 &&
        cleanedData.length <= textLengthLimit)
      ? true
      : false;
  };

  /**
   * Check if there is no text input
   *
   * @return {boolean}
   */
  const isEmpty = () => {
    return Util.StringIsEmpty(text) === true && !canPost();
  };

  /**
   * Callback from FileUploader whenever file selection
   * has changed. This is used when submitting
   *
   * @param {Files[]} files
   */
  const updateFilesSelected = (fileHandles, displayFiles, type) => {
    setFilesToRestore(fileHandles);
    setAllFiles(displayFiles);
    setAcceptType(type);
  };

  const getActionButtons = () => {
    let submitButton = (
      <GButton
        onClick={onSubmit}
        disabled={
          text.trim().length > textLengthLimit || !canPost() || isLoading
        }
      >
        {t("getter_fe.post.button.reply")}
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
      const commentRepliedPost = window.document.getElementById(
        "commentRepliedPost",
      );
      if (commentRepliedPost) {
        maxHeight =
          window.document.body.offsetHeight * 0.8 -
          commentRepliedPost?.offsetHeight -
          180;

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

  let commentBox = (
    <GMentionsInput
      value={text}
      onChange={onTextChange}
      placeholder={t("getter_fe.post.placeholder.reply_here")}
      style={{
        maxHeight: Math.max(textareaMaxHeight, 100),
        minHeight: Math.min(textareaMaxHeight, 50),
      }}
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
      id="textarea-comment"
    />
  );

  let avatarUrl = userInfo ? userInfo.ico : null;

  let comp = (
    <div className={clsx(classes.root, "comment-wrapper")}>
      {isLoading && <GLoader progress={progress} withBorderRadius />}
      <div className="comment-replied-post" id="commentRepliedPost">
        <PostFeedItem
          item={item}
          scene="comment"
          type="in-composer"
          hasMounted={getTextareaMaxHeight}
          sharedObj={sharedObj}
          userId={item.getTargetId()}
          postId={item.getPostId()}
        />
        <div className="reply-to">
          {t("getter_fe.post.tips.replying_to")}{" "}
          <span>
            @
            {item.getUserInfo()
              ? item.getUserInfo().ousername ||
                item.getUserInfo().data.ousername
              : userInfo?.ousername}
          </span>
        </div>
        <span className="after" />
      </div>
      <div className="post-composer comment-composer">
        <AvatarLink
          avatarUrl={userInfo && avatarUrl}
          styleClasses={classes.avatar}
          userId={userInfo?._id}
          username={userInfo?.nickname}
        />
        <div className="post-box comment-box">
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
              filesToRestore={filesToRestore}
            />
            <div
              style={{whiteSpace: "nowrap"}}
              className={`text-length-limit ${
                !isEmpty() && !canPost() && "is-exceed"
              }`}
            >
              {!isEmpty() && !canPost()
                ? `${textLengthLimit - (text || "").trim().length}`
                : `${(text || "").trim().length} / ${textLengthLimit}`}
            </div>
            {!breakpoints(600) && getActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );

  if (isPopup) {
    comp = (
      <div onClick={onCancel}>
        <PopupDialogNew
          nested={true}
          open={popupDialogOpen}
          trigger={trigger}
          headerContent={t("getter_fe.post.button.reply")}
          onCancel={onCancel}
          contentStyle={{marginTop: "max(15px, 5vh)"}}
          className="popup-reply"
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
