import {LanguageCodes} from "../core/model/ModelConsts";

import {
  APP_NAME,
  APP_WEB_NAME,
  MSG_PASSWORD_OK,
  MSG_PASSWORD_NOT_MATCHED,
  MSG_PASSWORD_NOT_VALID,
  MSG_NICKNAME_NOT_VALID,
  MSG_EMAIL_NOT_VALID,
  MSG_EMAIL_NONE,
  MSG_INVITE_CODE_INVALID,
  MSG_INVITE_CODE_VERIFIED,
  MSG_USERNAME_EXISTS,
  MSG_USERNAME_AVAILABLE,
  MSG_USERNAME_CHECK_ERROR,
  MSG_USERNAME_NOT_VALID,
  MSG_CREATE_POST_LABEL,
  LABEL_WEBSITE,
  LABEL_APPNAME,
  LABEL_PRIVACY_POLICY,
  LABEL_FEEDBACK,
  LABEL_HOMEPAGE,
  LABEL_ABOUT_US,
  LABEL_TOS,
  LABEL_SUBMIT_CHANGE,
  LABEL_EMAIL_ADDRESS,
  LABEL_USERNAME,
  LABEL_DISPLAYNAME,
  LABEL_EMAIL_ENTER,
  LABEL_DISPLAYNAME_ENTER,
  LABEL_USERNAME_ENTER,
  LABEL_PASSWORD_ENTER,
  LABEL_PASSWORD2_ENTER,
  LABEL_DELETE,
  LABEL_EDIT,
  LABEL_SELECT,
  LABEL_CANCEL,
  LABEL_CLONE,
  LABEL_CLOSE,
  LABEL_RESET,
  LABEL_RETURN,
  LABEL_HOME,
  LABEL_EXPLORE,
  LABEL_NOTIFICATIONS,
  LABEL_MESSAGES,
  LABEL_PROFILE,
  LABEL_SUBMIT_POST,
  LABEL_SUBMIT_REPOST,
  LABEL_SUBMIT_COMMENT,
} from "./AppConsts";

import {
  TOPIC_BUG,
  TOPIC_FEATURE,
  TOPIC_USABILITY,
  TOPIC_INQUIRY,
  TOPIC_OTHER,
} from "../core/model/user/XMUserFeedback";

// Common error codes used in server side but we want a different
// message to override
import {PASS_NONE} from "../core/ErrorConsts";

export const AppMessages_en = {
  [PASS_NONE]: "Password is required",

  [LABEL_WEBSITE]: APP_WEB_NAME,
  [LABEL_APPNAME]: APP_NAME,
  [LABEL_HOMEPAGE]: "Home Page",
  [LABEL_ABOUT_US]: "About Us",
  [LABEL_TOS]: "Terms of Use",
  [LABEL_PRIVACY_POLICY]: "Privacy and Policy",
  [LABEL_FEEDBACK]: "Feedback",
  [LABEL_SUBMIT_CHANGE]: "Submit Change",
  [LABEL_USERNAME]: "Username",
  [LABEL_USERNAME_ENTER]: "Username",
  [LABEL_DISPLAYNAME]: "Display Name",
  [LABEL_DISPLAYNAME_ENTER]: "Display Name",
  [LABEL_EMAIL_ADDRESS]: "Email Address",
  [LABEL_EMAIL_ENTER]: "Email",
  [LABEL_PASSWORD_ENTER]: "Password",
  [LABEL_PASSWORD2_ENTER]: "Confirm Password",
  [LABEL_DELETE]: "Delete",
  [LABEL_EDIT]: "Edit",
  [LABEL_SELECT]: "Select",
  [LABEL_CANCEL]: "Cancel",
  [LABEL_CLONE]: "Clone",
  [LABEL_CLOSE]: "Close",
  [LABEL_RESET]: "Reset",
  [LABEL_RETURN]: "Return",
  [LABEL_SUBMIT_POST]: "Post",
  [LABEL_SUBMIT_REPOST]: "Repost",
  [LABEL_SUBMIT_COMMENT]: "Reply",

  [LABEL_HOME]: "Home",
  [LABEL_EXPLORE]: "Explore",
  [LABEL_NOTIFICATIONS]: "Notifications",
  [LABEL_MESSAGES]: "Messages",
  [LABEL_PROFILE]: "Profile",

  [TOPIC_BUG]: "Bug Report",
  [TOPIC_FEATURE]: "Feature Request",
  [TOPIC_USABILITY]: "Usability Suggestion",
  [TOPIC_INQUIRY]: "General Inquiry",
  [TOPIC_OTHER]: "Other Inquiry",

  [MSG_PASSWORD_OK]: "Password OK",
  [MSG_PASSWORD_NOT_VALID]: "Password not valid",
  [MSG_PASSWORD_NOT_MATCHED]: "Passwords do not match!",
  [MSG_NICKNAME_NOT_VALID]: "Nickname is missing or invalid!",
  [MSG_EMAIL_NOT_VALID]: "Email entered doesn't seem to be valid!",
  [MSG_EMAIL_NONE]: "Email is required",
  [MSG_INVITE_CODE_INVALID]: "Invalid Invitation Code",
  [MSG_INVITE_CODE_VERIFIED]: "Verified Invite Code",
  [MSG_USERNAME_EXISTS]: "Username exists already. Please choose another one.",
  [MSG_USERNAME_AVAILABLE]: "Username is available!",
  [MSG_USERNAME_CHECK_ERROR]: "Error checking username",
  [MSG_USERNAME_NOT_VALID]: "Username contains invalid characters or too short",
  [MSG_CREATE_POST_LABEL]: "What's On Your Mind?",
};

