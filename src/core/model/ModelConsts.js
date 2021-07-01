
// Global Model Constants
//
// Note while server side supports ES6 class properties, the client
// side (CRA 2.0 + babel) does not have it enabled. Hence we have the
// constants and then the "get" methods act as constants within exportable
// grouping (class).
//

// -------------------------- SYSTEM GLOBALS -------------------------

// Set to 'true' to limit features for regular users
// See DISABLE_FEATURES_USER below
export const LIMIT_USER_FEATURES = false;

export const EMAIL_DOMAIN = 'getter.buzz';

export const CACHE_LIST_NO_ITEMS = '-!n0ne$-';

// -------------------------- HARDCODED USERS -------------------------


export const USERID_ADMIN_SYS = '_sysadm_';
export const USERID_ADMIN_ACCT = 'acct_svc';
export const USERID_ADMIN_APP = 'getter_admin';
export const USERID_ADMIN_BYPASS = 'bypass_admin';

export const USERID_GUEST = '_guest';
export const USERID_ROBOT = '_bot';
export const USERID_TEMP = '_tmp';
export const USERID_NONE = '_none';

export const NICKNAME_GUEST = 'Guest';

export const TOKEN_GUEST = 'D032EF1093C3AD902A29EE';
export const TOKEN_ROBOT = '209A0D8AE39300178B81D1';
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{5,15}$/;

// ---------------------- HARDCODED TOPIC CATEGORIES -------------------

export const CATEGORY_POLITICS = 'politics';
export const CATEGORY_ECONOMY = 'economy';
export const CATEGORY_WHISTLE_BLOWER_MOVEMENT = 'whistleblower';
export const CATEGORY_NEWS = 'news';
export const CATEGORY_ENTERTAINMENT = 'entertainment';

export const TOPIC_CATEGORIES = [
  CATEGORY_POLITICS, CATEGORY_NEWS, CATEGORY_ENTERTAINMENT, CATEGORY_WHISTLE_BLOWER_MOVEMENT
];

// -------------------------- MODEL TYPE NAMES -------------------------

const TYPE_ACTIVITY_LOG = 'act_log';
const TYPE_BINARY = 'bin';
const TYPE_CONTRIB_STATS = 's_contrib';
const TYPE_COMMENT = 'cmt';
const TYPE_COMMENT_STATS = 's_cmst';
const TYPE_COMMENT_FEED = 'cmfd';
const TYPE_COMMENT_INFO = 'cinf';
const TYPE_COMMENT_ITEM = 'cmti';
const TYPE_CONTEXT = 'ctx';
const TYPE_GLOBAL_CONFIG_PROP = 'gcp';
const TYPE_ENCRYPTED = 'enc';
const TYPE_FACEBOOK_CRED = 'fbcrd';
const TYPE_FOLLOWS = 'fws';
const TYPE_FOLLOW = 'flw';
const TYPE_BLOCKS = 'blks';
const TYPE_MUTES = 'mts';
const TYPE_FOLLOWERS = 'fwr';
const TYPE_HASHTAGINFO = 'htinfo';
const TYPE_LIKES = 'lks';
const TYPE_LIKED = 'lkd';
const TYPE_LIKE_COMMENT = 'lkc';
const TYPE_LIKES_COMMENT = 'lkscm';
const TYPE_LIKED_COMMENT = 'lkdcm';
const TYPE_LIKE_POST = 'lkp';
const TYPE_LIKES_POST = 'lks_post';
const TYPE_LIKED_POST = 'lkd_post';
const TYPE_NEWS_FEED = 'nfeed';
const TYPE_NEWS_ITEM = 'nfi';
const TYPE_NOTIFICATION = 'notif';
const TYPE_POST = 'post';
const TYPE_POST_STATS = 's_pst';
const TYPE_POST_ITEM = 'psti';
const TYPE_POST_FEED = 'pstfd';
const TYPE_POST_INFO = 'pinf';
const TYPE_ROLE_DEFINITION = 'rdef';
const TYPE_REACTION = 'rct';
const TYPE_RENDER_STYLE = 'rdstyle';
const TYPE_SHARED = 'shrd';
const TYPE_SHARE_POST = 'shrp';
const TYPE_SHARED_POST = 'shrdpst';
const TYPE_SHARE_COMMENT = 'shrc';
const TYPE_SHARED_COMMENT = 'shrdcm';
const TYPE_SHARES = 'shrs';
const TYPE_SHARES_POST = 'shrspst';
const TYPE_SHARES_COMMENT = 'shrscm';
const TYPE_SOCIAL_INDEXABLE = 'socobj';
const TYPE_USER = 'u';
const TYPE_USER_STATS = 's_user';
const TYPE_USER_ALERT = 'ualrt';
const TYPE_USER_ALERTS = 'ualrts';
const TYPE_USER_AUTH = 'ua';
const TYPE_USER_CONFIRM = 'ucfm';
const TYPE_USER_FEEDBACK = 'fbk';
const TYPE_USER_REQUEST = 'ureq';
const TYPE_USER_INFO = 'uinf';
const TYPE_WATCHES = 'watches';
const TYPE_WATCHED = 'watched';
const TYPE_WATCHES_COMMENT = 'wscm';
const TYPE_WATCHED_COMMENT = 'wdcm';
const TYPE_WATCH_COMMENT = 'wcm';
const TYPE_WATCHES_POST = 'wspst';
const TYPE_WATCHED_POST = 'wdpst';
const TYPE_WATCH_POST = 'wpst';
const TYPE_XMLIST = 'xmlst';
const TYPE_XRESULT_LIST = 'rslst';
const TYPE_XRESULT_MAP = 'rsmap';
const TYPE_XDIFF = 'df';
const TYPE_XDEEPDIFF = 'ddf';
const TYPE_XERROR = 'xerr';
const TYPE_XOBJECT = 'xobj';
const TYPE_XMOBJECT = 'xmobj';
const TYPE_XTEXT = 'xtxt';
const TYPE_VARDATA = 'vdta';
const TYPE_ADMIN_USER = 'admusr';
const TYPE_SYSCONFIG = 'sysconf';

/**
 * Type constants for all registered model objects grouped
 * for simple single export
 */
export class ModelType {
  static get ACTIVITY_LOG() { return TYPE_ACTIVITY_LOG; }
  static get BINARY() { return TYPE_BINARY; }
  static get CONTRIB_STATS() { return TYPE_CONTRIB_STATS; }
  static get COMMENT() { return TYPE_COMMENT; }
  static get COMMENT_FEED() { return TYPE_COMMENT_FEED; }
  static get COMMENT_INFO() { return TYPE_COMMENT_INFO; }
  static get COMMENT_ITEM() { return TYPE_COMMENT_ITEM; }
  static get COMMENT_STATS() { return TYPE_COMMENT_STATS; }
  static get CONTEXT() { return TYPE_CONTEXT; }
  static get GLOBAL_CONFIG_PROP() { return TYPE_GLOBAL_CONFIG_PROP; }
  static get ENCRYPTED() { return TYPE_ENCRYPTED; }
  static get FACEBOOK_CRED() { return TYPE_FACEBOOK_CRED; }
  static get FOLLOW() { return TYPE_FOLLOW; }
  static get FOLLOWS() { return TYPE_FOLLOWS; }
  static get BLOCKS() { return TYPE_BLOCKS; }
  static get MUTES() { return TYPE_MUTES; }
  static get FOLLOWERS() { return TYPE_FOLLOWERS; }
  static get HASHTAGINFO() { return TYPE_HASHTAGINFO; }
  static get LIKES() { return TYPE_LIKES; }
  static get LIKED() { return TYPE_LIKED; }
  static get LIKE_COMMENT() { return TYPE_LIKE_COMMENT; }
  static get LIKES_COMMENT() { return TYPE_LIKES_COMMENT; }
  static get LIKED_COMMENT() { return TYPE_LIKED_COMMENT; }
  static get LIKE_POST() { return TYPE_LIKE_POST; }
  static get LIKES_POST() { return TYPE_LIKES_POST; }
  static get LIKED_POST() { return TYPE_LIKED_POST; }
  static get NEWS_FEED() { return TYPE_NEWS_FEED; }
  static get NEWS_ITEM() { return TYPE_NEWS_ITEM; }
  static get NOTIFICATION() { return TYPE_NOTIFICATION; }
  static get POST() { return TYPE_POST; }
  static get POST_FEED() { return TYPE_POST_FEED; }
  static get POST_INFO() { return TYPE_POST_INFO; }
  static get POST_ITEM() { return TYPE_POST_ITEM; }
  static get POST_STATS() { return TYPE_POST_STATS; }
  static get ROLE_DEFINITION() { return TYPE_ROLE_DEFINITION; }
  static get SOCIAL_INDEXABLE() { return TYPE_SOCIAL_INDEXABLE; }
  static get REACTION() { return TYPE_REACTION; }
  static get RENDER_STYLE() { return TYPE_RENDER_STYLE; }
  static get SHARED() { return TYPE_SHARED; }
  static get SHARE_POST() { return TYPE_SHARE_POST; }
  static get SHARED_POST() { return TYPE_SHARED_POST; }
  static get SHARE_COMMENT() { return TYPE_SHARE_COMMENT; }
  static get SHARED_COMMENT() { return TYPE_SHARED_COMMENT; }
  static get SHARES() { return TYPE_SHARES; }
  static get SHARES_POST() { return TYPE_SHARES_POST; }
  static get SHARES_COMMENT() { return TYPE_SHARES_COMMENT; }
  static get USER() { return TYPE_USER; }
  static get USER_STATS() { return TYPE_USER_STATS; }
  static get USER_ALERT() { return TYPE_USER_ALERT; }
  static get USER_ALERTS() { return TYPE_USER_ALERTS; }
  static get USER_AUTH() { return TYPE_USER_AUTH; }
  static get USER_CONFIRM() { return TYPE_USER_CONFIRM; }
  static get USER_FEEDBACK() { return TYPE_USER_FEEDBACK; }
  static get USER_REQUEST() { return TYPE_USER_REQUEST; }
  static get USER_INFO() { return TYPE_USER_INFO; }
  static get WATCHES() { return TYPE_WATCHES; }
  static get WATCHED() { return TYPE_WATCHED; }
  static get WATCHES_COMMENT() { return TYPE_WATCHES_COMMENT; }
  static get WATCHED_COMMENT() { return TYPE_WATCHED_COMMENT; }
  static get WATCH_COMMENT() { return TYPE_WATCH_COMMENT; }
  static get WATCHES_POST() { return TYPE_WATCHES_POST; }
  static get WATCHED_POST() { return TYPE_WATCHED_POST; }
  static get WATCH_POST() { return TYPE_WATCH_POST; }
  static get XMLIST() { return TYPE_XMLIST; }
  static get XRESULT_LIST() { return TYPE_XRESULT_LIST; }
  static get XRESULT_MAP() { return TYPE_XRESULT_MAP; }
  static get XDIFF() { return TYPE_XDIFF; }
  static get XDEEPDIFF() { return TYPE_XDEEPDIFF; }
  static get XERROR() { return TYPE_XERROR; }
  static get XMOBJECT() { return TYPE_XMOBJECT; }
  static get XOBJECT() { return TYPE_XOBJECT; }
  static get XTEXT() { return TYPE_XTEXT; }
  static get VARDATA() { return TYPE_VARDATA; }
  static get ADMIN_USER() { return TYPE_ADMIN_USER; }
  static get SYSCONFIG() { return TYPE_SYSCONFIG; }
}

