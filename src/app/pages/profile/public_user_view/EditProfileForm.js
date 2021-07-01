import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Formik} from "formik";
import {object, string} from "yup";
import moment from "moment";
import {toast} from "react-toastify";
import emojiRegex from "emoji-regex";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  DialogTitle,
  DialogContent,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import {ReactComponent as EditCloseIcon} from "src/assets/icons/basic/close.svg";
import {GTextField} from "../../../../styles/components/GTextField";
import {GButton} from "../../../../styles/components/GButton";
import {GTypography} from "../../../../styles/components/GTypography";
import {
  months,
  days,
  getYears,
  MAX_USERNAME_LENGTH,
  MAX_BIO_LENGTH,
  MAX_LOCATION_LENGTH,
  MAX_WEBSITE_LENGTH,
  MIN_USERNAME_LENGTH,
} from "./consts";
import clsx from "clsx";
import {dataURLtoFile} from "src/util/imageUtils";
import {GLoader} from "src/styles/components/GLoader";
import {useTranslation} from "react-i18next";
import {refreshUserInfo} from "src/app/components/auth/store";
import {NotifMessage} from "../../../components/notifications/NotifMessage";
import {ReactComponent as WarningIcon} from "../../../../assets/icons/feature/warning.svg";
import {ImageSettings} from "./ImageSettings";
import Global from "src/system/Global";

const useStyles = makeStyles((theme) =>
  /**
   * TODO: update the colors when the light/dark theme mode ready
   */
  createStyles({
    formControl: {
      marginTop: 0,
      marginBottom: theme.spacing(2),
    },
    ImageSettingsStyle: {
      minHeight: "250px",
      paddingTop: theme.spacing(8),
    },
    error: {
      color: "red",
    },
    dialogContainer: {
      display: "flex",
      flexDirection: "column",
    },
    dialogPaper: {
      height: "max-content",
      maxHeight: 1000,
    },
    dialogTitle: {
      position: "fixed",
      width: "100%",
      maxWidth: theme.spacing(82.25),
      fontSize: 18,
      backgroundColor: theme.palette.background.default,
      borderTopLeftRadius: theme.spacing(1.5),
      borderTopRightRadius: theme.spacing(1.5),
      zIndex: 99,
      [theme.breakpoints.down("sm")]: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
      "& > h2": {
        display: "flex",
        alignItems: "center",
        minHeight: 36,
        // justifyContent: "space-between",
      },
    },
    dialogTitleOptions: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
    },
    dialogCloseIcon: {
      cursor: "pointer",
      marginRight: theme.spacing(3),

      "& circle": {
        transition: "all 0.1s ease-in",
        fill: theme.palette.grey.A300,
      },
      "&:hover": {
        "& circle": {
          fill: theme.palette.grey.A200,
        },
      },
    },
    dialogBanner: {
      position: "relative",
      height: 150,
      backgroundColor: "#DEDEDE",
    },
    dialogCameraBig: {
      position: "absolute",
      top: "40%",
      left: "46%",
      cursor: "pointer",
    },
    dialogCameraSmall: {
      cursor: "pointer",
      position: "absolute",
      zIndex: 1,
      top: "40%",
      left: "6.75%",
    },
    dialogTitleText: {
      fontWeight: 700,
    },
    dialogAvatar: {
      position: "relative",
      "& > div": {
        borderRadius: "50%",
        border: "3px solid white",
      },
    },
    avatar: {
      height: 100,
      width: 100,
    },
    btn: {
      height: 36,
      width: 80,
      borderRadius: 100,
      "&:hover": {
        backgroundColor: "#3D3C7C !important",
      },
    },
    formHelperContainer: {
      display: "flex",
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
      marginBottom: theme.spacing(10),
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
    formControlCP: {
      marginTop: theme.spacing(1.25),
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
    dialogBirthDateComment: {
      color: theme.palette.text.secondary,
    },
    selectsWrapper: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: 10,
      marginBottom: 20,
    },
    birthDateControl: {
      minWidth: 120,
      "& .MuiSelect-select": {
        "&:focus": {
          background: theme.palette.background.default,
        },
      },
      "& .MuiSelect-icon": {
        display: "none",
      },
    },
    dialogBirthDateTitle: {
      display: "flex",
      justifyContent: "space-between",
    },
    removeBirthDate: {
      fontSize: 15,
      color: "#DD1818",
      cursor: "pointer",
    },
    dialogContent: {
      paddingBottom: "25px",
    },
  }),
);

