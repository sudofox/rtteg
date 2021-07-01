import React, {Fragment, memo} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Box} from "@material-ui/core";
import {UserLabelLink} from "../../components/UserLabelLink";
import HoverPopup from "../../components/HoverPopup";
import {PostStatLine} from "./PostStatLine";
import {ReportContentDialog} from "../../components/ReportContentDialog";
import {AvatarLink} from "../../components/AvatarLink";
import {useHistory} from "react-router-dom";
import {ReactComponent as VerificationIcon} from "src/assets/icons/feature/verification.svg";
import {scrollHelper} from "src/util/scrollUtils";
import {ReactComponent as PinIcon} from "src/assets/icons/feature/pin.svg";
import {t} from "src/i18n/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    "& .posterInfo-part2": {
      color: theme.palette.secondary.light,
    },
    "&.post-feed-item": {
      display: "flex",
      flexDirection: "column",
      marginBottom: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.mixins.post.shadow,
      borderRadius: 10,

      "&.timeline": {
        borderTop: "none",
        backgroundColor: "#fff",

        "& > .feed-item-main > .content > .message": {
          wordBreak: "break-word",
          lineHeight: "160%",
          paddingBottom: "8px",
          paddingLeft: "96px",
          paddingRight: "30px",
          marginTop: "-50px",
          minHeight: "30px",
        },
      },
      "&:hover": {
        backgroundColor: theme.palette.background.dark,

        [theme.breakpoints.down("xs")]: {
          backgroundColor: "transparent",
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
            height: 20,
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
                // flexDirection:"column",
                marginLeft: "20px",
                fontSize: "15px",
                overflow: "hidden",
                "& .posterInfo-part1": {
                  display: "flex",
                  fontWeight: 700,
                  lineHeight: "20px",
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
      "& .reposted-info": {
        color: theme.palette.text.gray,
        fontSize: "13px",
        lineHeight: "13px",
        paddingLeft: "52px",
        paddingBottom: "8px",
        marginBottom: "-20px",
        paddingTop: "14px",
        fontWeight: "500",

        "& svg": {
          verticalAlign: "top",
        },
        "& a": {
          color: theme.palette.text.gray,
          marginRight: "10px",
        },
      },
    },
  },
  pinnedLine: {
    borderBottom: theme.notchedOutline.border,
    backgroundColor: "#F2F2F2",
    height: theme.spacing(1.25),
  },
  repostSpacing: {
    marginRight: theme.spacing(1.25),
  },
  feedItemMain: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    padding: "15px 0px 6px 18px",
    transition: "all 100ms ease-in",
    cursor: "pointer",
    fontSize: 14,
    "& > .content": {
      width: "calc(100% - 67px)",
      display: "flex",
      flexDirection: "column",
      "& .description-header": {
        height: 20,
        display: "flex",
        justifyContent: "space-between",
        paddingRight: theme.spacing(0.5),
        fontSize: "15px",
      },
    },
  },
  description: {
    paddingRight: 0,
  },
  messageContent: {
    padding: 0,
    paddingRight: 18,
    fontSize: 15,
  },
  postDetailMessageContent: {
    padding: 0,
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
    color: theme.palette.text.secondary,
    fontSize: "18px",
    padding: "20px 0",
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
  },
  avatarContent: {
    marginRight: "15px",
    "& > div": {
      maxWidth: "100%",
    },
  },
  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "100%",
    cursor: "pointer",
  },
  commentDetailAvatar: {
    position: "relative",
    marginRight: "15px",

    "&::after": {
      content: "' '",
      position: "absolute",
      top: "85px",
      left: "18px",
      bottom: 0,
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
          fontSize: "15px",
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
            paddingLeft: "3px",
            paddingRight: "3px",
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
    flexShrink: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginRight: "3px",
    alignItems: "center",
  },
  userDisplayName: {
    // width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
    cursor: "pointer",
    marginLeft: "3px",
    fontWeight: "400",
  },
  dot: {
    color: theme.palette.text.gray,
    display: "flex",
    fontSize: 15,
    flexShrink: 0,
    marginLeft: 5,
    marginRight: 5,
  },
  sinceTime: {
    color: theme.palette.text.gray,
    display: "flex",
    flexShrink: 0,
  },
  pinIcon: {
    height: 20,
    width: 20,
  },
  unavailablePost: {
    border: "1px solid #E0E6EA",
    backgroundColor: "#F3F5F8",
    borderRadius: 10,
    width: "auto",
    padding: theme.spacing(1.75),
    color: theme.palette.text.gray,
    lineHeight: "15px",
    margin: theme.spacing(2.5),
  },
}));