export class ObjectType extends ModelType {

  static get INFO_HELP() { return 'help'; }
  static get INFO_TOS_USER() { return 'tos_user'; }
  static get INFO_TOS_PUBLIC() { return 'tos_public'; }
  static get INFO_PRIVACY_PUBLIC() { return 'privacy_public'; }
  static get INFO_DMCA_NOTICE() { return 'dmca_notice'; }
  static get INFO_USER_GUIDELINES() { return 'user_guidelines'; }
  static get INFO_LEGAL_GUIDELINES() { return 'legal_guidelines'; }
  static get INFO_ABOUT_US() { return 'about_us'; }
  static get SURVEY_FEEDBACK() { return 'feedback'; }
  static get MYACCOUNT() { return 'myaccount'; }
  static get HOMEPAGE() { return 'homepage'; }
}

// --------------- MODEL FOLDER/COLLECTION NAMES -----------------------

const FOLDER_ACTIVITY_LOG = 'act_log';
const FOLDER_BINARY_DATA = 'binary';
const FOLDER_COMMENT = 'cm';
const FOLDER_COMMENT_STATS = 'cm_stats';
const FOLDER_CONTRIB_STATS = 'contrib_stats';
const FOLDER_ENCRYPTED_DATA = 'enc';
const FOLDER_FACEBOOK_CRED = 'fbcred';
const FOLDER_FOLLOW = 'follow';
const FOLDER_FOLLOWS = 'follows';
const FOLDER_FOLLOWERS = 'followers';
const FOLDER_LIKE_COMMENT = 'cm_like';
const FOLDER_LIKES_COMMENT = 'cm_likes';
const FOLDER_LIKED_COMMENT = 'cm_liked';
const FOLDER_LIKE_POST = 'post_like';
const FOLDER_LIKES_POST = 'post_likes';
const FOLDER_LIKED_POST = 'post_liked';
const FOLDER_NEWS_ITEM = 'news_items';
const FOLDER_NOT_APPLICABLE = '_na';
const FOLDER_NOTIFICATION = 'notif';
const FOLDER_POST = 'post';
const FOLDER_POSTED_ITEM = 'posted_items';
const FOLDER_POST_STATS = 'post_stats';
const FOLDER_SHARE_POST = 'post_share';
const FOLDER_SHARED = 'shared'; // should not be used
const FOLDER_SHARED_POST = 'post_shared';
const FOLDER_SHARE_COMMENT = 'cm_share';
const FOLDER_SHARED_COMMENT = 'cm_shared';
const FOLDER_SHARES = 'shares'; // should not be used
const FOLDER_SHARES_POST = 'post_shares';
const FOLDER_SHARES_COMMENT = 'cm_shares';
const FOLDER_USER = 'user';
const FOLDER_USER_STATS = 'user_stats';
const FOLDER_USER_AUTH = 'user_auth';
const FOLDER_USER_CONFIRM = 'uconfirm';
const FOLDER_USER_FEEDBACK = 'feedback';
const FOLDER_USER_REQUEST = 'urequest';
const FOLDER_WATCH_COMMENT = 'cm_watch';
const FOLDER_WATCHES_COMMENT = 'cm_watches';
const FOLDER_WATCHED_COMMENT = 'cm_watched';
const FOLDER_WATCH_POST = 'post_watch';
const FOLDER_WATCHES_POST = 'post_watches';
const FOLDER_WATCHED_POST = 'post_watched';

/**
 * Type constants for all registered model objects grouped
 * for simple single export
 */
export class ModelFolder {
  static get NONE() { return null; }
  static get ACTIVITY_LOG() { return FOLDER_ACTIVITY_LOG; }
  static get BINARY_DATA() { return FOLDER_BINARY_DATA; }
  static get COMMENT() { return FOLDER_COMMENT; }
  static get COMMENT_STATS() { return FOLDER_COMMENT_STATS; }
  static get CONTRIB_STATS() { return FOLDER_CONTRIB_STATS; }
  static get ENCRYPTED_DATA() { return FOLDER_ENCRYPTED_DATA; }
  static get FACEBOOK_CRED() { return FOLDER_FACEBOOK_CRED; }
  static get FOLLOW() { return FOLDER_FOLLOW; }
  static get FOLLOWS() { return FOLDER_FOLLOWS; }
  static get FOLLOWERS() { return FOLDER_FOLLOWERS; }
  static get LIKE_COMMENT() { return FOLDER_LIKE_COMMENT; }
  static get LIKES_COMMENT() { return FOLDER_LIKES_COMMENT; }
  static get LIKED_COMMENT() { return FOLDER_LIKED_COMMENT; }
  static get LIKE_POST() { return FOLDER_LIKE_POST; }
  static get LIKES_POST() { return FOLDER_LIKES_POST; }
  static get LIKED_POST() { return FOLDER_LIKED_POST; }
  static get NEWS_ITEM() { return FOLDER_NEWS_ITEM; }
  static get NOT_APPLICABLE() { return FOLDER_NOT_APPLICABLE; }
  static get NOTIFICATION() { return FOLDER_NOTIFICATION; }
  static get POST() { return FOLDER_POST; }
  static get POST_STATS() { return FOLDER_POST_STATS; }
  static get SHARED() { return FOLDER_SHARED; }
  static get SHARE_POST() { return FOLDER_SHARE_POST; }
  static get SHARED_POST() { return FOLDER_SHARED_POST; }
  static get SHARE_COMMENT() { return FOLDER_SHARE_COMMENT; }
  static get SHARED_COMMENT() { return FOLDER_SHARED_COMMENT; }
  static get SHARES() { return FOLDER_SHARES; }
  static get SHARES_POST() { return FOLDER_SHARES_POST; }
  static get SHARES_COMMENT() { return FOLDER_SHARES_COMMENT; }
  static get POST_ITEM() { return FOLDER_POSTED_ITEM; }
  static get USER() { return FOLDER_USER; }
  static get USER_AUTH() { return FOLDER_USER_AUTH; }
  static get USER_CONFIRM() { return FOLDER_USER_CONFIRM; }
  static get USER_FEEDBACK() { return FOLDER_USER_FEEDBACK; }
  static get USER_REQUEST() { return FOLDER_USER_REQUEST; }
  static get USER_STATS() { return FOLDER_USER_STATS; }
  static get WATCHES_COMMENT() { return FOLDER_WATCHES_COMMENT; }
  static get WATCHED_COMMENT() { return FOLDER_WATCHED_COMMENT; }
  static get WATCH_COMMENT() { return FOLDER_WATCH_COMMENT; }
  static get WATCHES_POST() { return FOLDER_WATCHES_POST; }
  static get WATCHED_POST() { return FOLDER_WATCHED_POST; }
  static get WATCH_POST() { return FOLDER_WATCH_POST; }
}


// --------------------- PROPERTY LABEL CONSTANTS ---------------------------

export const PROP_ID = '_id';
const PROP_CREATED_DATE = 'cdate';
const PROP_UPDATED_DATE = 'udate';
const PROP_EDITED_DATE = 'edate';
const PROP_DELETED_DATE = 'ddate';
const PROP_PUBLISHED_DATE = 'pdate';
const PROP_CONFIRMED_DATE = 'cfdate';
const PROP_COMPLETED_DATE = 'donedate';
// const PROP_EXPIRATION_DATE = "expdate";
const PROP_DATA_SOURCE = 'ds';

export const VISTYPE_PUBLIC = 'p';
export const VISTYPE_GROUP = 'g';
export const VISTYPE_PRIVATE = 'v';
export const VISTYPE_SUSPENDED = 's';
export const VISTYPE_DELETED = 'd';
export const VISTYPES = [
  VISTYPE_PUBLIC, VISTYPE_GROUP, VISTYPE_PRIVATE, VISTYPE_SUSPENDED, VISTYPE_DELETED,
];

export const VERSION_TITLE = 'vttl';
export const VERSION_PREVIOUS = 'vprev';
export const VERSION_NEXT = 'vnext';
export const VERSION_STATUS = 'ver';

export const VSTAT_WORKING = 'wrk';
export const VSTAT_FROZEN = 'frz';
export const VSTATUS_TYPES = [
  VSTAT_FROZEN,
];


export const ICON_URL = 'ico';
export const CONTENT_WWW_URL = 'www';
export const CONTENT_TEXT_URL = 'txt';
export const CONTENT_VIDEO_URL = 'vid';
export const CONTENT_AUDIO_URL = 'aud';
export const CONTENT_IMAGE_URL = 'img';
export const CONTENT_BGIMAGE_URL = 'bgimg'; // must be static image only
export const CONTENT_VIDEO_DURATION = 'vid_dur';
export const CONTENT_VIDEO_WIDTH = 'vid_wid';
export const CONTENT_VIDEO_HEIGHT = 'vid_hgt';
export const CONTENT_BGCOLOR = 'bgcolor'; // must be static image only
export const CONTENT_FGCOLOR = 'fgcolor'; // must be static image only

