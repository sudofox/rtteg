import React, {useState, Fragment, useEffect} from "react";
import {connect} from "react-redux";
import clsx from "clsx";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import Global from "src/system/Global";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {PopupDialogNew} from "src/app/components/PopupDialogNew";
import GMentionsInput from "src/styles/components/GMentionsInput";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import {PreviewContent} from "src/app/components/PreviewContent";
import {AvatarLink} from "src/app/components/AvatarLink";
import XMPost from "src/core/model/post/XMPost";
import Util from "src/core/Util";
import {t, getLang} from "src/i18n/utils";
import {GButton} from "src/styles/components/GButton";
import {GDisplayFiles} from "src/styles/components/GDisplayFiles";
import {PostToolsGroup} from "src/app/pages/post/PostToolsGroup";
import {GLoader} from "src/styles/components/GLoader";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import XObject from "src/core/model/XObject";
import {scrollHelper} from "src/util/scrollUtils";
import {breakpoints} from "src/util/BrowserUtils";
import {GBackTitle} from "src/styles/components/GBackTitle";
import {postConstants} from "../_constants";
import {postSubmit} from "../store";
import {addPost} from "../../timeline/store";
import {handleSameText} from "src/util/TextUtil";
import {uniqueKey} from "src/util/Global";
import {parsePost} from "src/util/FeedUtils";

const connector = connect(
  (state) => {
    return {
      userInfo: state.auth.session?.userinfo,
    };
  },
  {postSubmit, addPost},
);

