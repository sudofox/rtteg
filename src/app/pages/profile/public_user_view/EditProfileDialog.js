import React, {useState} from "react";
import {Dialog} from "@material-ui/core";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import {GButton} from "../../../../styles/components/GButton";
import {EditProfileForm} from "./EditProfileForm";

import {t} from "../../../../i18n/utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      zIndex: "1300 !important",
      "& .MuiDialog-container": {
        backgroundColor: "rgba(27, 27, 27, 0.9)",
      },
    },
    dialogPaper: {
      height: "max-content",
      maxHeight: "96vh",
      "&.MuiDialog-paperWidthSm": {
        maxWidth: 658,
      },
      borderRadius: theme.spacing(1.5),
      [theme.breakpoints.down("sm")]: {
        borderRadius: 0,
        maxHeight: "100vh",
        height: "100%",
      },
    },
    dialogCloseIcon: {
      cursor: "pointer",
    },
    dialogBanner: {
      position: "relative",
      height: 150,
      backgroundColor: "#DEDEDE",
    },
    dialogCameraBig: {
      position: "absolute",
      top: "40%",
      left: "46%",
      cursor: "pointer",
    },
    dialogCameraSmall: {
      cursor: "pointer",
      position: "absolute",
      zIndex: 1,
      top: "40%",
      left: "6.75%",
    },
    dialogContent: {
      transform: "translateY(-50px)",
    },
    dialogAvatar: {
      position: "relative",
      "& > div": {
        borderRadius: "50%",
        border: "3px solid white",
      },
    },
    avatar: {
      height: 100,
      width: 100,
    },
    btn: {
      borderRadius: 20,
      height: 40,
      padding: theme.spacing(1.25, 2.5),
      "& .MuiButton-label": {
        fontWeight: 700,
        fontSize: 16,
        lineHeight: "19px",
        whiteSpace: "nowrap",
      },
      "&:hover": {
        backgroundColor: `${theme.palette.background.notif} !important`,
      },
    },
  }),
);

export default function EditProfileDialog({
  objId,
  avatarUrl,
  userId,
  nickname,
  location,
  website,
  birthdate,
  dsc,
  bgimg,
  refreshView,
}) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <GButton
        className={classes.btn}
        variant="outlined"
        onClick={handleClickOpen}
      >
        {t("getter_fe.profile.common.editProfile")}
      </GButton>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
        fullScreen={fullScreen}
        classes={{root: classes.root, paper: classes.dialogPaper}}
      >
        <div style={{overflow: "auto"}}>
          <EditProfileForm
            objId={objId}
            userId={userId}
            nickname={nickname}
            location={location}
            birthdate={birthdate}
            website={website}
            ico={avatarUrl}
            bgimg={bgimg}
            dsc={dsc}
            handleClose={handleClose}
            refreshView={refreshView}
          />
        </div>
      </Dialog>
    </>
  );
}