export const AppMessages_zh = {
  [LABEL_HOME]: "首页",
  [LABEL_EXPLORE]: "浏览",
  [LABEL_NOTIFICATIONS]: "通知",
  [LABEL_MESSAGES]: "消息",
  [LABEL_PROFILE]: "个人页面",
};

export const AppMessages_tw = {
  [LABEL_HOME]: "首頁",
  [LABEL_EXPLORE]: "瀏覽",
  [LABEL_NOTIFICATIONS]: "通知",
  [LABEL_MESSAGES]: "消息",
  [LABEL_PROFILE]: "個人頁面",
};

export const AppMessages_ko = {
  [LABEL_EXPLORE]: "탐험하다",
  [LABEL_MESSAGES]: "메시지",
  [LABEL_PROFILE]: "프로필",
};

export const AppMessages_es = {
  [LABEL_HOME]: "página de inicio",
  [LABEL_EXPLORE]: "explorar",
  [LABEL_NOTIFICATIONS]: "notificaciones",
  [LABEL_MESSAGES]: "mensajes",
  [LABEL_PROFILE]: "perfil",
};

/**
 * Container to hold language text maps via a map
 */
export const AppMessages = {
  [LanguageCodes.ENGLISH]: AppMessages_en,
  [LanguageCodes.CHINESE_SIMPLIFIED]: AppMessages_zh,
  [LanguageCodes.CHINESE_TRADITIONAL]: AppMessages_tw,
  [LanguageCodes.KOREAN]: AppMessages_ko,
  [LanguageCodes.SPANISH]: AppMessages_es,
};

/**
 * Official list of supported languages. This will be shown in the
 * pulldown menu
 */
export const SupportedLanguageList = [
  {code: LanguageCodes.ENGLISH, name: "English", nativeName: "English"},
  /**
   * TODO: enable when the translation is available
   */
  {code: LanguageCodes.FRENCH, name: "French", nativeName: "français"},
  {code: LanguageCodes.SPANISH, name: "Spanish", nativeName: "Español"},
  {
    code: LanguageCodes.CHINESE_SIMPLIFIED,
    name: "Chinese (Simplified)",
    nativeName: "中文(简体)",
  },
  {
    code: LanguageCodes.CHINESE_TRADITIONAL,
    name: "Chinese (Traditional)",
    nativeName: "中文(繁體)",
  },
  {code: LanguageCodes.JAPANESE, name: "Japanese", nativeName: "日本語"},
  // {code: LanguageCodes.GERMAN, name: "German", nativeName: "Deutsche"},
  {code: LanguageCodes.KOREAN, name: "Korean", nativeName: "한국어"},
];

export default AppMessages;
