import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import classnames from "classnames";
import PropTypes from "prop-types";
import clsx from "clsx";

import {t} from "../../../i18n/utils";
import IconButton from "@material-ui/core/IconButton";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import {connect} from "react-redux";

import {PostComposer} from "src/app/components/post/comps/PostComposer";
import {GButton} from "../../../styles/components/GButton";
import {SectionLinks} from "./SectionLinks";
import UserMenu from "src/app/components/global/UserMenu";

import {ReactComponent as IconAddPost} from "src/assets/icons/feature/post.svg";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      marginLeft: 0,
      position: "relative",
      flexShrink: 0,
      flexGrow: 0,
      width: theme.spacing(34.375),
      zIndex: 10,
      [theme.breakpoints.down("md")]: {
        width: "auto",
        display: "flex",
        justifyContent: "flex-end",
        flexGrow: 1,
        marginRight: 0,
      },
    },
    wrapper: {
      position: "sticky",
      top: 75,
      height: `calc(var(--vh, 1vh) * 100 - 85px)`,
      textAlign: "center",
    },
    wrapperFooter: {
      display: "flex",
      justifyContent: "center",
      flex: 1,
      alignItems: "flex-end",
      paddingBottom: 23,
    },
    button: {
      textTransform: "none",
      height: 46,
      width: 211,
      borderRadius: 100,
      backgroundColor: `${theme.palette.buttonDanger.main} !important`,
      boxShadow: "0px 4px 14px rgba(122, 140, 166, 0.18)",
      "&:hover": {
        backgroundColor: `${theme.palette.buttonDanger.light} !important`,
      },
      "& .MuiButton-label": {
        fontWeight: 700,
        fontSize: "15px",
        lineHeight: "18px",
        letterSpacing: "0.05em",
      },
      "& svg": {
        marginRight: theme.spacing(1.25),
      },
    },
    "@keyframes fadeIn": {
      "0%": {
        opacity: 0.5,
      },
      "100%": {
        backgroundColor: "#F5F9FF",
        opacity: 1,
      },
    },
    tabletPostButton: {
      padding: theme.spacing(2.0625),
      background: theme.palette.buttonDanger.main,
      "& svg ": {
        width: theme.spacing(2.75),
        height: theme.spacing(2.75),
        "& path": {
          stroke: "#fff !important",
        },
      },
      "&:hover": {
        background: theme.palette.buttonDanger.light,
      },
    },
    fixedButton: {
      position: "fixed",
      bottom: "85px",
      right: "12px",
      zIndex: 99,
    },
    brandLogo: {
      cursor: "pointer",
      height: 56,
      display: "flex",
      alignItems: "center",
      marginBottom: 17,
      paddingLeft: "5px",
      [theme.breakpoints.down("md")]: {
        justifyContent: "center",
      },
    },
    postBtnContainer: {
      display: "flex",
      marginTop: 30,
      marginBottom: 24,
      [theme.breakpoints.down("md")]: {
        marginTop: 24,
        justifyContent: "center",
      },
    },
    headerMenuItem: {
      [theme.breakpoints.up("lg")]: {
        width: 230,
      },
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      "& .dropdown": {
        [theme.breakpoints.up("lg")]: {
          width: "100%",
        },
      },
    },
    scrollWrapper: {
      height: "100%",
      position: "relative",
      overflowX: "hidden",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("md")]: {
        paddingRight: theme.spacing(3.75),
      },
      [theme.breakpoints.only("sm")]: {
        paddingLeft: theme.spacing(1.75),
        paddingRight: theme.spacing(2.75),
      },
    },
  }),
);

/**
 * Sidebar in the user / news pages that show current
 * user info, stats, and navigation links. It's usually
 * on the left side of the timeline / news feed.
 *
 * If user is not logged in, then some items in the side
 * bar will not be shown.
 */

const connector = connect((state) => {
  return {
    authenticated: state.auth?.session?.authenticated,
  };
}, {});

export const NavigateSideBar = connector(_NavigateSideBar);

function _NavigateSideBar({appContext, userId, authenticated}) {
  const classes = useStyles();
  const history = useHistory();
  const {pathname} = useLocation();
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.only("xs"));
  const tabletMatches = useMediaQuery(theme.breakpoints.down("sm"));
  const pcMatches = useMediaQuery(theme.breakpoints.up("lg"));
  const authRedirect = useAuthRedirect();

  const handleClick = () => {
    if (!userId) {
      authRedirect();
    }
  };

  let postButton = (
    <GButton className={classes.button} onClick={handleClick}>
      <IconAddPost />
      {t("getter_fe.post.text.post")}
    </GButton>
  );

  let tabletPostButton = (
    <IconButton
      className={clsx(
        classes.tabletPostButton,
        mobileMatches && classes.fixedButton,
      )}
      color="primary"
      onClick={handleClick}
    >
      <IconAddPost />
    </IconButton>
  );

  return !mobileMatches ? (
    <div className={classnames(classes.root)}>
      <div className={classes.wrapper}>
        <div className={classes.scrollWrapper}>
          <div className={classes.postBtnContainer}>
            {authenticated && (
              <PostComposer
                history={history}
                isPopup={true}
                trigger={pcMatches ? postButton : tabletPostButton}
              />
            )}
            {!authenticated && (pcMatches ? postButton : tabletPostButton)}
          </div>

          <SectionLinks
            pcMatches={pcMatches}
            tabletMatches={tabletMatches}
            mobileMatches={mobileMatches}
            appContext={appContext}
            userId={userId}
          />

          {authenticated && tabletMatches && (
            <div className={classes.wrapperFooter}>
              <div className={classes.headerMenuItem}>
                <UserMenu small={!pcMatches} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    (/\/dashboard/.test(pathname) || pathname === "/") &&
      (authenticated ? (
        <PostComposer
          history={history}
          isPopup={true}
          trigger={tabletPostButton}
        />
      ) : (
        tabletPostButton
      ))
  );
}

NavigateSideBar.propTypes = {
  appContext: PropTypes.object,
};