export const TAGPROP_REL = 'rel';
export const TAGPROP_WWW = 'www';

export const PREFIX_POST_ID = 'p';
export const PREFIX_COMMENT_ID = 'c';
export const PREFIX_ACTIVITYLOG_ID = 'a';

/**
 * XObject level property labels
 */
export class XObjectProps {
  static get ID() { return '_id'; }
  static get TYPE() { return '_t'; }
  static get PARENT() { return '_p'; }
  static get STYPE() { return 'serial'; }
  static get MAIN_DATA() { return 'data'; }
  static get AUX_DATA() { return 'aux'; }
  static get AUX_DATA_STATS() { return 'stats'; }
  static get AUX_TAGMAP() { return 'tagMap'; }

  static get SNAP_DATA() { return 'snap_data'; }
  static get SNAP_DATE() { return 'snap_ts'; }
  static get CREATED_DATE() { return PROP_CREATED_DATE; }
  static get UPDATED_DATE() { return PROP_UPDATED_DATE; }
  static get DELETED_DATE() { return PROP_DELETED_DATE; }
  static get EDITED_DATE() { return PROP_EDITED_DATE; }
  static get PUBLISHED_DATE() { return PROP_PUBLISHED_DATE; }
  static get EXPIRATION_DATE() { return 'exp_date'; }
  static get DATA_SOURCE() { return PROP_DATA_SOURCE; }
  static get VISIBILITY() { return 'vis'; }

  static get TITLE() { return 'ttl'; }
  static get DERIVED_TITLE() { return 'dttl'; }
  static get TITLE_FORMAT() { return 'ttlf'; }
  static get ORIG_TITLE() { return 'ottl'; }
  static get ORIG_LANG() { return 'olang'; }
  static get SUBTITLE() { return 'sttl'; }
  static get VERTITLE() { return 'vttl'; }
  static get DESC() { return 'dsc'; }
  static get ICON_URL() { return ICON_URL; }
  static get BGIMG_URL() { return 'bgimg'; }
  static get LOCATION() { return 'location'; }
  static get WEBSITE() { return 'website'; }
  static get BIRTHDATE() { return 'birthdate'; }

  static get WWW_URL() { return CONTENT_WWW_URL; }
  static get TEXT_URL() { return CONTENT_TEXT_URL; }
  static get VIDEO_URL() { return CONTENT_VIDEO_URL; }
  static get AUDIO_URL() { return CONTENT_AUDIO_URL; }
  static get IMAGE_URL() { return CONTENT_IMAGE_URL; }
  static get BGIMAGE_URL() { return CONTENT_BGIMAGE_URL; }
  static get VIDEO_DURATION() { return CONTENT_VIDEO_DURATION; }
  static get VIDEO_WIDTH() { return CONTENT_VIDEO_WIDTH; }
  static get VIDEO_HEIGHT() { return CONTENT_VIDEO_HEIGHT; }
  static get BGCOLOR() { return CONTENT_BGCOLOR; }
  static get FGCOLOR() { return CONTENT_FGCOLOR; }

  static get VISTYPE_PUBLIC() { return VISTYPE_PUBLIC; }
  static get VISTYPE_GROUP() { return VISTYPE_GROUP; }
  static get VISTYPE_PRIVATE() { return VISTYPE_PRIVATE; }
  static get VISTYPE_DELETED() { return VISTYPE_DELETED; }
  static get VISTYPES() { return VISTYPES; }

}

/**
 * XMObject level property labels
 */
export class XMObjectProps extends XObjectProps {

  static get OWNERID() { return PROP_OWNER_ID; }
  static get CREATORID() { return 'cid'; }
  static get BASED_ON() { return 'based'; }
  static get ACL() { return 'acl'; }

  static get TAGS() { return 'tags'; }
  static get MENTIONS() { return 'mentions'; }
  static get RELTAGS() { return 'rel'; }
  static get SRCTAGS() { return 'src'; }
  static get VAREXPRS() { return 'var'; }
  static get PINPOSTS() { return 'pinpsts'; }
  static get MAX_PINPOSTS() { return 5; }

  static get TAGPROP_REL() { return TAGPROP_REL; }

  static get VERSION_TITLE() { return VERSION_TITLE; }
  static get VERSION_PREV() { return VERSION_PREVIOUS; }
  static get VERSION_NEXT() { return VERSION_NEXT; }
  static get VERSION_STATUS() { return VERSION_STATUS; }
}

// ------------------ LANGUAGE CODE ---------------------------

export class LanguageCodes {
  static get DEFAULT() { return 'en'; }
  static get ENGLISH() { return 'en'; }
  static get CHINESE_SIMPLIFIED() { return 'zh'; }
  static get CHINESE_TRADITIONAL() { return 'tw'; }
  static get SPANISH() { return 'es'; }
  static get FRENCH() { return 'fr'; }
  static get GERMAN() { return 'gr'; }
  static get JAPANESE() { return 'ja'; }
  static get KOREAN() { return 'ko'; }
  // static get ARABIC() { return 'ar'; }
  // static get RUSSIAN() { return 'ru'; }

  static get CHINESE_ALL() { return ['zh', 'tw']; }
}


// -------------------- E-MAIL / SMS COMMUNICATIONS -----------------------

// Confirmation constants
export const CONFIRM_TYPE_EMAIL = 'email';
export const CONFIRM_TYPE_SMS = 'sms';
export const CONFIRM_TYPE_TOS = 'tos';
export const CONFIRM_TYPE_SYSTEM = 'sys';

const CONFIRM_TYPES = [CONFIRM_TYPE_EMAIL, CONFIRM_TYPE_SMS, CONFIRM_TYPE_TOS];
export const DEFAULT_CONFIRM_EXPIRATION = 60 * 10000; // unit is in millisecond

// Request constants
const REQUEST_TYPE_EMAIL = 'email';
const REQUEST_TYPE_SMS = 'sms';
const REQUEST_TYPE_PWDCHG = 'pwdchg';
const REQUEST_TYPE_SIGNUP = 'signup';
const REQUEST_TYPE_PWDRESET = 'pwdreset';
const REQUEST_TYPE_UPGRADE = 'upgrade';

const REQUEST_TYPES = [REQUEST_TYPE_EMAIL, REQUEST_TYPE_SMS, REQUEST_TYPE_PWDCHG,
  REQUEST_TYPE_SIGNUP, REQUEST_TYPE_PWDRESET, REQUEST_TYPE_UPGRADE];
export const DEFAULT_REQUEST_EXPIRATION = 60 * 10000; // unit is in millisecond

// ----------------------- FEATURE ACCESS -------------------------

export const FEATURE_SUBMIT_POST = 'spst';
export const FEATURE_REPLY_POST = 'scm1';
export const FEATURE_REPLY_COMMENT = 'scm2';
export const FEATURE_FOLLOW_USER = 'fw';
export const FEATURE_FOLLOWED_BY = 'fwb';
export const FEATURE_LIKE = 'lk';
export const FEATURE_REPOST = 'rpst';
export const FEATURE_VIEW_REPLY_POST = 'vcm1';
export const FEATURE_VIEW_REPLY_COMMENT = 'vcm2';

export const FEATURE_AUTO_FOLLOW = 'fea_autoflw';
export const FEATURE_REMOVE_POST = 'rm_post';
export const FEATURE_REMOVE_SUSPEND_USER = 'sp_user';

// System-wide enable/disabling of features by user levels.
// These are affected by LIMIT_USER_FEATURES defined at the top.

export const ENABLED_FEATURES_USER = [];
export const DISABLED_FEATURES_USER = LIMIT_USER_FEATURES ? [
  FEATURE_SUBMIT_POST, FEATURE_REPOST,
  FEATURE_FOLLOW_USER, FEATURE_FOLLOWED_BY
] : [];

export const ENABLED_FEATURES_INFLUENCER_L1 = [];
export const ENABLED_FEATURES_INFLUENCER_L2 = [];
export const ENABLED_FEATURES_INFLUENCER_L3 = [];
export const ENABLED_FEATURES_INFLUENCER_L4 = [];
export const ENABLED_FEATURES_INFLUENCER_L5 = [FEATURE_AUTO_FOLLOW];
export const DISABLED_FEATURES_INFLUENCER_L1 = [];
export const DISABLED_FEATURES_INFLUENCER_L2 = [];
export const DISABLED_FEATURES_INFLUENCER_L3 = [];
export const DISABLED_FEATURES_INFLUENCER_L4 = [];
export const DISABLED_FEATURES_INFLUENCER_L5 = [];

// Array of all enabled user features. This must map to user level from 0 - 5
export const ENABLED_FEATURES = [
  ENABLED_FEATURES_USER,
  ENABLED_FEATURES_INFLUENCER_L1,
  ENABLED_FEATURES_INFLUENCER_L2,
  ENABLED_FEATURES_INFLUENCER_L3,
  ENABLED_FEATURES_INFLUENCER_L4,
  ENABLED_FEATURES_INFLUENCER_L5
];

// Array of all disabled user features. This must map to user level from 0 - 5
export const DISABLED_FEATURES = [
  DISABLED_FEATURES_USER,
  DISABLED_FEATURES_INFLUENCER_L1,
  DISABLED_FEATURES_INFLUENCER_L2,
  DISABLED_FEATURES_INFLUENCER_L3,
  DISABLED_FEATURES_INFLUENCER_L4,
  DISABLED_FEATURES_INFLUENCER_L5
];


/**
 * Constants related to features
 */
export class FeatureConsts {

  static get LIKE() { return 'f_lk'; }
  static get FOLLOW_USER() { return 'f_fwu'; }
  static get WATCH_POST() { return 'f_pst'; }

}


/**
 * Properties for XMUser, XUserInfo, XAuthInfo, etc.
 */
export class UserProps extends XMObjectProps {
  /** match object's ID (_id) */
  static get USER_ID() { return PROP_ID; }
  static get USER_ID_GTV() { return 'gtvid'; }

