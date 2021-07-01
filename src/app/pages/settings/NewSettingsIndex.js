import {makeStyles} from "@material-ui/core";
import {Tabs, Tab} from "@material-ui/core";
import AppConsts from "src/app/AppConsts";
import {ChangePasswordForm} from "./ChangePasswordForm";
import {TabPanel} from "src/app/components/TabPanel";
import {t} from "src/i18n/utils";
import Global from "src/system/Global";
import {Languages} from "./Languages";
import PrivacyTabs from "./PrivacyTabs";
import {useHistory} from "react-router";
import {MobileIndex} from "./MobileIndex";
import {GBackTitle} from "src/styles/components/GBackTitle";

import {ReactComponent as RightArrowIcon} from "src/assets/icons/basic/forward_arrow.svg";

const selectTabByUrlQuery = (tab) => {
  switch (tab) {
    case AppConsts.URL_SETTINGS_CHANGE_PASSWORD:
      return 0;
    case AppConsts.URL_SETTINGS_INTERFACE_LANGUAGE:
      return 1;
    case AppConsts.URL_SETTINGS_PRIVACY:
      return 2;
    default:
      return -1;
  }
};

const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%",
    padding: 0,
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
  container: {
    height: "100%",
  },
  tabs: {
    minWidth: theme.spacing(40),
    minHeight: `calc(100vh - ${theme.mixins.header.height + 58}px)`,
    borderRight: `1px solid ${theme.palette.grey.A200}`,
    borderLeft: `1px solid ${theme.palette.grey.A200}`,
    background: theme.palette.background.default,
    "& .MuiTabs-indicator": {
      display: "none",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  tab: {
    maxWidth: "100%",
    minWidth: "auto",
    minHeight: "auto",
    height: "auto",
    padding: "15px 18px",
    lineHeight: "18px",
    color: theme.palette.text.main,
    textTransform: "capitalize",
    fontSize: 15,
    borderRight: `1px solid ${theme.palette.background.default}`,

    "&:hover": {
      backgroundColor: "#F5F9FF",
      opacity: 1,
      borderRight: "1px solid #F5F9FF",
    },
    "&.Mui-selected": {
      fontWeight: 700,
      backgroundColor: "#F5F9FF",
      borderRight: "2px solid #232255",
    },
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
    "&:last-child": {
      marginBottom: 0,
    },
    "& > .MuiTab-wrapper": {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      alignItems: "center",
      "& > svg": {
        marginBottom: "0 !important",
        width: 14,
        height: 14,
        "& > path": {
          stroke: theme.palette.text.main,
          strokeWidth: 2,
        },
      },
    },
  },
  tabPanel: {
    width: "100%",
    borderRight: `1px solid ${theme.palette.grey.A200}`,
    background: "rgb(252, 253, 253)",
    [theme.breakpoints.down("sm")]: {
      borderLeft: `1px solid ${theme.palette.grey.A200}`,
    },
  },
  menuContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  tabMenuTitle: {
    display: "flex",
    alignItems: "center",
    // paddingLeft: 14,
    fontSize: 20,
    fontWeight: 800,
    height: 58,
    color: "#000000",
    borderLeft: `1px solid ${theme.palette.grey.A200}`,
    borderRight: `1px solid ${theme.palette.grey.A200}`,
    borderBottom: `1px solid ${theme.palette.grey.A200}`,
    background: theme.palette.background.default,
  },
  indexContainer: {
    display: "flex",
    width: "100%",
  },
}));

export const NewSettingsIndex = ({tab, setPageSeo}) => {
  const classes = useStyles();
  const history = useHistory();
  const tabNumber = selectTabByUrlQuery(tab);

  const api = Global.GetPortal().getAppService();
  const userId = api.getUserId();
  const nickname = api.getNickname();
  const token = api.getUserToken();

  const handleUrl = (e, tabNumber) => {
    e.preventDefault();
    switch (tabNumber) {
      case 1:
        history.push(`/settings/${AppConsts.URL_SETTINGS_INTERFACE_LANGUAGE}`);
        break;
      case 2:
        history.push(`/settings/${AppConsts.URL_SETTINGS_PRIVACY}`);
        break;
      default:
        history.push(`/settings/${AppConsts.URL_SETTINGS_CHANGE_PASSWORD}`);
        break;
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.root}>
        {tabNumber === -1 ? (
          <MobileIndex nickname={nickname} />
        ) : (
          <div className={classes.indexContainer}>
            <div className={classes.menuContainer}>
              {/* <div className={classes.tabMenuTitle}>Settings</div> */}
              <div className={classes.tabMenuTitle}>
                <GBackTitle
                  title={t("getter_fe.menu.common.settings")}
                  hideBackLink
                />
              </div>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabNumber}
                onChange={handleUrl}
                aria-label="settings"
                className={classes.tabs}
              >
                <Tab
                  icon={<RightArrowIcon />}
                  label={t("getter_fe.settings.common.changePassword")}
                  className={classes.tab}
                  {...a11yProps(0)}
                  disableRipple={true}
                />
                <Tab
                  icon={<RightArrowIcon />}
                  label={t("getter_fe.settings.common.interfaceLanguages")}
                  className={classes.tab}
                  {...a11yProps(1)}
                  disableRipple={true}
                />
                <Tab
                  icon={<RightArrowIcon />}
                  label={t("getter_fe.settings.common.privacy")}
                  className={classes.tab}
                  {...a11yProps(2)}
                  disableRipple={true}
                />
              </Tabs>
            </div>
            <TabPanel value={tabNumber} index={0} className={classes.tabPanel}>
              <ChangePasswordForm userId={userId} setPageSeo={setPageSeo} />
            </TabPanel>
            <TabPanel value={tabNumber} index={1} className={classes.tabPanel}>
              <Languages setPageSeo={setPageSeo} />
            </TabPanel>
            <TabPanel value={tabNumber} index={2} className={classes.tabPanel}>
              <PrivacyTabs
                userId={userId}
                token={token}
                setPageSeo={setPageSeo}
              />
            </TabPanel>
          </div>
        )}
      </div>
    </div>
  );
};
