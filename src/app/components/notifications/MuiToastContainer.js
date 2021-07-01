import React from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {ToastContainer, Slide, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "auto",
      minWidth: theme.spacing(33.25),
      padding: 0,
      marginBottom: 0,
      [theme.breakpoints.down("xs")]: {
        width: `calc(100% - 40px)`,
        maxWidth: theme.spacing(45),
      },

      "&.Toastify__toast-container--top-right": {
        top: theme.spacing(5),
      },
      "&.Toastify__toast-container--top-center": {
        top: theme.spacing(5),
        [theme.breakpoints.down("xs")]: {
          left: "50%",
          transform: "translateX(-50%)",
        },
      },
      "&.Toastify__toast-container--top-left": {
        top: theme.spacing(5),
      },
      "& .Toastify__toast": {
        padding: 0,
        marginBottom: theme.spacing(3),
        minHeight: theme.spacing(6.75),
        backgroundColor: theme.palette.background.default,
        boxShadow: "0px 0px 11px 3px rgba(0, 0, 0, 0.04)",
        borderRadius: 10,
      },

      "& > .Toastify__toast--error": {},
      "& > .Toastify__toast--warning": {},
      "& > .Toastify__toast--success": {},
      "& .Toastify__toast-container": {},
      "& .Toastify__toast-body": {
        margin: 0,
      },
    },
  }),
);

export function MuiToastContainer() {
  const classes = useStyles();
  return (
    <ToastContainer
      position={toast.POSITION.TOP_CENTER}
      transition={Slide}
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      closeButton={false}
      limit={1}
      className={classes.root}
    />
  );
}
