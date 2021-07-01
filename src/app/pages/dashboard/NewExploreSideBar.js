import React, {useLayoutEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core";
import Sticky from "react-stickynode";
import {NewSuggestTopics} from "./SuggestTopics";
import {useAuthRedirect} from "src/util/useAuthRedirect";
import {t} from "../../../i18n/utils";
import {GButton} from "../../../styles/components/GButton";
import Global from "src/system/Global";
import {Link, useHistory} from "react-router-dom";
import clsx from "clsx";
import AppConsts from "src/app/AppConsts";

const useStyles = makeStyles((theme) => ({
  exploreSidebarContainer: {
    width: "100%",
    paddingLeft: 60,
    "&:not(.initial) .sticky-outer-wrapper": {
      "&:not(.active):not(.released)": {
        "& .sticky-inner-wrapper": {
          position: "fixed !important",
          top: "76px !important",
          width: (props) => props.width || "auto",
        },
      },
    },
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "&-ms-overflow-style": "none",
    scrollbarWidth: "none",
    "& .sidebar-body": {
      maxWidth: 350,
      "& .sidebar-section": {
        background: theme.palette.background.default,
        borderRadius: 10,
        marginBottom: 25,
        "& .section-header": {
          padding: "0 18px",
          height: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 20,
          fontWeight: 800,
          borderBottom: theme.notchedOutline.border,
        },
        "& .section-content": {
          "& .sub-section": {
            padding: "15px 15px",
            "&:not(:last-child)": {
              borderBottom: theme.notchedOutline.border,
            },
          },
        },
        "& .tags-content": {
          display: "flex",
          flexWrap: "wrap",
          padding: "15px 18px",
          rowGap: 15,
          columnGap: 10,
        },
      },
    },
    "@media (max-width: 1365px)": {
      maxWidth: 360,
      boxSizing: "content-box",
      paddingLeft: 23,
      width: "calc(100% - 23px)",
      "& .sidebar-body": {
        width: "100%",
        paddingRight: 5,
      },
    },
  },
  wrapperFooter: {
    fontSize: "12px",
    fontWeight: theme.typography.fontWeightMedium,
    letterSpacing: "0.01em",
    paddingBottom: "25px",
    color: theme.palette.text.gray,
    "& .link-list": {
      marginBottom: 3,
    },
    "& .copy-right": {
      fontWeight: 400,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      justifyContent: "center",
    },
    "& a": {
      marginRight: "10px",
      textDecoration: "none",
      letterSpacing: "0.01em",
      fontWeight: 500,
      color: theme.palette.text.gray,
      lineHeight: "190%",
    },
  },
}));

export const NewExploreSideBar = () => {
  const [width, setWidth] = useState(0);
  const classes = useStyles({width});
  const history = useHistory();
  const stickyOuterRef = useRef();
  const authRedirect = useAuthRedirect();

  const api = Global.GetPortal().getAppService();
  const userId = api.getUserId();
  // const token = api.getUserToken();
  const loggedIn = !!userId;

  useLayoutEffect(() => {
    setWidth(stickyOuterRef.current.innerElement.clientWidth);

    const onResize = () => {
      setWidth(0); // reset to initial
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Commenting out due to the redrawing issue on resize
  // useLayoutEffect(() => {
  //   if (!width) {
  //     setWidth(stickyOuterRef.current.innerElement.clientWidth);
  //   }
  // }, [width]);

  return (
    <div className={clsx(classes.exploreSidebarContainer, !width && "initial")}>
      <Sticky enableTransforms={false} top={76} ref={stickyOuterRef}>
        <div className="sidebar-body">
          <div className="inner-wrapper">
            <NewSuggestTopics />
            {/*<SuggestPeople userId={userId} token={token} />*/}
            <div className={classes.wrapperFooter}>
              <div className="link-list">
                <Link className="link text-link" to="/terms">
                  {t("getter_fe.helpCenter.common.termsOfService")}
                </Link>
                <Link className="link text-link" to="/privacy">
                  {t("getter_fe.helpCenter.common.privacyPolicy")}
                </Link>
              </div>
              <div dir="auto" className="copy-right">
                <span>© 2021 GETTR, Inc.</span>
              </div>
            </div>
          </div>
        </div>
      </Sticky>
    </div>
  );
};
