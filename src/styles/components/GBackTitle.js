import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  createStyles,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import {GTypography} from "./GTypography";
import {resetTimeline} from "src/store/modules/timeline";
import icon_back from "src/assets/icons/basic/back_arrow.svg";
import {useHistory} from "react-router-dom";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {GButton} from "./GButton";
import {ReactComponent as VerificationIcon} from "../../assets/icons/feature/verification.svg";
import {useAuthRedirect} from "src/util/useAuthRedirect";
import AppConsts from "src/app/AppConsts";

const HEIGHT = 71;
const SCROLL_TRANSITION = "top 0.3s";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      lineHeight: `${HEIGHT - 10}px`,
      height: HEIGHT - 10,
      position: "sticky",
      width: "100%",
      top: 0,
      zIndex: 2,
      transition: SCROLL_TRANSITION,
    },
    backBtn: {
      marginRight: theme.spacing(4),
      marginLeft: theme.spacing(2.625),
      cursor: "pointer",
      lineHeight: 0,
      display: "flex",
      alignItems: "center",
      "& img": {
        verticalAlign: "middle",
        borderRadius: "50%",
        "-webkit-transition": "background-color 300ms ease",
        "-moz-transition": "background-color 300ms ease",
        "-ms-transition": "background-color 300ms ease",
        "-o-transition": "background-color 300ms ease",
        transition: "background-color 300ms ease",
        backgroundColor: "transparent",
      },
      "&:hover img": {
        backgroundColor: theme.palette.background.notif,
      },
    },
    backTitleWrapper: {
      display: "flex",
      alignItems: "center",
      width: "83%",
      "&.spacing": {
        marginLeft: 19,
        display: "flex",
      },
    },
    backTitle: {
      fontSize: 20,
      fontWeight: 800,
      color: theme.palette.text.primary,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      lineHeight: "46px",
      cursor: ({titleHasClick}) => titleHasClick && "pointer",
    },
    backSubTitle: {
      fontSize: 15,
      color: theme.palette.text.gray,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      height: "27.25px",
      marginTop: "-4px",
    },
    mobileAuthBar: {
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
      position: "sticky",
      display: "flex",
      borderBottom: `1px solid ${theme.palette.grey.A800}`,
      top: 58,
      zIndex: 2,
      background: theme.palette.background.default,
      padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
      transition: SCROLL_TRANSITION,
    },
    authButton: {
      height: 26,
      "&:not(:last-child)": {
        marginRight: theme.spacing(1),
      },
      "& .MuiButton-label": {
        fontSize: 12,
      },
    },
    icon: {
      width: theme.spacing(2),
      margin: theme.spacing(0, 0, 0, 0.5),
    },
  }),
);

export const GBackTitle = ({
  title,
  subTitle,
  handleClick,
  className,
  children,
  rightPart,
  hideBackLink = false,
  showVIcon,
}) => {
  const titleHasClick = handleClick && hideBackLink;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const classes = useStyles({subTitle, titleHasClick});
  const history = useHistory();
  const dispatch = useDispatch();
  const {authenticated} = useSelector((state) => state.auth?.session);
  const authRedirect = useAuthRedirect();

  const prevScrollPosRef = useRef(0);
  const setPrevScrollPos = (pos) => {
    prevScrollPosRef.current = pos;
  };
  const [visible, setVisible] = useState(true);

  const handleMobileScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollPosRef.current > currentScrollPos;

    setPrevScrollPos(currentScrollPos);
    setVisible(visible);
  };
  useEffect(() => {
    return () => {
      if (window.location.pathname !== "/") {
        dispatch(
          resetTimeline({
            field: "postTimeline",
          }),
        );
      }
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      window.addEventListener("scroll", handleMobileScroll);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("scroll", handleMobileScroll);
      }
    };
  }, [isMobile]);

  const _handleClick =
    handleClick ||
    (() => {
      if (history.length > 2) {
        history.goBack();
      } else {
        history.push(`/`);
      }
    });

  return (
    <>
      <div
        className={clsx(classes.root, className, "backTitle")}
        style={{top: visible ? 0 : HEIGHT * -1}}
      >
        {!hideBackLink && (
          <div
            className={clsx(classes.backBtn, className)}
            onClick={_handleClick}
          >
            <img src={icon_back} alt="back" />
          </div>
        )}
        <div
          className={clsx(classes.backTitleWrapper, hideBackLink && "spacing")}
        >
          {title && (
            <>
              <GTypography
                variant="h1"
                className={classes.backTitle}
                title={title}
                onClick={() => {
                  if (titleHasClick) {
                    handleClick();
                  }
                }}
              >
                {children || (
                  <>
                    <GTwemoji text={title} />
                  </>
                )}
              </GTypography>
              {showVIcon && <VerificationIcon className={classes.icon} />}
            </>
          )}
        </div>
        {rightPart}
      </div>
      {!authenticated && (
        <div
          className={classes.mobileAuthBar}
          style={{top: visible ? HEIGHT : 0}}
        >
          <GButton
            variant="outlined"
            className={classes.authButton}
            onClick={() => authRedirect()}
          >
            Log In
          </GButton>
          <GButton
            className={classes.authButton}
            onClick={() => authRedirect(AppConsts.URL_SIGNUP)}
          >
            Create Account
          </GButton>
        </div>
      )}
    </>
  );
};