  static get USER_STATS() { return 's_user'; }
  static get USER_BIO() { return 'bio'; }
  static get TOKEN() { return 'token'; }
  static get EMAIL() { return 'email'; }
  static get SMS() { return 'sms'; }
  static get FIRSTNAME() { return 'fname'; }
  static get LASTNAME() { return 'lname'; }
  static get NICKNAME() { return 'nickname'; }
  static get USERNAME() { return 'username'; }
  static get ORIG_USERNAME() { return 'ousername'; }
  static get JOINT_DATE() { return 'joint_date'; }
  static get RANK() { return 'rank'; }
  static get LANGUAGE() { return 'lang'; }
  static get SCORE() { return 'score'; }
  static get DEVICEID() { return 'deviceID'; }
  static get DIGEST() { return 'digest'; }
  static get BLOCK_LIST() { return SocialProps.BLOCKED; }
  static get MUTE_LIST() { return SocialProps.MUTED; }
  static get PREF_THEME() { return 'pref_theme'; }    // see THEME_*
  static get PREF_TOPICS() { return 'topics'; }
  static get TWT_FOLLOWS() { return 'twt_flw'; }
  static get TWT_FOLLOWED() { return 'twt_flg'; }
  static get PUBLIC_PROPS() { return [this.ID, this.NICKNAME, this.USERNAME, this.JOINT_DATE, this.USER_STATS, this.TWT_FOLLOWED, this.TWT_FOLLOWS]; }
  static get TEST_LOADER() { return 'backend/testloader'; }
  static get PRIVATE_PROPS() {
    return [this.TOKEN, this.EMAIL, this.SMS, this.FIRSTNAME, this.LASTNAME, this.RANK, this.LANGUAGE, this.SCORE, this.BLOCK_LIST, this.MUTE_LIST];
  }
  /**
   * DO NOT CHANGE THIS  PART WITHOUT DOUBLE CONFIRM WITH FRONT_END AND TESTING!!!!
   */
  static get USER_PROFILE_UPDATABLE_PROPS() {
    return [
      this.ICON_URL,
      this.BGIMG_URL,
      this.NICKNAME,
      this.DESC,
      this.LANGUAGE,
      this.LOCATION,
      this.WEBSITE,
      this.BIRTHDATE
    ];
  }

  static get USER_SIGNUP_UPDATABLE_PROPS() {
    return [
      this.USERNAME,
      this.ORIG_USERNAME,
      this.NICKNAME,
      this.EMAIL,
      this.LANGUAGE,
    ];
  }

  static get USER_SIGNUP_FROM_IMPORT_UPDATABLE_PROPS() {
    return this.USER_SIGNUP_UPDATABLE_PROPS.concat([
      this.ROLE_INFLUENCER,
      this.CREATED_DATE,
      this.UPDATED_DATE,
      this.STATUS,   // TODO: temporary will be removed in the next fix
      this.TWT_FOLLOWS,
      this.TWT_FOLLOWED
    ]);
  }

  static get USER_QUICK_SIGNUP_UPDATABLE_PROPS() {
    return this.USER_SIGNUP_UPDATABLE_PROPS.concat([
      this.DEVICEID,
      this.DIGEST
    ]);
  }

  static get USERINFO_FILL_FROM_USER_PROPS() {
    return [
      this.ID, this.TOKEN, this.NICKNAME,
      this.EMAIL, this.USERNAME, this.ORIG_USERNAME,
      this.DESC, this.TAGS, this.STATUS, this.PINPOSTS,
      this.CREATED_DATE, this.UPDATED_DATE, this.LANGUAGE, this.RANK, this.SCORE,
      this.ROLE_INFLUENCER,
      this.ICON_URL, this.BGIMG_URL, this.LOCATION, this.WEBSITE, this.BIRTHDATE,
      this.TWT_FOLLOWED, this.TWT_FOLLOWS,
      StatsProps.FOLLOWS, StatsProps.FOLLOWED, StatsProps.LIKES_POST, StatsProps.LIKES_COMMENT,
      StatsProps.SHARES_POST, StatsProps.VIEWS_FULL_POST,
    ];
  }

  static get USER_CREATE_FROM_USERINFO_PROPS() {
    return [
      this.ID, this.ICON_URL, this.TOKEN,
      this.EMAIL, this.NICKNAME,
      this.USERNAME, this.ORIG_USERNAME,
      this.DESC, this.TAGS, this.LANGUAGE,
      this.CREATED_DATE,
      this.ROLE_INFLUENCER,
      this.STATUS, this.RANK, this.SCORE,
      this.TWT_FOLLOWS, this.TWT_FOLLOWED
    ];
  }

  static get AUTH_GETTER() { return 'gt'; }
  static get AUTH_FACEBOOK() { return 'fb'; }
  static get AUTH_GOOGLE() { return 'gg'; }
  static get AUTH_TWITTER() { return 'tw'; }
  static get AUTH_OTHER() { return 'unknown'; }

  static get AUTH_INFO() { return 'auth_info'; }
  static get AUTH_PWD_ENC_OLD() { return 'fr_pwd'; }
  static get AUTH_PWD_ENC() { return 'pwd'; }
  static get AUTH_PWD_CLR() { return 'pwd'; }
  static get AUTH_PWD_CLR2() { return 'cpwd2'; }
  static get AUTH_PWD_HINT() { return 'pwd_hint'; }

  static get AUTH_FB_ID() { return 'fb_id'; }
  static get AUTH_FB_TOKEN() { return 'fb_token'; }
  static get AUTH_FB_ACCESS_EXP() { return 'fb_access_exp'; }
  static get FB_ICON_URL() { return 'fb_ico'; }
  static get FB_EMAIL() { return 'fb_email'; }
  static get FB_NICKNAME() { return 'fb_name'; }

  static get AUTH_TW_ID() { return 'tw_id'; }
  static get AUTH_TW_TOKEN() { return 'tw_token'; }
  static get AUTH_TW_TOKEN_EXP() { return 'twtoken_exp'; }

  static get AUTH_GOOGLE_ID() { return 'gg_id'; }
  static get AUTH_GOOGLE_TOKEN() { return 'gg_token'; }
  static get AUTH_GOOGLE_TOKEN_EXP() { return 'gg_token_exp'; }

  static get CONN_FOLLOWS_USERS() { return 'followsUsers'; }
  static get CONN_FOLLOWERS_USERS() { return 'followersUsers'; }

  static get CONFIRM_ACTION_TYPE() { return 'action'; }
  static get CONFIRM_ACTION_TARGET() { return 'target'; }
  static get CONFIRM_ACTION_SOURCE() { return 'source'; }
  static get CONFIRMED_DATE() { return PROP_CONFIRMED_DATE; }
  static get CONFIRM_EMAIL() { return CONFIRM_TYPE_EMAIL; }
  static get CONFIRM_SMS() { return CONFIRM_TYPE_SMS; }
  static get CONFIRM_SYSTEM() { return CONFIRM_TYPE_SYSTEM; }
  static get CONFIRM_TOS() { return CONFIRM_TYPE_TOS; }
  static get CONFIRM_TYPES() { return CONFIRM_TYPES; }

  static get NOTIF_NEWS() { return 'nf_news'; }
  static get NOTIF_USER_FOLLOWED() { return 'nf_ufol'; }
  static get NOTIF_POST_WATCHED() { return 'nf_pwd'; }
  static get NOTIF_POST_LIKED() { return 'nf_plkd'; }
  static get NOTIF_POST_SHARED() { return 'nf_pshr'; }
  static get NOTIF_POST_COMMENTED() { return 'nf_pcmd'; }

  static get PASSWORD_MIN_LENGTH() { return 4; }

  static get REQUEST_ACTION_TYPE() { return 'action'; }
  static get REQUEST_ACTION_TARGET() { return 'target'; }
  static get REQUEST_ACTION_SOURCE() { return 'source'; }
  static get COMPLETED_BY() { return 'doneby'; }
  static get COMPLETED_DATE() { return PROP_COMPLETED_DATE; }
  static get REQUEST_EMAIL() { return REQUEST_TYPE_EMAIL; }
  static get REQUEST_SMS() { return REQUEST_TYPE_SMS; }
  static get REQUEST_PWDCHG() { return REQUEST_TYPE_PWDCHG; }
  static get REQUEST_PWDRESET() { return REQUEST_TYPE_PWDRESET; }
  static get REQUEST_SIGNUP() { return REQUEST_TYPE_SIGNUP; }
  static get REQUEST_UPGRADE() { return REQUEST_TYPE_UPGRADE; }
  static get REQUEST_TYPES() { return REQUEST_TYPES; }


  static get APPUSER_ROLES() { return 'roles'; }
  static get ROLE_ROOT() { return 'root'; }
  static get ROLE_ADMIN() { return 'adm'; }
  static get ROLE_SYSADM() { return 'sysadm'; }
  static get ROLE_MODERATOR() { return 'mod'; }
  static get ROLE_INFLUENCER() { return 'infl'; }

  static get USER_UPDATABLE_ROLES() {
    return [
      this.ROLE_ROOT,
      this.ROLE_ADMIN,
      this.ROLE_SYSADM,
      this.ROLE_MODERATOR,
      this.ROLE_INFLUENCER,
    ];
  }

  static get PROP_INFLUENCER_LEVEL() { return 'lvl'; }

  static get INFLUENCER_LEVEL_NONE() { return 0; }
  static get INFLUENCER_LEVEL_MIN() { return 1; }
  static get INFLUENCER_LEVEL_MAX() { return 5; }

  static get FEATURE_GROUP_APP() { return 'fg_app'; }
  static get FEATURE_GROUP_APP_DISABLED() { return 'fg_app_disabled'; }
  static get FEATURE_PREVIEW() { return 'fea_preview'; }
  static get FEATURE_IMPORT_POST() { return 'fea_importp'; }
  static get FEATURE_IMPORT_USER() { return 'fea_importu'; }
  static get FEATURE_IMPORT_PROFILE() { return 'fea_importpf'; }

