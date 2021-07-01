import React, {useEffect, useState, useRef} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";
import exifr from "exifr";
import {NotifMessage} from "../components/notifications/NotifMessage";
import {t} from "../../i18n/utils";
import {ReactComponent as IconUploadFile} from "src/assets/icons/icon_upload_file.svg";
import {getVideoDuration, getImageInfo} from "../../util/imageUtils";
import uuid from "react-uuid";
import {exclusiveEvent} from "src/util/EventUtils";
import Global from "src/system/Global";
import XUserInfo from "src/core/model/user/XUserInfo";

const PROP_ONSELECT = "onSelect";
const ACCEPT_IMAGE = "image/png,image/jpeg,image/jpg,image/gif";
const ACCEPT_VIDEO = "video/mp4,video/quicktime";

const WINDOW_OPEN_POPUP_DIALOG = "windowOpenPopupDialog";
const IMAGES_NUMBER_LIMIT = 6;
const GIF_NUMBER_LIMIT = 1;
const VIDEOS_NUMBER_LIMIT = 1;
const VIDEO_SIZE_LIMIT = 512 * 1024 * 1024;
const IMAGE_SIZE_LIMIT = 15 * 1024 * 1024;
const GIF_SIZE_LIMIT = 5 * 1024 * 1024;

// influencer level 0-5 is array index
const VIDEO_SECONDS_LIMITS = [181, 181, 301, 301, 601, 601];

const IMAGE_FILE_EXTENSIONS = ["png", "jpg", "jpeg", "gif"];
const VIDEO_FILE_EXTENSIONS = ["mp4", "mov"];
const IMAGE_FILE_EXTENSION_REGEX = new RegExp(
  `(${IMAGE_FILE_EXTENSIONS.join("|")})$`,
  "i",
);
const VIDEO_FILE_EXTENSION_REGEX = new RegExp(
  `(${VIDEO_FILE_EXTENSIONS.join("|")})$`,
  "i",
);

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "relative",
      width: "100%",
      "& .file-input": {
        display: "none",
      },
      "& .file-drag-drop": {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(27,27,27,.9)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        "& > .wrapper": {
          position: "relative",
          width: "220px",
          height: "100px",
          margin: "0 auto",
          borderRadius: "10px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "#fff",
          "& h5": {
            padding: "14px 0 6px",
            fontSize: "18px",
            fontWeight: 800,
            lineHeight: "22px",
          },
          "& p": {
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: "19px",
          },
        },
      },
    },
    toastWarning: {
      display: "flex",
      height: "100%",
      "& i": {
        width: "58px",
        height: "100%",
        background: theme.gradient.danger,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        "& svg": {
          margin: "0 auto",
        },
      },
      "& p": {
        padding: "0 13px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "220px",
        "& span": {
          color: theme.palette.text.composer,
          lineHeight: "18px",
          fontSize: "15px",
        },
      },
    },
  }),
);

