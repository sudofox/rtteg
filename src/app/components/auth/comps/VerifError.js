import React from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {GButton} from "../../../../styles/components/GButton";
import {useTranslation} from "react-i18next";
import {changeSignupStep} from "src/app/components/auth/store";
import {userConstants} from "src/app/components/auth/_constants";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    conditionsWrapper: {
      marginTop: theme.spacing(8.125),
      marginBottom: theme.spacing(1.5),
      textAlign: "center",
      padding: theme.spacing(0, 2),
    },
    conditions: {
      fontSize: 16,
      lineHeight: "22.4px",
      fontWeight: 400,
      color: theme.palette.grey.A1,
      "& a": {
        fontWeight: "normal",
      },
    },
    btn: {
      height: theme.spacing(6),
      margin: theme.spacing(0, 0, 5, 0),
      borderRadius: 100,
      "& .MuiButton-label": {
        marginTop: 0,
      },
    },
  }),
);

const connector = connect(
  (state) => {
    return {};
  },
  {changeSignupStep},
);

export const VerifError = connector(_VerifError);

function _VerifError({changeSignupStep}) {
  const classes = useStyles();
  const history = useHistory();
  const {t} = useTranslation();

  const handleBackToHome = () => {
    changeSignupStep(userConstants.STEP_SIGNUP);
    history.push("/");
  };

  return (
    <div>
      <div className={classes.conditionsWrapper}>
        <div className={classes.conditions}>
          {t("getter_fe.auth.errors.verifyError")}
        </div>
      </div>

      <GButton
        variant="contained"
        className={classes.btn}
        onClick={handleBackToHome}
      >
        {t("getter_fe.auth.common.backToHome")}
      </GButton>
    </div>
  );
}
