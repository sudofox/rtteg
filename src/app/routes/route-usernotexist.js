import React from "react";

import {GBackTitle} from "src/styles/components/GBackTitle";
import {t} from "src/i18n/utils";
import {NewUIPage} from "../base/NewUIPage";
import {makeStyles} from "@material-ui/core";
import {AvatarLink} from "src/app/components/AvatarLink";
import {GTwemoji} from "src/styles/components/GTwemoji";
import {GTypography} from "src/styles/components/GTypography";

const useStyles = makeStyles((theme) => ({
  userProfileDetails: {
    display: "flex",
    flexDirection: "column",
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    paddingBottom: theme.spacing(5),
  },
  userBannerImage: {
    height: 199,
    backgroundColor: theme.palette.grey.A800,
  },
  userProfileContent: {
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(1.625),
  },
  userProfile__top: {
    display: "flex",
    position: "relative",
    justifyContent: "space-between",
    height: "90px",
  },
  userProfileAvatar: {
    transform: "translateY(-51px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    height: 134,
    width: 134,
    border: "4px solid #fff",
    borderRadius: "50%",
  },
  userId: {
    fontSize: 20,
    fontWeight: 800,
    lineHeight: "24px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  userProfileNickname: {
    fontSize: 20,
    fontWeight: 800,
    lineHeight: "24px",
  },
  userProfileSubtitle: {
    marginTop: theme.spacing(0.5),
    fontWeight: 500,
    fontSize: 16,
    color: theme.palette.text.gray,
  },
  userProfileBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 175,
  },
}));

export const NewUserNotExist = ({match}) => {
  const {id} = match.params;
  const classes = useStyles();
  return (
    <NewUIPage title="Account Doesn't Exist">
      <GBackTitle title={t("getter_fe.menu.common.profile")} />
      <div className={classes.userProfileDetails}>
        <div className={classes.userBannerImage} />
        <div className={classes.userProfileContent}>
          <div className={classes.userProfile__top}>
            <div className={classes.userProfileAvatar}>
              <AvatarLink
                styleClasses={classes.avatar}
                userNotExist
                noRedirect
              />
            </div>
          </div>

          <p className={classes.userId}>
            <GTwemoji text={`@${id}`} />
          </p>
        </div>
      </div>
      <div className={classes.userProfileBody}>
        <GTypography isBold className={classes.userProfileNickname}>
          This account doesn't exist
        </GTypography>
        <GTypography className={classes.userProfileSubtitle}>
          Try searching for another
        </GTypography>
      </div>
    </NewUIPage>
  );
};
