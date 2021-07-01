import React, {useEffect, useRef, useState} from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import {GTypography} from "src/styles/components/GTypography";
import {ReactComponent as IconCancel} from "src/assets/icons/basic/close.svg";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import GAxios from "src/util/GAxios";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {FollowUserButton} from "src/app/components/FollowUserButton";
import {AvatarLink} from "src/app/components/AvatarLink";
import {ReactComponent as VerificationIcon} from "../../assets/icons/feature/verification.svg";
import {shortNum} from "src/util/NumberUtil";
import {t} from "../../i18n/utils";
import {useHistory} from "react-router-dom";
import {ReactComponent as IconBack} from "src/assets/icons/icon_back.svg";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {changeFollowingStatus} from "src/store/modules/status";
import {connect} from "react-redux";

const MAX_COUNT = 80;

const useStyles = makeStyles((theme) =>
  createStyles({
    userListDialogContainer: {
      "& .MuiDialog-paperWidthSm": {
        maxWidth: 600,
        overflow: "hidden",
        borderRadius: 10,
        [theme.breakpoints.down("xs")]: {
          margin: 0,
          borderRadius: 0,
          width: "100%",
          height: "100%",
        },
      },
    },
    userListDialogHeader: {
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
      padding: "19px 24px 17px 70px",
      position: "relative",
    },
    userListDialog: {
      width: 600,
      maxHeight: 600,
      overflowY: "auto",
      overflowX: "hidden",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignContent: "space-between",
      transition: "height .5s",
      display: "flex",
      minHeight: 100,
      [theme.breakpoints.down("sm")]: {
        width: 500,
      },
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        height: "calc(100vh - 60px)",
        maxHeight: "none",
      },
    },
    userListTitle: {
      fontSize: "18px",
      lineHeight: "21px",
    },
    closeButton: {
      position: "absolute",
      left: 24,
      top: 30,
      transform: "translate(0, -50%)",
      cursor: "pointer",
      width: 26,
      height: 26,
      background: theme.palette.grey.A300,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&:hover": {
        background:
          "linear-gradient(0deg, rgba(95, 95, 95, 0.7), rgba(95, 95, 95, 0.7))",
      },
      "& > svg": {
        stroke: "#FFF",
      },
      [theme.breakpoints.down("xs")]: {
        background: "none",
        "&:hover": {
          background: "#F2F9FF",
        },
      },
    },
    loaderWrapper: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      height: 100,
      alignItems: "center",
      [theme.breakpoints.down("xs")]: {
        height: "calc(100vh - 100px)",
      },
    },
    userInfoList: {
      flex: 1,
      background: "#F6F7F8",
    },
    userInfoContainer: {
      margin: 15,
      padding: "15px 16px",
      display: "flex",
      flex: 1,
      alignItems: "center",
      background: "#FFF",
      boxShadow: "0px 0px 7px 6px rgba(0, 0, 0, 0.02)",
      borderRadius: 10,
      cursor: "pointer",
      "&:hover": {
        background: theme.palette.grey[100],
      },
    },
    userTextInfoContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      paddingLeft: 10,
    },
    displayName: {
      fontWeight: 600,
      fontSize: 15,
      display: "flex",
      alignItems: "center",
    },
    icon: {
      marginLeft: theme.spacing(0.25),
      width: 16,
      height: 16,
    },
    secondaryText: {
      color: theme.palette.secondary.light,
      fontSize: 15,
      fontWeight: "normal",
    },
  }),
);

const connector = connect(
  (state) => {
    return {
      // authenticated: state.auth?.session?.authenticated,
    };
  },
  {changeFollowingStatus},
);

export const UserListDialog = connector(_UserListDialog);

