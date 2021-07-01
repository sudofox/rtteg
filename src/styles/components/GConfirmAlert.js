import React from "react";
import {makeStyles} from "@material-ui/core";
import ReactDOM from "react-dom";
import PopupDialog from "../../app/components/PopupDialog";
import {ThemeProvider} from "@material-ui/core";
import getTheme from "../themes";
import {GTwemoji} from "src/styles/components/GTwemoji";

const useStyles = makeStyles((theme) => ({
  confirmAlertRoot: {
    "& .popup-content": {
      backgroundColor: "rgba(27,27,27,.9)",
      // width: "394px !important",
      minWidth: "394px",
      borderRadius: "10px !important",
      [theme.breakpoints.only("xs")]: {
        width: "300px !important",
        minWidth: "300px",
        height: "auto",
        margin: "auto !important",
        overflow: "hidden",
        border: "none !important",
      },
      "& .header": {
        borderBottom: "none",
        "& .cancel": {
          top: "10px",
          left: "10px",
        },
      },
      "& .content": {
        [theme.breakpoints.up("sm")]: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: (props) => {
            return props.confirmType !== "LOGIN" && 394;
          },
        },
        padding: "6px 59px 42px !important",

        [theme.breakpoints.only("xs")]: {
          padding: "0px 10px 0px !important",
        },
      },
    },
    "& .popup-overlay": {
      zIndex: "2000 !important",
    },
    "& h3": {
      color: theme.palette.text.primary,
      display: "block",
      textAlign: "center",
      fontSize: "22px",
      lineHeight: "26px",
      fontWeight: 800,
      textOverflow: "ellipsis",
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      [theme.breakpoints.only("xs")]: {
        fontSize: "17px",
        padding: "0px 24px",
      },
    },
    "& p": {
      color: theme.palette.text.secondary,
      display: "block",
      textAlign: "center",
      fontSize: "18px",
      lineHeight: "26px",
      fontWeight: 400,
      padding: "8px 0 50px",
      [theme.breakpoints.only("xs")]: {
        width: "100%",
        fontSize: "15px",
        lineHeight: "20px",
        padding: "12px 24px 24px 24px",
      },
    },
    "& .btns-row": {
      display: "flex",
      justifyContent: "center",
      "& button": {
        margin: "0 12.5px",
        borderRadius: "100px",
        backgroundColor: theme.palette.background.button.grey.default,
        border: "none",
        fontWeight: 700,
        fontSize: "16px",
        height: "36px",
        minWidth: "100px",
        width: "130px",
        cursor: "pointer",
        outline: "none",
        transition: "background 0.3s",
        "&:hover": {
          background: theme.palette.background.button.grey.hover,
        },
        "&.danger": {
          color: theme.palette.background.default,
          borderColor: theme.palette.error.main,
          background: theme.palette.error.main,
          "&:hover": {
            background: theme.palette.buttonDanger.light,
          },
        },
        "&.confirm": {
          color: theme.palette.background.default,
          borderColor: "#CDD5DC",
          backgroundColor: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
            [theme.breakpoints.up("sm")]: {
              borderColor: theme.palette.primary.dark,
            },
          },
          [theme.breakpoints.down("xs")]: {
            color: theme.palette.primary.main,
          },
        },
        [theme.breakpoints.only("xs")]: {
          height: "50px",
          margin: 0,
          borderRadius: 0,
          width: "100%",
          background: "none !important",
          borderTop: "0.5px solid #CDD5DC",
          "&.danger": {
            fontWeight: 400,
            color: "#DD1818",
            borderColor: "#CDD5DC !important",
            background: "none !important",
            borderLeft: "0.5px solid #CDD5DC",
            "&:hover": {
              background: "none",
            },
          },
          "&.confirm": {
            borderLeft: "0.5px solid #CDD5DC",
          },
        },
      },
    },
    "& .btns-col": {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      [theme.breakpoints.only("xs")]: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        padding: (props) => (props.confirmType === "LOGIN" ? "5px 10px" : 0),
      },
      "& .div": {
        marginBottom: "17px",
      },
      "& button": {
        margin: "0 12.5px",
        borderRadius: "100px",
        backgroundColor: "#ECEEF0",
        border: "none",
        fontWeight: 800,
        fontSize: "16px",
        height: "36px",
        minWidth: "100px",
        width: "130px",
        cursor: "pointer",
        outline: "none",
        "&:hover": {
          color: theme.palette.primary.dark,
          border: `1px solid ${theme.palette.primary.dark} !important`,
        },
        "&.primary": {
          color: "white",
          width: "min(488px, 60vw)",
          height: "48px",
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.main,
          [theme.breakpoints.only("xs")]: {
            width: "100%",
            height: "40px",
            margin: 0,
          },
          "&:hover": {
            borderColor: theme.palette.primary.dark,
            background: theme.palette.primary.dark,
          },
        },
        "&.secondary": {
          color: theme.palette.primary.main,
          width: "min(488px, 60vw)",
          height: "48px",
          border: `1px solid ${theme.palette.primary.main}`,
          backgroundColor: "white",
          [theme.breakpoints.only("xs")]: {
            width: "100%",
            height: "40px",
            margin: 0,
          },
          "&:hover": {
            color: theme.palette.primary.dark,
            border: `1px solid ${theme.palette.primary.dark}`,
          },
        },
      },
    },
  },
}));

