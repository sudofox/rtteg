import React, {useState} from "react";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {ReactComponent as CheckMarkIcon} from "src/assets/icons/checkMark.svg";
import {t, getLang, setLang} from "src/i18n/utils";
import clsx from "clsx";
import Global from "src/system/Global";
import AppConsts from "../../AppConsts";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .languages-menu-trigger": {
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        borderRadius: 100,
        padding: 0,
      },
    },
    dropdownContent: {
      cursor: "pointer",
      width: theme.spacing(30.625),
      borderRadius: 8,
      margin: 0,
      borderColor: "#e3e9ee",
      boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.08)",
      marginTop: theme.spacing(-1),
      top: "83px !important",
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 50,
      fontSize: 15,
      color: theme.palette.text.main,
      padding: theme.spacing(0, 2.5, 0, 1.875),
      "&:hover": {
        backgroundColor: theme.palette.grey.A300,
      },
    },
    checkIcon: {
      "&  path": {
        stroke: theme.palette.text.main,
      },
    },
  }),
);

const LanguagesMenu = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const currentLangCode = getLang();
  const api = Global.GetPortal().getAppService();
  const allLangs = api.getSupportedLanguageList();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleLang = (langCode) => {
    setOpen(false);
    const success = api.setLanguagePref(langCode);
    if (success) {
      localStorage.setItem(AppConsts.LOCAL_STORAGE_LAST_BROWSER_LANG, langCode);
      window.location.reload();
      setLang(langCode);
    } else {
      console.error("Oops! Cannot change to the language you desired.");
    }
  };

  const getUserMenuTrigger = () => {
    let comp = (
      <div className="languages-menu-trigger">
        {currentLangCode.toLocaleUpperCase()}
      </div>
    );

    return comp;
  };

  return (
    <div className={clsx(classes.root, "dropdown")}>
      <div
        aria-describedby="languages-menu"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        {getUserMenuTrigger()}
      </div>
      <Popover
        id="user-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        classes={{
          paper: classes.dropdownContent,
        }}
      >
        {allLangs &&
          allLangs.map((lang, idx) => {
            return (
              <span
                className={classes.item}
                key={idx}
                onClick={() => handleLang(lang.code)}
              >
                {lang.nativeName}
                {currentLangCode === lang.code ? (
                  <CheckMarkIcon className={classes.checkIcon} />
                ) : null}
              </span>
            );
          })}
      </Popover>
    </div>
  );
};

export default LanguagesMenu;
