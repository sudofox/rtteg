import {makeStyles} from "@material-ui/core";
import {useRef} from "react";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {compressImage, handleMediaUrl, readFile} from "src/util/imageUtils";

import {ReactComponent as CameraIcon} from "src/assets/icons/feature/camera.svg";

import {AvatarEditDialog} from "../../../components/AvatarEditDialog";
import {BannerEditDialog} from "../../../components/BannerEditDialog";
import {Avatar} from "@material-ui/core";
import {t} from "../../../../i18n/utils";
import Global from "src/system/Global";

const IMAGE_FILE_EXTENSIONS = ["png", "jpg", "jpeg"];
const ALLOWED_EXTENSIONS = ["image/jpeg", "image/png"];

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

const MAX_BANNER_SIZE = 15 * 1024 * 1024; // 15MB

const useStyles = makeStyles((theme) => ({
  avatar: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 112,
    height: 112,
    border: "2px solid #FFFFFF",
    borderRadius: "100%",
    overflow: "hidden",
    transform: "translateY(-50%)",
    marginLeft: 24,
    marginBottom: -36,

    "& img": {
      maxWidth: "100%",
      maxHeight: "100%",
    },

    "& input.file-input": {
      position: "absolute",
      top: "40px",
      width: "100%",
      cursor: "pointer",
      opacity: 0,
      zIndex: 1,
    },
    '& input[type="file"]::-webkit-file-upload-button': {
      cursor: "pointer",
    },
    "& .MuiAvatar-root": {
      height: "112px !important",
      width: "112px !important",
    },
    "& svg": {
      position: "absolute",
      transition: "0.1s all ease-in",
      borderRadius: 50,
      height: 25,
      width: 25,
      zIndex: 2,
      opacity: 0.9,
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#5F5F5F",
      },
      "& path": {
        fill: "white",
      },
    },
  },
  bannerImageContainer: {
    width: "100%",
    height: 214,
    overflow: "hidden",
    backgroundColor: "#DEDEDE",
  },
  banner: {
    position: "relative",
    backgroundColor: "#DEDEDE",
    width: "100%",
    height: 214,
    overflow: "hidden",

    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    "& input.file-input": {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: 0,
      cursor: "pointer",
      width: "100%",
    },

    "& svg": {
      zIndex: 1,
      cursor: "pointer",
      transition: "0.1s all ease-in",
      position: "absolute",
      borderRadius: "100%",
      left: "50%",
      top: "50%",
      height: 40,
      width: 40,
      opacity: 0.9,
      transform: "translate(-50%, -50%)",
      "&:hover": {
        backgroundColor: "red",
        backgroundColor: "#5F5F5F",
      },
    },
  },
}));

export const ImageSettings = ({
  croppedBannerImage,
  croppedAvatarImage,
  bannerLocalImage,
  setAvatarOpen,
  isAvatarOpen,
  isBannerOpen,
  setAvatarLocalImage,
  setBannerOpen,
  avatarLocalImage,
  setCroppedAvatarImage,
  setBannerLocalImage,
  setCroppedBannerImage,
}) => {
  const classes = useStyles();

  const bannerFileInputRef = useRef(null);
  const avatarFileInputRef = useRef(null);

  const api = Global.GetPortal().getAppService();

  const avatar =
    croppedAvatarImage?.indexOf("data:image") < 0
      ? handleMediaUrl(process.env.REACT_APP_MEDIA_BASE, croppedAvatarImage)
      : croppedAvatarImage;

  const handleAvatarInputChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setAvatarOpen(!isAvatarOpen);
      let file = event.target.files[0];
      event.target.value = null;
      const imgExt = ALLOWED_EXTENSIONS.includes(file.type);
      if (!imgExt) {
        toast.info(
          <NotifMessage
            message={t("getter_fe.profile.errors.imageExtError", {
              allowedTypes: [...IMAGE_FILE_EXTENSIONS].join(", "),
            })}
          />,
          {
            type: toast.TYPE.WARNING,
          },
        );
        setAvatarOpen(false);
        return;
      }
      file = await compressImage({file}); // compress image first

      const imageDataUrl = await readFile(file);

      const imgSize = file.size;
      if (imgSize > MAX_AVATAR_SIZE) {
        toast.info(
          <NotifMessage
            message={t("getter_fe.profile.errors.imageSizeError")}
          />,
          {
            type: toast.TYPE.WARNING,
          },
        );
        setAvatarOpen(false);
        return;
      }
      setAvatarLocalImage(imageDataUrl);
    }
  };

  const handleBannerInputChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setBannerOpen(!isBannerOpen);

      let file = event.target.files[0];
      event.target.value = null;
      const imgExt = ALLOWED_EXTENSIONS.includes(file.type);
      if (!imgExt) {
        setBannerOpen(false);
        toast.info(
          <NotifMessage
            message={t("getter_fe.profile.errors.imageExtError", {
              allowedTypes: [...IMAGE_FILE_EXTENSIONS].join(", "),
            })}
          />,
          {
            type: toast.TYPE.WARNING,
          },
        );
        return;
      }
      file = await compressImage({
        file: file,
        maxFileSize: MAX_BANNER_SIZE,
      }); // compress image first
      const imageDataUrl = await readFile(file);

      const imgSize = file.size;
      if (imgSize > MAX_BANNER_SIZE) {
        setBannerOpen(false);
        toast.info(
          <NotifMessage
            message={t("getter_fe.profile.errors.imageSizeError")}
          />,
          {
            type: toast.TYPE.WARNING,
          },
        );
        return;
      }
      setBannerLocalImage(imageDataUrl);
    }
  };

  return (
    <>
      <div className={classes.bannerImageContainer}>
        <div className={classes.banner}>
          <CameraIcon onClick={() => bannerFileInputRef.current?.click()} />
          {croppedBannerImage || bannerLocalImage ? (
            <img
              src={
                croppedBannerImage
                  ? croppedBannerImage.indexOf("data:image") < 0
                    ? handleMediaUrl(
                        process.env.REACT_APP_MEDIA_BASE,
                        croppedBannerImage,
                      )
                    : croppedBannerImage
                  : bannerLocalImage
              }
              onError={(event) => (event.target.style.display = "none")}
            />
          ) : null}
          <input
            ref={bannerFileInputRef}
            type="file"
            onChange={handleBannerInputChange}
            className="file-input"
            accept="image/*"
          />
        </div>
      </div>
      <div className={classes.avatar}>
        <Avatar src={avatar || api.getAvatarUrl()} />
        <CameraIcon onClick={() => avatarFileInputRef.current?.click()} />
        <input
          ref={avatarFileInputRef}
          type="file"
          onChange={handleAvatarInputChange}
          className="file-input"
          accept="image/*"
        />
      </div>
      <AvatarEditDialog
        originalImage={avatarLocalImage ? avatarLocalImage : api.getAvatarUrl()}
        setOriginalImage={setAvatarLocalImage}
        setCroppedImage={setCroppedAvatarImage}
        isOpen={isAvatarOpen}
        setIsOpen={setAvatarOpen}
      />

      <BannerEditDialog
        originalImage={bannerLocalImage}
        croppedBannerImage={croppedBannerImage}
        setOriginalImage={setBannerLocalImage}
        setCroppedImage={setCroppedBannerImage}
        isOpen={isBannerOpen}
        setIsOpen={setBannerOpen}
      />
    </>
  );
};
