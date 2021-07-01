import Util from './Util';
import {
  API_TYPE_API,
  API_TYPE_SVC,
  API_TYPE_SYS,
  API_TYPE_USER,
  XObjectProps
} from './model/ModelConsts';


// -------- Fetch parameters: Results inclusion
export const PARAM_INCL = 'incl';
export const INCL_POSTS = 'posts';
export const INCL_POSTSTATS = 'poststats';
export const INCL_USERINFO = 'userinfo';
export const INCL_USERSTATS = 'userstats';
export const INCL_COMMENTS = 'comments';
export const INCL_COMMENTSTATS = 'commentstats';
export const INCL_ALL_STATS = 'stats';
export const INCL_FOLLOWINGS = 'followings';
export const INCL_FOLLOWERS = 'followers';
export const INCL_HASHTAGS = '#';
export const INCL_HASHTAGINFO = 'htinfo';
export const INCL_USERTAGS = '@';
export const INCL_ALLPARENTS = 'parents';
export const INCL_LIKED = 'liked';
export const INCL_SHARED = 'shared';

// -------- Fetch parameters: Results exclusion
export const EXCL_DELETED = 'deleted';
export const EXCL_UNSHARED = 'unshared';
export const EXCL_UNLIKED = 'unliked';

// --------- Old Style (to be phased out)
export const INCL_STATS = 'incl_stats';
export const INCL_REFOBJS = 'incl_refobjs';
export const INCL_OBJ = 'incl_obj';
export const INCL_TAGINFO = 'catObjs';

// -------- Search parameters: search type
export const SEARCH_TYPE = 'stype';
export const SEARCH_TAGTAGS = 'tagtags';
export const SEARCH_MAINTAGS = 'intag';
export const SEARCH_KWDTAGS = 'kwdtags';
export const SEARCH_EXTENDED = 'x';
export const SEARCH_TYPE_VALUES = [SEARCH_TAGTAGS, SEARCH_MAINTAGS, SEARCH_KWDTAGS];

// --------- Filter parameters

export const FILTER_LANGUAGE_PREF = 'lang';
export const FILTER_TOPICS = 'topics';

// ---------- CRUD parameters ------------
export const NEW_VERSION = 'newver';
export const ALL_VERSIONS = 'allvers';
export const VISIBILITY = 'vis';

const OPTION_DELIM = '|';


/** Search tags and return all its associated tags */
// export const TAG2TAGS = "tag2tags";

/**
 * API utilities and declared Parameters used by
 * client side and processed on the server side
 */
class API {
  // static get ENTRY_TYPE_SYS() { return API_TYPE_SYS; }
  // static get ENTRY_TYPE_USER() { return API_TYPE_USER; }
  // static get ENTRY_TYPE_API() { return API_TYPE_API; }
  // static get ENTRY_TYPE_SVC() { return API_TYPE_SVC; }

  // General
  static get USERID() { return 'user_id'; }
  static get USERNAME() { return 'username'; }

  static get OPTION_DELIM() { return OPTION_DELIM; }
  static get PARAM_INCL() { return PARAM_INCL; }
  static get PARAM_CATEGORIES() { return 'cats'; }
  static get PARAM_FEEDPREFIX() { return 'fp'; }

  // Constants and access selectors for API calls
  // static get INCL_ALL_STATS() { return INCL_ALL_STATS; }
  static get INCL_STATS() { return INCL_ALL_STATS; }
  static get INCL_POSTS() { return INCL_POSTS; }
  static get INCL_POSTSTATS() { return INCL_POSTSTATS; }
  static get INCL_USERINFO() { return INCL_USERINFO; }
  static get INCL_USERSTATS() { return INCL_USERSTATS; }
  static get INCL_COMMENTS() { return INCL_COMMENTS; }
  static get INCL_COMMENTSTATS() { return INCL_COMMENTSTATS; }
  static get INCL_FOLLOWINGS() { return INCL_FOLLOWINGS; }
  static get INCL_FOLLOWERS() { return INCL_FOLLOWERS; }
  static get INCL_HASHTAGS() { return INCL_HASHTAGS; }
  static get INCL_HASHTAGINFO() { return INCL_HASHTAGINFO; }
  static get INCL_USERTAGS() { return INCL_USERTAGS; }
  static get INCL_ALLPARENTS() { return INCL_ALLPARENTS; }
  static get INCL_LIKED() { return INCL_LIKED; }
  static get INCL_SHARED() { return INCL_SHARED; }

