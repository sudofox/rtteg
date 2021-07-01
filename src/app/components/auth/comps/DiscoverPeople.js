import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import {t} from "src/i18n/utils";
import {GButton} from "src/styles/components/GButton";
import {PopularUsersFeed} from "src/app/components/PopularUsersFeed";
import Global from "src/system/Global";
import {useHistory} from "react-router-dom";
import {useRedirectAfterLogin} from "src/util/useRedirectAfterLogin";

const useStyles = makeStyles((theme) =>
  createStyles({
    contentWrapper: {
      maxWidth: theme.spacing(67.5),
    },
    title: {
      marginBottom: theme.spacing(1.875),
      fontSize: 28,
      lineHeight: "33px",
      fontWeight: 600,
      color: theme.palette.text.main,
      [theme.breakpoints.down("xs")]: {
        marginTop: theme.spacing(8.125),
      },
    },
    paragraph: {
      marginBottom: theme.spacing(5),
      fontSize: 20,
      fontWeight: 400,
      lineHeight: "28px",
      color: theme.palette.text.secondary,
      [theme.breakpoints.down("sm")]: {
        fontSize: 16,
        lineHeight: "22px",
      },
    },
    wrapper: {
      maxHeight: theme.spacing(64.5),
      overflowY: "scroll",
    },
    btn: {
      display: "block",
      maxWidth: theme.spacing(37.5),
      height: theme.spacing(6),
      margin: theme.spacing(5, 0, 5, 0),
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: 100,
      "& .MuiButton-label": {
        marginTop: 0,
      },
    },
  }),
);

export const DiscoverPeople = ({redirectURL}) => {
  const classes = useStyles();
  const history = useHistory();
  const redirectAfterLogin = useRedirectAfterLogin();

  const api = Global.GetPortal().getAppService();
  const token = api.getUserToken();
  const userId = api.getUserId();

  const handleNext = () => {
    if (redirectURL) {
      history.push(redirectURL);
    } else {
      redirectAfterLogin();
    }
  };

  return (
    <div className={classes.contentWrapper}>
      <Typography variant="h1" component="h2" className={classes.title}>
        {t("getter_fe.common.people.whoToFollow")}
      </Typography>
      <Typography variant="body1" className={classes.paragraph}>
        {t("getter_fe.common.people.whoToFollowDescr")}
      </Typography>

      <div className={classes.wrapper}>
        <PopularUsersFeed
          sidebar={false}
          token={token}
          userId={userId}
          isPage={true}
        />
      </div>

      <GButton
        type="submit"
        variant="contained"
        className={classes.btn}
        onClick={handleNext}
      >
        {t("getter_fe.auth.common.next")}
      </GButton>
    </div>
  );
};
