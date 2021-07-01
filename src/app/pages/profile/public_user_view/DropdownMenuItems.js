import {makeStyles} from "@material-ui/core";
import CopyToClipboard from "react-copy-to-clipboard";
import {t} from "../../../../i18n/utils";

import {ReactComponent as ShareIcon} from "src/assets/icons/feature/share.svg";
import {ReactComponent as UnmuteIcon} from "src/assets/icons/ico-unmute.svg";
import {ReactComponent as BlockIcon} from "src/assets/icons/feature/block.svg";
import {ReactComponent as ReportIcon} from "src/assets/icons/feature/report.svg";
import {ReactComponent as MuteIcon} from "src/assets/icons/feature/mute.svg";
import {ReactComponent as DeleteIcon} from "src/assets/icons/basic/delete.svg";
import {UIStyleConsts} from "src/app/AppConsts";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import Global from "src/system/Global";

const useStyles = makeStyles((theme) => ({
  icon: {
    "& path": {
      fill: theme.palette.text.lightGray,
    },
  },
}));

export const DropdownMenuItems = ({
  username,
  setDrawerOpen,
  isMuted,
  isBlocked,
  isSuspended,
  handleMute,
  handleBlock,
  handleSuspend,
  handleReport,
  canShowMuted,
  canShowBlocked,
  handleClaim,
}) => {
  const classes = useStyles();
  const userHasModeratorRole = Global.GetPortal().userHasModeratorRole();

  return (
    <>
      <div className={UIStyleConsts.DROPDOWN_MENU_ITEM} onClick={setDrawerOpen}>
        <CopyToClipboard
          text={window.location.origin + location.pathname}
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
          <div className="wrapper">
            <div className="icon">
              <ShareIcon className={classes.icon} />
            </div>
            <div className="menu-item-name">
              {t("getter_fe.profile.common.shareUsername", {username})}
            </div>
          </div>
        </CopyToClipboard>
      </div>
      {/*<div
        className={UIStyleConsts.DROPDOWN_MENU_ITEM}
        onClick={() => handleClaim()}
      >
        <div className="wrapper">
          <div className="icon">
            <ReportIcon />
          </div>
          <div className="menu-item-name">
            {t("getter_fe.profile.common.claim", {
              username,
            })}
          </div>
        </div>
      </div>*/}
      {canShowMuted &&
        isMuted && ( //this.state.ismuted
          <div
            className={UIStyleConsts.DROPDOWN_MENU_ITEM}
            onClick={() => handleMute()}
          >
            <div className="wrapper">
              <div className="icon">
                <UnmuteIcon className={classes.icon} />
              </div>
              <div className="menu-item-name">
                {t("getter_fe.profile.common.unmuteUsername", {
                  username,
                })}
              </div>
            </div>
          </div>
        )}

      {canShowMuted && !isMuted && (
        <div
          className={UIStyleConsts.DROPDOWN_MENU_ITEM}
          onClick={() => handleMute()}
        >
          <div className="wrapper">
            <div className="icon">
              <MuteIcon className={classes.icon} />
            </div>
            <div className="menu-item-name">
              {t("getter_fe.profile.common.muteUsername", {
                username,
              })}
            </div>
          </div>
        </div>
      )}
      {canShowBlocked &&
        isBlocked && ( //this.state.isblocked
          <div
            className={UIStyleConsts.DROPDOWN_MENU_ITEM}
            onClick={() => handleBlock()}
          >
            <div className="wrapper">
              <div className="icon">
                <BlockIcon className={classes.icon} />
              </div>
              <div className="menu-item-name">
                {t("getter_fe.profile.common.unblockUsername", {
                  username,
                })}
              </div>
            </div>
          </div>
        )}

      {canShowBlocked && !isBlocked && (
        <div
          className={UIStyleConsts.DROPDOWN_MENU_ITEM}
          onClick={() => handleBlock()}
        >
          <div className="wrapper">
            <div className="icon">
              <BlockIcon className={classes.icon} />
            </div>
            <div className="menu-item-name">
              {t("getter_fe.profile.common.blockUsername", {username})}
            </div>
          </div>
        </div>
      )}
      <div
        className={UIStyleConsts.DROPDOWN_MENU_ITEM}
        onClick={() => handleReport()}
      >
        <div className="wrapper">
          <div className="icon">
            <ReportIcon className={classes.icon} />
          </div>
          <div className="menu-item-name">
            {t("getter_fe.profile.common.reportUsername", {username})}
          </div>
        </div>
      </div>
      {/* {userHasModeratorRole && isSuspended && (
        <div
          className={UIStyleConsts.DROPDOWN_MENU_ITEM}
          onClick={() => handleSuspend()}
        >
          <div className="wrapper">
            <div className="icon">
              <DeleteIcon />
            </div>
            <div className="menu-item-name">
              {t("getter_fe.profile.common.unsuspendUser", {
                username,
              })}
            </div>
          </div>
        </div>
      )} */}
      {userHasModeratorRole && !isSuspended && (
        <div
          className={UIStyleConsts.DROPDOWN_MENU_ITEM}
          onClick={() => handleSuspend()}
        >
          <div className="wrapper">
            <div className="icon">
              <DeleteIcon className={classes.icon} />
            </div>
            <div className="menu-item-name">
              {t("getter_fe.profile.common.suspendUser", {
                username,
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