function _UserListDialog({
  postId,
  postDetailType, // 'like' | 'repost' | 'comment' | null
  isOpen,
  handleClose,
  changeFollowingStatus,
}) {
  const classes = useStyles();
  const selectEl = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const getApiUrl = () => {
    switch (postDetailType) {
      case "like":
        return `${process.env.REACT_APP_API_URL}/u/post/${postId}/liked?offset=0&max=${MAX_COUNT}&dir=rev&incl=userinfo|followings`;
      case "repost":
        return `${process.env.REACT_APP_API_URL}/u/post/${postId}/shared?offset=0&max=${MAX_COUNT}&dir=rev&incl=userinfo|followings`;
      // TODO: Comment API is not available yet. Add this once the API is available.
      // case 'comment':
      //   return `${process.env.REACT_APP_API_URL}/u/post/${postId}/commented?offset=0&max=${MAX_COUNT}&dir=rev&incl=userinfo|followings`;
      default:
        return null;
    }
  };

  const fetchData = async () => {
    if (!postId || !postDetailType) {
      return;
    }

    let dataArr = [];
    setItems([]);
    setIsLoading(true);

    const config = {
      url: getApiUrl(),
    };

    await GAxios(
      config,
      (res) => {
        const data = res.data?.result?.aux?.uinf;
        const followings = res.data?.result?.aux?.fws;

        if (data) {
          for (const [_, value] of Object.entries(data)) {
            if (value?._id && followings.includes(value._id)) {
              changeFollowingStatus({
                userId: value._id,
                status: true,
              });
            } else {
              changeFollowingStatus({
                userId: value._id,
                status: false,
              });
            }

            dataArr.push(value);
          }

          if (dataArr.length) {
            setItems(dataArr);
          }
        }
      },
      (err) => {
        console.error(err);
      },
    );

    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const getTotalFollowers = (userInfo) => {
    let flg = userInfo.flg ? userInfo.flg : 0;
    let twitter = userInfo.twt_flg ? userInfo.twt_flg : 0;
    return shortNum(flg * 1 + twitter * 1);
  };

  return (
    <div ref={selectEl}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        scroll="body"
        className={classes.userListDialogContainer}
        container={() => (selectEl ? selectEl.current : null)}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle className={classes.userListDialogHeader}>
          <GTypography isBold className={classes.userListTitle}>
            {postDetailType === "like"
              ? "Liked by"
              : postDetailType === "repost"
              ? "Reposted by"
              : "Replied by"}
          </GTypography>
          <span className={classes.closeButton} onClick={handleClose}>
            {isMobile ? <IconBack /> : <IconCancel />}
          </span>
        </DialogTitle>

        <div className={classes.userListDialog}>
          {isLoading && (
            <div className={classes.loaderWrapper}>
              <CircularProgress className={classes.loader} size={22} />
            </div>
          )}
          {!isLoading && (
            <div className={classes.userInfoList}>
              {items.map((userInfo, idx) => {
                const hasWhiteSpaceAtbeginning = /^\s/.test(userInfo._id);
                return (
                  <React.Fragment key={`pul-${idx}`}>
                    {!hasWhiteSpaceAtbeginning ? (
                      <div
                        className={classes.userInfoContainer}
                        onClick={() => history.push(`/user/${userInfo._id}`)}
                      >
                        <AvatarLink
                          avatarUrl={userInfo.ico}
                          styleClasses={classes.avatar}
                          userId={userInfo._id}
                          username={userInfo.nickname}
                          disableHistoryPush={true}
                        />
                        <div className={classes.userTextInfoContainer}>
                          <span className={classes.displayName}>
                            <GTwemoji
                              text={userInfo.nickname || userInfo._id}
                            />
                            {userInfo.infl && (
                              <VerificationIcon className={classes.icon} />
                            )}
                          </span>
                          <span className={classes.secondaryText}>
                            {`${getTotalFollowers(userInfo)} ${t(
                              "getter_fe.profile.common.followers",
                            )}`}
                          </span>
                        </div>
                        <div>
                          <FollowUserButton isPopup userId={userInfo._id} />
                        </div>
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
