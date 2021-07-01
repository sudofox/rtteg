import React, {useState, useEffect, useRef} from "react";
import clsx from "clsx";
import Popover from "@material-ui/core/Popover";
import {makeStyles} from "@material-ui/core/styles";
import UserProfilePopup from "../pages/dashboard/UserProfilePopup";
import Global from "src/system/Global";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: "0 !important",
    overflow: "hidden",
    display: "flex",
    "& .MuiPopover-paper": {
      transform: "translate(-50%, 10px) !important",
    },
  },
  popover: {
    padding: 0,
    pointerEvents: "none",
  },
  paper: {
    padding: 0,
    marginTop: theme.spacing(1.25),
    borderRadius: theme.spacing(1.25),
    minWidth: 0,
    minHeight: 0,
    pointerEvents: "auto",
    "&.flip": {
      marginTop: theme.spacing(-1.5),
    },
  },
}));

const HoverPopup = ({
  userId = null,
  userInfoTemp = null,
  getUserStatus = null,
  leftAligned = false,
  children = null,
  extraClass,
}) => {
  if (userInfoTemp?._id) {
    userId = userInfoTemp?._id;
  }
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [outOfScreen, setOutOfScreen] = useState(false);
  const popoverContainer = useRef(null);
  const postFeedItemContainer = useRef(null);

  const api = Global.GetPortal().getAppService();

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  const keepPopoverOpen = () => {
    setOpen(true);
  };

  const mouseEnter = (event) => {
    setHover(true);
    let rect = postFeedItemContainer.current?.getBoundingClientRect();
    if (rect) {
      if (
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom + 230 >
          (window.innerHeight || document.documentElement.clientHeight) ||
        rect.right < 0
      ) {
        setOutOfScreen(true);
      } else {
        setOutOfScreen(false);
      }
    }
    handlePopoverOpen(event);
  };

  const mouseLeave = () => {
    setHover(false);
    // setOutOfScreen(false);
    handlePopoverClose();
  };

  const onTimeout = () => {
    setOpen(true);
    fetchUserInfo();
  };

  useEffect(() => {
    const timer = hover && setTimeout(onTimeout, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [hover]);

  const fetchUserInfo = async () => {
    if (
      userInfoTemp &&
      typeof userInfoTemp.getFollowsCount === "function" &&
      userInfoTemp.getFollowsCount() !== null &&
      typeof userInfoTemp.getFollowedCount === "function" &&
      userInfoTemp.getFollowedCount() !== null
    ) {
      setUserInfo(userInfoTemp);
    } else {
      if (isLoading) return;
      setIsLoading(true);

      try {
        if (userId && api) {
          const userRes = await api.fetchUserInfo(userId);
          userRes && setUserInfo(userRes);
          setIsLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <div
        aria-owns={open ? "mouse-over-popover" : ""}
        id="hoverPopup"
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        className={clsx(classes.root, extraClass ? extraClass : "")}
        ref={postFeedItemContainer}
      >
        {children}
      </div>
      <div ref={popoverContainer}>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: clsx(classes.paper, outOfScreen ? "flip" : ""),
          }}
          open={open && !isLoading && userInfo}
          anchorEl={anchorEl}
          // container={anchorEl}
          disableScrollLock={true}
          anchorOrigin={{
            vertical: outOfScreen ? "top" : "bottom",
            horizontal: leftAligned ? "left" : "center",
          }}
          transformOrigin={{
            vertical: outOfScreen ? "bottom" : "top",
            horizontal: leftAligned ? "left" : "center",
          }}
          PaperProps={{
            onMouseEnter: keepPopoverOpen,
            onMouseLeave: handlePopoverClose,
          }}
          onClose={handlePopoverClose}
          getContentAnchorEl={null}
          disableRestoreFocus
        >
          {userId && userInfo && (
            <UserProfilePopup
              userId={userId}
              userInfo={userInfo}
              getUserStatus={getUserStatus}
            />
          )}
        </Popover>
      </div>
    </>
  );
};

export default HoverPopup;
