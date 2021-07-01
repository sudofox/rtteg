import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core";
import {Tabs, Tab} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router";

import {cacheI18nT} from "src/i18n/utils";
import AppConsts from "src/app/AppConsts";
import {TabPanel} from "src/app/components/TabPanel";
import {ContactUs} from "./ContactUs";
import {HelpCenterMobileIndex} from "./HelpCenterMobileIndex";
import {HelpCenterContent} from "./HelpCenterContent";
import {ReactComponent as RightArrowIcon} from "src/assets/icons/basic/forward_arrow.svg";
import {TextFileReader} from "src/app/components/TextFileReader";
import termsMdPath from "src/assets/md/terms.md";
import privacyMdPath from "src/assets/md/privacy.md";

const selectTabByUrlQuery = (tab) => {
  switch (tab) {
    case AppConsts.URL_HELPCENTER_REGISTRATION:
      return 1;
    case AppConsts.URL_HELPCENTER_POST_REPOST_REPLY:
      return 2;
    case AppConsts.URL_HELPCENTER_SHARE:
      return 3;
    case AppConsts.URL_HELPCENTER_PRIVACYPOLICY:
      return 5;
    case AppConsts.URL_HELPCENTER_TERMSOFUSER:
      return 6;
    case AppConsts.URL_HELPCENTER_CONTACTUS:
      return 10;
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
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    height: "100%",
  },
  wrapper: {
    width: "100%",
    borderLeft: "1px solid #E8E9EA",
  },
  tabs: {
    minWidth: theme.spacing(40),
    minHeight: `calc(100vh - ${theme.mixins.header.height + 58}px)`,
    borderLeft: `1px solid ${theme.palette.grey.A200}`,
    "& .MuiTabs-indicator": {
      display: "none",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  subTitle: {
    padding: "15px 18px",
    fontWeight: 800,
    fontSize: 20,
    lineHeight: "24px",
    color: theme.palette.text.main,
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
  },
  subTitleGap: {
    width: "100%",
    height: 10,
    background: theme.palette.grey[100],
  },
  tab: {
    maxWidth: "100%",
    minWidth: "auto",
    minHeight: "auto",
    height: "auto",
    padding: "15px 18px",
    fontSize: "18px",
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
      borderRight: "1px solid #232255",
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
    borderLeft: `1px solid ${theme.palette.grey.A200}`,
    borderRight: `1px solid ${theme.palette.grey.A200}`,
    // [theme.breakpoints.down("sm")]: {
    //   borderLeft: `1px solid ${theme.palette.grey.A200}`,
    // },
  },
  menuContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  tabMenuTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: 20,
    fontWeight: 800,
    height: 58,
    color: "#000000",
    paddingLeft: 20,
    border: `1px solid ${theme.palette.grey.A200}`,
    borderTop: `none`,
  },
  indexContainer: {
    display: "flex",
    width: "100%",
  },
}));

