import {makeStyles} from "@material-ui/core";
import classnames from "classnames";
import {t} from "src/i18n/utils";
import {UIStyleConsts} from "../AppConsts";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  primaryColumn: {
    maxWidth: "600px",
    boxShadow: "0px 4px 34px 5px rgba(236, 239, 245, 0.35);",
    minHeight: "calc(var(--vh, 1vh) * 100 - 60px)",
    [theme.breakpoints.up("md")]: {
      width: "600px",
    },
    alignItems: "center",
  },
  pageNotFoundContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 426,
    paddingTop: 40,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  pageNotFoundTitle: {
    fontSize: 18,
    fontWeight: 800,
  },
  pageNotFoundContent: {
    color: theme.palette.text.gray,
    fontSize: 14,
    fontWeight: 500,
    textAlign: "center",
    paddingTop: 6,
  },
  returnLink: {
    fontSize: 14,
    paddingTop: 20,
    fontWeight: 500,
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
  ExploreSideBar: {
    maxWidth: "425px",
    [theme.breakpoints.up("lg")]: {
      width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none !important",
    },
  },
}));

export const NetworkRequestFailed = () => {
  const classes = useStyles();
  return (
    <div className={classnames(UIStyleConsts.DASHBOARD)}>
      <div
        className={classnames(
          UIStyleConsts.DASHBOARD_PRIMARY_COLUMN,
          UIStyleConsts.DASHBOARD_COLUMN,
          classes.primaryColumn,
        )}
      >
        <div className={classes.pageNotFoundContainer}>
          <div className={classes.pageNotFoundTitle}>
            {t("getter_fe.common.errorOccured")}
          </div>
          <Link to="/" className={classes.returnLink}>
            {t("getter_fe.common.returnToHomePage")}
          </Link>
        </div>
      </div>
    </div>
  );
};