/**
 * A view component for a single item in the popup
 */
export const PostFeedItemViewForTimeline = memo(
  ({
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
    setTimelineId,
    headLine,
    isOpen,
    menuDropDown,
    xPostItem,
    detailLink,
    type,
    itemId,
    handleClose,
    handleSubmit,
    postId,
    sharedObj,
    isPinnedPost,
    hideDropdown,
    removePostFromProfile,
  }) => {
    const classes = useStyles();
    const history = useHistory();
    const handleContentClick = (e, id) => {
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
      const selection = window.getSelection().toString();

      if (selection.length > 0) {
        return;
      }

      if (setTimelineId) {
        setTimelineId(xPostItem.getId());
      }
      id && history.push(`/post/${id}`);
    };

    const isSuspended = posterInfo?.data?.status === "s";

    return (
      <Fragment>
        <div
          id={id}
          className={`${classes.root} post-feed-item ${scene}`}
          key={itemId}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isSuspended) {
              scrollHelper.rememberScrollY("post-timeline");
              handleContentClick(e, postId);
            }
          }}
          ref={postItemRef}
        >
          <div>
            {headLine}

            {isPinnedPost && (
              <div className="header-msg reposted-info">
                <PinIcon className={classes.pinIcon} />
                <span className={classes.repostSpacing} />
                {t("getter_fe.post.text.pinnedPost")}
              </div>
            )}
            <div className={classes.feedItemMain}>
              <div className={classes.avatarContent}>
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
              <div className="content">
                <div className="description-header">
                  <Box
                    alignItems={"center"}
                    flexDirection={"row"}
                    style={{width: "80%", flexGrow: 1}}
                  >
                    <Box
                      alignItems="flex-start"
                      mr={0.5}
                      style={{
                        width: "100%",
                        display: "flex",
                        lineHeight: "18px",
                      }}
                    >
                      <HoverPopup
                        userId={posterId}
                        userInfoTemp={posterInfo}
                        leftAligned={true}
                      >
                        <div
                          key="popup-handler"
                          name="timeline-handler"
                          className={classes.hoverPopup}
                        >
                          <div className={classes.userDisplayName}>
                            <UserLabelLink
                              userId={posterId}
                              nickname={
                                posterInfo?.nickname || displayName || username
                              }
                            />
                          </div>
                          {(posterInfo?.isInfluencer &&
                            posterInfo?.isInfluencer() > 0) ||
                          posterInfo?.infl > 0 ? (
                            <div className={classes.influencer}>
                              <VerificationIcon className={classes.icon} />
                            </div>
                          ) : null}
                          <div
                            className={
                              sinceTimeFormat
                                ? classes.userAtNameShort
                                : classes.userAtName
                            }
                          >
                            @{posterInfo?.ousername || username}
                          </div>
                        </div>
                      </HoverPopup>

                      <div className={classes.dot}>·</div>
                      <div className={classes.sinceTime}>{sinceTime}</div>
                    </Box>
                  </Box>

                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    {menuDropDown}
                  </div>
                </div>
                {isSuspended ? (
                  <div className="unavailable-post-container">
                    <div className={classes.unavailablePost}>
                      {t("getter_fe.post.tips.unavailable_comment")}
                    </div>
                  </div>
                ) : (
                  <div className={classes.description}>
                    <div className={classes.messageContent}>{mainContent}</div>

                    <PostStatLine
                      item={xPostItem}
                      postId={postId}
                      detailLink={detailLink}
                      type={type}
                      sharedObj={sharedObj}
                      hideDropdown={hideDropdown}
                      removePostFromProfile={removePostFromProfile}
                      isPinnedPost={isPinnedPost}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isPinnedPost && <div className={classes.pinnedLine}></div>}
        <ReportContentDialog
          isOpen={isOpen}
          handleClose={handleClose}
          handleSubmit={(reasonId) => handleSubmit(reasonId)}
        />
      </Fragment>
    );
  },
);