const GConfirmAlertCustomUI = ({children}) => {
  const classes = useStyles();
  return <div className={classes.confirmAlertRoot}>{children}</div>;
};

export const GConfirmAlert = ({
  title,
  uppercase,
  text,
  text1,
  close = {
    text: "",
    callback: () => {},
    type: "default", // default / danger / confirm
  },
  confirm = {
    text: "",
    callback: () => {},
    type: "danger",
  },
  primary = {
    text: "",
    callback: () => {},
    type: "primary",
  },
  secondary = {
    text: "",
    callback: () => {},
    type: "secondary",
  },
  showCloseIcon = false,
}) => {
  const dom = document.createElement("DIV");
  const _text = text?.message || text;
  // provider needed when rendering outside app
  // when dark theme is available this will need to change
  ReactDOM.render(
    <ThemeProvider theme={getTheme("light")}>
      <GConfirmAlertCustomUI>
        <PopupDialog
          nested={true}
          open={true}
          hasOK={true}
          hasCancel={true}
          needDoNothing={true}
          parentComp={this}
          trigger={<div />}
          showCloseIcon={showCloseIcon}
        >
          {title && (
            <h3 style={{textTransform: uppercase ? "uppercase" : ""}}>
              <GTwemoji text={title} />
            </h3>
          )}
          {_text && !text1 && <p>{_text}</p>}
          {text1 && (
            <p>
              {_text}
              <br />
              {text1}
            </p>
          )}
          <div className="btns-row">
            {close.text !== "" && (
              <button
                className={close.type}
                onClick={() => {
                  if (close.callback) {
                    close.callback(() => document.body.removeChild(dom));
                  } else {
                    document.body.removeChild(dom);
                  }
                }}
              >
                {close.text}
              </button>
            )}
            {confirm.text !== "" && (
              <button
                className={confirm.type}
                onClick={() => {
                  if (confirm.callback) {
                    confirm.callback(() => document.body.removeChild(dom));
                  } else {
                    document.body.removeChild(dom);
                  }
                }}
              >
                {confirm.text}
              </button>
            )}
          </div>
          <div className="btns-col">
            {primary.text !== "" && (
              <div style={{marginBottom: "17px"}}>
                <button
                  className={primary.type}
                  onClick={() => {
                    if (primary.callback) {
                      primary.callback(() => document.body.removeChild(dom));
                    } else {
                      document.body.removeChild(dom);
                    }
                  }}
                >
                  {primary.text}
                </button>
              </div>
            )}
            {secondary.text !== "" && (
              <div>
                <button
                  className={secondary.type}
                  onClick={() => {
                    if (secondary.callback) {
                      secondary.callback(() => document.body.removeChild(dom));
                    } else {
                      document.body.removeChild(dom);
                    }
                  }}
                >
                  {secondary.text}
                </button>
              </div>
            )}
          </div>
        </PopupDialog>
      </GConfirmAlertCustomUI>
    </ThemeProvider>,
    document.body.appendChild(dom),
  );
};