export const NewHelpCenterIndex = ({tab}) => {
  const classes = useStyles();
  const history = useHistory();
  const tabNumber = selectTabByUrlQuery(tab);
  const {t} = useTranslation();

  useEffect(() => {
    cacheI18nT(t);
  }, []);

  const HELPCENTER_CONTENT = {
    registration: [
      // {
      //   question: t(
      //     "getter_fe.helpCenter.common.registrationContent.question1",
      //   ),
      //   answers: [
      //     t("getter_fe.helpCenter.common.registrationContent.answer11"),
      //     "",
      //     t("getter_fe.helpCenter.common.registrationContent.answer12"),
      //   ],
      // },
      // {
      //   question: t(
      //     "getter_fe.helpCenter.common.registrationContent.question2",
      //   ),
      //   answers: [
      //     t("getter_fe.helpCenter.common.registrationContent.answer21"),
      //     "",
      //     t("getter_fe.helpCenter.common.registrationContent.answer22"),
      //     t("getter_fe.helpCenter.common.registrationContent.answer23"),
      //   ],
      //   notes: [t("getter_fe.helpCenter.common.registrationContent.note21")],
      // },
      {
        question: t(
          "getter_fe.helpCenter.common.registrationContent.question3",
        ),
        answers: [
          t("getter_fe.helpCenter.common.registrationContent.answer31"),
          "",
          t("getter_fe.helpCenter.common.registrationContent.answer32"),
          ,
          "",
          t("getter_fe.helpCenter.common.registrationContent.answer33"),
        ],
      },
    ],
    postRepostReply: [
      {
        question: t(
          "getter_fe.helpCenter.common.postRepostReplyContent.question1",
        ),
        answers: [
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer11"),
          "",
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer12"),
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer13"),
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer14"),
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer15"),
        ],
        notes: [
          t("getter_fe.helpCenter.common.postRepostReplyContent.note11"),
          t("getter_fe.helpCenter.common.postRepostReplyContent.note12"),
          t("getter_fe.helpCenter.common.postRepostReplyContent.note13"),
          t("getter_fe.helpCenter.common.postRepostReplyContent.note14"),
        ],
      },
      {
        question: t(
          "getter_fe.helpCenter.common.postRepostReplyContent.question2",
        ),
        answers: [
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer21"),
          "",
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer22"),
          "",
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer23"),
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer24"),
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer25"),
          t("getter_fe.helpCenter.common.postRepostReplyContent.answer26"),
        ],
      },
    ],
    share: [
      {
        question: t("getter_fe.helpCenter.common.shareContent.question1"),
        answers: [
          t("getter_fe.helpCenter.common.shareContent.answer11"),
          t("getter_fe.helpCenter.common.shareContent.answer12"),
          t("getter_fe.helpCenter.common.shareContent.answer13"),
        ],
      },
      {
        question: t("getter_fe.helpCenter.common.shareContent.question2"),
        answers: [
          t("getter_fe.helpCenter.common.shareContent.answer21"),
          t("getter_fe.helpCenter.common.shareContent.answer22"),
        ],
        notes: [
          t("getter_fe.helpCenter.common.shareContent.note21"),
          t("getter_fe.helpCenter.common.shareContent.note22"),
          t("getter_fe.helpCenter.common.shareContent.note23"),
        ],
      },
      {
        question: t("getter_fe.helpCenter.common.shareContent.question3"),
        answers: [
          t("getter_fe.helpCenter.common.shareContent.answer31"),
          t("getter_fe.helpCenter.common.shareContent.answer32"),
          t("getter_fe.helpCenter.common.shareContent.answer33"),
          t("getter_fe.helpCenter.common.shareContent.answer34"),
        ],
      },
      {
        question: t("getter_fe.helpCenter.common.shareContent.question4"),
        answers: [
          t("getter_fe.helpCenter.common.shareContent.answer41"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer42"),
          t("getter_fe.helpCenter.common.shareContent.answer43"),
          t("getter_fe.helpCenter.common.shareContent.answer44"),
          t("getter_fe.helpCenter.common.shareContent.answer45"),
        ],
      },
      {
        question: t("getter_fe.helpCenter.common.shareContent.question5"),
        answers: [
          t("getter_fe.helpCenter.common.shareContent.answer51"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer52"),
          t("getter_fe.helpCenter.common.shareContent.answer53"),
          t("getter_fe.helpCenter.common.shareContent.answer54"),
          t("getter_fe.helpCenter.common.shareContent.answer55"),
        ],
      },
      {
        question: t("getter_fe.helpCenter.common.shareContent.question6"),
        answers: [
          t("getter_fe.helpCenter.common.shareContent.answer61"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer62"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer63"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer64"),
          t("getter_fe.helpCenter.common.shareContent.answer65"),
        ],
      },
      {
        question: t("getter_fe.helpCenter.common.shareContent.question7"),
        answers: [
          t("getter_fe.helpCenter.common.shareContent.answer71"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer72"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer73"),
          t("getter_fe.helpCenter.common.shareContent.answer74"),
          t("getter_fe.helpCenter.common.shareContent.answer75"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer76"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer77"),
          t("getter_fe.helpCenter.common.shareContent.answer78"),
          t("getter_fe.helpCenter.common.shareContent.answer79"),
        ],
      },
      {
        question: t("getter_fe.helpCenter.common.shareContent.question8"),
        answers: [
          t("getter_fe.helpCenter.common.shareContent.answer81"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer82"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer83"),
          t("getter_fe.helpCenter.common.shareContent.answer84"),
          t("getter_fe.helpCenter.common.shareContent.answer85"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer86"),
          "",
          t("getter_fe.helpCenter.common.shareContent.answer87"),
          t("getter_fe.helpCenter.common.shareContent.answer88"),
          t("getter_fe.helpCenter.common.shareContent.answer89"),
        ],
      },
    ],
  };

  const handleUrl = (e, tabNumber) => {
    e.preventDefault();
    switch (tabNumber) {
      case 1:
        history.push(
          `${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_REGISTRATION}`,
        );
        break;
      case 2:
        history.push(
          `${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_POST_REPOST_REPLY}`,
        );
        break;
      case 3:
        history.push(
          `${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_SHARE}`,
        );
        break;
      case 5:
        history.push("/privacy");
        break;
      case 6:
        history.push("/terms");
        break;
      default:
        history.push(
          `${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_REGISTRATION}`,
        );
        break;
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.root}>
        {tabNumber === -1 ? (
          <HelpCenterMobileIndex />
        ) : tabNumber === 10 ? (
          <div className={classes.wrapper}>
            <ContactUs />
          </div>
        ) : (
          <div className={classes.indexContainer}>
            <div className={classes.menuContainer}>
              <div className={classes.tabMenuTitle}>
                {t("getter_fe.menu.common.helpCenter")}
              </div>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabNumber}
                onChange={handleUrl}
                aria-label="helpCenter"
                className={classes.tabs}
              >
                <div>
                  <div className={classes.subTitleGap} />
                  <div className={classes.subTitle}>
                    {t("getter_fe.helpCenter.common.popularTopics")}
                  </div>
                </div>
                <Tab
                  icon={<RightArrowIcon />}
                  label={t("getter_fe.helpCenter.common.registration")}
                  className={classes.tab}
                  {...a11yProps(1)}
                  disableRipple={true}
                />
                <Tab
                  icon={<RightArrowIcon />}
                  label={t("getter_fe.helpCenter.common.postRepostReply")}
                  className={classes.tab}
                  {...a11yProps(2)}
                  disableRipple={true}
                />
                <Tab
                  icon={<RightArrowIcon />}
                  label={t("getter_fe.helpCenter.common.share")}
                  className={classes.tab}
                  {...a11yProps(3)}
                  disableRipple={true}
                />
                <div>
                  <div className={classes.subTitleGap} />
                  <div className={classes.subTitle}>
                    {t("getter_fe.helpCenter.common.ruleAndPolicy")}
                  </div>
                </div>
                <Tab
                  icon={<RightArrowIcon />}
                  label={t("getter_fe.helpCenter.common.privacyPolicy")}
                  className={classes.tab}
                  {...a11yProps(5)}
                  disableRipple={true}
                />
                <Tab
                  icon={<RightArrowIcon />}
                  label={t("getter_fe.helpCenter.common.termsOfUse")}
                  className={classes.tab}
                  {...a11yProps(6)}
                  disableRipple={true}
                />
              </Tabs>
            </div>
            <TabPanel value={tabNumber} index={1} className={classes.tabPanel}>
              <HelpCenterContent
                title={t("getter_fe.helpCenter.common.registration")}
                content={HELPCENTER_CONTENT.registration}
              />
            </TabPanel>
            <TabPanel value={tabNumber} index={2} className={classes.tabPanel}>
              <HelpCenterContent
                title={t("getter_fe.helpCenter.common.postRepostReply")}
                content={HELPCENTER_CONTENT.postRepostReply}
              />
            </TabPanel>
            <TabPanel value={tabNumber} index={3} className={classes.tabPanel}>
              <HelpCenterContent
                title={t("getter_fe.helpCenter.common.share")}
                content={HELPCENTER_CONTENT.share}
              />
            </TabPanel>
            <TabPanel value={tabNumber} index={5} className={classes.tabPanel}>
              <TextFileReader file={privacyMdPath} />
            </TabPanel>
            <TabPanel value={tabNumber} index={6} className={classes.tabPanel}>
              <TextFileReader file={termsMdPath} />
            </TabPanel>
          </div>
        )}
      </div>
    </div>
  );
};
