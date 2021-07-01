import React, {useState, useLayoutEffect} from "react";
import {makeStyles, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

import AppConsts from "src/app/AppConsts";
import {cacheI18nT} from "src/i18n/utils";
import {ReactComponent as RightArrowIcon} from "src/assets/icons/basic/forward_arrow.svg";

const selectTabByUrlQuery = (tab) => {
  switch (tab) {
    case AppConsts.URL_HELPCENTER_REGISTRATION:
      return 0;
    case AppConsts.URL_HELPCENTER_POST_REPOST_REPLY:
      return 1;
    case AppConsts.URL_HELPCENTER_SHARE:
      return 2;
    default:
      return -1;
  }
};

const contentType = (tab) => {
  if (tab === "post-repost-reply") {
    return "postRepostReply";
  }
  return tab;
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    padding: 0,
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    height: "100%",
  },
  title: {
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
  tabTitle: {
    height: 58,
    paddingLeft: theme.spacing(4),
    fontWeight: 800,
    fontSize: 20,
    lineHeight: "22px",
    color: theme.palette.text.primary,
    textTransform: "capitalize",
    borderBottom: `1px solid ${theme.palette.grey.A200}`,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      // tablet or mobile
      paddingLeft: theme.spacing(2.5),
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
    [theme.breakpoints.only("xs")]: {
      fontWeight: "bold",
    },
  },
  link: {
    paddingLeft: theme.spacing(2),
    display: "block",
    textTransform: "capitalize",
    height: 51,
    lineHeight: "51px",
    borderBottom: `1px solid ${theme.palette.grey.A200}`,
    color: theme.palette.text.main,
    fontSize: 17,
    fontWeight: "500",
    cursor: "pointer",
    overflow: "hidden",
    "&.no-border": {
      borderBottom: "none",
    },
    "&:hover": {
      color: theme.palette.text.main,
    },
    "& > svg.menu-icon": {
      float: "left",
      marginTop: 16,
      marginRight: 15,
      marginLeft: 5,
      verticalAlign: "top",
    },
    "& > svg.right-arrow": {
      float: "right",
      marginTop: 15,
      marginRight: 15,
      verticalAlign: "top",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
      marginLeft: 20,
      marginRight: 20,
      "& > svg.right-arrow": {
        marginRight: 0,
      },
    },
  },
  itemContainer: {
    padding: "0 20px",
  },
  question: {
    padding: "15px 0",
    fontWeight: 500,
    fontSize: 17,
    lineHeight: "22px",
    borderBottom: `1px solid ${theme.palette.grey.A200}`,
  },
  answers: {
    padding: "20px 0",
    fontWeight: "normal",
    fontSize: 17,
  },
  answer: {
    minHeight: 12,
  },
  noteMark: {
    fontWeight: 500,
  },
  notes: {
    fontWeight: "normal",
    fontSize: 17,
    marginTop: 12,
  },
  note: {
    paddingLeft: 20,
  },
}));

export const MobileAppHelpCenterIndex = ({tab}) => {
  const classes = useStyles();
  const tabNumber = selectTabByUrlQuery(tab);
  const type = contentType(tab);
  const [selectedIndex, setSeletedIndex] = useState(0);
  const {t} = useTranslation();

  useLayoutEffect(() => {
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
        notes: [t("getter_fe.helpCenter.common.registrationContent.note31")],
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

  return (
    <div className={classes.container}>
      <div className={classes.root}>
        {tabNumber === -1 ? (
          <>
            <div className={classes.title}>
              {t("getter_fe.menu.common.helpCenter")}
            </div>
            <Link
              to={`${AppConsts.URL_HELP_CENTER_MOBILE_APP}/${AppConsts.URL_HELPCENTER_REGISTRATION}`}
              className={classes.link}
            >
              {t("getter_fe.helpCenter.common.registration")}
              <RightArrowIcon className="right-arrow" />
            </Link>
            <Link
              to={`${AppConsts.URL_HELP_CENTER_MOBILE_APP}/${AppConsts.URL_HELPCENTER_POST_REPOST_REPLY}`}
              className={classes.link}
            >
              {t("getter_fe.helpCenter.common.postRepostReply")}
              <RightArrowIcon className="right-arrow" />
            </Link>
            <Link
              to={`${AppConsts.URL_HELP_CENTER_MOBILE_APP}/${AppConsts.URL_HELPCENTER_SHARE}`}
              className={`${classes.link} no-border`}
            >
              {t("getter_fe.helpCenter.common.share")}
              <RightArrowIcon className="right-arrow" />
            </Link>
          </>
        ) : (
          <>
            <Typography variant="h1" className={classes.tabTitle}>
              {t(`getter_fe.helpCenter.common.${type}`)}
            </Typography>
            {selectedIndex ? (
              <div className={classes.itemContainer}>
                <Typography className={classes.question}>
                  {HELPCENTER_CONTENT[type][selectedIndex - 1].question}
                </Typography>
                <div className={classes.answers}>
                  {HELPCENTER_CONTENT[type][selectedIndex - 1].answers.map(
                    (answer, index) => (
                      <Typography key={index} className={classes.answer}>
                        {answer}
                      </Typography>
                    ),
                  )}
                  {HELPCENTER_CONTENT[type][selectedIndex - 1].notes && (
                    <Typography className={classes.notes}>
                      <span className={classes.noteMark}>Note: </span>
                      {HELPCENTER_CONTENT[type][selectedIndex - 1].notes
                        .length === 1
                        ? HELPCENTER_CONTENT[type][selectedIndex - 1].notes[0]
                        : HELPCENTER_CONTENT[type][selectedIndex - 1].notes.map(
                            (note, index) => (
                              <div key={index} className={classes.note}>
                                {note}
                              </div>
                            ),
                          )}
                    </Typography>
                  )}
                </div>
              </div>
            ) : (
              <>
                {HELPCENTER_CONTENT[type].map((item, index) => (
                  <div
                    key={index}
                    className={classes.link}
                    onClick={() => setSeletedIndex(index + 1)}
                  >
                    {item.question}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
