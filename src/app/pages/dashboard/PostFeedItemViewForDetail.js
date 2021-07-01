import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import {UserLabelLink} from "../../components/UserLabelLink";
import HoverPopup from "../../components/HoverPopup";
import {PostStatLine} from "./PostStatLine";
import {ReportContentDialog} from "../../components/ReportContentDialog";
import {AvatarLink} from "../../components/AvatarLink";
import {refreshHelper} from "src/util/refreshHelper";
import {ReactComponent as VerificationIcon} from "src/assets/icons/feature/verification.svg";
import {t} from "src/i18n/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 15,
    "&.post-feed-item": {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.background.default,
      boxShadow: ({isCommentDetail}) =>
        isCommentDetail ? null : theme.mixins.post.shadow,
      borderRadius: 10,

      "&.comment-detail": {
        border: "none",
        "& .content": {
          width: "calc(100% - 71px)",
        },
      },
      "&.post-page-view": {
        "& > .feed-item-main > .content > .description-header": {
          marginLeft: "17px !important",
          "& .posterInfo_name": {
            flexDirection: "column",
            paddingTop: "10px",
          },
          "& .dropdown": {
            marginTop: "-12px !important",
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
        cursor: "pointer",
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
            margin: "0 30px",
            "& .header-msg": {
              display: "flex",
              width: "100%",
              whiteSpace: "nowrap",
              "& .avatar": {
                width: "56px",
                height: "56px",
                borderRadius: "50%",
              },
              "& .posterInfo_name": {
                display: "flex",
                marginLeft: "20px",
                fontSize: "16px",
                overflow: "hidden",
                "& .posterInfo-part1": {
                  display: "flex",
                  fontWeight: 700,
                  lineHeight: "19px",
                  marginRight: "7px",
                  "& a": {
                    color: theme.palette.text.primary,
                  },
                  "& svg": {
                    marginLeft: "5px",
                    marginTop: "2px",
                    verticalAlign: "top",
                  },
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

            "& .dropdown": {
              marginRight: "-22px",
              marginTop: "-30px",
              "& svg": {
                fontSize: "24px",
              },
            },
          },

          "& .message": {
            wordBreak: "break-word",
            lineHeight: "160%",
            paddingBottom: "8px",
            marginTop: "-30px",
            minHeight: "30px",
          },
        },
      },
    },
  },
  posterInfoPart2: {
    fontWeight: 400,
    color: theme.palette.secondary.light,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  feedItemMain: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    padding: "15px 0px 12px 18px",
    transition: "all 100ms ease-in",
    fontSize: 14,
    "& .content": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      "& .description-header": {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "16px",
        alignItems: "center",
        "& > div > div:first-child": {
          maxWidth: "100%",
        },
        "& > div > div:nth-child(3)": {
          maxWidth: "100%",
          minWidth: "0px",
        },
      },
    },
  },
  description: {
    paddingRight: "18px",
    paddingTop: "10px",
    "& .btn-like": {
      "& svg": {
        width: 20,
        height: "auto",
      }
    }
  },
  messageContent: {
    padding: 0,
    paddingRight: "15px",
  },
  postDetailMessageContent: {
    fontSize: 24,
    fontWeight: "300",
    lineHeight: 1.3125,
    "& .post-page-view > div > .text-content": {
      fontSize: "24px",
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  dropdownContent: {
    width: theme.mixins.dropdownMenu.width,
    position: "absolute",
    right: 10,
    top: -5,
    borderRadius: 6,

    "& .menu-item": {
      padding: theme.spacing(1),
      borderRadius: 6,

      "&.danger": {
        border: "1px solid white",
        color: theme.palette.error.secondary,
        "&:hover": {
          borderRadius: theme.spacing(0.5),
          border: "1px solid red",
          backgroundColor: theme.palette.background.red,
        },
      },

      "& .wrapper": {
        display: "flex",
      },

      "& .icon": {
        marginRight: theme.spacing(1),
      },

      "& .menu-item-name": {
        lineHeight: "31px",
      },
    },
  },
  postedTime: {
    color: theme.palette.text.gray,
    fontSize: 18,
    padding: "20px 0",
    borderBottom: `1px solid ${theme.mixins.avatar.borderColor}`,
    letterSpacing: 0.9,
  },
  avatarContent: {
    marginRight: "15px",
    "& > div": {
      maxWidth: "100%",
    },
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: "100%",
    border: `1px solid ${theme.mixins.avatar.borderColor}`,
    cursor: "pointer",
  },
  commentDetailAvatar: {
    position: "relative",
    marginRight: "15px",

    "&::after": {
      content: "' '",
      position: "absolute",
      top: "56px",
      left: "27px",
      bottom: "-20px",
      width: "3px",
      backgroundColor: "#d9d9d9",
      borderRadius: "3px",
      transform: "translate(-50%, 0)",
    },
  },
  commentFeedItemMain: {
    display: "flex",
    margin: "16px 30px 0",
    position: "relative",
    cursor: "pointer",
    transition: "all 100ms ease-in",

    "& .content": {
      width: "calc(100% - 67px)",
      marginBottom: "20px",

      "& .description-header": {
        "& .posterInfo_name": {
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
          "& .posterInfo-part1": {
            fontWeight: 700,
            marginRight: "12px",
            display: "flex",
            alignItems: "center",

            "& a": {
              color: theme.palette.text.primary,
              marginRight: theme.spacing(1),
            },
          },
          "& .posterInfo-part2": {
            fontWeight: 400,
            color: theme.palette.secondary.light,
          },
        },
      },
    },
  },
  icon: {
    width: 16,
    height: 16,
    margin: theme.spacing(0, 0, 0, 0.5),
    borderRadius: "100%",
  },

  hoverPopup: {
    display: "flex",
    alignItems: "center",
    flexShrink: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginRight: "3px",
    lineHeight: "19px",
  },
  userDisplayName: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: "19px",
  },
  influencer: {
    display: "flex",
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
    lineHeight: "19px",
    marginTop: 1,
    marginBottom: 1,
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
    lineHeight: "19px",
    marginTop: 1,
    marginBottom: 2,
    cursor: "pointer",
    color: theme.palette.text.gray,
    fontWeight: "400",
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
  },
}));

