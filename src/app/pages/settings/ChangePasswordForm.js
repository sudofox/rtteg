import React, {useState} from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Formik} from "formik";
import {object, ref, string} from "yup";
import {FormControl, FormHelperText, Typography} from "@material-ui/core";
import {GTextField} from "../../../styles/components/GTextField";
import {GButton} from "../../../styles/components/GButton";
import clsx from "clsx";
import {ReactComponent as BackArrowIcon} from "src/assets/icons/basic/back_arrow.svg";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import AppConsts from "../../AppConsts";
import {toast} from "react-toastify";
import {NotifMessage} from "src/app/components/notifications/NotifMessage";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {ReactComponent as WarningIcon} from "../../../assets/icons/feature/warning.svg";
import Global from "src/system/Global";
import theme from "../../../styles/themes/_lightMuiTheme";

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(4),
      maxWidth: 488,
    },
    tabTitle: {
      margin: theme.spacing(0, 4),
      paddingTop: theme.spacing(3.75),
      paddingBottom: theme.spacing(3.75),
      fontSize: 28,
      fontWeight: 600,
      lineHeight: "33px",
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
    },
    formControl: {
      marginTop: 0,
      marginBottom: theme.spacing(2.5),
    },
    inputField: {
      "& > .MuiInputBase-root": {
        "& > input": {
          fontSize: 15,
        },
      },
      "& .MuiInputLabel-outlined": {
        transform: "translate(0, 15px) scale(1)",
        color: theme.palette.text.lightGray,
        letterSpacing: "0.01em",
      },
    },
    error: {
      color: "red",
    },
    btn: {
      height: 48,
      width: 200,
      margin: theme.spacing(6, 0, 5, 0),
      borderRadius: 24,
      boxSizing: "border-box",
      "&:disabled": {
        background: "transparent",
        border: `1px solid ${theme.palette.primary.light}`,
        color: theme.palette.primary.light,
      },
      // boxShadow: "none",
      // "&:hover": {
      //   boxShadow: "none",
      // },
      // "& .MuiButton-label": {
      //   marginTop: 0,
      // },
    },
    mobileBtn: {
      width: "auto",
      height: theme.spacing(3.5),
      borderRadius: 24,
      fontWeight: 700,
      position: "absolute",
      right: theme.spacing(1.5),
      top: 15,
      "&:disabled": {
        background: "transparent",
        border: `1px solid ${theme.palette.primary.light}`,
        color: theme.palette.primary.light,
      },
      "& span": {
        fontSize: "13px !important",
      },
    },
    passwordTextHelperContainer: {
      display: "flex",
      alignItems: "center",
    },
    textHelper: {
      maxWidth: 340,
      fontSize: 12,
      lineHeight: "16px",
    },
    warningIcon: {
      "& path": {
        fill: theme.palette.error.main,
      },
      marginRight: 3,
      minWidth: 16,
      marginTop: 4,
    },
    linkHelperWrapper: {
      textAlign: "center",
    },
    linkHelper: {
      marginTop: theme.spacing(0.625),
      fontSize: "14",
      color: theme.palette.primary.main,
      fontWeight: 500,
      cursor: "pointer",
      textDecoration: "none",
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
    alertWrapper: {
      textAlign: "center",
    },
    alert: {
      display: "inline-flex",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: theme.spacing(6.625),
      "& .MuiAlert-message": {
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
  }),
);

