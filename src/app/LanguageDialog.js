import React, {useRef} from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import {GButton} from "../styles/components/GButton";
import {GTypography} from "../styles/components/GTypography";
import clsx from "clsx";
import {t} from "../i18n/utils";
import {ReactComponent as IconCancel} from "src/assets/icons/basic/close.svg";
import DialogTitle from "@material-ui/core/DialogTitle";
import {ReactComponent as CheckMarkIcon} from "../assets/icons/checkMark.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    languageDialogContainer: {
      "& .MuiDialog-paperWidthSm": {
        maxWidth: 310,
        margin: 0, // for mobile
        borderRadius: 10,
      },
    },
    languageDialogHeader: {
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
      padding: "26px 38px 16px",
      position: "relative",
    },
    languageDialog: {
      padding: "20px 25px",
      width: 310,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignContent: "space-between",
    },
    languageTitle: {
      fontSize: "18px",
      lineHeight: "21px",
    },
    closeButton: {
      position: "absolute",
      right: 34,
      top: "calc(50% + 5px)",
      transform: "translate(0, -50%)",
      cursor: "pointer",
      width: 26,
      height: 26,
      background: theme.palette.grey.A300,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&:hover": {
        background:
          "linear-gradient(0deg, rgba(95, 95, 95, 0.7), rgba(95, 95, 95, 0.7))",
      },
      "& > svg": {
        stroke: "#FFF",
      },
    },
    buttonWrapper: {
      marginBottom: theme.spacing(1),
      flexBasis: "50%",
    },
    langButton: {
      "&.isActive": {
        color: theme.palette.primary.main,
      },
      "& > .MuiButton-label": {
        fontSize: "14px",
        lineHeight: "133%",
      },
    },
    checkMark: {
      marginLeft: theme.spacing(1),

      "&  path": {
        stroke: "#016EDC",
      },
    },
  }),
);

export function LanguageDialog({
  isOpen,
  handleClose,
  allLangs,
  currentLangCode,
  selectLangCode,
}) {
  const classes = useStyles();
  const selectEl = useRef(null);

  return (
    <div ref={selectEl}>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        scroll="body"
        className={classes.languageDialogContainer}
        container={() => (selectEl ? selectEl.current : null)}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle className={classes.languageDialogHeader}>
          <GTypography isBold className={classes.languageTitle}>
            {t("getter_fe.menu.common.languages")}
          </GTypography>
          <span className={classes.closeButton} onClick={handleClose}>
            <IconCancel />
          </span>
        </DialogTitle>

        <div className={classes.languageDialog}>
          {allLangs &&
            allLangs.map((lang, idx) => {
              const isActive = currentLangCode === lang.code;
              return (
                <div className={classes.buttonWrapper} key={idx}>
                  <GButton
                    fullWidth={false}
                    variant="text"
                    color="default"
                    className={clsx(classes.langButton, isActive && "isActive")}
                    onClick={() => selectLangCode(lang.code)}
                  >
                    {lang.nativeName}
                    {isActive && (
                      <CheckMarkIcon className={classes.checkMark} />
                    )}
                  </GButton>
                </div>
              );
            })}
        </div>
      </Dialog>
    </div>
  );
}
