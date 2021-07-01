import {StyleConsts, RenderProps} from "../core/model/VisualConsts";

// ----------------------- Application Specific Constants -------------------------

export const APP_NAME = "GETTR";
export const APP_WEB_NAME = "GETTR";
export const APP_WEB_DOMAIN = "GETTR";

export const PROP_OBJID = "objId";
export const PROP_OBJDATA = "obj";

export const style_vlist_nobullet = {
  listStyleType: "none",
};

export const style_tr_align_top = {
  alignItems: "top",
};

/**
 * Constants. PROP_ for properties, STATE_ for states, etc.
 */
export class AppConsts extends RenderProps {
  static get APP_NAME() {
    return APP_NAME;
  }
  static get APP_WEB_NAME() {
    return APP_WEB_NAME;
  }
  static get APP_WEB_DOMAIN() {
    return APP_WEB_DOMAIN;
  }
  static get APP_TWITTER_USERNAME() {
    return "gettr";
  }
  static get APP_FACEBOOK_USERNAME() {
    return "gettr";
  }
  static get APP_EMAIL_REQUEST() {
    return "info@gettr.com";
  }
  static get APP_UID_ADMIN() {
    return "admin";
  }

  static get PROP_OBJID() {
    return "objId";
  }
  static get PROP_OBJDATA() {
    return "obj";
  }
  static get PROP_BUTTON_TYPE() {
    return "buttonType";
  }
  static get PROP_COMPNAME() {
    return "compName";
  }
  static get PROP_LABEL() {
    return "label";
  }
  static get PROP_COUNT() {
    return "count";
  }
  static get PROP_SHARE_COUNT() {
    return "shares";
  }
  static get PROP_SHOW_ICON() {
    return "showIcon";
  }
  static get PROP_SHOW_COUNT() {
    return "showCount";
  }
  static get PROP_SIGNUP_REDIRECT_URL() {
    return "SignupRedirect";
  }
  static get PROP_STATUS() {
    return "status";
  }
  static get PROP_THEME() {
    return "theme";
  }
  static get PROP_INFO_CODE() {
    return "ifc";
  }
  static get PROP_ERROR_CODE() {
    return "emc";
  }

  static get TYPE_BUTTON_PILL() {
    return "pill";
  }
  static get TYPE_BUTTON_ICON() {
    return "icon";
  }

  static get CONNECTION_TYPE_FOLLOWERS() {
    return "followers";
  }
  static get CONNECTION_TYPE_FOLLOWING() {
    return "following";
  }
  static get CONNECTION_TYPE_POSTWATCHED() {
    return "pstwatched";
  }

  static get COMPOSER_MAX_TEXT_LENGTH() {
    return 777;
  }

  static get DIALOG_HEIGHT() {
    return 720;
  }
  static get DIALOG_WIDTH() {
    return 640;
  } // 40rem Must match dialog-view__box.width minus padding
  static get MIN_DIALOG_HEIGHT() {
    return 1200;
  }
  static get LIST_ITEM_WIDTH() {
    return "400px";
  }
  static get ONE_COLUMN_WIDTH() {
    return 1024;
  }

  static get STATE_LOADING() {
    return "_ldg";
  }
  static get STATE_LOADING_LIKES() {
    return "_ldglks";
  }
  static get STATE_LOADING_SHARES() {
    return "_ipshs";
  }

  static get STATE_STATUS() {
    return "status";
  }
  static get STATE_LIKE_STATUS() {
    return "lkst";
  }
  static get STATE_SHARE_STATUS() {
    return "shst";
  }

  static get URL_SIGNUP() {
    return "/signup";
  }
  static get URL_LOGIN() {
    return "/login";
  }
  static get URL_LOGOUT() {
    return "/logout";
  }
  static get URL_CLAIM() {
    return "/claim";
  }
  static get URL_TEMPORARILY_BLOCKED() {
    return "/temporarily-blocked";
  }
  static get URL_CHANGE_PASSWORD() {
    return "/chgpwd";
  }
  static get URL_HOME() {
    return "/";
  }
  static get URL_DASHBOARD() {
    return "/";
  }
  static get URL_HELP_CENTER() {
    return "/helpcenter";
  }
  static get URL_HELP_CENTER_MOBILE_APP() {
    return "/helpcenter-app";
  }
  static get URL_ROOT() {
    return "/";
  }
  static get URL_SEARCH_RESULT() {
    return "/search";
  }
  static get URL_HASHTAG() {
    return "/hashtag";
  }