  static get EXCL_DELETED() { return EXCL_DELETED; }
  static get EXCL_UNSHARED() { return EXCL_UNSHARED; }
  static get EXCL_UNLIKED() { return EXCL_UNLIKED; }

  static get INCL_REFOBJS() { return INCL_REFOBJS; }

  static get FILTER_LANGUAGE_PREF() { return FILTER_LANGUAGE_PREF; }
  static get FILTER_TOPICS() { return FILTER_TOPICS; }

  static get MAIN_DATA() { return XObjectProps.MAIN_DATA; }
  static get AUX_DATA() { return XObjectProps.AUX_DATA; }
  static get AUX_DATA_STATS() { return XObjectProps.AUX_DATA_STATS; }
  static get NEW_VERSION() { return NEW_VERSION; }
  static get ALL_VERSIONS() { return ALL_VERSIONS; }
  static get VISIBILITY() { return VISIBILITY; }
  static get SEARCH_MAINTAGS() { return SEARCH_MAINTAGS; }

  static get SORT_BY() { return 'sort'; }
  static get USER_ID() { return 'user_id'; }
  static get USER_IDS() { return 'user_ids'; }
  static get BATCH_SIZE() { return 'max'; }
  static get OFFSET() { return 'offset'; }
  static get MAX() { return 'max'; }
  static get START_TS() { return 'startts'; }
  static get END_TS() { return 'endts'; }
  static get DIRECTION() { return 'dir'; }
  static get DIRECTION_FORWARD() { return 'fwd'; }
  static get DIRECTION_REVERSE() { return 'rev'; }

  // Alerts related
  static get ALERT_IDS() { return 'alert_ids'; }
  static get READ_TS() { return 'read_ts'; }
  static get READ_MEDIUM() { return 'read_medium'; }
  static get DONE_TS() { return 'done_ts'; }
  static get DONE_METHOD() { return 'done_method'; }

  // Passwords
  static get CURRENT_PASSWORD() { return 'cur_pwd'; }
  static get NEW_PASSWORD() { return 'new_pwd'; }

  // --------------- PARAMETER RELATED UTILITIES ----------------------

  /**
   * Check options string and report if the given label is in that optons
   * string.
   *
   * @param {string} optionString
   * @param {string} label
   * @param {string} label2 secodnary label (just in case caller meant for HasOptions)
   * @return {boolean}
   */
  static HasOption(optionString, label, label2) {
    return Util.HasValueInValuesString(optionString, label, label2, OPTION_DELIM, true);
  }

  /**
   * Check option string for two possible labels, and reports on either
   * match
   *
   * @param {string} optionString
   * @param {string} label1
   * @param {string=} label2
   * @return {boolean}
   */
  static HasOptions(optionString, label1, label2) {
    return Util.HasValueInValuesString(optionString, label1, label2, OPTION_DELIM, true);
  }

  /**
   * Given options string 'v1|v2|v3', return ['v1', 'v2', 'v3]
   *
   * @param {string} optionString
   * @param {boolean} upperCase
   * @return {string[]}
   */
  static GetOptionsArray(optionString, upperCase = true) {
    return Util.GetValuesInValuesString(optionString, OPTION_DELIM, upperCase);
  }

  /**
   * Add an option label to existing option string. Will not add
   * duplicates.
   *
   * @param {string} optionString existing string, like 'opt1|opt2|opt3'
   * @param {string} label new label, like 'opt4'
   * @param {boolean} upperCase
   * @return {string} new option string result string like 'opt1|opt2|opt3|opt4'
   */
  static AddOption(optionString, label, upperCase = true) {
    return Util.AddValueToValuesString(optionString, label, OPTION_DELIM, upperCase);
  }

  /**
   * Create an option string based on array of options in indvidual strings
   *
   * @param {string[]} args individual string options to be concatenated
   * @return {string} all args delimited by |
   */
  static CreateOptions(args) {
    return args ? args.join(OPTION_DELIM) : '';
  }

  /**
   *
   * @param {string} optionString existing string, like 'opt1|opt2|opt3'
   * @param {string} label target option like 'opt2'
   * @param {boolean} upperCase
   * @return {string} result option string like 'opt1|opt3'
   */
  static RemoveOption(optionString, label, upperCase = true) {
    return Util.RemoveValueFromValuesString(optionString, label, OPTION_DELIM, upperCase);
  }

} // API


export default API;

