import React, {useState} from "react";
import {makeStyles, createStyles, useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Dialog from "@material-ui/core/Dialog";
import {GButton} from "../../styles/components/GButton";
import {GTypography} from "../../styles/components/GTypography";
import {t} from "../../i18n/utils";
import DialogTitle from "@material-ui/core/DialogTitle";
import {ReactComponent as IconCancel} from "src/assets/icons/basic/close.svg";
import {ReactComponent as SuccessFilledIcon} from "src/assets/icons/ico-success-filled.svg";

const TOTAL_ANSWERS_CNT = 5;

const useStyles = makeStyles((theme) =>
  createStyles({
    dialogContainer: {
      "& .MuiPaper-rounded": {
        borderRadius: theme.spacing(1.5),
      },
      [theme.breakpoints.up("md")]: {
        "& .MuiDialog-paperWidthSm": {
          maxWidth: 658,
        },
      },
    },
    header: {
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
      padding: "23px 0 18px 38px",
      "& .MuiTypography-h6": {
        display: "flex",
        justifyContent: "space-between",
      },
    },
    closeButton: {
      // position: "absolute",
      // right: 38,
      // top: 20,
      cursor: "pointer",
      width: 26,
      height: 26,
      background:
        "linear-gradient(0deg, rgba(95, 95, 95, 0.5), rgba(95, 95, 95, 0.5))",
      opacity: 0.7,
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "all 0.3s ease-in-out",
      marginRight: 20,
      marginTop: 5,
      "&:hover": {
        background:
          "linear-gradient(0deg, rgba(95, 95, 95, 0.7), rgba(95, 95, 95, 0.7))",
      },
      "& > svg": {
        stroke: "#FFF",
      },
    },
    title: {
      fontSize: "18px",
      lineHeight: "36px",
    },
    description: {
      fontWeight: 500,
      fontSize: "20px",
      color: theme.palette.text.secondary,
      padding: "24px 38px",
      lineHeight: "130%",
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
    },
    dialogContent: {
      [theme.breakpoints.up("md")]: {
        width: 658,
        // height: 472,
      },
    },
    answer: {
      fontSize: "16px",
      padding: "15px 37px",
      display: "flex",
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      "&:hover": {
        backgroundColor: theme.palette.grey.A300,
      },
      "& .MuiTypography-root": {
        lineHeight: "24px",
      },
    },
    reportButton: {
      textTransform: "capitalize",
      height: 36,
      width: 100,
      // marginTop: 30,
      marginRight: 20,
      borderRadius: "100px",
      "& > .MuiButton-label": {
        fontSize: "16px",
      },
    },
    dialogTitleLeft: {
      display: "flex",
    },
  }),
);

export function ReportUserDialog({
  username,
  isOpen,
  handleClose,
  handleSubmit,
}) {
  const classes = useStyles();
  const [selectedAnswerKey, setSelectedAnswerKey] = useState(null);
  const answerKeys = [...Array(TOTAL_ANSWERS_CNT + 1).keys()].slice(1); // [1,2,3,...]

  const onSubmit = () => {
    handleSubmit(selectedAnswerKey); // API call
    handleClose();
    setSelectedAnswerKey(null); // reset
  };

  const toggleAnswer = (key) => {
    if (selectedAnswerKey === key) {
      setSelectedAnswerKey(null);
    } else {
      setSelectedAnswerKey(key);
    }
  };

  return (
    <Dialog
      fullScreen={useMediaQuery(useTheme().breakpoints.down("sm"))}
      open={isOpen}
      onClose={handleClose}
      className={classes.dialogContainer}
    >
      <DialogTitle className={classes.header}>
        <div className={classes.dialogTitleLeft}>
          <span className={classes.closeButton} onClick={handleClose}>
            <IconCancel />
          </span>
          <GTypography isBold className={classes.title}>
            {t("getter_fe.common.reportUser.title", {username})}
          </GTypography>
        </div>
        <GButton
          fullWidth={false}
          isBold
          color="primary"
          variant="contained"
          disabled={!selectedAnswerKey}
          className={classes.reportButton}
          onClick={onSubmit}
        >
          {t("getter_fe.common.reportUser.report")}
        </GButton>
      </DialogTitle>

      <div className={classes.dialogContent}>
        <GTypography className={classes.description}>
          {t("getter_fe.common.reportUser.description")}
        </GTypography>

        {answerKeys.map((key) => {
          return (
            <div
              key={key}
              className={classes.answer}
              onClick={() => toggleAnswer(key)}
            >
              <GTypography>
                {t(`getter_fe.common.reportUser.answer${key}`)}
              </GTypography>
              {selectedAnswerKey === key && <SuccessFilledIcon />}
            </div>
          );
        })}
      </div>
    </Dialog>
  );
}
