import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {Tabs, Tab, Typography} from "@material-ui/core";
import {t} from "../../../i18n/utils";
import Muted from "./Muted";
import Blocked from "./Blocked";
import {ReactComponent as BackArrowIcon} from "src/assets/icons/basic/back_arrow.svg";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import AppConsts from "../../AppConsts";
import Global from "src/system/Global";

function TabPanel({children, value, index, ...other}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  headBox: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(2.8),
    paddingBottom: theme.spacing(2.8),
    margin: theme.spacing(0, 4, 4, 4),
    borderBottom: `1px solid ${theme.palette.grey.A200}`,
  },
  tabTitle: {
    margin: theme.spacing(0, 5, 0, 0),
    fontSize: 28,
    fontWeight: 600,
    lineHeight: "33px",
    color: theme.palette.text.primary,
    textTransform: "capitalize",
    [theme.breakpoints.down("sm")]: {
      // tablet or mobile
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
      marginTop: 0,
      height: 58,
      lineHeight: "58px",
      fontSize: 18,
      "& > svg": {
        // back arrow icon
        marginRight: theme.spacing(2),
        verticalAlign: "top",
        cursor: "pointer",
        borderRadius: "50%",
        padding: 1,
        width: 26,
        height: 26,
        "&:hover": {
          backgroundColor: "#F2F9FF",
        },
      },
    },
  },
  root: {
    height: "100%",
    minHeight: "calc(100vh - 58px)",
    flexGrow: 1,
    margin: theme.spacing(0, 4),
    [theme.breakpoints.down("sm")]: {
      minHeight: `calc(100vh - ${
        58
        // theme.mixins.header.height + tabTitleHeight
      }px)`,
    },
  },
  tabPanel: {
    height: "100%",
  },
  tabs: {
    "& .MuiTabs-indicator": {
      height: 3,
      borderRadius: "100px",
      backgroundColor: theme.palette.error.main,
    },
  },
  tab: {
    color: theme.palette.text.lightGray,
    textTransform: "capitalize",
    fontSize: 18,
    lineHeight: "21px",
    opacity: 1,
    fontWeight: "bold",
    "&.Mui-selected": {
      color: theme.palette.error.main,
    },
    // "& .MuiTab-wrapper": {
    //   opacity: 0.5,
    // },
    // "&.Mui-selected .MuiTab-wrapper": {
    //   opacity: 1,
    // },
  },
}));

export default function PrivacyTabs({userId, token, setPageSeo}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  useEffect(() => {
    setPageSeo(t("getter_fe.settings.common.privacy"));
  }, []);

  return (
    <>
      <div className={classes.headBox}>
        <Typography variant="h1" className={classes.tabTitle}>
          {isTabletOrMobile && (
            <BackArrowIcon
              onClick={() =>
                history.push(`/settings/${AppConsts.URL_SETTINGS_MOBILE_INDEX}`)
              }
            />
          )}
          {t("getter_fe.settings.common.privacy")}
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          className={classes.tabs}
        >
          <Tab
            label={t("getter_fe.settings.common.mutedTitle")}
            {...a11yProps(0)}
            className={classes.tab}
            disableRipple={true}
          />
          <Tab
            label={t("getter_fe.settings.common.blockedTitle")}
            {...a11yProps(1)}
            className={classes.tab}
            disableRipple={true}
          />
        </Tabs>
      </div>
      <div className={classes.root}>
        <TabPanel value={value} index={0} className={classes.tabPanel}>
          <Muted userId={userId} token={token} />
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.tabPanel}>
          <Blocked userId={userId} token={token} />
        </TabPanel>
      </div>
    </>
  );
}