  static get FEATURE_GROUP_USER() { return 'fg_user'; }
  static get FEATURE_SUBMIT_POST() { 'submit_post'; }
  static get FEATURE_SUBMIT_COMMENT() { 'submit_cm'; }
  static get FEATURE_USER_FOLLOWS() { 'user_follows'; }
  static get FEATURE_USER_LIKES() { 'user_likes'; }
  static get FEATURE_USER_REPOST() { 'submit_repost'; }

  static get FEATURE_GROUP_SUPER_INFLUENCER() { return 'fg_superv'; }
  static get FEATURE_AUTO_FOLLOW() { return 'fea_autoflw'; }

  static get FEATURE_SUSPEND_USER() { return FEATURE_REMOVE_SUSPEND_USER; }

  static get USER_UPDATABLE_FEATURES() {
    return [
      this.FEATURE_IMPORT_USER,
      this.FEATURE_IMPORT_POST,
      this.FEATURE_SUBMIT_POST,
      this.FEATURE_SUBMIT_COMMENT,
      this.FEATURE_USER_FOLLOWS,
      this.FEATURE_USER_LIKES,
      this.FEATURE_USER_REPOST,
      this.FEATURE_AUTO_FOLLOW,
      this.FEATURE_IMPORT_PROFILE,
      this.FEATURE_SUSPEND_USER,
    ];
  }

  static get NICKNAME_GUEST() { return NICKNAME_GUEST; }
  static get NICKNAME_ROBOT() { return NICKNAME_GUEST; }

  static get SETTINGS_PROFILE() { return 'profile'; }
  static get SETTINGS_ACCOUNT() { return 'account'; }
  static get SETTINGS_FEEDS() { return 'feeds'; }
  static get SETTINGS_CONNECTIONS() { return 'conn'; }
  static get SETTINGS_NOTIFICATIONS() { return 'notif'; }
  static get SETTINGS_PRIVACY() { return 'privsec'; }
  static get SETTINGS_PREFERENCES() { return 'prefsec'; }
  static get SETTINGS_INTERESTS() { return 'prefintr'; }

  static get STATUS() { return 'status'; }
  static get STATUS_TS() { return 'ts_status'; }
  static get STATUS_QUICKSIGNUP() { return 'qs'; }
  static get STATUS_IMPORTED() { return 'ui'; }
  static get STATUS_UNVERIFIED() { return 'uv'; }
  static get STATUS_ACTIVE() { return 'a'; }
  static get STATUS_RESERVED() { return 'rv'; }
  static get STATUS_SUSPENDED() { return 's'; }
  static get STATUS_UNKNOWN() { return 'uk'; }
  static get STATUS_TYPES() {
    return [
      this.STATUS_QUICKSIGNUP,
      this.STATUS_UNVERIFIED,
      this.STATUS_ACTIVE,
      this.STATUS_SUSPENDED];
  }

  static get TOKEN_GUEST() { return TOKEN_GUEST; }
  static get TOKEN_ROBOT() { return TOKEN_ROBOT; }

  static get THEME_LITE() { return 'lite'; }
  static get THEME_DARK() { return 'dark'; }

  static get USERNAME_MIN_LENGTH() { return 5; }
  static get USERNAME_MAX_LENGTH() { return 15; }
  static get NICKNAME_MIN_LENGTH() { return 1; }
  static get NICKNAME_MAX_LENGTH() { return 50; }
  static get TAG_MAX_LENGTH() { return 50; }
  static get USERID_GUEST() { return USERID_GUEST; }
  static get USERID_ROBOT() { return USERID_ROBOT; }
  static get USERID_TEMP() { return USERID_TEMP; }
  static get USER_PASSWORD_LENGTH() { return 6; }

  static get VERIFIED_CONTACT() { return 'vc'; }
  static get VERIFIED_EMAIL_CFID() { return 'cfid_email'; }
  static get VERIFIED_SMS_CFID() { return 'cfid_sms'; }

  /**
   * Use USER_EDITABLE_PROPS instead to make it more generic
   */
  // static get PROFILE_UPDATE_FIELDS() {
  //   return [
  //     ICON_URL,
  //     'bgimg',
  //     'nickname',
  //     'dsc',
  //     'location',
  //     'website',
  //     'birthdate',
  //     'lang'
  //   ];
  // }
}

// ------------- ACTIVITY LOG / NOTIFICATION / ALERT MESSAGE / FEED -----------------

/**
 * Message type. Can be either notification,
 * initiator history, etc.
 */
const PROP_MSGTYPE = 'mtype';
const PROP_SORTBY = 'sortby';

export const API_TYPE_SYS = 'sys';
export const API_TYPE_USER = 'usr';
export const API_TYPE_API = 'api';
export const API_TYPE_SVC = 'svc';

const PROP_ACTION = 'action';
const PROP_ACTION_STATUS = 'status';
const PROP_ACTION_START_TS = 'ts_start';
const PROP_ACTION_STOP_TS = 'ts_stop';
const PROP_ACTIVITY_ID = '_id';
const PROP_DEPTH_LEVEL = 'depth';
const PROP_INITIATOR_ID = 'init_id';
const PROP_INITIATOR_LEVEL = 'init_lvl';
const PROP_HAS_MEDIA = 'media';
// const PROP_INVERSE_LOG_ID = "inv_id";
const PROP_LOGSRC = 'src';
const PROP_PARENT_LOG_ID = 'p_id';
const PROP_POST_ID = 'pstid';
const PROP_COMMENT_POST_ID = 'pid';
const PROP_IMPORT_POST_ID = 'ipid';
const PROP_PARENT_COMMENT_ID = 'pcid';
const PROP_ORIG_POST_ID = 'opid';
const PROP_ORIG_POST_OWNER_ID = 'opuid';
const PROP_OWNER_ID = 'uid';
const PROP_PARENT_OWNER_ID = 'puid';
const PROP_SRC_TYPE = 'src_type';
const PROP_SRC_ID = 'src_id';
const PROP_SRC_OWNER_ID = 'src_oid';
const PROP_SRC_OBJECT = 'src_obj';
const PROP_TGT_TYPE = 'tgt_type';
const PROP_TGT_ID = 'tgt_id';
const PROP_TGT_OWNER_ID = 'tgt_oid';
const PROP_TGT_OBJECT = 'tgt_obj';
const PROP_RPS_TYPE = 'rps_type';
const PROP_RPS_IDS = 'rpstIds';
const PROP_RPS_OWNER_IDS = 'rusrIds';
const PROP_USER_AGENT = 'agent';
const PROP_USER_HOST = 'user_host';
const PROP_API_NAME = 'api_name';
const PROP_API_TYPE = 'api_type';
const PROP_API_SPEC = 'api_spec';
const PROP_SVC_NAME = 'svc';
const PROP_API_ECODE = 'api_ecode';
const PROP_SVC_ECODE = 'svc_ecode';
const PROP_API_TIME = 'api_time';
const PROP_SVC_TIME = 'svc_time';

const PROP_SENDER_ID = 'sender_id';
const PROP_RECEIVER_ID = 'receiver_id';
const PROP_SENT_TS = 'sent_ts';
const PROP_SENT_MEDIUM = 'sent_method';
const PROP_READ_TS = 'read_ts';
const PROP_READ_MEDIUM = 'read_medium';
const PROP_ACTIVITY = 'activity';
const PROP_DONE_TS = 'done_ts';
const PROP_DONE_METHOD = 'done_method';

/**
 * Fields within XMActivityLog that are useful and
 * can be specified in message template and MERGED
 * as information rendered for users (e.g., notification)
 */
export const PROPS_ACTIVITY = [
  PROP_ACTION, PROP_INITIATOR_ID, PROP_INITIATOR_LEVEL, PROP_RECEIVER_ID,
  PROP_ACTION_START_TS, PROP_ACTION_STOP_TS,
  PROP_SRC_ID, PROP_SRC_TYPE, PROP_SRC_OWNER_ID,
  PROP_TGT_ID, PROP_TGT_TYPE, PROP_TGT_OWNER_ID,
  PROP_RPS_IDS, PROP_RPS_TYPE, PROP_RPS_OWNER_IDS,
  PROP_READ_TS, PROP_READ_MEDIUM,
  PROP_DONE_TS, PROP_DONE_METHOD,
];

export const MEDIUM_EMAIL = 'email';
export const MEDIUM_SMS = 'sms';
export const MEDIUM_APP = 'app';

export const MSGTYPE_NOTIFICATION = 'n';
export const MSGTYPE_HISTORICAL = 'h';

export const SORTTYPE_NEWEST = 'new';
export const SORTTYPE_RELEVT = 'rel';
export const SORTTYPE_HOTEST = 'hot';
export const SORTTYPE_OLDEST = 'old';
export const SORTTYPE_LIKED = 'mlk';
export const SORTTYPE_FOLLOWED = 'mfw';
export const SORT_TYPES = [
  SORTTYPE_NEWEST, SORTTYPE_HOTEST, SORTTYPE_OLDEST, SORTTYPE_LIKED, SORTTYPE_FOLLOWED,
];

/**
 * Properties from Activity log that is common for all types of
 * messages, emails, alerts, etc.
 */
const PROPS_COMMON = [
  PROP_ACTIVITY_ID,
  PROP_INITIATOR_ID,
  PROP_INITIATOR_LEVEL,
  PROP_SRC_ID,
  PROP_SRC_OWNER_ID,
  PROP_SRC_TYPE,
  PROP_ACTION,
  PROP_TGT_ID,
  PROP_TGT_OWNER_ID,
  PROP_TGT_TYPE,
  PROP_RPS_TYPE,
  PROP_RPS_IDS,
  PROP_RPS_OWNER_IDS,
  PROP_UPDATED_DATE,
  PROP_DEPTH_LEVEL,
  PROP_USER_HOST,
  PROP_POST_ID,
  PROP_ORIG_POST_ID,
];

/**
 * Properties from Activity log that is common for all types of
 * messages, emails, alerts, etc.
 */
