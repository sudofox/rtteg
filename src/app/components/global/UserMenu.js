import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MenuItem from "src/app/components/MenuItem";
import {AvatarLink} from "src/app/components/AvatarLink";
import {GTwemoji} from "src/styles/components/GTwemoji";

import {ReactComponent as ProfileIcon} from "src/assets/icons/nav/profile.svg";
import {ReactComponent as SettingsIcon} from "src/assets/icons/nav/settings.svg";
import {ReactComponent as LogOutIcon} from "src/assets/icons/basic/log_out.svg";
import {t} from "src/i18n/utils";
import AppConsts from "src/app/AppConsts";
import {GConfirmAlert} from "src/styles/components/GConfirmAlert";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .user-menu-trigger": {
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        borderRadius: 100,
        padding: 0,

        "& .avatar": {
          ...theme.mixins.avatar,
          width: 40,
          height: 40,
        },

        "& .user-info": {
          padding: "2px 8px 0 0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",

          "& .nickname": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: "bold",
            fontSize: "16px",
            lineHeight: "19px",
            maxWidth: 275,
          },

          "& .username": {
            fontWeight: 500,
            color: theme.palette.text.gray,
            fontSize: 13,
            lineHeight: "17px",
            textAlign: "left",
            "&:before": {
              content: '"@"',
            },
          },
        },
      },
    },
    dropdownContent: {
      cursor: "pointer",
      width: theme.spacing(30.625),
      borderRadius: 8,
      margin: 0,
      borderColor: "#e3e9ee",
      boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.08)",
      marginTop: theme.spacing(-1),
      [theme.breakpoints.up("md")]: {
        top: "60px !important",
      },
    },
    leftContentContainer: {
      display: "flex",
    },
    logoutIcon: {
      "& path": {
        fill: theme.palette.text.lightGray,
      },
    },
  }),
);

const UserMenu = () => {
  const history = useHistory();
  const classes = useStyles();
  const {session} = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!session?.authenticated) {
      history.push("/logout");
    }
    setUserInfo(session.userinfo);
  }, [session]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const getUserMenuTrigger = () => {
    let avatarUrl = userInfo?.ico;
    const nickname = userInfo?.nickname;
    const username = userInfo?.ousername;
    let comp = (
      <div className="user-menu-trigger">
        <div className={classes.leftContentContainer}>
          {!small && (
            <div className="user-info">
              <div className="nickname">
                <GTwemoji text={nickname || username || "-"} size={18} />
              </div>
              <div className="username">
                <GTwemoji text={username} size={18} />
              </div>
            </div>
          )}
          <AvatarLink
            avatarUrl={avatarUrl}
            styleClasses="avatar"
            userId={userInfo?._id}
            username={userInfo?.nickname}
            noRedirect={true}
            openUserMenu={setOpen}
          />
        </div>
      </div>
    );

    return comp;
  };

  const goUrl = (e, url = null) => {
    e.preventDefault();

    const nickName = userInfo?.nickname || userInfo?._id;
    handleClose();

    if (AppConsts.URL_LOGOUT === url) {
      GConfirmAlert({
        title: nickName,
        text: t("getter_fe.auth.common.logOutConfirm"),
        close: {
          text: t("getter_fe.post.button.cancel"),
          type: "default",
        },
        confirm: {
          text: t("getter_fe.menu.common.logout"),
          type: "danger",
          callback: (close) => {
            if (url != null) history.push(url);
            close();
            // toast.info(
            //   <NotifMessage
            //     message={t("getter_fe.auth.common.youLoggedOut")}
            //   />,
            //   {
            //     type: toast.TYPE.SUCCESS,
            //   },
            // );
          },
        },
        showCloseIcon: false,
      });
      return;
    }

    if (url != null) history.push(url);
  };

  return (
    <div className={clsx(classes.root, "dropdown")}>
      <div
        aria-describedby="user-menu"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        {getUserMenuTrigger()}
      </div>
      <Popover
        id="user-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: small ? "top" : "bottom",
          horizontal: small ? "center" : "right",
        }}
        transformOrigin={{
          vertical: small ? "bottom" : "top",
          horizontal: small ? "center" : "right",
        }}
        disableScrollLock
        classes={{
          paper: classes.dropdownContent,
        }}
      >
        <MenuItem
          text={t("getter_fe.menu.common.profile")}
          icon={<ProfileIcon />}
          doClick={goUrl}
          url={`/user/${userInfo?._id}`}
        />
        <MenuItem
          text={t("getter_fe.menu.common.settings")}
          icon={<SettingsIcon />}
          doClick={goUrl}
          url={`/settings/change-password`}
        />
        <MenuItem
          text={t("getter_fe.menu.common.logout")}
          icon={<LogOutIcon className={classes.logoutIcon} />}
          doClick={goUrl}
          url={AppConsts.URL_LOGOUT}
        />
      </Popover>
    </div>
  );
};

export default UserMenu;