export const PostComposer = connector(_PostComposer);
function _PostComposer({userInfo, isPopup, scenes, trigger, addPost}) {
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.only("xs"));
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

  /**
   * Answers the question whether there is enough input
   * to allow user to post (enble post button)
   *
   * @return {boolean} true if can post
   */
  const canPost = () => {
    let currentText = text;
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

  const onCancel = () => {
    if (typeof closeFunc !== "function" || isLoading) {
      return;
    }

    if (isEmpty()) {
      resetAll();
      setPopupDialogOpen(false);

      closeFunc();
      mobileMatches && scrollHelper.enableScroll();
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
            mobileMatches && scrollHelper.enableScroll();
          },
        },
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

  const getTextareaMaxHeight = () => {
    const maxHeight = window.document.body.offsetHeight * 0.8 - 180;
    const newMaxHeight = Math.max(maxHeight, 120);
    setTextareaMaxHeight(newMaxHeight);
  };

  const resetAll = () => {
    setText("");

    setAllFiles([]);
    setFilesToRestore([]);
    removeFileFunc && removeFileFunc("all", acceptType);

    setMetaData(null);
    setGifFile(null);
    setAcceptType("");
  };

  const getPlaceholderText = () => {
    return t("getter_fe.post.placeholder.create_gettr");
  };

  const getActionButtons = () => {
    let postButton = (
      <GButton
        onClick={onSubmit}
        variant="contained"
        style={{whiteSpace: "nowrap"}}
        disabled={
          text.trim().length > textLengthLimit || !canPost() || isLoading
        }
      >
        {t("getter_fe.post.button.post")}
      </GButton>
    );
    let actionButtons = (
      <div className={clsx("action-buttons", getLang())}>{postButton}</div>
    );

    return actionButtons;
  };

  /**
   * Likely implemented by subclass
   */
  const getEmbeddedPostComp = () => {
    return null;
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

  const handleSubmit = async (filesUploaded) => {
    if (metaDataLoading) {
      setIsWaiting(true);
      return;
    } // waiting metadata return result

    if (!filesUploaded?.length && handleSameText(text, "prevPost")) {
      setIsLoading(false);
      return;
    }

    const {title, imageUrl, url, description} = metaData || {};

    let appService = Global.GetPortal().getAppService();
    let xpost = XMPost.CreateNew();
    xpost.setText(text);

    if (title || imageUrl) {
      title && xpost.setPreviewTitle(title);
      imageUrl && xpost.setPreviewImageURL(imageUrl);
      url && xpost.setPreviewURL(url);
      description && xpost.setPreviewDescription(description);
    }

    if (
      filesUploaded &&
      filesUploaded.length === 1 &&
      /gif|png|jpg|jpeg/.test(filesUploaded[0].ori)
    ) {
      xpost.setVideoWidth(filesUploaded[0].width);
      xpost.setVideoHeight(filesUploaded[0].height);
    }

    /**
     * TODO: Code below will be used when the timeline uses redux
     */

    // let data = {
    //   txt: text,
    //   udate: Date.now(),
    //   cdate: Date.now(),
    //   uid: userInfo ? userInfo._id : "",
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

    // await postSubmit(data);

    appService.submitPost(xpost, filesUploaded, null, (err, result) => {
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

      if (typeof closeFunc === "function") {
        closeFunc();
      }

      const _id = XObject.GetId(result);
      toast.info(
        <NotifMessage
          message={
            <div className={"notifmesage-with-link"}>
              <span>{t("getter_fe.post.tips.getter_was_send")}</span>
              {_id ? (
                <Link
                  className={clsx("toastlink", "text-link")}
                  to={`/post/${_id}`}
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

      let parsedPost = parsePost(result.data);

      parsedPost.domId = uniqueKey(parsedPost.id);
      parsedPost.isNewPost = true;

      addPost(parsedPost);

      mobileMatches && scrollHelper.enableScroll();
    });
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

  useEffect(() => {
    if (isLoading && !metaDataLoading && isWaiting) {
      handleSubmit();
      setIsWaiting(false);
    }
  }, [isLoading, metaDataLoading, isWaiting]);

  let nickname = userInfo ? userInfo.nickname : null;
  let postBox = (
    <GMentionsInput
      value={text}
      onChange={onTextChange}
      placeholder={getPlaceholderText(nickname)}
      style={{
        maxHeight: textareaMaxHeight,
        minHeight:
          isPopup && breakpoints(600) ? (allFiles.length ? 30 : 120) : 120,
        background: "#F7F8F9",
        padding: "14px 18px",
        borderRadius: "14px",
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
      id="textarea-post"
      autoFocus={!!isPopup}
      variant="secondary"
    />
  );

  let avatarUrl = userInfo ? userInfo.ico : null;

  let comp = (
    <Fragment>
      <div className={`post-composer ${isPopup && "is-in-popup"}`}>
        {isLoading && (
          <GLoader
            progress={progress}
            isPopup={!isPopup}
            notCloseOnDocumentClick={true}
            tips={t("getter_fe.post.tips.popup_loader_tips")}
          />
        )}
        {/* <div className="post-avatar">
          <AvatarLink
            avatarUrl={userInfo && avatarUrl}
            styleClasses="avatar"
            userId={userInfo?._id}
            username={userInfo?.nickname}
          />
        </div> */}
        <div className="post-box">
          {postBox}
          {getEmbeddedPostComp()}
          <GDisplayFiles
            files={allFiles}
            type={acceptType}
            onDelete={(index, acceptType) => {
              removeFileFunc(index, acceptType);
            }}
            gif={gifFile}
            onGifDelete={() => setGifFile(null)}
          />

          {allFiles.length === 0 && <div className="empty-space"></div>}

          <PreviewContent
            previewMetaData={metaData}
            setupFetchMetadata={(fetchMetadata) => {
              setFetchMetadataFunc(() => {
                return fetchMetadata;
              });
            }}
            scene="post"
          />

          <div
            className="action-bar"
            style={{
              marginTop:
                isPopup && !mobileMatches && !allFiles.length && "10px",
            }}
          >
            <PostToolsGroup
              onSelectFiles={updateFilesSelected}
              onSelectGiphy={(gif) => {
                setGifFile(gif);
              }}
              onSelectEmoji={(e, {emoji}) => {
                insertEmojiFunc && insertEmojiFunc(emoji);
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
              scenes={scenes}
              gif={gifFile}
              filesToRestore={filesToRestore}
            />
            <div
              style={{whiteSpace: "nowrap"}}
              className={`text-length-limit ${
                !isEmpty() && !canPost() && "is-exceed"
              }`}
            >
              {!isEmpty() &&
                !canPost() &&
                `${textLengthLimit - (text || "").trim().length}`}

              {!isEmpty() &&
                canPost() &&
                `${(text || "").trim().length} / ${textLengthLimit}`}
            </div>
            {!breakpoints(600) && getActionButtons()}
          </div>
        </div>
      </div>
      {/* post-composer-divider */}
      <div style={{height: 9}} />
    </Fragment>
  );

  if (isPopup) {
    comp = (
      <div onClick={onCancel}>
        <PopupDialogNew
          open={popupDialogOpen}
          trigger={trigger}
          setPopupDialogOpen={setPopupDialogOpen}
          headerContent={t("getter_fe.post.text.post")}
          hasMounted={() => getTextareaMaxHeight}
          contentStyle={{marginTop: "max(15px, 5vh)"}}
          className="popup-post"
          onOpen={() => {
            scrollHelper.lock();
            mobileMatches && scrollHelper.disableScroll();
          }}
          showCloseIcon
          setCloseFunc={setCloseFunc}
          onCancel={onCancel}
          customHeader={
            breakpoints(600) && (
              <GBackTitle
                className="mobile-GBackTitle-with-post"
                handleClick={onCancel}
                rightPart={getActionButtons()}
              />
            )
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
