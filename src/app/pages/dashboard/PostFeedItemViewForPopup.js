import React from "react";
import {makeStyles} from "@material-ui/core/styles";

import {UserLabelLink} from "../../components/UserLabelLink";
import {AvatarLink} from "../../components/AvatarLink";
import {ReactComponent as VerificationIcon} from "src/assets/icons/feature/verification.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    "&.post-feed-item": {
      display: "flex",
      flexDirection: "column",
      borderBottom: theme.notchedOutline.border,
      "&.comment": {
        position: "relative",
        zIndex: 1,
        border: "none",
        "& .description-header": {
          margin: "0 !important",
        },
        "& .stats-line, & .dropdown": {
          display: "none",
        },
        "& .posterInfo_name": {
          flexDirection: "row !important",
        },
        "& .post-content-view": {
          padding: "0 0 0 66px",
        },
      },
      "&.comment-detail": {
        border: "none",
      },
      "&.repost": {
        border: "none",
        "& .description-header": {
          height: "24px !important",
          margin: "0 12px 15px !important",
          "& .posterInfo_name": {
            display: "flex",
            alignItems: "center",
            flexDirection: "row !important",
            // marginTop: "3px",
            "& .posterInfo-part1": {
              display: "flex",
              marginRight: "6px",
              "& a": {
                height: "auto",
                padding: "0",
              },
            },
          },
        },
        "& .message": {
          marginTop: "2px !important",
          // padding: "0 12px !important",
        },
        "& > .feed-item-main": {
          marginBottom: 0,
        },
      },
      "&.post-page-view": {
        "& > .feed-item-main > .content > .description-header": {
          marginLeft: "17px !important",
          "& .posterInfo_name": {
            flexDirection: "column",
            paddingTop: "10px",
          },
        },
        "& > .feed-item-main > .content > .message": {
          marginTop: "-6px !important",
          padding: "0 17px !important",
          "& .post-page-view > div": {
            marginBottom: 0,
          },
        },
      },
      "& .feed-item-main": {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        cursor: "default",
        margin: "15px 0px 20px",
        transition: "all 100ms ease-in",

        "& > .content": {
          width: "100%",

          "& .description-header": {
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "space-between",
            height: "56px",
            margin: "0 30px 10px",
            "& .header-msg": {
              display: "flex",
              width: "100%",
              cursor: "default",
              whiteSpace: "nowrap",
              "& .posterInfo_name": {
                display: "flex",
                // flexDirection:"column",
                marginLeft: "10px !important",
                fontSize: "16px",
                overflow: "hidden",
                "& .posterInfo-part1": {
                  display: "flex",
                  fontWeight: 700,
                  lineHeight: "18px !important",
                  marginRight: "7px",
                  width: "100%",
                  "& a": {
                    color: theme.palette.text.primary,
                  },
                  "& svg": {
                    marginLeft: "5px",
                    marginTop: "2px",
                    verticalAlign: "top",
                  },
                },
                "& .posterInfo-part2": {
                  fontWeight: 400,
                  color: theme.palette.secondary.light,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                },
              },

              "& .time-since": {
                fontWeight: "lighter",
                padding: "0px 10px",
                fontSize: "13px",
                color: theme.palette.primary.light,
                marginLeft: "10px",
                borderLeft: `1px solid ${theme.border.lightGray}`,
              },
            },
          },

          "& .message": {
            wordBreak: "break-word",
            lineHeight: "160%",
            paddingBottom: "0px !important",
            marginTop: "-30px",
            minHeight: "30px",
            "& >.unavailable-post-container": {
              marginLeft: 66,
            },
          },
        },
      },
    },
  },
  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "100%",
    "&.repost": {
      width: "24px",
      height: "24px",
    },
  },
  icon: {
    width: 16,
    height: 16,
    margin: theme.spacing(0, 0, 0, 0.5),
    borderRadius: "100%",
  },

  userAvatar: {
    minWidth: "25px !important",
  },
  hoverPopup: {
    display: "flex",
    flexShrink: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginRight: "3px",
  },
  userDisplayName: {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    height: "100%",
  },
  influencer: {
    display: "flex",
    alignItems: "flex-start",
    flexShrink: 0,
    marginRight: "3px",
    paddingTop: theme.spacing(0.25),
  },
  userAtNameShort: {
    color: theme.palette.text.gray,
    flexShrink: 99,
    marginRight: "3px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: "400",
    [theme.breakpoints.down("xs")]: {
      flexShrink: 99,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      Display: "block",
    },
  },
  userAtName: {
    color: theme.palette.text.gray,
    flexShrink: 99,
    marginLeft: "3px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontWeight: "400",
    [theme.breakpoints.down("xs")]: {
      flexShrink: 99,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  dot: {
    color: theme.palette.text.gray,
    display: "flex",
    fontSize: 16,
    flexShrink: 0,
    marginLeft: 5,
    marginRight: 5,
  },
  sinceTime: {
    color: theme.palette.text.gray,
    display: "flex",
    flexShrink: 0,
    fontWeight: 400,
  },
}));

/**
 * A view component for a single item in the popup
 */
export const PostFeedItemViewForPopup = ({
  id,
  scene,
  mainContent,
  postItemRef,
  avatarUrl,
  posterId,
  posterInfo,
  displayName,
  username,
  sinceTime,
  sinceTimeFormat,
}) => {
  const classes = useStyles();
  const comp = (
    <div
      id={id}
      className={`${classes.root} post-feed-item ${scene}`}
      ref={postItemRef}
    >
      <div className="feed-item-main">
        <div className="content">
          <div className="description-header">
            <div className="header-msg">
              <div key="popup-handler" className={classes.userAvatar}>
                <AvatarLink
                  avatarUrl={avatarUrl}
                  styleClasses={`${classes.avatar} ${scene}`}
                  userId={posterId}
                  username={displayName}
                />
              </div>
              <div className="posterInfo_name">
                <div
                  className="posterInfo-part1"
                  style={{width: "100%", display: "flex"}}
                >
                  <div className={classes.hoverPopup}>
                    <div
                      key="popup-handler"
                      name="handler"
                      className={classes.userDisplayName}
                    >
                      <UserLabelLink
                        userId={posterId}
                        nickname={displayName || username}
                      />
                    </div>
                  </div>

                  {posterInfo?.isInfluencer && posterInfo?.isInfluencer() > 0 && (
                    <div className={classes.influencer}>
                      <VerificationIcon className={classes.icon} />
                    </div>
                  )}

                  <div
                    className={
                      sinceTimeFormat
                        ? classes.userAtNameShort
                        : classes.userAtName
                    }
                  >
                    @{username}
                  </div>
                  <div className={classes.dot}>·</div>
                  <div className={classes.sinceTime}>{sinceTime}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="message">{mainContent}</div>
        </div>
      </div>
    </div>
  );

  return comp;
};
