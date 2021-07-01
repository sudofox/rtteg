import {makeStyles, Divider} from "@material-ui/core";
import {t} from "src/i18n/utils";
import LanguagesMenu from "./LanguagesMenu";
import AppConsts from "src/app/AppConsts";
import {useAuthRedirect} from "src/util/useAuthRedirect";

const useStyles = makeStyles((theme) => ({
  itemsWrapper: {
    display: "flex",
    alignItems: "center",
  },
  item: {
    fontSize: 16,
    lineHeight: "19px",
    fontWeight: 700,
    color: theme.palette.primary.main,
    cursor: "pointer",
    "&:nth-child(2)": {
      margin: theme.spacing(0, 3.125),
    },
    "&:nth-child(1)": {
      color: theme.palette.error.main,
    },
  },
  divider: {
    display: "inline-block",
    height: 19,
    marginRight: theme.spacing(3.125),
    backgroundColor: theme.palette.primary.light,
  },
}));

export const UserMenuGuest = () => {
  const classes = useStyles();
  const authRedirect = useAuthRedirect();

  return (
    <div className={classes.itemsWrapper}>
      <span
        className={classes.item}
        onClick={() => {
          authRedirect(AppConsts.URL_SIGNUP);
        }}
      >
        {t("getter_fe.auth.common.createAccount")}
      </span>
      <span
        className={classes.item}
        onClick={() => {
          authRedirect();
        }}
      >
        {t("getter_fe.auth.common.login")}
      </span>
      <Divider orientation="vertical" className={classes.divider} />
      <span className={classes.item}>
        <LanguagesMenu />
      </span>
    </div>
  );
};