export const EditProfileForm = ({
  objId,
  handleClose,
  birthdate,
  ico,
  bgimg,
  refreshView,
  nickname,
  website,
  dsc,
  location,
  userId,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const years = getYears();
  const [birthSplit, setBirthSplit] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [isAvatarOpen, setAvatarOpen] = useState(false);
  const [avatarLocalImage, setAvatarLocalImage] = useState(null);
  const [croppedAvatarImage, setCroppedAvatarImage] = useState("");
  const [isBannerOpen, setBannerOpen] = useState(false);
  const [bannerLocalImage, setBannerLocalImage] = useState(null);
  const [croppedBannerImage, setCroppedBannerImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(-1);
  const {t, i18n} = useTranslation();
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const api = Global.GetPortal().getAppService();

  useEffect(() => {
    if (birthdate) {
      setBirthSplit(birthdate.split("-"));
    }

    ico && setCroppedAvatarImage(ico);
    bgimg && setCroppedBannerImage(bgimg);
  }, [birthdate, ico, bgimg]);

  const uploadFiles = (files, callback) => {
    let realUrls = [];
    let allProgress = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i]?.name) {
        const path =
          i === 0 ? "/media/upload_avatar" : "/media/upload_background_image";
        setTimeout(() => {
          api.uploadFile(
            files[i],
            false,
            (error, result, progress) => {
              if (error) {
                toast.info(
                  <NotifMessage
                    message={t("getter_fe.profile.errors.imageUploadError")}
                  />,
                  {type: toast.TYPE.WARNING},
                );
                setIsLoading(false);
                return;
              } else if (result) {
                realUrls[i] = result.ori;
              } else if (progress) {
                allProgress[i] = progress;
                callback(
                  null,
                  allProgress.reduce((prev = 0, current = 0) => {
                    return prev + current;
                  }) / files.length,
                  error,
                );
              }
              if (
                realUrls.length === files.length &&
                !/(^,)|[,]{2,}/.test(realUrls.join())
              ) {
                callback(realUrls);
              }
            },
            path,
          );
        }, i * 1000);
      } else {
        realUrls[i] = files[i] || "none";
        if (
          realUrls.length === files.length &&
          !/(^,)|[,]{2,}/.test(realUrls.join())
        ) {
          callback(realUrls);
        }
      }
    }
  };

  const _handleSubmit = (data) => {
    const removeDate = () => {
      delete data.year;
      delete data.month;
      delete data.day;
      delete data.birthDate;
      return;
    };
    const trimData = () => {
      data.location = data.location.trim();
      data.bio = data.bio.trim();
      data.website = data.website.trim();
      data.username = data.username.trim();
      if (!data.username.length) {
        throw new Error("Username cannot consist of only spaces");
      }
    };
    const checkDate = () => {
      return data.year === "" || data.month === "" || data.day === "";
    };

    try {
      trimData();
      if (checkDate() && !data.birthDate) {
        removeDate();
        data.birthdate = "";
      } else {
        let birthDate = data.birthDate
          ? moment(data.birthDate)
          : moment(`${data.year}-${data.month}-${data.day}`, "YYYY-MM-DD");
        if (birthDate.isValid() === false || birthDate.isAfter()) {
          toast.info(
            <NotifMessage
              message={t("getter_fe.profile.errors.invalidDate")}
            />,
            {
              type: toast.TYPE.ERROR,
            },
          );
          return;
        }
        birthDate = birthDate.format("YYYY-MM-DD");
        removeDate();
        data = {
          ...data,
          birthdate: birthDate,
        };
      }
      setIsLoading(true);

      uploadFiles(
        [dataURLtoFile(data.ico), dataURLtoFile(data.bgimg)],
        async (realUrls, progress, error) => {
          if (error) {
            return;
          }
          if (realUrls) {
            setProgress(-1);
            data.ico = realUrls[0] !== "none" ? realUrls[0] : "";
            data.bgimg = realUrls[1] !== "none" ? realUrls[1] : "";
            const formatData = {
              ...data,
            };

            let result = await api.updateUserProfile(objId, formatData, userId);
            if (result?.status === 200) {
              await api.refreshUserInfo((err, result) => {
                dispatch(
                  refreshUserInfo({
                    userinfo: result.data,
                  }),
                );
                api.updateUserInfo(result);
                // const user = JSON.parse(
                //   localStorage.getItem(userConstants.LS_SESSION_INFO),
                // );
                // user.userinfo = result.data;
                // const newUser = JSON.stringify(user);
                // localStorage.setItem(userConstants.LS_SESSION_INFO, newUser);
              });
              toast.info(
                <NotifMessage
                  message={t("getter_fe.profile.common.yourProfileWasSaved")}
                />,
                {
                  type: toast.TYPE.SUCCESS,
                },
              );
            } else {
              toast.error(
                <NotifMessage
                  message={t(
                    "getter_fe.profile.common.yourProfileWasSavedError",
                  )}
                />,
                {
                  type: toast.TYPE.ERROR,
                },
              );
            }
            handleClose();
            setIsLoading(false);
            // if (result?.status === 200) {
            //   refreshView();
            // }
          } else {
            setProgress(progress);
          }
        },
      );
      // history.go(0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isLoading && (
        <GLoader
          progress={progress}
          isPopup={true}
          tips={
            progress > -1
              ? t("getter_fe.profile.common.uploadingFile")
              : t("getter_fe.profile.common.savingProfile")
          }
        />
      )}
      <Formik
        enableReinitialize={true}
        initialValues={{
          username: nickname,
          bio: dsc || "",
          location: location || "",
          website: website || "",
          birthDate: birthdate || "",
          month: Number(birthSplit[1]) || "",
          day: Number(birthSplit[2]) || "",
          year: Number(birthSplit[0]) || "",
          ico: ico || "",
          bgimg: bgimg || "",
        }}
        validationSchema={object().shape({
          username: string()
            .trim()
            .label("Username")
            .min(
              MIN_USERNAME_LENGTH,
              t("getter_fe.profile.errors.displayNameMinLength", {
                minLength: MIN_USERNAME_LENGTH,
                maxLength: MAX_USERNAME_LENGTH,
              }),
            )
            .max(
              MAX_USERNAME_LENGTH,
              t("getter_fe.profile.errors.displayNameMaxLength", {
                maxLength: MAX_USERNAME_LENGTH,
              }),
            )
            .required(t("getter_fe.profile.errors.displayNameRequired")),
          bio: string()
            .label("bio")
            .max(
              MAX_BIO_LENGTH,
              t("getter_fe.profile.errors.bioMaxLength", {
                maxLength: MAX_BIO_LENGTH,
              }),
            ),
          location: string()
            .label("location")
            .max(
              MAX_LOCATION_LENGTH,
              t("getter_fe.profile.errors.locationMaxLength", {
                maxLength: MAX_LOCATION_LENGTH,
              }),
            ),
          website: string()
            .label("website")
            .matches(
              new RegExp(
                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                "gi",
              ),
              t("getter_fe.profile.errors.websiteInvalidUrl"),
            )
            .matches(
              new RegExp(`^((?!${emojiRegex().source}).)*$`, "g"),
              t("getter_fe.profile.errors.websiteInvalidUrl"),
            )
            .max(
              MAX_WEBSITE_LENGTH,
              t("getter_fe.profile.errors.websiteMaxLength", {
                maxLength: MAX_WEBSITE_LENGTH,
              }),
            ),
        })}
        onSubmit={(
          {username, bio, location, website, month, day, year, birthDate},
          {setSubmitting, resetForm},
        ) =>
          _handleSubmit({
            username,
            bio,
            location,
            website,
            month,
            day,
            year,
            ico: croppedAvatarImage,
            bgimg: croppedBannerImage,
            birthDate: birthdate !== birthDate ? birthDate : null,
          })
        }
      >
        {({
          values,
          touched,
          errors,
          initialValues,
          handleChange,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
        }) => {
          i18n.on("languageChanged", (lng) => {
            setTimeout(() => {
              Object.keys(errors).forEach((fieldName) => {
                if (touched[fieldName]) {
                  setFieldTouched(fieldName);
                }
              });
            }, 50);
          });

          const birthdayKeys = ["month", "day", "year"];

          const isInitialValues =
            Object.keys(initialValues).every((key) => {
              if (birthdayKeys.indexOf(key) > -1 && !initialValues[key]) {
                return birthdayKeys.some(
                  (birthdayKey) =>
                    initialValues[birthdayKey] === values[birthdayKey],
                );
              }
              return initialValues[key] === values[key];
            }) &&
            (croppedBannerImage.length === 0 || bgimg === croppedBannerImage) &&
            (croppedAvatarImage.length === 0 || ico === croppedAvatarImage);

          return (
            <form className="form" onSubmit={handleSubmit}>
              <DialogTitle className={classes.dialogTitle}>
                <EditCloseIcon
                  className={classes.dialogCloseIcon}
                  onClick={handleClose}
                />
                <GTypography variant="h2" className={classes.dialogTitleText}>
                  {t("getter_fe.profile.common.editProfile")}
                </GTypography>
                <div className={classes.dialogTitleOptions}>
                  <GButton
                    type="submit"
                    variant="contained"
                    className={classes.btn}
                    onClick={handleSubmit}
                    disabled={
                      errors.username ||
                      errors.location ||
                      errors.bio ||
                      errors.website ||
                      errors.year ||
                      errors.day ||
                      errors.month ||
                      isInitialValues
                    }
                  >
                    {t("getter_fe.profile.common.save")}
                  </GButton>
                </div>
              </DialogTitle>
              <div className={classes.ImageSettingsStyle}>
                <ImageSettings
                  renderCount={renderCount}
                  setRenderCount={setRenderCount}
                  isAvatarOpen={isAvatarOpen}
                  setAvatarOpen={setAvatarOpen}
                  avatarLocalImage={avatarLocalImage}
                  setAvatarLocalImage={setAvatarLocalImage}
                  croppedAvatarImage={croppedAvatarImage}
                  setCroppedAvatarImage={setCroppedAvatarImage}
                  isBannerOpen={isBannerOpen}
                  setBannerOpen={setBannerOpen}
                  bannerLocalImage={bannerLocalImage}
                  setBannerLocalImage={setBannerLocalImage}
                  croppedBannerImage={croppedBannerImage}
                  setCroppedBannerImage={setCroppedBannerImage}
                />
              </div>
              <DialogContent className={classes.dialogContent}>
                <FormControl fullWidth className={classes.formControl}>
                  <GTextField
                    id="username-field"
                    type="charValidate"
                    name="username"
                    value={values.username ? values.username : ""}
                    onChange={handleChange}
                    error={errors.username}
                    className={classes.inputField}
                    label={t("getter_fe.profile.common.displayName")}
                    charCount={values.username?.length || 0}
                    maxCharLength={MAX_USERNAME_LENGTH}
                  />
                  <div className={classes.formHelperContainer}>
                    {errors.username && (
                      <WarningIcon className={classes.warningIcon} />
                    )}
                    <FormHelperText
                      className={classes.error}
                      error={Boolean(touched.username || errors.username)}
                    >
                      {touched.username || errors.username
                        ? errors.username
                        : ""}
                    </FormHelperText>
                  </div>
                </FormControl>
                <FormControl
                  fullWidth
                  error={Boolean(touched.bio || errors.bio)}
                  className={classes.formControl}
                >
                  <GTextField
                    id="bio-field"
                    type="charValidate"
                    name="bio"
                    value={values.bio ? values.bio : ""}
                    onChange={handleChange}
                    error={errors.bio}
                    className={classes.inputField}
                    label={t("getter_fe.profile.common.bio")}
                    charCount={values.bio?.length || 0}
                    maxCharLength={MAX_BIO_LENGTH}
                  />
                  <div className={classes.formHelperContainer}>
                    {errors.bio && (
                      <WarningIcon className={classes.warningIcon} />
                    )}
                    <FormHelperText
                      className={classes.error}
                      error={Boolean(touched.bio || errors.bio)}
                    >
                      {touched.bio || errors.bio ? errors.bio : ""}
                    </FormHelperText>
                  </div>
                </FormControl>
                <FormControl
                  fullWidth
                  className={clsx(classes.formControl, classes.formControlCP)}
                >
                  <GTextField
                    id="location-field"
                    type="charValidate"
                    name="location"
                    value={values.location ? values.location : ""}
                    onChange={handleChange}
                    error={errors.location}
                    className={classes.inputField}
                    label={t("getter_fe.profile.common.location")}
                    charCount={values.location?.length || 0}
                    maxCharLength={MAX_LOCATION_LENGTH}
                  />
                  <div className={classes.formHelperContainer}>
                    {errors.location && (
                      <WarningIcon className={classes.warningIcon} />
                    )}
                    <FormHelperText
                      className={classes.error}
                      error={Boolean(touched.location || errors.location)}
                    >
                      {touched.location || errors.location
                        ? errors.location
                        : ""}
                    </FormHelperText>
                  </div>
                </FormControl>
                <FormControl
                  fullWidth
                  className={clsx(classes.formControl, classes.formControlCP)}
                >
                  <GTextField
                    id="website-field"
                    type="charValidate"
                    name="website"
                    value={
                      values.website && values.website !== "null"
                        ? values.website
                        : ""
                    }
                    onChange={handleChange}
                    error={errors.website}
                    className={classes.inputField}
                    label={t("getter_fe.profile.common.website")}
                    charCount={values.website?.length || 0}
                    maxCharLength={MAX_WEBSITE_LENGTH}
                  />
                  <div className={classes.formHelperContainer}>
                    {errors.website && (
                      <WarningIcon className={classes.warningIcon} />
                    )}
                    <FormHelperText
                      className={classes.error}
                      error={Boolean(touched.website || errors.website)}
                    >
                      {touched.website || errors.website ? errors.website : ""}
                    </FormHelperText>
                  </div>
                </FormControl>
                <div className={classes.dialogBirthDateTitle}>
                  <div>{t("getter_fe.profile.common.birth_date")}</div>
                </div>
                <div className={classes.dialogBirthDateComment}>
                  {t("getter_fe.profile.common.birth_date_helper_text")}
                </div>
                {isTabletOrMobile ? (
                  <FormControl>
                    <input
                      type="date"
                      name="birthDate"
                      id="birthDate"
                      value={values.birthDate}
                      onChange={handleChange}
                      style={{padding: 0}}
                    />
                  </FormControl>
                ) : (
                  <div className={classes.selectsWrapper}>
                    <FormControl className={classes.birthDateControl}>
                      <InputLabel id="year-label">
                        {t("getter_fe.profile.common.year")}
                      </InputLabel>
                      <Select
                        labelId="year-label"
                        id="year"
                        name="year"
                        onChange={handleChange}
                        value={values.year}
                        className={classes.select}
                      >
                        <MenuItem aria-label="None" value="">
                          {t("getter_fe.profile.common.year")}
                        </MenuItem>
                        {years.map((year, idx) => {
                          return (
                            <MenuItem key={`${year}-${idx}`} value={year}>
                              {year}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <FormControl className={classes.birthDateControl}>
                      <InputLabel id="month-label">
                        {t("getter_fe.profile.common.month")}
                      </InputLabel>
                      <Select
                        labelId="month-label"
                        id="month"
                        name="month"
                        onChange={handleChange}
                        value={values.month}
                        className={classes.select}
                      >
                        <MenuItem aria-label="None" value="">
                          {t("getter_fe.profile.common.month")}
                        </MenuItem>
                        {months.map((month, idx) => {
                          return (
                            <MenuItem key={`${month}-${idx}`} value={month}>
                              {month < 10 ? `0${month}` : month}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <FormControl className={classes.birthDateControl}>
                      <InputLabel id="day-label">
                        {t("getter_fe.profile.common.day")}
                      </InputLabel>
                      <Select
                        labelId="day-label"
                        id="day"
                        name="day"
                        onChange={handleChange}
                        value={values.day}
                        className={classes.select}
                      >
                        <MenuItem aria-label="None" value="">
                          {t("getter_fe.profile.common.day")}
                        </MenuItem>
                        {days.map((day, idx) => {
                          return (
                            <MenuItem key={`${day}-${idx}`} value={day}>
                              {day < 10 ? `0${day}` : day}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                )}

                {errors.year && (
                  <div className={classes.formHelperContainer}>
                    <WarningIcon className={classes.warningIcon} />
                    <FormHelperText error={true} className={classes.errorTxt}>
                      {errors.year}
                    </FormHelperText>
                  </div>
                )}
                {values.year && values.month && values.day ? (
                  <div
                    className={classes.removeBirthDate}
                    onClick={() => {
                      setFieldValue("year", "");
                      setFieldValue("month", "");
                      setFieldValue("day", "");
                      setFieldValue("birthDate", "");
                    }}
                  >
                    {t("getter_fe.profile.common.removeBirthDate")}
                  </div>
                ) : null}
              </DialogContent>
            </form>
          );
        }}
      </Formik>
    </>
  );
};