  static get URL_LOGO_32T() {
    return "/logos/getter_logo_128.png";
  }
  static get URL_LOGO_64T() {
    return "/logos/getter_logo_192.png";
  }
  static get URL_LOGO_96T() {
    return "/logos/getter_logo_96.png";
  }

  static get URL_UNKNOWN_USER() {
    return "";
  }
  static get URL_MILES_GUO() {
    return "https://yt3.ggpht.com/a/AATXAJzXqvFDzrgTS3Aed9kAO4tnFZOItkGdKiYr6_o4Og=s900-c-k-c0xffffffff-no-rj-mo";
  }
  static get URL_SETTINGS_PRIVACY() {
    return "privacy";
  }
  static get URL_SETTINGS_CHANGE_PASSWORD() {
    return "change-password";
  }
  static get URL_SETTINGS_INTERFACE_LANGUAGE() {
    return "interface-language";
  }
  static get URL_SETTINGS_MOBILE_INDEX() {
    return "mobile";
  }
  static get URL_HELPCENTER_REGISTRATION() {
    return "registration";
  }
  static get URL_HELPCENTER_POST_REPOST_REPLY() {
    return "post-repost-reply";
  }
  static get URL_HELPCENTER_SHARE() {
    return "share";
  }
  static get URL_HELPCENTER_COOKIEPOLICY() {
    return "cookie-policy";
  }
  static get URL_HELPCENTER_PRIVACYPOLICY() {
    return "privacy-policy";
  }
  static get URL_HELPCENTER_TERMSOFUSER() {
    return "terms-of-user";
  }
  static get URL_HELPCENTER_MOBILE_INDEX() {
    return "mobile";
  }
  static get URL_HELPCENTER_CONTACTUS() {
    return "contact-us";
  }
  static get COOKIE_EXPIRE_DAYS() {
    return 30;
  }
  static get SELLIST_TAGS() {
    return "tags";
  }
  static get SELLIST_DATA() {
    return "cats";
  }
  static get SELLIST_SIZE() {
    return "size";
  }
  static get SELLIST_SEQ() {
    return "seq";
  }
  static get SELLIST_TEXT() {
    return "text";
  }
  static get SELLIST_LABEL() {
    return "label";
  }
  static get SELLIST_SUBTITLE() {
    return "sttl";
  }
  static get SELLIST_STICKY() {
    return "sticky";
  }
  static get SELLIST_DESC() {
    return "dsc";
  }
  static get SELLIST_ICON_URL() {
    return "ico";
  }

  static get TYPE_SEARCH_DELAY_MS() {
    return 350;
  }

  static get LOCAL_STORAGE_RECENT_SEARCH() {
    return "localStorageRecentSearch";
  }

  static get LOCAL_STORAGE_FIRST_TIME_VISIT() {
    return "FIRST_TIME_VISIT";
  }

  static get LOCAL_STORAGE_LAST_BROWSER_LANG() {
    return "LAST_BROWSER_LANG";
  }

  static get LOCAL_STORAGE_REDIRECT_AFTER_LOGIN() {
    return "REDIRECT_AFTER_LOGIN";
  }

  static get EMAIL_SAMPLE() {
    return "12345@gmail.com.";
  }

  static get CONTACTUS_EMAIL() {
    return "info@gettr.com";
  }

  static get CHAR_AROBASE() {
    return "@";
  }

  static get DESCRIPTION_MAX_CHARACT() {
    return 147;
  }

  static get USER_LIST_MUTED() {
    return "muted";
  }

  static get USER_LIST_BLOCKED() {
    return "blocked";
  }

  static get USER_LIST_FOLLOW() {
    return "follow";
  }

  static get NOTIF_MESSAGE_SUCCESS() {
    return "notif_message_success";
  }

  static get NOTIF_MESSAGE_ERROR() {
    return "notif_message_error";
  }

  // -------------------------- STATUS -------------------------------------

  static get STATUS_ACCEPTED() {
    return "y";
  }

  static get STATUS_SERVER_ERROR() {
    return "server_error";
  }
}

export class UIStyleConsts extends StyleConsts {
  static get APP_PAGE() {
    return "app-page";
  }
  static get DASHBOARD() {
    return "dashboard";
  }
  static get DASHBOARD_COLUMN() {
    return "dashboard-column";
  }
  static get DASHBOARD_COLUMN_OVERFLOW() {
    return "column-overflow";
  }
  static get DASHBOARD_COLUMN_HEADER() {
    return "column-header";
  }
  static get DASHBOARD_PRIMARY_COLUMN() {
    return "primary-column";
  }
  static get DASHBOARD_SECONDARY_COLUMN() {
    return "secondary-column";
  }