const PROPS_CACHED = [
  PROP_ACTIVITY_ID,
  PROP_INITIATOR_ID,
  PROP_INITIATOR_LEVEL,
  PROP_SRC_ID,
  PROP_SRC_OWNER_ID,
  PROP_SRC_TYPE,
  PROP_ACTION,
  PROP_TGT_ID,
  PROP_TGT_OWNER_ID,
  PROP_TGT_TYPE,
  PROP_RPS_TYPE,
  PROP_RPS_IDS,
  PROP_RPS_OWNER_IDS,
  PROP_CREATED_DATE,
  PROP_UPDATED_DATE,
  PROP_POST_ID,
  PROP_OWNER_ID,
  PROP_ORIG_POST_ID,
  PROP_ORIG_POST_OWNER_ID,
  PROP_HAS_MEDIA,
];


export class MessageProps extends UserProps {
  static get VARDATA() { return 'vardata'; }
  static get VARMAP() { return 'var'; }
  static get COMPILED() { return 'compiled'; }

  /**
     * Message type: notification or historical
     */
  static get MSGTPL() { return PROP_MSGTYPE; }

  /**
     * Message type: notification or historical
     */
  static get MSGTYPE() { return PROP_MSGTYPE; }

  /**
     * Sort type for messages (see SORTTYPE_*)
     */
  static get SORTBY() { return PROP_SORTBY; }

  /**
     * Either web browser agent, mobile ID, or server ID?
     */
  static get USER_AGENT() { return PROP_USER_AGENT; }

  /**
     * Host that initated user action
     */
  static get USER_HOST() { return PROP_USER_HOST; }

  /**
     * user/system ID for the initiator of the message
     */
  static get INITIATOR_ID() { return PROP_INITIATOR_ID; }

  /**
   * user/system influence level for the initiator of the message
   */
  static get INITIATOR_LVL() { return PROP_INITIATOR_LEVEL; }

  static get ACTION() { return PROP_ACTION; }

  /**
     * Status of the action taken (TBD)
     */
  static get ACTION_STATUS() { return PROP_ACTION_STATUS; }

  /**
     * Timestamp of when the action was started.
     */
  static get ACTION_START_TS() { return PROP_ACTION_START_TS; }

  /**
     * Timestamp of when the action was completed.
     */
  static get ACTION_STOP_TS() { return PROP_ACTION_STOP_TS; }

  /**
     * Source of the action (actioner). It can be a user, a group, or a system agent.
     */
  static get LOGSRC() { return PROP_LOGSRC; }

  /**
     * ID of the activity log
     */
  static get ACTIVITY_ID() { return PROP_ACTIVITY_ID; }

  /**
     * ID of the parent activity log, if the object records sub-activity.
     */
  static get PARENT_LOG_ID() { return PROP_PARENT_LOG_ID; }

  /**
     * Frequently a user activity have two ends, and there
     * may be an activity generated from the other side, which
     * equates to an "inverse".
     */
  static get INVERSE_LOG_ID() { return 'inv_id'; }

  /**
     * Direct reference to a post to remove guessing game
     * on whether source or target object.
     */
  static get POST_ID() { return PROP_POST_ID; }

  /**
   * Direct reference to a post to remove guessing game
   * on whether source or target object.
   */
  static get COMMENT_POST_ID() { return PROP_COMMENT_POST_ID; }

  /**
   * Direct reference to an imported post to remove guessing game
   * on whether source or target object.
   */
  static get IMPORT_POST_ID() { return PROP_IMPORT_POST_ID; }

  /**
   * Direct reference to a post to remove guessing game
   * on whether source or target object.
   */
  static get PARENT_COMMENT_ID() { return PROP_PARENT_COMMENT_ID; }

  /**
   * Direct reference to a post to remove guessing game
   * on whether source or target object.
   */
  static get PARENT_OWNER_ID() { return PROP_PARENT_OWNER_ID; }

  /**
     * Tracking of the original post's ID if the post in
     * question is a "repost"
     */
  static get ORIG_POST_ID() { return PROP_ORIG_POST_ID; }

  /**
   * Tracking of the original post's ID if the post in
   * question is a "repost"
   */
  static get ORIG_POST_OWNER_ID() { return PROP_ORIG_POST_OWNER_ID; }

  /**
     * Source side of action's object type. This goes
     * along with the object id.
     * @see ~FIELD_SRC_ID
     */
  static get SRC_TYPE() { return PROP_SRC_TYPE; }

  static get HAS_MEDIA() { return PROP_HAS_MEDIA; }

  /**
     * Title of the source object. This is derived and require retrieval
     * of the actual object
     */
  static get SRC_TITLE() { return 'src_title'; }

  /**
     * Source object's owner ID. This is needed if the source
     * object is not a user, and require to lookup object's owner.
     */
  static get SRC_OWNER_ID() { return PROP_SRC_OWNER_ID; }

  /**
     * Source object's owner name. This is needed if the
     * source object is not a user, and require to lookup
     * object's owner and print the name.
     */
  static get SRC_OWNER_NAME() { return 'src_owner_name'; }

  /**
     * Source side of action's object id. This along
     * with the type allow us to retrieve the actual
     * data.
     * @see ~FIELD_SRC_TYPE
     */
  static get SRC_ID() { return PROP_SRC_ID; }

  static get SRC_OBJECT() { return PROP_SRC_ID; }

  /**
     * Target side of action's object type. This goes
     * along with the object id.
     * @see ~FIELD_TGT_ID
     *
     */
  static get TGT_TYPE() { return PROP_TGT_TYPE; }

  static get TGT_TITLE() { return 'tgt_title'; }

  static get TGT_OWNER_NAME() { return 'tgt_owner_name'; }

  static get TGT_OWNER_ID() { return PROP_TGT_OWNER_ID; }

  static get TGT_OBJECT() { return PROP_TGT_OBJECT; }

  /**
   * Repost side of action's object type. This goes
   * along with the object id.
   * @see ~FIELD_TGT_ID
   *
   */
  static get RPS_TYPE() { return PROP_RPS_TYPE; }

  static get RPS_OWNER_IDS() { return PROP_RPS_OWNER_IDS; }

  static get RPS_IDS() { return PROP_RPS_IDS; }

  /**
     * Target side of action's object id. This along
     * with the type allow us to retrieve the actual
     * data.
     * @see ~FIELD_TGT_TYPE
     */
  static get TGT_ID() { return PROP_TGT_ID; }

  static get SENDER_ID() { return PROP_SENDER_ID; }
  static get RECEIVER_ID() { return PROP_RECEIVER_ID; }
  static get SENT_TS() { return PROP_SENT_TS; }
  static get SENT_MEDIUM() { return PROP_SENT_MEDIUM; }
  static get READ_TS() { return PROP_READ_TS; }
  static get READ_MEDIUM() { return PROP_READ_MEDIUM; }
  static get DONE_TS() { return PROP_DONE_TS; }
  static get DONE_METHOD() { return PROP_DONE_METHOD; }

  static get API_NAME() { return PROP_API_NAME; }
  static get API_TYPE() { return PROP_API_TYPE; }
  static get API_SPEC() { return PROP_API_SPEC; }
  static get SVC_NAME() { return PROP_SVC_NAME; }
  static get API_ECODE() { return PROP_API_ECODE; }
  static get SVC_ECODE() { return PROP_SVC_ECODE; }
  static get API_TIME() { return PROP_API_TIME; }
  static get SVC_TIME() { return PROP_SVC_TIME; }

  static get ACTIVITY() { return PROP_ACTIVITY; }

  static get MEDIUM_EMAIL() { return MEDIUM_EMAIL; }
  static get MEDIUM_SMS() { return MEDIUM_SMS; }
  static get MEDIUM_APP() { return MEDIUM_APP; }

  static get MSGTYPE_NOTIFICATION() { return MSGTYPE_NOTIFICATION; }
  static get MSGTYPE_HISTORICAL() { return MSGTYPE_HISTORICAL; }

  /**
     * @return {string[]} all relevant PROP_* labels for XMActivity
     */
  static get PROPS_ACTIVITY() { return PROPS_ACTIVITY; }

  static get PROPS_COMMON() { return PROPS_COMMON; }
  static get PROPS_CACHED() { return PROPS_CACHED; }

  static get PROPS_DEPTH_LEVEL() { return PROP_DEPTH_LEVEL; }

  /**
     * @return {string[]} all sort types
     */
  static get SORT_TYPES() { return SORT_TYPES; }
  static get SORT_NEWEST() { return SORTTYPE_NEWEST; }
  static get SORT_RELEVT() { return SORTTYPE_RELEVT; }
  static get SORT_HOTEST() { return SORTTYPE_HOTEST; }
  static get SORT_OLDEST() { return SORTTYPE_OLDEST; }
  static get SORT_LIKED() { return SORTTYPE_LIKED; }
  static get SORT_FOLLOWED() { return SORTTYPE_FOLLOWED; }
} // class MessageProp


// --------------- ACTIVITY LOG TYPE / ACTION NAMES -----------------------

export const VIEW_OVERVIEW = 'overview';     // includes title, stats
export const VIEW_DETAILS = 'detail';      //
export const VIEW_HEADLINE = 'headline';     // headline (or mentions)
export const VIEW_ALL = 'all';          // view everything (listing items)
export const VIEW_INITIAL = 'initial';      // initial page (e.g., feed)
export const VIEW_NEXT = 'next';         // fetch next page
export const VIEW_PREVIOUS = 'prev';     // fetch previous page
export const VIEW_LAST = 'end';         // last / end page

export const INFOACCESS_OVERVIEW = 'overview';
export const INFOACCESS_DETAILS = 'detail';
export const INFOACCESS_HEADLINE = 'headline';
export const INFOACCESS_ALL = 'all';
export const INFOACCESS_INITIAL = 'initial';   // initial page (e.g., feed)
export const INFOACCESS_NEXT = 'next';         // fetch next
export const INFOACCESS_PREVIOUS = 'prev';     // fetch previous
export const INFOACCESS_LAST = 'end';          // last / end page

const ACTIVITY_LOGIN = 'login';
const ACTIVITY_LOGOUT = 'logout';
const ACTIVITY_SIGNUP = 'signup';

