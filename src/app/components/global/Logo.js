import {useLocation, useHistory} from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {
  resetTimelineStatus,
  resetTimelineData,
} from "src/app/components/timeline/store";
import {makeStyles} from "@material-ui/core";
import {ReactComponent as LogoBig} from "src/assets/images/common/logoGettr.svg";
import {ReactComponent as LogoSmall} from "src/assets/images/common/brand-logo-small.svg";

const useStyles = makeStyles((theme) => ({
  brandLogoContainer: {},
  brandLogoWrapper: {
    position: "relative",
    [theme.breakpoints.only("md")]: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(3.75),
    },
    [theme.breakpoints.only("sm")]: {
      paddingLeft: theme.spacing(1.625),
      paddingRight: theme.spacing(2.75),
    },
  },
  brandLogo: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    height: theme.mixins.header.height - 5,
    paddingLeft: 25,
    [theme.breakpoints.down("md")]: {
      paddingLeft: 0,
      width: 72,
      justifyContent: "center",
    },
  },
}));

const connector = connect(
  (state) => {
    return {};
  },
  {resetTimelineStatus, resetTimelineData},
);

export const Logo = connector(_Logo);

function _Logo({resetTimelineStatus, resetTimelineData}) {
  const classes = useStyles();
  const {pathname} = useLocation();
  const history = useHistory();
  const theme = useTheme();
  const pcMatches = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <div className={classes.brandLogoContainer}>
      <div className={classes.brandLogoWrapper}>
        <div
          className={classes.brandLogo}
          onClick={() => {
            if (/\/dashboard/.test(pathname) || pathname === "/") {
              return window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }
            resetTimelineData();
            resetTimelineStatus();
            history.push("/");
          }}
        >
          {pcMatches ? <LogoBig /> : <LogoSmall />}
        </div>
      </div>
    </div>
  );
}