  static get DROPDOWN_MENU_ITEM() {
    return "menu-item";
  }

  static get POST_FEED_ITEM_BUTTON() {
    return "post-feed-item-button";
  }

  static get BUTTON_PILL() {
    return "button--pill panel-view__button";
  }
  static get BUTTON_COLOR_PILL() {
    return "button--color-pill panel-view__button";
  }
  static get BUTTON_PANEL() {
    return "button panel-view__button";
  }
  static get BUTTON_LINK() {
    return "cbutton button--link";
  }
  static get BUTTON_PANEL_DISABLED() {
    return "button-disabled panel-view__button";
  }

  static get MBUTTON_ACTION() {
    return "mbutton panel-view__mbutton";
  }
  static get MBUTTON_ACTION_DISABLED() {
    return "mbutton-disabled panel-view__mbutton";
  }
  static get MBUTTON_PANEL() {
    return "mbutton panel-view__mbutton";
  }
  static get MBUTTON_PANEL_DISABLED() {
    return "mbutton-disabled panel-view__mbutton";
  }

  static get SBUTTON_ACTION() {
    return "mbutton panel-view__sbutton";
  }
  static get SBUTTON_ACTION_DISABLED() {
    return "mbutton-disabled panel-view__sbutton";
  }

  static get INPUT_LABEL() {
    return "panel-view__inputLabel";
  }
  static get INPUT_COMP() {
    return "panel-view__input";
  }
  static get CHECKBOX_LABEL() {
    return "panel-view__checkboxLabel";
  }
  static get CHECKBOX_COMP() {
    return "panel-view__checkbox";
  }

  static get INPUT_SIZE_PASSWORD() {
    return "25";
  }
}

// --------------------------- LABEL IDs --------------------------------

export const LABEL_WEBSITE = "WWW";
export const LABEL_APPNAME = "APPN";
export const LABEL_HOMEPAGE = "HMPG";
export const LABEL_ABOUT_US = "ABUS";
export const LABEL_TOS = "TOS";
export const LABEL_PRIVACY_POLICY = "PRVP";
export const LABEL_FEEDBACK = "FDBK";

export const LABEL_SUBMIT_CHANGE = "SBCH";

export const LABEL_EMAIL_ADDRESS = "EMLADR";
export const LABEL_USERNAME = "USRN";
export const LABEL_DISPLAYNAME = "DSPN";

export const LABEL_EMAIL_ENTER = "INPEML";
export const LABEL_DISPLAYNAME_ENTER = "INPDSN";
export const LABEL_USERNAME_ENTER = "INPUSN";
export const LABEL_PASSWORD_ENTER = "INPPWD";
export const LABEL_PASSWORD2_ENTER = "INPPW2";

export const LABEL_SELECT = "SEL";
export const LABEL_DELETE = "DEL";
export const LABEL_EDIT = "EDT";
export const LABEL_CANCEL = "CAN";
export const LABEL_CLONE = "CLN";
export const LABEL_CLOSE = "CLS";
export const LABEL_RESET = "RST";
export const LABEL_RETURN = "RET";
export const LABEL_SUBMIT_POST = "PST";
export const LABEL_SUBMIT_REPOST = "RPST";
export const LABEL_SUBMIT_COMMENT = "SCM";

export const LABEL_HOME = "HM";
export const LABEL_EXPLORE = "EPLR";
export const LABEL_NOTIFICATIONS = "NTFCT";
export const LABEL_MESSAGES = "MSG";
export const LABEL_PROFILE = "PF";

// --------------------------- MESSAGE IDs ------------------------------

export const MSG_PASSWORD_OK = "M0101";

export const MSG_PASSWORD_NOT_VALID = "E0101";
export const MSG_PASSWORD_NOT_MATCHED = "E0102";
export const MSG_NICKNAME_NOT_VALID = "E0103";
export const MSG_EMAIL_NOT_VALID = "E0104";
export const MSG_EMAIL_NONE = "E0105";
export const MSG_INVITE_CODE_INVALID = "E0106";
export const MSG_INVITE_CODE_VERIFIED = "E0107";
export const MSG_USERNAME_EXISTS = "E0108";
export const MSG_USERNAME_AVAILABLE = "E0109";
export const MSG_USERNAME_CHECK_ERROR = "E0110";
export const MSG_USERNAME_NOT_VALID = "E0111";

export const MSG_CREATE_POST_LABEL = "M0112";

export const UIStyle = UIStyleConsts;

export default AppConsts;