const ACTIVITY_FOLLOWS_USER = 'follows';
const ACTIVITY_FOLLOWEDBY_USER = 'followed_by';
const ACTIVITY_UNFOLLOWS_USER = 'unfollows';
const ACTIVITY_UNFOLLOWEDBY_USER = 'unfollowed_by';
const ACTIVITY_BLOCKS_USER = 'blocks';
const ACTIVITY_UNBLOCKS_USER = 'unblocks';
const ACTIVITY_MUTES_USER = 'mutes';
const ACTIVITY_UNMUTES_USER = 'unmutes';
const ACTIVITY_REPORTS_USER = 'reports_user';
const ACTIVITY_REPORTEDBY_USER = 'reported_by';
const ACTIVITY_REPORTS_POST = 'reports_post';

const ACTIVITY_LIKES_POST = 'likes_pst';
const ACTIVITY_POST_LIKEDBY = 'pst_liked_by';
const ACTIVITY_UNLIKES_POST = 'unlikes_pst';
const ACTIVITY_POST_UNLIKEDBY = 'pst_unliked_by';

const ACTIVITY_PIN_POST = 'pin_pst';
const ACTIVITY_UNPIN_POST = 'unpin_pst';
const ACTIVITY_POST_PINNEDBY = 'pst_pinned_by';
const ACTIVITY_POST_UNPINNEDBY = 'pst_unpinned_by';

const ACTIVITY_WATCHES_POST = 'watches_pst';
const ACTIVITY_WATCHED_POST = 'watched_pst_by';
const ACTIVITY_UNWATCHES_POST = 'unwatches_pst';
const ACTIVITY_UNWATCHED_POST = 'unwatched_pst';

const ACTIVITY_SHARES_POST = 'shares_pst';
const ACTIVITY_POST_SHAREDBY = 'pst_sharedby';
const ACTIVITY_UNSHARES_POST = 'unshares_pst';
const ACTIVITY_POST_UNSHAREDBY = 'pst_unsharedby';

const ACTIVITY_LIKES_COMMENT = 'likes_cm';
const ACTIVITY_COMMENT_LIKEDBY = 'cm_liked_by';
const ACTIVITY_UNLIKES_COMMENT = 'unlikes_cm';
const ACTIVITY_COMMENT_UNLIKEDBY = 'cm_unliked_by';

const ACTIVITY_WATCHES_COMMENT = 'watches_cm';
const ACTIVITY_WATCHED_COMMENT = 'watched_cm_by';
const ACTIVITY_UNWATCHES_COMMENT = 'unwatches_cm';
const ACTIVITY_UNWATCHED_COMMENT = 'unwatched_cm';

const ACTIVITY_SHARES_COMMENT = 'shares_cm';
const ACTIVITY_COMMENT_SHAREDBY = 'cm_sharedby';
const ACTIVITY_UNSHARES_COMMENT = 'unshares_cm';
const ACTIVITY_COMMENT_UNSHAREDBY = 'cm_unsharedby';

const ACTIVITY_API_GETRES = 'getres';

const ACTIVITY_USER_VIEW = 'usr_view';
const ACTIVITY_USER_VIEW_USER = 'view_user';
const ACTIVITY_USER_VIEW_HELP = 'view_help';
const ACTIVITY_USER_FEEDBACK = 'feedback';

const ACTIVITY_USER_MENTIONED_IN = 'usr_mentioned';

const ACTIVITY_USER_VIEW_POST = 'view_pst';
const ACTIVITY_USER_PUB_POST = 'pub_pst';
const ACTIVITY_POST_PUBLISHED = 'pub_pst_by';

const ACTIVITY_USER_VIEW_COMMENT = 'view_cm';
const ACTIVITY_USER_PUB_COMMENT = 'pub_cm';
const ACTIVITY_COMMENT_PUBLISHED = 'pub_cm_by';

const ACTIVITY_USER_VIEW_TIMELINE = 'view_tl';
const ACTIVITY_USER_VIEW_TIMELINE_TRENDS = 'view_tl_trends';
const ACTIVITY_USER_VIEW_USER_FEED = 'view_usr_feed';
const ACTIVITY_USER_VIEW_POST_FEED = 'view_pst_feed';
const ACTIVITY_USER_VIEW_POST_COMMENTS = 'view_pcm_feed';
const ACTIVITY_USER_VIEW_COMMENT_COMMENTS = 'view_ccm_feed';

const ACTIVITY_USER_VIEW_TOS = 'view_tos';
const ACTIVITY_USER_VIEW_PRIVACY = 'view_privacy';
const ACTIVITY_USER_VIEW_DMCA = 'view_dmca';
const ACTIVITY_USER_VIEW_USER_GUIDELINES = 'view_user_guidelines';
const ACTIVITY_USER_VIEW_LEGAL_GUIDELINES = 'view_legal_guidelines';
const ACTIVITY_USER_VIEW_ABOUTUS = 'view_aboutus';
const ACTIVITY_USER_VIEW_FEEDBACK = 'view_feedback';
const ACTIVITY_USER_VIEW_HOMEPAGE = 'view_homepage';
const ACTIVITY_USER_VIEW_MYACCOUNT = 'view_myaccount';

const ACTIVITY_USER_GET_CONF_PROPS = 'get_sysconf_props';
const ACTIVITY_SYS_SET_CONF_PROPS = 'set_sysconf_props';
const ACTIVITY_SUSPENDS_USER = 'suspends';
const ACTIVITY_SUSPENDEDBY_USER = 'suspended_by';

const ACTIVITY_ADD_ROLE = 'add_role';
const ACTIVITY_REMOVE_ROLE = 'remove_role';

/**
 * Grouping of all log type constants in a class for single export
 */
export class ActivityLogProps extends MessageProps {
  static get API_TYPE_SYS() { return API_TYPE_SYS; }
  static get API_TYPE_USER() { return API_TYPE_USER; }
  static get API_TYPE_API() { return API_TYPE_API; }
  static get API_TYPE_SVC() { return API_TYPE_SVC; }

  static get VIEW_OVERVIEW() { return VIEW_OVERVIEW; }
  static get VIEW_DETAILS() { return VIEW_DETAILS; }
  static get VIEW_HEADLINE() { return VIEW_HEADLINE; }
  static get VIEW_ALL() { return VIEW_ALL; }
  static get VIEW_INITIAL() { return VIEW_INITIAL; }
  static get VIEW_NEXT() { return VIEW_NEXT; }
  static get VIEW_PREVIOUS() { return VIEW_PREVIOUS; }
  static get VIEW_LAST() { return VIEW_LAST; }

  static get INFOACCESS_OVERVIEW() { return INFOACCESS_OVERVIEW; }
  static get INFOACCESS_DETAILS() { return INFOACCESS_DETAILS; }
  static get INFOACCESS_HEADLINE() { return INFOACCESS_HEADLINE; }
  static get INFOACCESS_ALL() { return INFOACCESS_ALL; }
  static get INFOACCESS_INITIAL() { return INFOACCESS_INITIAL; }
  static get INFOACCESS_NEXT() { return INFOACCESS_NEXT; }
  static get INFOACCESS_PREVIOUS() { return INFOACCESS_PREVIOUS; }
  static get INFOACCESS_LAST() { return INFOACCESS_LAST; }

  static get LOGIN() { return ACTIVITY_LOGIN; }
  static get LOGOUT() { return ACTIVITY_LOGOUT; }
  static get SIGNUP() { return ACTIVITY_SIGNUP; }

  static get FOLLOWS_USER() { return ACTIVITY_FOLLOWS_USER; }
  static get FOLLOWEDBY_USER() { return ACTIVITY_FOLLOWEDBY_USER; }
  static get UNFOLLOWS_USER() { return ACTIVITY_UNFOLLOWS_USER; }
  static get UNFOLLOWEDBY_USER() { return ACTIVITY_UNFOLLOWEDBY_USER; }
  static get BLOCKS_USER() { return ACTIVITY_BLOCKS_USER; }
  static get UNBLOCKS_USER() { return ACTIVITY_UNBLOCKS_USER; }
  static get MUTES_USER() { return ACTIVITY_MUTES_USER; }
  static get UNMUTES_USER() { return ACTIVITY_UNMUTES_USER; }
  static get REPORTS_USER() { return ACTIVITY_REPORTS_USER; }
  static get REPORTS_POST() { return ACTIVITY_REPORTS_POST; }
  static get REPORTEDBY_USER() { return ACTIVITY_REPORTEDBY_USER; }

  static get LIKES_POST() { return ACTIVITY_LIKES_POST; }
  static get POST_LIKEDBY() { return ACTIVITY_POST_LIKEDBY; }
  static get UNLIKES_POST() { return ACTIVITY_UNLIKES_POST; }
  static get POST_UNLIKEDBY() { return ACTIVITY_POST_UNLIKEDBY; }

  static get PIN_POST() { return ACTIVITY_PIN_POST; }
  static get UNPIN_POST() { return ACTIVITY_UNPIN_POST; }
  static get POST_PINNEDBY() { return ACTIVITY_POST_PINNEDBY; }
  static get POST_UNPINNEDBY() { return ACTIVITY_POST_UNPINNEDBY; }

  static get WATCHES_POST() { return ACTIVITY_WATCHES_POST; }
  static get WATCHED_POST() { return ACTIVITY_WATCHED_POST; }
  static get UNWATCHES_POST() { return ACTIVITY_UNWATCHES_POST; }
  static get UNWATCHED_POST() { return ACTIVITY_UNWATCHED_POST; }

  static get SHARES_POST() { return ACTIVITY_SHARES_POST; }
  static get POST_SHAREDBY() { return ACTIVITY_POST_SHAREDBY; }
  static get UNSHARES_POST() { return ACTIVITY_UNSHARES_POST; }
  static get POST_UNSHAREDBY() { return ACTIVITY_POST_UNSHAREDBY; }

  static get LIKES_COMMENT() { return ACTIVITY_LIKES_COMMENT; }
  static get COMMENT_LIKEDBY() { return ACTIVITY_COMMENT_LIKEDBY; }
  static get UNLIKES_COMMENT() { return ACTIVITY_UNLIKES_COMMENT; }
  static get COMMENT_UNLIKEDBY() { return ACTIVITY_COMMENT_UNLIKEDBY; }

