import React, {useCallback, useState} from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {GButton} from "../../styles/components/GButton";
import {GTypography} from "../../styles/components/GTypography";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import clsx from "clsx";
import {ReactComponent as ZoomPlusIcon} from "../../assets/zoomPlus.svg";
import {ReactComponent as ZoomMinusIcon} from "../../assets/zoomMinus.svg";
import {ReactComponent as EditCloseIcon} from "src/assets/icons/basic/close.svg";
import {getCroppedImg} from "../../util/canvasUtils";
import {blobToBase64} from "../../util/imageUtils";
import {t} from "../../i18n/utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      zIndex: "10000 !important",
    },
    avatarEditDialogContainer: {
      "& .MuiDialog-paperWidthSm": {
        maxWidth: 658,
        borderRadius: theme.spacing(1.5),
        [theme.breakpoints.down("xs")]: {
          width: "100%",
          height: "100%",
          borderRadius: 0,
          margin: 0,
        },
      },
      [theme.breakpoints.down("xs")]: {
        "& .MuiDialog-paperScrollPaper": {
          maxHeight: "100%",
        },
      },
    },
    dialogTitleContainer: {
      padding: "16px 24px",
    },
    dialogTitle: {
      fontSize: "18px",
      padding: "11px 0", // same padding top/bottom as GButton
      flex: "auto",
    },
    dialogTitleText: {
      fontWeight: 700,
    },
    actionButton: {
      height: 36,
      width: 100,
      borderRadius: 100,
      marginLeft: "auto",
      "& > .MuiButton-label": {
        fontSize: "16px",
      },
      "&:hover": {
        backgroundColor: "#3D3C7C !important",
      },
    },
    cropContainer: {
      position: "relative",
      height: 523,
      backgroundColor: `rgba(34, 34, 34, 0.74)`,
      backdropFilter: `blur(7px)`,
      "& .reactEasyCrop_CropArea": {
        borderWidth: 5,
        borderColor: theme.blue.dark,
      },
      [theme.breakpoints.only("sm")]: {
        width: 500,
      },
      [theme.breakpoints.up("md")]: {
        width: 658,
      },
    },
    sliderContainer: {
      padding: theme.spacing(2, 0),
    },
    sliderInner: {
      display: "flex",
      alignItems: "center",
      width: "48.3%",
      margin: "0 auto",

      "& .MuiSlider-thumb.MuiSlider-thumbColorPrimary": {
        height: 14,
        width: 14,
      },
      "& .MuiSlider-rail": {
        opacity: 0.5,
        backgroundColor: theme.palette.primary.main,
        height: 4,
      },
      "& .MuiSlider-track": {
        height: 4,
      },
    },
    icon: {
      cursor: "pointer",
      transform: "scale(1.1)",
    },
    iconMinus: {
      marginRight: 15,
    },
    iconPlus: {
      marginLeft: 15,
    },
    dialogCloseIcon: {
      cursor: "pointer",
      marginRight: theme.spacing(3),

      "& circle": {
        transition: "all 0.1s ease-in",
        fill: theme.palette.grey.A300,
      },
      "&:hover": {
        "& circle": {
          fill: theme.palette.grey.A200,
        },
      },
    },
  }),
);

export function AvatarEditDialog({
  originalImage, // base64 string
  setOriginalImage, // (string) => void
  setCroppedImage, // (string) => void
  isOpen, // boolean
  setIsOpen, // (boolean) => void
}) {
  const classes = useStyles();

  const [crop, setCrop] = useState({x: 0, y: 0});
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1.4);
  const [pixelCrop, setPixelCrop] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const handleZoomChange = (event, newValue) => {
    if (typeof newValue === "number") {
      if (newValue >= 1 && newValue <= 3) {
        setZoom(newValue);
      }
    }
  };

  const handleZoomPlus = (event) => {
    event.preventDefault();
    if (zoom > 0 && zoom <= 3) {
      setZoom(zoom + 0.2);
    }
  };

  const handleZoomMinus = (event) => {
    event.preventDefault();
    if (zoom > 1 && zoom <= 4) {
      setZoom(zoom - 0.2);
    }
  };

  const onCropComplete = useCallback((croppedArea, pixelCrop) => {
    setPixelCrop(pixelCrop);
  }, []);

  const handleCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg({
        imageSrc: originalImage,
        pixelCrop,
        rotation,
      });
      setIsOpen(false);

      if (croppedImage !== null) {
        const imgBase64 = await blobToBase64(croppedImage);
        setCroppedImage(imgBase64);
      }
    } catch (e) {
      console.error(e);
    }
  }, [originalImage, setCroppedImage, pixelCrop, rotation]);

  const cancelCroppedImage = useCallback(async () => {
    setIsOpen(false);
    setOriginalImage(null);
  }, []);

  const handleClose = (event) => {
    event.preventDefault();
    setIsOpen(false);
    setOriginalImage(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="avatar-edit-dialog-title"
      classes={{root: classes.root}}
      className={classes.avatarEditDialogContainer}
    >
      <DialogTitle
        id="avatar-edit-dialog-title"
        className={classes.dialogTitleContainer}
      >
        <Box display="flex" alignItems="center">
          <EditCloseIcon
            className={classes.dialogCloseIcon}
            onClick={cancelCroppedImage}
          />
          <GTypography variant="h2" className={classes.dialogTitleText}>
            {t("getter_fe.user.editMedia.editMedia")}
          </GTypography>

          <GButton
            onClick={handleCroppedImage}
            color="primary"
            variant="contained"
            fullWidth={false}
            className={classes.actionButton}
          >
            {t("getter_fe.user.common.done")}
          </GButton>
        </Box>
      </DialogTitle>
      <div className={classes.cropContainer}>
        <Cropper
          image={originalImage}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={4 / 4}
          cropShape="round"
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          showGrid={false}
        />
      </div>
      <div className={classes.sliderContainer}>
        <div className={classes.sliderInner}>
          <ZoomMinusIcon
            className={clsx(classes.icon, classes.iconMinus)}
            onClick={(event) => handleZoomMinus(event)}
          />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={handleZoomChange}
            aria-labelledby="continuous-slider"
          />
          <ZoomPlusIcon
            className={clsx(classes.icon, classes.iconPlus)}
            onClick={(event) => handleZoomPlus(event)}
          />
        </div>
      </div>
    </Dialog>
  );
}
