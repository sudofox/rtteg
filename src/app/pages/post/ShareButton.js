import React, {useEffect, useState, useRef} from "react";
import {
  makeStyles,
  useMediaQuery,
  useTheme,
  Button,
  MenuItem,
  ClickAwayListener,
} from "@material-ui/core";
import Dropdown, {
  DropdownTrigger,
  DropdownContent,
} from "react-simple-dropdown";
import classnames from "classnames";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {NotifMessage} from "../../components/notifications/NotifMessage";
import {GMobileDrawer} from "src/styles/components/GMobileDrawer";
import {t} from "../../../i18n/utils";
import {toast} from "react-toastify";
import {ReactComponent as IconShare} from "src/assets/icons/feature/share.svg";
import {ReactComponent as IconTwitter} from "src/assets/icons/social/twitter_black.svg";
import {ReactComponent as IconFacebook} from "src/assets/icons/social/facebook_black.svg";
import {ReactComponent as IconLink} from "src/assets/icons/social/link_black.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  "@keyframes fadeIn": {
    "0%": {
      stroke: theme.palette.text.gray,
    },
    "100%": {
      stroke: theme.palette.primary.main,
    },
  },
  menuButton: {
    padding: 0,
    minWidth: "auto",
    "& .icon": {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "100%",
      "& svg": {
        width: 20,
        height: "auto",
        color: theme.palette.primary.light,
      },
      "& .tooltiptext": {
        position: "absolute",
        padding: "6px",
        background: theme.palette.background.gray,
        borderRadius: "2px",
        fontSize: "11px",
        color: theme.palette.text.disabled,
        visibility: "hidden",
        fontWeight: "400",
        textTransform: "capitalize",
        lineHeight: "8px",
        zIndex: 1,
        top: "100%",
        left: "50%",
        transform: "translate(-50%, 2px)",
        whiteSpace: "nowrap",
        "&.top": {
          transform: "translate(-50%, -52px)",
        },
      },
    },
    "&:hover": {
      background: "none",

      "& .icon": {
        "& svg": {
          "& path": {
            fill: theme.blue.light,
          },
        },
        "& .tooltiptext": {
          visibility: "visible",
        },
      },
      "& .regular-hover": {
        backgroundColor: "#EDF7FF",
      },
    },
    "&.white:hover": {
      "& .icon": {
        backgroundColor: "rgba(255,255,255,.2)",
        "& svg": {
          stroke: `#fff !important`,
        },
      },
    },
  },
  menuItem: {
    padding: 0,
  },
  menuInner: {
    display: "block",
    height: "50px",
    width: "100%",
    lineHeight: "20px",
    padding: "15px 0",
    color: "#000",
    fontSize: "14px",
    fontWeight: 400,
    "& svg": {
      margin: "0 11px 0 14px",
      verticalAlign: "top",
    },
  },
  dropdownShare: {
    borderRadius: "6px",
    top: ({isImagePopup}) => (isImagePopup ? -150 : null),

    right: ({isImagePopup}) => (isImagePopup ? null : 0),
    left: ({isImagePopup}) => (isImagePopup ? -6 : null),
    width: "auto",
    "& li": {
      paddingRight: "10px",
    },
  },
  shareIcon: {},
  outOfScreen: {
    bottom: "100%",
  },
}));

export const ShareButton = ({detailLink, tooltip, isImagePopup, skin}) => {
  const classes = useStyles({isImagePopup});
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.only("xs"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [outOfScreen, setOutOfScreen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let rect = dropdownRef.current?.getBoundingClientRect();
    if (rect) {
      if (
        rect.bottom + 150 >
        (window.innerHeight || document.documentElement.clientHeight)
      ) {
        setOutOfScreen(true);
      } else {
        setOutOfScreen(false);
      }
    }
  }, []);

  const menuItems = (
    <>
      <MenuItem
        className={classes.menuItem}
        onClick={() => {
          setDrawerOpen(false);
          window.open(
            `https://twitter.com/intent/tweet?url=${detailLink}`,
            "_blank",
          );
        }}
      >
        <div className={classes.menuInner}>
          <IconTwitter />
          <span>
            {t("getter_fe.post.button.share_on", {platform: "Twitter"})}
          </span>
        </div>
      </MenuItem>
      <MenuItem
        className={classes.menuItem}
        onClick={() => {
          setDrawerOpen(false);
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${detailLink}`,
            "_blank",
          );
        }}
      >
        <div className={classes.menuInner}>
          <IconFacebook />
          <span>
            {t("getter_fe.post.button.share_on", {platform: "Facebook"})}
          </span>
        </div>
      </MenuItem>
      <MenuItem
        className={classes.menuItem}
        onClick={() => setDrawerOpen(false)}
      >
        <CopyToClipboard
          text={detailLink}
          onCopy={() => {
            toast.info(
              <NotifMessage
                message={t("getter_fe.post.tips.link_has_been_copied")}
              />,
              {
                type: toast.TYPE.SUCCESS,
              },
            );
          }}
        >
          <div className={classes.menuInner}>
            <IconLink />
            <span>{t("getter_fe.post.button.copy_link")}</span>
          </div>
        </CopyToClipboard>
      </MenuItem>
    </>
  );

  return mobileMatches ? (
    <>
      <Button
        onClick={() => setDrawerOpen(true)}
        className={classes.menuButton}
        disableRipple={true}
      >
        <div className="icon">
          <IconShare className={classes.shareIcon} />
          <span className="tooltiptext">
            {t("getter_fe.post.button.share")}
          </span>
        </div>
      </Button>
      <GMobileDrawer
        open={drawerOpen}
        toggleDrawer={(open) => () => setDrawerOpen(open)}
        disableSwipeToOpen
      >
        <div style={{padding: "0 12px"}}>{menuItems}</div>
      </GMobileDrawer>
    </>
  ) : (
    <ClickAwayListener
      onClickAway={(e) => {
        e.stopPropagation();
        setDropdownOpen(false);
      }}
    >
      <Dropdown
        active={dropdownOpen}
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
          document.body.click();
        }}
      >
        <DropdownTrigger>
          <div
            aria-controls="simple-menu"
            aria-haspopup="true"
            className={classnames(classes.menuButton, `icon-${skin}`)}
            ref={dropdownRef}
          >
            <div className="icon regular-hover">
              <IconShare className={classes.shareIcon} />
              <span className={`tooltiptext ${tooltip}`}>
                {t("getter_fe.post.button.share")}
              </span>
            </div>
          </div>
        </DropdownTrigger>
        <DropdownContent
          className={classnames(
            classes.dropdownShare,
            outOfScreen && classes.outOfScreen,
          )}
        >
          {menuItems}
        </DropdownContent>
      </Dropdown>
    </ClickAwayListener>
  );
};
