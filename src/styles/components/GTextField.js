import React, {useState, useRef} from "react";
import classnames from "classnames";
import {
  createStyles,
  makeStyles,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";
import {ReactComponent as EyeOpen} from "../../assets/icons/basic/password_show.svg";
import {ReactComponent as EyeClose} from "../../assets/icons/basic/password_hide.svg";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
  createStyles({
    btnEye: {
      display: "block",
      padding: theme.spacing(1),
      "& .MuiIconButton-label": {
        display: "inline-flex",
        width: "auto",
      },
    },
    inputField: {
      marginTop: 0,
      "& label": {
        fontWeight: theme.typography.fontWeightLight,
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: 0,
        boxShadow: "none",
        "& input": {
          fontSize: 15,
          [theme.breakpoints.down("xs")]: {
            fontSize: 16,
          },
        },
        "& .MuiInputAdornment-positionEnd": {
          "& p": {
            fontSize: 12,
            marginBottom: 0,
          },
        },
      },
      "& fieldset": {
        border: "none",
        borderBottom: `1px solid ${theme.input.borderColor}`,
      },
      "&:hover": {
        "& fieldset": {
          borderBottom: `1px solid ${theme.input.borderColor} !important`,
        },
      },
      "& .MuiOutlinedInput-root.Mui-focused fieldset": {
        borderBottom: `2px solid ${theme.palette.primary.main} !important`,
      },
      "& input:not([type=checkbox]):not([type=radio])": {
        paddingLeft: 0,
        backgroundColor: theme.palette.background.main,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderBottom: `2px solid ${theme.palette.primary.main} !important`,
      },
      "& .MuiInputLabel-outlined": {
        transform: "translate(0, 8px) scale(1)",
        fontSize: 15,
        color: theme.palette.text.secondary,
        textTransform: "capitalize",
      },
      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
        transform: "translate(0, -6px) scale(0.75)",
      },
      "& .MuiInputBase-root": {
        color: theme.palette.text.main,
      },
      "& input:-webkit-autofill": {
        transition: "background-color 5000s ease-in-out 0s",
      },
    },
    icon: {
      "& path": {
        fill: theme.palette.primary.light,
      },
    },
    iconBtn: {
      marginRight: theme.spacing(-1.625),
      cursor: "pointer",
      paddingRight: 0,
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  }),
);

export const GTextField = ({
  className,
  type,
  anchor = null,
  hideIcon,
  charCount,
  maxCharLength,
  showPwd = false,
  iconBtnClick = null,
  ...rest
}) => {
  const classes = useStyles();
  const passwordType = type === "password";
  const charValidateType = type === "charValidate";
  const [showPassword, setShowPassword] = useState(false);
  const [showAdornment, setShowAdornment] = useState(false);
  const InputProps = {};

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Password show toggle
  if (passwordType && !hideIcon && rest.value) {
    InputProps["endAdornment"] = (
      <InputAdornment position="end">
        <div
          tabIndex={-1}
          className={classnames(
            classes.btnEye,
            classes.iconBtn,
            (iconBtnClick ? showPwd : showPassword) ? "showPassword" : null,
          )}
          aria-label="toggle password visibility"
          onClick={() => {
            setShowPassword(!showPassword);
            iconBtnClick && iconBtnClick();
          }}
          onMouseDown={handleMouseDownPassword}
        >
          {(iconBtnClick ? showPwd : showPassword) ? (
            <EyeOpen className={classes.icon} />
          ) : (
            <EyeClose className={classes.icon} />
          )}
        </div>
      </InputAdornment>
    );
  }

  if (charValidateType && !hideIcon && showAdornment) {
    InputProps["endAdornment"] = (
      <InputAdornment position="end">
        {`${charCount} / ${maxCharLength}`}
      </InputAdornment>
    );
  }

  return (
    <TextField
      className={clsx(className, classes.inputField)}
      variant="outlined"
      fullWidth
      SelectProps={{
        displayEmpty: true,
        IconComponent: ExpandMore,
        MenuProps: {
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: anchor,
        },
      }}
      type={
        passwordType
          ? (iconBtnClick ? showPwd : showPassword)
            ? "text"
            : "password"
          : "text"
      }
      InputProps={InputProps}
      onBlur={(e) => {
        setShowAdornment(false);
      }}
      onFocus={(e) => {
        setShowAdornment(true);
      }}
      {...rest}
    />
  );
};