export const ChangePasswordForm = ({setPageSeo}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const history = useHistory();
  const {t, i18n} = useTranslation();
  const [showPwd, setShowPwd] = useState(false);

  const api = Global.GetPortal().getAppService();

  const _handleSubmit = (data) => {
    try {
      api.submitPasswordChange(
        data.currentPass,
        data.newPass,
        (error, result) => {
          data.setSubmitting(false);
          if (result) {
            toast(
              <NotifMessage
                message={t("getter_fe.settings.successes.changedPassword")}
              />,
              {
                position: toast.POSITION.TOP_CENTER,
                type: toast.TYPE.SUCCESS,
              },
            );
            data.resetForm();
          } else if (error || !result) {
            toast(
              <NotifMessage
                message={t("getter_fe.settings.errors.changePasswordFailure")}
              />,
              {
                position: toast.POSITION.TOP_CENTER,
                type: toast.TYPE.WARNING,
              },
            );
          }
        },
      );
    } catch (error) {}
  };

  useEffect(() => {
    setPageSeo(t("getter_fe.settings.common.changePassword"));
  }, []);

  return (
    <>
      <Typography variant="h1" className={classes.tabTitle}>
        {isTabletOrMobile && (
          <BackArrowIcon
            onClick={() =>
              history.push(`/settings/${AppConsts.URL_SETTINGS_MOBILE_INDEX}`)
            }
          />
        )}
        {t("getter_fe.settings.common.changePassword")}
      </Typography>
      <div className={classes.wrapper}>
        <Formik
          initialValues={{
            currentPass: "",
            newPass: "",
            confirmPass: "",
          }}
          validationSchema={object().shape({
            currentPass: string().required(
              t("getter_fe.settings.errors.oldPasswordRequired"),
            ),
            newPass: string()
              .required(t("getter_fe.auth.common.newPwdRequired"))
              .min(6, t("getter_fe.auth.common.minCharact"))
              .matches(
                /^(?=.*[a-zA-Z\d].*)[a-zA-Z\d!#$&()*+,\-.:;<=>?@[\]^_{|}~]{6,128}$/,
                t("getter_fe.settings.errors.passwordValidation"),
              )
              .matches(
                /^(?!\d+$)(?=.*[a-zA-Z\d].*)[a-zA-Z\d!#$&()*+,\-.:;<=>?@[\]^_{|}~]{6,128}$/,
                t("getter_fe.settings.errors.onlyNumbers"),
              ),
            confirmPass: string()
              .oneOf(
                [ref("newPass")],
                t("getter_fe.settings.errors.passwordsNotMatch"),
              )
              .required(t("getter_fe.settings.errors.confirmPasswordRequired")),
          })}
          onSubmit={(
            {currentPass, newPass, confirmPass},
            {setSubmitting, resetForm},
          ) =>
            _handleSubmit({
              currentPass,
              newPass,
              confirmPass,
              setSubmitting,
              resetForm,
            })
          }
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              isValid,
              isSubmitting,
              dirty,
              setFieldTouched,
            } = props;

            i18n.on("languageChanged", (lng) => {
              setTimeout(() => {
                Object.keys(errors).forEach((fieldName) => {
                  if (touched[fieldName]) {
                    setFieldTouched(fieldName);
                  }
                });
              }, 50);
            });

            return (
              <form className="form" onSubmit={handleSubmit}>
                <FormControl
                  fullWidth
                  margin="dense"
                  className={classes.formControl}
                >
                  <GTextField
                    id="password-current"
                    type="password"
                    name="currentPass"
                    value={values.currentPass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.currentPass && errors.currentPass)}
                    className={classes.inputField}
                    label={t("getter_fe.settings.common.oldPassword")}
                    disabled={isSubmitting}
                    showPwd={showPwd}
                    iconBtnClick={() => {
                      setShowPwd(!showPwd);
                    }}
                  />

                  {touched.currentPass && errors.currentPass && (
                    <div className={classes.passwordTextHelperContainer}>
                      <WarningIcon className={classes.warningIcon} />
                      <FormHelperText
                        error={Boolean(
                          touched.currentPass && errors.currentPass,
                        )}
                      >
                        {errors.currentPass}
                      </FormHelperText>
                    </div>
                  )}
                </FormControl>
                <FormControl
                  fullWidth
                  margin="dense"
                  className={classes.formControl}
                >
                  <GTextField
                    id="password-new"
                    type="password"
                    name="newPass"
                    value={values.newPass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.newPass && errors.newPass)}
                    className={classes.inputField}
                    label={t("getter_fe.settings.common.newPassword")}
                    disabled={isSubmitting}
                    showPwd={showPwd}
                    iconBtnClick={() => {
                      setShowPwd(!showPwd);
                    }}
                  />
                  {touched.newPass && errors.newPass && (
                    <div className={classes.passwordTextHelperContainer}>
                      <WarningIcon className={classes.warningIcon} />
                      <FormHelperText
                        className={classes.textHelper}
                        error={Boolean(touched.newPass && errors.newPass)}
                      >
                        {errors.newPass}
                      </FormHelperText>
                    </div>
                  )}
                </FormControl>
                <FormControl
                  fullWidth
                  margin="dense"
                  className={classes.formControl}
                >
                  <GTextField
                    id="password-confirm"
                    type="password"
                    name="confirmPass"
                    value={values.confirmPass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.confirmPass && errors.confirmPass)}
                    className={classes.inputField}
                    label={t("getter_fe.settings.common.confirmPassword")}
                    disabled={isSubmitting}
                    showPwd={showPwd}
                    iconBtnClick={() => {
                      setShowPwd(!showPwd);
                    }}
                  />

                  {touched.confirmPass && errors.confirmPass && (
                    <div className={classes.passwordTextHelperContainer}>
                      <WarningIcon className={classes.warningIcon} />
                      <FormHelperText
                        error={Boolean(
                          touched.confirmPass && errors.confirmPass,
                        )}
                      >
                        {errors.confirmPass}
                      </FormHelperText>
                    </div>
                  )}
                </FormControl>
                {isMobile ? (
                  <GButton
                    type="submit"
                    variant="outlined"
                    className={classes.mobileBtn}
                    disabled={Boolean(!isValid || isSubmitting || !dirty)}
                    loading={isSubmitting}
                  >
                    {t("getter_fe.profile.common.save")}
                  </GButton>
                ) : (
                  <GButton
                    type="submit"
                    variant="outlined"
                    className={classes.btn}
                    disabled={Boolean(!isValid || isSubmitting || !dirty)}
                    loading={isSubmitting}
                  >
                    {t("getter_fe.settings.common.saveChanges")}
                  </GButton>
                )}
              </form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};
