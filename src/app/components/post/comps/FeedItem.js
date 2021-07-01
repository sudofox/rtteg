import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {Link, useHistory} from "react-router-dom";
import clsx from "clsx";
import {Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {UserLabelLink} from "src/app/components/UserLabelLink";
import HoverPopup from "src/app/components/HoverPopup";
import {PostStatLine} from "./PostStatLine";
import {AvatarLink} from "src/app/components/AvatarLink";
import {ReactComponent as VerificationIcon} from "src/assets/icons/feature/verification.svg";
import {TimeUtil} from "src/core/Util";
import {scrollHelper} from "src/util/scrollUtils";
import {getDisplayName, getIsShared, getUserName} from "src/util/FeedUtils";
import {ReactComponent as PinIcon} from "src/assets/icons/feature/pin.svg";
import {ReactComponent as RepostIcon} from "src/assets/icons/feature/retweet.svg";
import {getLang, t} from "src/i18n/utils";
import FeedItemContent from "./FeedItemContent";
import {MoreDropDown} from "./MoreDropDown";
import {addItemHeight} from "src/app/components/timeline/store";
import {connect} from "react-redux";
import ElementResizeListener from "src/app/components/timeline/comps/ElementResizeListener";
import {timelineConstants} from "../../timeline/_constants";

const useStyles = makeStyles((theme) => ({
  feedItem: {
    display: "flex",
    flexDirection: "column",
    marginBottom: timelineConstants.FEED_ITEM_MARGIN_BOTTOM, // !the margin bottom should be updated in timelineConstants.FEED_ITEM_MARGIN_BOTTOM,
    backgroundColor: theme.palette.background.default,
    boxShadow: ({scene}) => {
      scene !== "comment" && theme.mixins.post.shadow;
    },
    borderRadius: 10,
    width: "100%",
    // minHeight: 700, // temporary
  },
  topLine: {
    display: "flex",
    "& > div": {
      maxWidth: "100%",
    },
    color: theme.palette.text.gray,
    fontSize: 13,
    lineHeight: "13px",
    paddingLeft: 52,
    marginBottom: -4,
    paddingTop: 14,
    fontWeight: 500,
    "& svg": {
      width: 13.3,
      verticalAlign: "top",
      color: theme.palette.text.gray,
      marginRight: theme.spacing(1.625),
    },
    "& a": {
      color: theme.palette.text.gray,
      marginRight: theme.spacing(1.25),
      "&:hover": {
        color: theme.palette.text.gray,
      },
    },
  },
  feedItemBody: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    padding: "15px 0px 6px 18px",
    paddingLeft: ({scene}) => {
      return scene === "comment" ? 0 : 18;
    },
    transition: "all 100ms ease-in",
    fontSize: 14,
    "& > .content": {},
  },
  feedColumn: {
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
  headerContent: {
    height: 20,
    display: "flex",
    justifyContent: "space-between",
    paddingRight: theme.spacing(0.5),
    fontSize: "15px",
  },
  messageContent: {
    padding: 0,
    paddingRight: 18,
    fontSize: 15,
  },
  avatarColumn: {
    marginRight: 8,
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
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
  influencer: {
    display: "flex",
    flexShrink: 0,
    marginRight: "3px",
    paddingTop: theme.spacing(0.25),
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
    width: "20px !important",
    height: "20px !important",
    marginRight: "6px !important",
    color: `${theme.palette.background.black} !important`,
  },
  dropdownImage: {
    display: "flex",
    width: 30,
    height: 30,
    marginTop: -4,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor: theme.palette.background.notif,
      cursor: "pointer",

      "& svg": {
        fill: theme.palette.background.hover,
      },
    },
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
  replyingTo: {
    color: theme.palette.text.gray,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    fontSize: 15,
    "& a": {
      color: theme.palette.text.link,
      fontWeight: "normal",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
}));

/**
 * A view component for a single item in the popup
 */
const connector = connect(
  (state) => {
    return {};
  },
  {addItemHeight},
);
export const FeedItem = connector(_FeedItem);

function _FeedItem({
  scene,
  item,
  user,
  originalUser, // original poster for repost without quote
  embededPost,
  embededUser,
  loggedinUserId,
  isPinned,
  hideMore,
  hidePostStatLine,
  addItemHeight,
  deleteItem,
}) {
  if (!item || !user) {
    return null;
  }
  const classes = useStyles({scene});
  const history = useHistory();
  const [isDeleted, setIsDeleted] = useState(false);

  const postItemRef = useRef(null);

  const {action, cdate, id, replyingTo, type, domId, index, isNewPost} = item;

  const isShared = getIsShared(action);
  const isSuspended = originalUser
    ? originalUser.status === "s"
    : user?.status === "s";
  const sinceTime = TimeUtil.SinceTimeV5(cdate, Date.now(), getLang(), false);
  const sinceTimeFormat = TimeUtil.SinceTimeV4(cdate, Date.now(), false);
  const mainUser = isShared ? originalUser : user;
  const isReply = type === "cmt" || action === "cm_sharedby";

  useEffect(() => {
    adaptResize();
  }, []);

  const adaptResize = useCallback(() => {
    if (scene === "timeline") {
      const current = postItemRef.current;

      if (current) {
        const elmRect = current.getBoundingClientRect();
        const itemHeight =
          elmRect.height + timelineConstants.FEED_ITEM_MARGIN_BOTTOM;

        addItemHeight({
          itemId: domId,
          itemHeight: itemHeight,
          index: index,
          isNewPost: isNewPost,
        });
      }
    }
  }, []);

  if (isDeleted) {
    return null;
  }

  // return (
  //   <div
  //     className={clsx(classes.feedItem, scene)}
  //     style={{
  //       backgroundColor: "red",
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       minHeight: 300,
  //     }}
  //     ref={(el) => (postItemRef.current = el)}
  //   >
  //     <h1>index: {item.index}</h1>
  //     <h1>domId :{item.domId}</h1>
  //   </div>
  // );

  return (
    <Fragment>
      <div
        className={clsx(classes.feedItem, scene)}
        key={id}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isSuspended) {
            const selection = window.getSelection().toString();
            if (selection.length > 0) {
              return;
            }
            if (scene === "timeline") {
              scrollHelper.rememberScrollY("post-timeline");
            }
            id && history.push(`/post/${id}`);
          }
        }}
        ref={(el) => (postItemRef.current = el)}
      >
        <ElementResizeListener
          onResize={() => {
            adaptResize();
          }}
        />
        <div>
          {isPinned ? (
            <div className={classes.topLine}>
              <PinIcon className={classes.pinIcon} />
              {t("getter_fe.post.text.pinnedPost")}
            </div>
          ) : (
            isShared && (
              <Link
                className={classes.topLine}
                onClick={(e) => e.stopPropagation()}
                to={`/user/${user.id}`}
              >
                <RepostIcon />
                {user.id === loggedinUserId
                  ? t("getter_fe.post.text.you_reposted")
                  : t("getter_fe.post.text.reposted", {
                      username: getDisplayName(user),
                    })}
              </Link>
            )
          )}
          <div className={classes.feedItemBody}>
            <div className={classes.avatarColumn}>
              <HoverPopup userId={mainUser?.id} userInfoTemp={mainUser}>
                <AvatarLink
                  avatarUrl={mainUser?.ico}
                  styleClasses={classes.avatar}
                  userId={mainUser?.id}
                  username={getDisplayName(mainUser)}
                />
              </HoverPopup>
            </div>
            <div className={classes.feedColumn}>
              <div className={classes.headerContent}>
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
                    }}
                  >
                    <HoverPopup
                      userId={mainUser?.id}
                      userInfoTemp={mainUser}
                      leftAligned={true}
                    >
                      <div
                        key="popup-handler"
                        name="timeline-handler"
                        className={classes.hoverPopup}
                      >
                        <div className={classes.userDisplayName}>
                          <UserLabelLink
                            userId={mainUser?.id}
                            nickname={getDisplayName(mainUser)}
                          />
                        </div>
                        {mainUser?.infl > 0 ? (
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
                          @{getUserName(mainUser)}
                        </div>
                      </div>
                    </HoverPopup>
                    <div className={classes.dot}>·</div>
                    <div className={classes.sinceTime}>{sinceTime}</div>
                  </Box>
                </Box>
                {!hideMore && (
                  <MoreDropDown
                    item={item}
                    postId={id}
                    user={mainUser}
                    originalUser={originalUser}
                    embededPost={embededPost}
                    embededUser={embededUser}
                    loggedinUserId={loggedinUserId}
                    isShared={isShared}
                    scene={scene}
                    onDelete={() =>
                      typeof deleteItem === "function"
                        ? deleteItem(id)
                        : setIsDeleted(true)
                    }
                  />
                )}
              </div>
              {isReply ? (
                <div className={classes.replyingTo}>
                  {t("getter_fe.post.tips.replying_to")}{" "}
                  <Link>@{replyingTo ?? getUserName(originalUser)}</Link>
                </div>
              ) : null}
              {isSuspended ? (
                <div className={classes.unavailablePost}>
                  {t("getter_fe.post.tips.unavailable_comment")}
                </div>
              ) : (
                <Fragment>
                  <div className={classes.context}>
                    <FeedItemContent
                      embeddedPost={embededPost}
                      embeddedUser={embededUser}
                      item={item}
                      user={user}
                      originalUser={originalUser}
                      loggedinUserId={loggedinUserId}
                      isPinnedPost={isPinned}
                      hidePostStatLine={hidePostStatLine}
                      addItemHeight={addItemHeight}
                    />
                  </div>

                  {!hidePostStatLine && (
                    <PostStatLine
                      item={item}
                      user={user}
                      originalUser={originalUser}
                      embededPost={embededPost}
                      embededUser={embededUser}
                      loggedinUserId={loggedinUserId}
                      isPinnedPost={isPinned}
                    />
                  )}
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