  static get WATCHES_COMMENT() { return ACTIVITY_WATCHES_COMMENT; }
  static get WATCHED_COMMENT() { return ACTIVITY_WATCHED_COMMENT; }
  static get UNWATCHES_COMMENT() { return ACTIVITY_UNWATCHES_COMMENT; }
  static get UNWATCHED_COMMENT() { return ACTIVITY_UNWATCHED_COMMENT; }

  static get SHARES_COMMENT() { return ACTIVITY_SHARES_COMMENT; }
  static get COMMENT_SHAREDBY() { return ACTIVITY_COMMENT_SHAREDBY; }
  static get UNSHARES_COMMENT() { return ACTIVITY_UNSHARES_COMMENT; }
  static get COMMENT_UNSHAREDBY() { return ACTIVITY_COMMENT_UNSHAREDBY; }

  static get API_GETRES() { return ACTIVITY_API_GETRES; }
  static get USER_VIEW() { return ACTIVITY_USER_VIEW; }
  static get USER_VIEW_USER() { return ACTIVITY_USER_VIEW_USER; }
  static get USER_VIEW_HELP() { return ACTIVITY_USER_VIEW_HELP; }

  static get USER_VIEW_COMMENT() { return ACTIVITY_USER_VIEW_COMMENT; }
  static get USER_PUB_COMMENT() { return ACTIVITY_USER_PUB_COMMENT; }
  static get USER_UPDATES_COMMENT() { return 'updCm'; }
  static get USER_DELETES_COMMENT() { return 'delCmv'; }

  static get COMMENT_PUBLISHEDBY() { return ACTIVITY_COMMENT_PUBLISHED; }
  static get COMMENT_UPDATEDBY() { return 'updCmBy'; }
  static get COMMENT_DELETEDBY() { return 'delCmBy'; }

  static get USER_PUB_POST() { return ACTIVITY_USER_PUB_POST; }
  static get USER_UPDATES_POST() { return 'updPst'; }
  static get USER_DELETES_POST() { return 'delPstv'; }

  static get POST_PUBLISHEDBY() { return ACTIVITY_POST_PUBLISHED; }
  static get POST_UPDATEDBY() { return 'updPstBy'; }
  static get POST_DELETEDBY() { return 'delPstBy'; }

  static get USER_VIEW_TIMELINE() { return ACTIVITY_USER_VIEW_TIMELINE; }
  static get USER_VIEW_TIMELINE_TRENDS() { return ACTIVITY_USER_VIEW_TIMELINE_TRENDS; }
  static get USER_VIEW_USER_FEED() { return ACTIVITY_USER_VIEW_USER_FEED; }
  static get USER_VIEW_POST_FEED() { return ACTIVITY_USER_VIEW_POST_FEED; }
  static get USER_VIEW_POST() { return ACTIVITY_USER_VIEW_POST; }
  static get USER_VIEW_POST_COMMENTS() { return ACTIVITY_USER_VIEW_POST_COMMENTS; }
  static get USER_VIEW_COMMENT_COMMENTS() { return ACTIVITY_USER_VIEW_COMMENT_COMMENTS; }
  static get USER_VIEW_ABOUTUS() { return ACTIVITY_USER_VIEW_ABOUTUS; }
  static get USER_VIEW_TOS() { return ACTIVITY_USER_VIEW_TOS; }
  static get USER_VIEW_PRIVACY() { return ACTIVITY_USER_VIEW_PRIVACY; }
  static get USER_VIEW_DMCA() { return ACTIVITY_USER_VIEW_DMCA; }
  static get USER_VIEW_USER_GUIDELINES() { return ACTIVITY_USER_VIEW_USER_GUIDELINES; }
  static get USER_VIEW_LEGAL_GUIDELINES() { return ACTIVITY_USER_VIEW_LEGAL_GUIDELINES; }
  static get USER_VIEW_FEEDBACK() { return ACTIVITY_USER_VIEW_FEEDBACK; }
  static get USER_VIEW_HOMEPAGE() { return ACTIVITY_USER_VIEW_HOMEPAGE; }
  static get USER_VIEW_MYACCOUNT() { return ACTIVITY_USER_VIEW_MYACCOUNT; }
  static get USER_FEEDBACK() { return ACTIVITY_USER_FEEDBACK; }

  static get USER_MENTIONED_IN() { return ACTIVITY_USER_MENTIONED_IN; }

  static get USER_GET_CONF_PROPS() { return ACTIVITY_USER_GET_CONF_PROPS; }
  static get SYS_SET_CONF_PROPS() { return ACTIVITY_SYS_SET_CONF_PROPS; }
  static get SUSPENDS_USER() { return ACTIVITY_SUSPENDS_USER; }
  static get SUSPENDEDBY_USER() { return ACTIVITY_SUSPENDEDBY_USER; }
  static get ADD_ROLE() { return ACTIVITY_ADD_ROLE; }
  static get REMOVE_ROLE() { return ACTIVITY_REMOVE_ROLE; }
}

// --------------------- SOCIAL / CONNECTIONS  --------------------

export const PROP_LIKE = 'like';
export const PROP_SHARE = 'share';
export const PROP_WATCH = 'watch';
export const PROP_ACCEPTED = 'accepted';
export const PROP_PENDING = 'pending';
export const PROP_BLOCKED = 'blocked';
export const PROP_UNBLOCKED = 'unblocked';
export const PROP_MUTED = 'muted';
export const PROP_BLOCKFlAG = 'isBlocked';
export const PROP_MUTEFLAG = 'isMuted';
export const PROP_FLWFLAG = 'isFollowing';

export const STATUS_WATCHED = 'y';
export const STATUS_NOT_WATCHED = 'n';
export const STATUS_UNKNOWN = 'u';

export const STATUS_BLOCKED = 'y';
export const STATUS_MUTED = 'y';

/**
 * Properties for social connections.
 *
 * NOTE: currently properties for XMFollows/XMFollowers
 * are not moved here from their classes.
 */
export class SocialProps extends XObjectProps {

  static get LIKE() { return PROP_LIKE; }
  static get SHARE() { return PROP_SHARE; }
  static get WATCH() { return PROP_WATCH; }
  static get ACCEPTED() { return PROP_ACCEPTED; }
  static get PENDING() { return PROP_PENDING; }
  static get BLOCKED() { return PROP_BLOCKED; }
  static get UNBLOCKED() { return PROP_UNBLOCKED; }
  static get MUTED() { return PROP_MUTED; }
  static get BLOCKFLAG() { return PROP_BLOCKFlAG; }
  static get MUTEFLAG() { return PROP_MUTEFLAG; }
  static get FLWFLAG() { return PROP_FLWFLAG; }

  static get STATUS_WATCHED() { return STATUS_WATCHED; }
  static get STATUS_NOT_WATCHED() { return STATUS_NOT_WATCHED; }
  static get STATUS_UNKNOWN() { return STATUS_UNKNOWN; }

} // Class SocialProps


// ------------------ Stats --------------------


/**
 * Class that holds properties and utilities related to stats
 */
export class StatsProps extends XObjectProps {
  static get FOLLOWS() { return 'flw'; }
  static get FOLLOWED() { return 'flg'; }
  static get COMMENTS() { return 'cm'; }
  static get COMMENT_SHAREDBY() { return 'shbcm'; }
  static get LIKES_COMMENT() { return 'lkscm'; }
  static get LIKEDBY_COMMENT() { return 'lkbcm'; }
  static get LIKE_POST_EXTRA_STATUS() { return 'lkpstexst'; }
  static get LIKES_POST() { return 'lkspst'; }
  static get LIKEDBY_POST() { return 'lkbpst'; }
  static get TWT_LIKEDBY_POST() { return 'twt_lkbpst'; }
  static get LIKES_GIVEN() { return 'lksgiv'; }
  static get LIKES_RECEIVED() { return 'lksrcv'; }
  static get POSTED_COMMENT() { return 'pscm'; }
  static get POSTED_POST() { return 'pspst'; }
  static get REFERRED_USERS() { return 'rfus'; }
  static get SHARES_COMMENT() { return 'shscm'; }
  static get SHARES_POST() { return 'shspst'; }
  static get POST_SHAREDBY() { return 'shbpst'; }
  static get TWT_POST_SHAREDBY() { return 'twt_shbpst'; }
  static get VIEWS_FULL_COMMENT() { return 'vfcm'; }
  static get VIEWS_HEADLINE_COMMENT() { return 'vhcm'; }
  static get VIEWS_FULL_POST() { return 'vfpst'; }
  static get VIEWS_HEADLINE_POST() { return 'vhpst'; }
  static get VIEWS_FEED_POST() { return 'ifpst'; }
  static get VIEWS_SHARED_POST() { return 'vspst'; }
  static get VIEWS_FULL_USER() { return 'vfusr'; }
  static get VIEWS_HEADLINE_USER() { return 'vhusr'; }
  static get VIEWS_FEED_USER() { return 'ifusr'; }
  static get WATCHES_COMMENT() { return 'wscm'; }
  static get WATCHED_COMMENT() { return 'wbcm'; }
  static get WATCHES_POST() { return 'wspst'; }
  static get WATCHED_POST() { return 'wbpst'; }

  /**
   * Specify stats that can be recalculated based on data in DB.
   */
  static get REFRESHABLE_STATS() {
    return {
      [ModelFolder.USER_STATS]: [
        this.FOLLOWS,
        this.FOLLOWED,
        this.LIKES_POST,
        this.LIKES_COMMENT,
        this.SHARES_POST,
        this.SHARES_COMMENT,
      ],
      [ModelFolder.USER]: [
        this.FOLLOWS,
        this.FOLLOWED,
      ],
      [ModelFolder.POST_STATS]: [
        this.LIKEDBY_POST,
        this.COMMENTS,
        this.POST_SHAREDBY,
      ],
      [ModelFolder.COMMENT_STATS]: [
        this.LIKEDBY_COMMENT,
        this.COMMENTS,
        this.COMMENT_SHAREDBY,
      ],
    };
  }
}

export class UserStatsProps extends StatsProps {
  // static get SCORE() { return 'scr'; }
}


export class PostStatsProps extends StatsProps {
  static get POSTID() { return 'postId'; }
}

export class CommentStatsProps extends StatsProps {
  static get COMMENTID() { return 'commentId'; }

}

export default ModelType;
