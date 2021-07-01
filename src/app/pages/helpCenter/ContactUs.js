import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import {GButton} from "../../../styles/components/GButton";
import {t} from "../../../i18n/utils";
import AppConsts from "../../AppConsts";
import {ReactComponent as Envelope} from "../../../assets/icons/envelope.svg";
import {GBackTitle} from "../../../styles/components/GBackTitle";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(2.5),
      marginRight: theme.spacing(2.5),
    },
  },
  GBtitle: {
    "& h1": {
      [theme.breakpoints.down("xs")]: {
        fontSize: 18,
        lineHeight: "29px",
        fontWeight: 700,
      },
    },
  },
  title: {
    fontSize: 21,
    lineHeight: "25px",
    fontWeight: 600,
    color: theme.palette.text.main,
  },
  description: {
    marginTop: theme.spacing(1.25),
    marginBottom: theme.spacing(2.5),
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 400,
    color: theme.palette.text.main,
  },
  btn: {
    width: "auto",
    minHeight: theme.spacing(4.5),
    padding: theme.spacing(1.125, 2.5),
    borderRadius: 5,
    "& .MuiButton-label": {
      fontWeight: 700,
      fontSize: 14,
      lineHeight: "16.8px",
      textTransform: "lowercase !important",
    },
    "&.MuiButton-containedPrimary:not(:disabled):hover": {
      color: theme.palette.text.disabled,
    },
    "& .MuiButton-label svg": {
      stroke: theme.palette.primary.main,
    },
    "& .MuiButton-startIcon": {
      marginLeft: 0,
    },
    "&:hover .MuiButton-label svg": {
      stroke: theme.palette.primary.main,
    },
  },
}));

export const ContactUs = () => {
  const classes = useStyles();

  return (
    <>
      <GBackTitle
        title={t("getter_fe.helpCenter.common.contactUs")}
        className={classes.GBtitle}
      />
      <div className={classes.wrapper}>
        <Typography className={classes.description} variant="body1">
          {t("getter_fe.helpCenter.common.contactUsDescription")}
        </Typography>
        <GButton
          variant="outlined"
          className={classes.btn}
          href={`mailto:${AppConsts.CONTACTUS_EMAIL}`}
          target="_blank"
          startIcon={<Envelope />}
        >
          {AppConsts.CONTACTUS_EMAIL}
        </GButton>
      </div>
    </>
  );
};

export default ContactUs;