/**
 * A view component for a single item in the popup
 */
export const PostFeedItemViewForDetail = ({
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
  headLine,
  isOpen,
  handleClose,
  handleSubmit,
  menuDropDown,
  xPostItem,
  detailLink,
  type,
  itemId,
  postedTime,
  postId,
  sharedObj,
  hideDropdown,
}) => {
  const classes = useStyles({isCommentDetail: type === "comment-detail"});
  // format posted time for detail with dot
  const _postedTime = postedTime.split(" ");
  _postedTime.splice(2, 0, "·");

  return (
    <div
      id={id}
      className={`${classes.root} post-feed-item ${scene} ${
        type === "comment-detail" && "comment-detail"
      }`}
      ref={postItemRef}
    >
      {headLine}
      <div className={classes.feedItemMain}>
        {type !== "post-detail" ? (
          <div
            className={
              type === "comment-detail"
                ? classes.commentDetailAvatar
                : classes.avatarContent
            }
          >
            <HoverPopup userId={posterId} userInfoTemp={posterInfo}>
              <div key="popup-handler">
                <AvatarLink
                  avatarUrl={avatarUrl}
                  styleClasses={classes.avatar}
                  userId={posterId}
                  username={displayName}
                />
              </div>
            </HoverPopup>
          </div>
        ) : null}
        <div className="content">
          <div className="description-header">
            <Box
              display={type === "post-detail" ? "flex" : ""}
              alignItems={type === "post-detail" ? "center" : ""}
              width="80%"
              flexGrow={1}
            >
              {type !== "post-detail" ? null : (
                <HoverPopup userId={posterId} userInfoTemp={posterInfo}>
                  <div key="popup-handler" className={classes.avatarContent}>
                    <AvatarLink
                      avatarUrl={avatarUrl}
                      styleClasses={classes.avatar}
                      userId={posterId}
                      username={displayName}
                    />
                  </div>
                </HoverPopup>
              )}
              <Box
                display="flex"
                alignItems="flex-start"
                flexDirection="row"
                flex="1"
              >
                <Box
                  display={type === "post-detail" ? "block" : "flex"}
                  flexDirection="row"
                  alignItems="center"
                  mr={1}
                  width="100%"
                >
                  <HoverPopup
                    userId={posterId}
                    userInfoTemp={posterInfo}
                    leftAligned={true}
                  >
                    <div
                      key="popup-handler"
                      name="handler"
                      className={classes.hoverPopup}
                    >
                      <div className={classes.userDisplayName}>
                        <UserLabelLink
                          userId={posterId}
                          nickname={displayName || username}
                        />
                      </div>
                      {posterInfo?.isInfluencer &&
                        posterInfo?.isInfluencer() > 0 && (
                          <div className={classes.influencer}>
                            <VerificationIcon className={classes.icon} />
                          </div>
                        )}
                    </div>
                  </HoverPopup>
                  <Box display="flex" alignItems="center" flexShrink="0">
                    <span
                      className={
                        sinceTimeFormat
                          ? classes.userAtNameShort
                          : classes.userAtName
                      }
                    >
                      @{username}
                    </span>
                    <span className={classes.dot}>·</span>
                    <span className={classes.sinceTime}>{sinceTime}</span>
                  </Box>
                </Box>
              </Box>
            </Box>
            {menuDropDown}
          </div>
          <div className={classes.description}>
            <div
              className={
                type === "post-detail"
                  ? classes.postDetailMessageContent
                  : classes.messageContent
              }
            >
              {mainContent}
            </div>
            {type === "post-detail" ? (
              <div className={classes.postedTime}>
                {t("getter_fe.post.text.posted_on") +
                  " " +
                  _postedTime.join(" ")}
              </div>
            ) : null}
            <PostStatLine
              item={xPostItem}
              postId={postId}
              detailLink={detailLink}
              type={type}
              setupRefresh={(refreshFunc) =>
                refreshHelper.setup(`PostStatLine-${itemId}`, refreshFunc)
              }
              sharedObj={sharedObj}
              scene={scene}
              hideDropdown={hideDropdown}
            />
          </div>
        </div>
      </div>

      <ReportContentDialog
        isOpen={isOpen}
        handleClose={handleClose}
        handleSubmit={(reasonId) => handleSubmit(reasonId)}
      />
    </div>
  );
};