export const FileUploader = (props) => {
  const classes = useStyles();
  const [normalFiles, setNormalFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [isShowFileDragDrop, setIsShowFileDrapDrop] = useState(false);
  const [isUploadError, setIsUploadError] = useState(false);
  const [uploadType, setUploadType] = useState("");

  const normalFilesRef = useRef(normalFiles);
  const uploadTypeRef = useRef(uploadType);

  const {filesToRestore} = props;

  const appService = Global.GetPortal().getAppService();
  const userinfo =
    Global.GetPortal().getUserInfo() &&
    XUserInfo.Wrap(Global.GetPortal().getUserInfo());
  const influencerLvl = userinfo?.isInfluencer();

  let timer = null;
  const setTimer = (value) => {
    timer = value;
  };

  useEffect(() => {
    if (filesToRestore?.length > 0) {
      handleInputChange(null, filesToRestore);
    }

    const guid = uuid();
    exclusiveEvent.bind("dragover", showFileDragDrop, guid);
    exclusiveEvent.bind("dragenter", preventDefault, guid);
    exclusiveEvent.bind("dragleave", hideFileDragDrop, guid);
    exclusiveEvent.bind("drop", handleInputChange, guid);
    return () => {
      exclusiveEvent.unbindAll(guid);
      timer && clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    props.setupDeleteFile && props.setupDeleteFile(removeFile);
    props.setupUploadFiles && props.setupUploadFiles(uploadFiles);
    let onSelectFunction = props[PROP_ONSELECT];
    if (typeof onSelectFunction === "function") {
      let fileHandles = [];
      let displayFiles = [];
      if (normalFiles.length) {
        normalFiles.forEach((f) => {
          fileHandles.push(f.handle);
          displayFiles.push(f.imageSrc);
        });
      }
      if (videoFiles.length) {
        videoFiles.forEach((vf) => {
          fileHandles.push(vf.handle);
          displayFiles.push(
            !/.mov$/.test(vf.handle.name) ? vf.videoSrc : "video.mov",
          );
        });
      }
      onSelectFunction(fileHandles, displayFiles, uploadType);
    }
  }, [normalFiles, videoFiles]);

  const preventDefault = (e) => {
    e.preventDefault();
  };

  const showFileDragDrop = (e) => {
    e.preventDefault();
    if (props.scenes === "notInPopup" && window[WINDOW_OPEN_POPUP_DIALOG]) {
      return;
    }

    timer && clearTimeout(timer);
    setIsShowFileDrapDrop(true);
  };

  const hideFileDragDrop = (e) => {
    e.preventDefault();
    timer && clearTimeout(timer);
    const timeOut = setTimeout(() => setIsShowFileDrapDrop(false), 300);
    setTimer(timeOut);
  };

  const uploadFiles = (callback) => {
    if (isUploadError) {
      setIsUploadError(false);
    }

    const files = [...(uploadType !== "video" ? normalFiles : videoFiles)];
    let realUrls = [];
    let allProgress = [];
    let errorFlag;
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i].handle.name
        .split("")
        .filter((char) => /[a-zA-Z\d\-_.]/.test(char))
        .join("");

      const splitFileName = fileName.split(".");
      if (splitFileName[0].length === 0) {
        fileName = `${uuidv4()}.${splitFileName[splitFileName.length - 1]}`;
      }

      const file = new File([files[i].handle], fileName, {
        type: files[i].handle.type,
      });

      const uploadFunc = (hasExif) => {
        appService.uploadFile(
          file,
          hasExif,
          async (error, result, progress) => {
            if (error && !isUploadError && !errorFlag) {
              console.error(error);
              setIsUploadError(true);
              errorFlag = true;
              toast.info(
                <NotifMessage
                  message={
                    uploadType === "image"
                      ? t("getter_fe.profile.errors.imageUploadError")
                      : t("getter_fe.profile.errors.videoUploadError")
                  }
                />,
                {type: toast.TYPE.WARNING},
              );
              callback(null, null, error);
              return;
            } else if (result) {
              if (uploadType === "image" && files.length === 1) {
                const widthHeight = await getImageInfo(file);
                result.width = widthHeight.width;
                result.height = widthHeight.height;
              }
              realUrls[i] = result;
            } else if (progress) {
              allProgress[i] = progress;
              callback(
                null,
                allProgress.reduce((prev = 0, current = 0) => {
                  return prev + current;
                }) / files.length,
              );
            }
            if (
              realUrls.length === files.length &&
              !/(^,)|[,]{2,}/.test(realUrls.join())
            ) {
              callback(realUrls);
            }
          },
        );
      };

      if (
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
      ) {
        exifr.parse(file).then((output) => {
          let hasExif = false;
          if (output) {
            hasExif = true;
          }
          uploadFunc(hasExif);
        });
      } else {
        uploadFunc(false);
      }
    }
    setIsUploadError(false);
  };

  const removeFile = (index, fileType) => {
    let files = fileType !== "video" ? normalFiles : videoFiles;

    if (index === "all") {
      files = [];
    } else {
      files.splice(index, 1);
    }

    if (fileType !== "video") {
      normalFilesRef.current = [...files];
      setNormalFiles(normalFilesRef.current);
    } else {
      setVideoFiles([...files]);
    }

    if (!files.length) {
      uploadTypeRef.current = "";
      setUploadType("");
    }
  };

  const handleInputChange = async (e, filesToRestore) => {
    if (e) {
      e.preventDefault();
    }

    if (props.scenes === "notInPopup" && window[WINDOW_OPEN_POPUP_DIALOG])
      return;
    setIsShowFileDrapDrop(false);
    var files = e ? e.target.files || e.dataTransfer.files : filesToRestore;
    let newFiles = [];
    let newGifs = [];
    let newVideoFiles = [];
    let errorTip;

    for (let i = 0; i < files.length; i++) {
      var file = files[i];

      // check supported file types
      if (
        !IMAGE_FILE_EXTENSION_REGEX.test(file.name) &&
        !VIDEO_FILE_EXTENSION_REGEX.test(file.name)
      ) {
        errorTip = t("getter_fe.post.tips.invalid_file_type", {
          allowedTypes: [
            ...IMAGE_FILE_EXTENSIONS,
            ...VIDEO_FILE_EXTENSIONS,
          ].join(", "),
        });
        break;
      }

      if (/gif/.test(file.type) && files[i].size > GIF_SIZE_LIMIT) {
        errorTip = t("getter_fe.post.tips.gif_exceeds_size", {
          size: GIF_SIZE_LIMIT / (1024 * 1024),
        });
        break;
      } else if (/image/.test(file.type) && files[i].size > IMAGE_SIZE_LIMIT) {
        errorTip = t("getter_fe.post.tips.image_exceeds_size", {
          size: IMAGE_SIZE_LIMIT / (1024 * 1024),
        });
        break;
      } else if (files[i].size > VIDEO_SIZE_LIMIT) {
        errorTip = t("getter_fe.post.tips.video_exceeds_size", {
          size: VIDEO_SIZE_LIMIT / (1024 * 1024),
        });
        break;
      }

      if (/gif$/.test(file.type)) {
        var newGif = {
          handle: file,
          imageSrc: URL.createObjectURL(file),
        };

        newGifs.push(newGif);
      } else if (/image/.test(file.type)) {
        var newFile = {
          handle: file,
          imageSrc: URL.createObjectURL(file),
        };

        newFiles.push(newFile);
      } else {
        var newVideoFile = {
          handle: file,
          videoSrc: URL.createObjectURL(file),
        };

        newVideoFiles.push(newVideoFile);
      }
    }
    e?.target && (e.target.value = ""); // the same file can be uploaded after deletion
    if (errorTip) {
      toast.info(<NotifMessage message={errorTip} />, {
        type: toast.TYPE.WARNING,
      });
      return;
    }
    if (newVideoFiles.length) {
      const _duration = await getVideoDuration(newVideoFiles[0]);
      const videoSecondLimit = VIDEO_SECONDS_LIMITS[influencerLvl];

      if (_duration > videoSecondLimit) {
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.video_seconds_limit", {
              duration: videoSecondLimit - 1,
            })}
          />,
          {
            type: toast.TYPE.WARNING,
          },
        );
        return;
      }
    }
    // Videos is first
    if (
      uploadTypeRef.current &&
      uploadTypeRef.current !== "video" &&
      newVideoFiles.length
    ) {
      toast.info(
        <NotifMessage
          message={t("getter_fe.post.tips.upload_one_format", {
            maxImg: IMAGES_NUMBER_LIMIT,
          })}
        />,
        {
          type: toast.TYPE.WARNING,
        },
      );
      return;
    } else if (newVideoFiles.length) {
      const _allVideoFIles = [...videoFiles, ...newVideoFiles];
      if (_allVideoFIles.length > VIDEOS_NUMBER_LIMIT) {
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.at_most_videos", {
              number: VIDEOS_NUMBER_LIMIT,
            })}
          />,
          {
            type: toast.TYPE.WARNING,
          },
        );
      }
      setUploadType("video");
      uploadTypeRef.current = "video";
      setVideoFiles([..._allVideoFIles.slice(0, VIDEOS_NUMBER_LIMIT)]);
    }

    // Gifs is second
    if (
      uploadTypeRef.current &&
      uploadTypeRef.current !== "gif" &&
      newGifs.length
    ) {
      toast.warn(
        <NotifMessage
          message={t("getter_fe.post.tips.upload_one_format", {
            maxImg: IMAGES_NUMBER_LIMIT,
          })}
        />,
        {
          type: toast.TYPE.WARNING,
        },
      );
      return;
    } else if (newGifs.length) {
      const _allImageFIles = [...normalFiles, ...newGifs];
      if (_allImageFIles.length > GIF_NUMBER_LIMIT) {
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.at_most_gifs", {
              number: GIF_NUMBER_LIMIT,
            })}
          />,
          {
            type: toast.TYPE.WARNING,
          },
        );
      }
      setUploadType("gif");
      uploadTypeRef.current = "gif";
      setNormalFiles([..._allImageFIles.slice(0, GIF_NUMBER_LIMIT)]);
    }

    // Other images is third
    if (
      uploadTypeRef.current &&
      uploadTypeRef.current !== "image" &&
      newFiles.length
    ) {
      toast.warn(
        <NotifMessage
          message={t("getter_fe.post.tips.upload_one_format", {
            maxImg: IMAGES_NUMBER_LIMIT,
          })}
        />,
        {
          type: toast.TYPE.WARNING,
        },
      );
      return;
    } else if (newFiles.length) {
      const _allImageFIles = [...normalFilesRef.current, ...newFiles];
      if (_allImageFIles.length > IMAGES_NUMBER_LIMIT) {
        toast.info(
          <NotifMessage
            message={t("getter_fe.post.tips.at_most_images", {
              number: IMAGES_NUMBER_LIMIT,
            })}
          />,
          {
            type: toast.TYPE.WARNING,
          },
        );
      }
      setUploadType("image");
      uploadTypeRef.current = "image";
      normalFilesRef.current = [
        ..._allImageFIles.slice(0, IMAGES_NUMBER_LIMIT),
      ];
      setNormalFiles(normalFilesRef.current);
    }
  };

  return (
    <div className={classes.root}>
      <input
        className="file-input"
        type="file"
        multiple
        ref={props.fileInputRef}
        onChange={handleInputChange}
        accept={`${ACCEPT_IMAGE},${ACCEPT_VIDEO}`}
        uploaded-type={uploadType}
        uploaded-number={[...normalFiles, ...videoFiles].length}
      ></input>
      {isShowFileDragDrop ? (
        <div className="file-drag-drop">
          <div className="wrapper">
            <div className={classes.iconUploadFile}>
              <IconUploadFile />
            </div>
            <h5>{t("getter_fe.post.tips.drag_drop_files")}</h5>
            <p>{t("getter_fe.post.tips.drag_drop_files_desc")}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
