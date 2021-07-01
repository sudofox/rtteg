import React, {useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";

import AppConsts from "src/app/AppConsts";
import {ReactComponent as BackArrowIcon} from "src/assets/icons/basic/back_arrow.svg";
import {ReactComponent as RightArrowIcon} from "src/assets/icons/basic/forward_arrow.svg";
import {ReactComponent as DownArrowIcon} from "src/assets/icons/basic/down_arrow.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      margin: 0,
      "& .MuiAccordion-rounded:first-child": {
        borderRadius: 0,
      },
      "& .MuiAccordion-rounded:last-child": {
        borderRadius: 0,
      },
      "& .MuiPaper-elevation1": {
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.grey.A800}`,
        margin: 0,
      },
      "& .MuiAccordionSummary-root": {
        padding: "0 8px 0 18px",
        "&.Mui-expanded": {
          height: 48,
          minHeight: 48,
        },
        "& .MuiTypography-body1": {
          fontSize: 15,
          fontWeight: 500,
          textTransform: "capitalize",
        },
        "& .MuiSvgIcon-root": {
          fill: theme.palette.background.black,
        },
        "& .MuiIconButton-edgeEnd": {
          marginRight: 0,
        },
      },
      "& .MuiAccordionDetails-root": {
        padding: "0 18px 16px",
        "& .MuiTypography-body1": {
          fontSize: 15,
          fontWeight: 300,
          minHeight: 12,
        },
      },
    },
    tabTitle: {
      height: 58,
      paddingLeft: theme.spacing(2),
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
    accordionDetail: {
      color: "#505050", // @TODO if this color is to be all gray text we need to change the theme. Needs to be confirmed.
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
    accordionSummary: {
      "&:hover": {
        backgroundColor: "#f5f9ff",
      },
    },
  }),
);

export const HelpCenterContent = ({title, content}) => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const [selectedIndex, setSeletedIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(-1);

  return (
    <>
      <Typography variant="h1" className={classes.tabTitle}>
        {isTabletOrMobile && (
          <BackArrowIcon
            onClick={() => {
              if (selectedIndex > 0) {
                setSeletedIndex(0);
              } else {
                history.push(
                  `${AppConsts.URL_HELP_CENTER}/${AppConsts.URL_HELPCENTER_MOBILE_INDEX}`,
                );
              }
            }}
          />
        )}
        {title}
      </Typography>
      <div className={classes.wrapper}>
        {isMobile ? (
          selectedIndex ? (
            <div className={classes.itemContainer}>
              <Typography className={classes.question}>
                {content[selectedIndex - 1].question}
              </Typography>
              <div className={classes.answers}>
                {content[selectedIndex - 1].answers.map((answer, index) => (
                  <Typography key={index} className={classes.answer}>
                    {answer}
                  </Typography>
                ))}
                {content[selectedIndex - 1].notes && (
                  <Typography className={classes.notes}>
                    <span className={classes.noteMark}>Note: </span>
                    {content[selectedIndex - 1].notes.length === 1
                      ? content[selectedIndex - 1].notes[0]
                      : content[selectedIndex - 1].notes.map((note, index) => (
                          <div key={index} className={classes.note}>
                            {note}
                          </div>
                        ))}
                  </Typography>
                )}
              </div>
            </div>
          ) : (
            <>
              {content.map((item, index) => (
                <div
                  key={index}
                  className={classes.link}
                  onClick={() => setSeletedIndex(index + 1)}
                >
                  {item.question}
                  <RightArrowIcon className="right-arrow" />
                </div>
              ))}
            </>
          )
        ) : (
          <>
            {content.map((item, index) => (
              <Accordion
                expanded={index === activeAccordion}
                key={index}
                onChange={() => setActiveAccordion(index)}
              >
                <AccordionSummary
                  expandIcon={<DownArrowIcon />}
                  aria-controls="help-center-content"
                  id="panel1a-header"
                  className={classes.accordionSummary}
                >
                  <Typography style={{fontWeight: 600}}>
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={classes.accordionDetail}>
                    {item.answers.map((answer, index) => (
                      <Typography key={index}>{answer}</Typography>
                    ))}
                    {item.notes && (
                      <Typography className={classes.notes}>
                        <span className={classes.noteMark}>Note: </span>
                        {item.notes.length === 1
                          ? item.notes[0]
                          : item.notes.map((note, index) => (
                              <div key={index} className={classes.note}>
                                {note}
                              </div>
                            ))}
                      </Typography>
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </div>
    </>
  );
};
