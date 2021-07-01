import * as moment from 'moment';
// import 'moment/locale/zh-cn';
// import 'moment/locale/zh-tw';
import 'moment/locale/es';
import 'moment/locale/ko';
import 'moment/locale/fr';
// import 'moment/locale/gr';
import 'moment/locale/ja';
import uuidv1 from 'uuid/v1';

// import JSON5 from "json5";
import EncryptorClass from 'simple-encryptor';

import { LanguageCodes, UserProps } from './model/ModelConsts';
import { PASS_INCL_NAME, PASS_BAD_CHARS, PASS_TOO_SHORT } from './ErrorConsts';
import { t } from 'src/i18n/utils';


const ENC_PWD = 'w';
const ENC_PWD_KEY = '$#@!2093k4qrlk43';

const ENC_STRING = '_s';
const ENC_STRING_KEY = 'LK!@!JE#Rd(-%#*@';

const ENC_INFO = 'i';
const ENC_INFO_KEY = 'A@#$34#@!905dfl4';
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 128;

const encryptors = {
  [ENC_PWD]: EncryptorClass(ENC_PWD_KEY),
  [ENC_STRING]: EncryptorClass(ENC_STRING_KEY),
  [ENC_INFO]: EncryptorClass(ENC_INFO_KEY),
};

// const _CLSNAME = "Util";

const REGEX_SPLIT2 = /.{1,2}/g;
const REGEX_SPLIT3 = /.{1,3}/g;

const UrlPattern = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/, 'i'); // fragment locator

const UrlMatchPattern = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/, 'gi'); // fragment locator
  
const UrlPattern_Original = new RegExp('^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

const UsernamePattern = new RegExp(/^[a-z0-9_]*$/);

const ReservedUsernames = [
  'twitter', 'getter', 'admin'
];

/**
 * Utility functions
 *
 */
class Util {

  /**
   *
   * @param {SystemConfig} config
   */
  static Initialize(config) {
    // Not used right now - these impact frontend as frontend will
    // need their own key configs
    // this.encPwdKey = config.getEncPwdKey();
    // this.encStringKey = config.getEncStringKey();
    // this.encInfoKey = config.getEncInfoKey();
  }

  /**
   * Generate an ID string based on UUID but without
   * the dashes
   *
   * @return {string}
   *
   */
  static GenUUID1() {
    let uuid = uuidv1();
    uuid = uuid.replace('-', '');
    uuid = uuid.replace('-', '');
    uuid = uuid.replace('-', '');
    uuid = uuid.replace('-', '');
    return uuid.toUpperCase();
  }


  /**
   *
   * @param {string} str
   */
  static IsValidURL(str) {
    const verdict = UrlPattern.test(str);
    console.log(`TEST: ${verdict} for URL: ${str}`);
    return verdict;
  }

  /**
   *
   * @param {string} str
   * @return {string[]} array of matched urls
   */
  static ExtractURLs(str) {
    return str ? str.match(UrlMatchPattern) : [];
  }

  /**
   * Encrypt the content using the key for password
   *
   * @param {string} text
   * @return {string} encrypted string
   */
  static EncryptPwd(text) {
    const encryptor = encryptors[ENC_PWD];
    // const encryptor = EncryptorClass(this.encPwdKey);
    return encryptor.encrypt(text);
  }

  /**
   * Decrypt the content using the key for password
   *
   * @param {string} encryptedStr
   * @return {string} text
   */
  static DecryptPwd(encryptedStr) {
    const encryptor = encryptors[ENC_PWD];
    // const encryptor = EncryptorClass(this.encPwdKey);
    return encryptor.decrypt(encryptedStr);
  }

  /**
   * Encrypt the content using the key for general string
   *
   * @param {string} text
   * @return {string} encrypted string
   */
  static EncryptText(text) {
    const encryptor = encryptors[ENC_STRING];
    // const encryptor = EncryptorClass(this.encStringKey);
    return encryptor.encrypt(text);
  }

  /**
   * Decrypt the content using the key for general string
   *
   * @param {string} encryptedStr
   * @return {string} text
   */
  static DecryptText(encryptedStr) {
    const encryptor = encryptors[ENC_STRING];
    // const encryptor = EncryptorClass(this.encStringKey);
    return encryptor.decrypt(encryptedStr);
  }

  /**
   * Encrypt the content using the key for info object
   *
   * @param {*} data can be JSON
   * @return {string} encrypted string
   */
  static EncryptJSON(data) {
    const encryptor = encryptors[ENC_INFO];
    // const encryptor = EncryptorClass(this.encInfoKey);
    return encryptor.encrypt(data);
  }

  /**
   * Decrypt the content using the key for info object
   *
   * @param {string} encryptedData
   * @return {{}} data as a string
   */
  static DecryptJSON(encryptedData) {
    const encryptor = encryptors[ENC_INFO];
    // const encryptor = EncryptorClass(this.encInfoKey);
    return encryptor.decrypt(encryptedData);
  }

  // ------------------- LANGUAGE UTILITIES -----------------------

  /**
   *
   * @param {string} lang
   * @return {boolean} true if language specified is one of the
   * chinese written languages (simplified or traditional)
   */
  static IsChinese(lang) {
    return LanguageCodes.CHINESE_ALL.includes(lang);
  }

  // -------------------- STRING UTILITIES -------------------------

  /**
   * Determine length of string. null means
   * zero length
   * @param {string=} s string
   * @param {boolean} trim true to trim first before checking for length
   * @return {number} 0 means empty or null
   */
  static StringLength(s, trim = false) {
    if (s == null) { return 0; }
    return (trim === true) ? s.trim().length : s.length;
  }

  /**
   * Pad string at the start if shorter than given length
   *
   * @param {*} s string to pad if shorter than length
   * @param {*} ch character to pad. default to space
   * @param {*} length pad if shorter than this length
   */
  static StringPadStart(s, ch = ' ', length = null) {
    if (length == null) {
      console.trace('PrePad: no length for:', s);
      return s;   // bad input
    }
    if (s == null) { s = ''; }
    return String(s).padStart(length, ch); // built-in function
  }

  /**
   * Insert a character/string every X number of characters
   * of the given string
   *
   * @param {string} s string to insert character
   * @param {string} ch character(s) to insert
   * @param {number} gap size of gap in character
   */
  static StringInsertDelim(s, ch, gap) {
    // not working
    const regex = new RegExp(`/.{1,${gap}/g`);
    const tokens = s.match(regex);
    return tokens ? tokens.join(ch) : s;
  }

  /**
   * Delimit an identifier into a (file) path of
   * two characters with padding  to a minimum
   * of 8 characters.
   *
   * @param {string} identifier
   * @return {string}
   */
  static FilePathDelim2_Min8(identifier) {
    const padded = Util.StringPadStart(identifier, '_', 8);
    const tokens = padded.match(REGEX_SPLIT2);
    return tokens ? tokens.join('/') : identifier;
  }

  /**
   * Delimit an identifier into a (file) path of
   * three characters and padding to 9 characters
   *
   * @param {string} identifier
   * @return {string}
   */
  static FilePathDelim3_Min9(identifier) {
    const padded = Util.StringPadStart(identifier, '_', 9);
    const tokens = padded.match(REGEX_SPLIT3);
    return tokens ? tokens.join('/') : identifier;
  }

  /**
   * Given a fully qualified file specification (path + filename),
   * return the path portion
   *
   * @param {string} fspec file path with file name, eg. /path/filename
   * @return {string} path portion, e.g., /path
   */
  static GetFilePathFromFileSpec(fspec) {
    if ((fspec == null) || (fspec.length === 1)) { return fspec; }

    const lastSlashIdx = fspec.lastIndexOf('/');
    return (lastSlashIdx) !== -1 ? fspec.substring(0, lastSlashIdx) : fspec;
  }

  /**
   * Given a fully qualified file specification (path + filename),
   * return the filename portion.
   *
   * @param {string} fspec file path with file name, eg. /path/filename
   * @return {string} filename portion, e.g., filename
   */
  static GetFilenameFromFileSpec(fspec) {
    if ((fspec == null) || (fspec.length === 1)) { return fspec; }

    const lastSlashIdx = fspec.lastIndexOf('/');
    if (lastSlashIdx === fspec.length) { return fspec; }   // last char is a slash!
    return (lastSlashIdx) !== -1 ? fspec.substring(lastSlashIdx + 1) : fspec;
  }

  /**
   * Return true if string is empty, which
   * includes null.
   *
   * @param {string=} s string or null
   * @param {boolean} trim true to trim first before checking for length
   * @return {boolean} true if string is empty or null
   */
  static StringIsEmpty(s, trim = false, nullIsEmpty = true) {
    if (s == null && (nullIsEmpty === false)) { return false; }
    return this.StringLength(s, trim) === 0;
  }

  /**
   * Return if the given value is either null or undefined.
   *
   * @param {*} v any value
   * @return {boolean} true if value is either null or undefined.
   *
   * @see ~NotNull
   */
  static IsNull(v) {
    return (v === null) || (v === undefined);
  }

  /**
   * Check if value is not null or not undefined
   *
   * @param {*} v
   * @return {boolean} true if value is not null or undefined
   *
   * @see ~IsNull
   */
  static NotNull(v) {
    return (v !== null) && (v !== undefined);
  }

  /**
   *
   * @param {*} s
   * @return {boolean} true if string type
   */
  static IsString(s) {
    return typeof s === 'string';
  }

  /**
   *
   * @param {*} s1
   * @param {*} s2
   * @param {boolean=} ignoreCase
   * @param {boolean=} nullIsEmpty
   * @param {boolean=} trim
   * @return {boolean}
   */
  static StringEquals(s1, s2, ignoreCase = true, nullIsEmpty = false, trim = false) {
    if (trim === true) {
      s1 = (Util.NotNull(s1)) ? String(s1).trim() : null;
      s2 = (Util.NotNull(s2)) ? String(s2).trim() : null;
    }
    if (nullIsEmpty === true) {
      if (s1 && s1.length === 0) { s1 = null; }
      if (s2 && s2.length === 0) { s2 = null; }
    }
    if (ignoreCase === false) {
      s1 = (Util.NotNull(s1)) ? String(s1).toLowerCase() : null;
      s2 = (Util.NotNull(s2)) ? String(s2).toLowerCase() : null;
    }
    return s1 === s2;
  }

  /**
   * Match a string as a substring of another
   *
   * @param {string} s1 should be keyword to check inside s2
   * @param {string} s2 longer string to check for embedment of s1
   * @param {boolean} ignoreCase true to convert all to lowercase before comparing
   * @param {boolean} partial true to do additional match with subset of s1. s1 is trimed
   * from right to left as expecting user to type word from left to right.
   * @return {number} 100% is complete match, > 0% is subset pct, < 0% is partial match of s1,
   * with -99% the highest possible partial match and -1% minimum match.
   */
  static StringMatchPct(s1, s2, ignoreCase = true, partial = true, trim = true) {
    let kwd = s1 || null;
    let text = s2 || null;
    if ((kwd == null) || (text == null)) { return 0; }

    if (ignoreCase) {
      kwd = s1 ? s1.toLowerCase() : s1;
      text = s2 ? s2.toLowerCase() : s2;
    }

    if (trim) {
      kwd = kwd.trim();
      text = text.trim();
    }
    const klen = kwd.length;
    const tlen = text.length;
    if (klen === tlen) {
      if (kwd === text) { return 100; }
    }
    if (text.indexOf(kwd) >= 0) {
      // console.log("StringMatchPct", `key ${kwd} found in text: ${text}`);
      return Math.ceil(((tlen - klen) / tlen) * 100);
    }

    if (partial === false) { return 0; }   // 0% match

    return 0;   // for now
  }

  /**
   * Hash the given string into some hash code
   *
   * @param {string} s shouild be, or we'll try to make it a string.
   * @return {number} hashed code unless there was exception. null will return zero
   */
  static HashString(s) {
    if (s == null) { return 0; }
    if (typeof s !== 'string') { s = String(s); }
    let hashedVal;
    try {
      hashedVal = s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
    } catch (e) {
      hashedVal = s;
    }
    // console.error(`Hash: "${s} => ${result}`);
    return (hashedVal < 0) ? -hashedVal : hashedVal;
  }

  /**
   * Hash a value based on two timestamps.
   *
   * @param {number} ts1
   * @param {number} ts2
   * @return {string} hashed code as String
   */
  static HashTimestamps(ts1, ts2) {
    if ((ts1 === -1) || (ts1 === null)) { ts1 = ''; }
    if ((ts2 === -1) || (ts2 === null)) { ts2 = ''; }

    return Util.HashString(String(ts1) + String(ts2));
  }


  // --------------------------- ARRAYS -------------------------------

  /**
   * Determine if the given value is an empty/null array.
   * This function will check for null or none-array type and
   * treated them as empty.
   *
   * @param {Array} a value to check
   * @return {boolean} true if value is null, non-array, or empty array (length zero)
   */
  static ArrayIsEmpty(a) {
    if (!a) { return true; }
    if (!Array.isArray(a)) { return true; }
    return a.length <= 0;
  }

  /**
   * Given an object array, return the the object that
   * has a property name that matches the given value
   *
   * @param {object[]} list array of object
   * @param {string} label property name inside objects to check
   * @param {*} value value to compare (using ==)
   * @return {*} item in list that match the label == value
   */
  static GetObjectFromArrayByValue(list, label, value) {
    const count = list ? list.length : 0;
    let result;
    let item;
    for (let i = 0; i < count; i++) {
      item = list[i];
      if (item && item[label] && (item[label] === value)) {
        result = item;
        break;
      }
    }
    return item;
  }

  /**
   * Take an array and convert to a string that quotes every element.
   * @param {Array} a array of values. elements should be string or
   * convertable to string
   * @param {string} eq element quote symobol (default to single quote)
   * @param {string} sqLeft left string quote symbol (default to double quote)
   * @param {string} sqRight right string quote symbol (default to double quote)
   * @param {string} delim delimiter between elements. (default to comma)
   * @return {string} formatted string array representation
   */
  static ArrayToQuotedString(a, eq = "'", sqLeft = '"', sqRight = '"', delim = ',') {
    if (Util.ArrayIsEmpty(a)) { return `${eq}${eq}`; }

    const joiner = `${eq}${delim}${eq}`;
    const s = `${sqLeft}${eq}${a.join(joiner)}${eq}${sqRight}`;
    // console.log(`ArrayToQuotedString: ${a} ==> ${s}`);
    return s;
  }

  /**
   * Take an array and convert to JavaScript array expression, parsable
   * by JSEP.
   *
   * @param {Array} a
   * @param {string} eq element quote symbole (default to single quote)
   * @return {string} format like ['a','b','c']
   */
  static ArrayToJSString(a, eq = "'") {
    return Util.ArrayToQuotedString(a, eq, '[', ']');
  }

  /**
   * Convert a (JavaScript) string expression of an array to actual strin garray
   *
   * @param {string} arrayStr string array expression like ['a','b','c']
   * @param {boolean} enforceBrackets true to return string if no square brackets found
   * @param {*} defaultVal default return value if null
   * @return {[]} array, or original string if no brackets and enforceBracket=true
   */
  static JSStringToArray(arrayStr, enforceBrackets = true, defaultVal = []) {
    if (Util.StringIsEmpty(arrayStr)) { return defaultVal; }

    const len = arrayStr.length;
    const startPos = (arrayStr[0] === '[') ? 1 : 0;
    const endPos = (arrayStr[len - 1] === ']') ? len - 1 : len;
    if (enforceBrackets) {
      if (startPos !== 1 && endPos !== (len - 1)) { return arrayStr; }
    }
    const trimmedStr = arrayStr.substring(startPos, endPos);
    // console.log(`JSStringToArray: ${arrayStr} ==> ${trimmedStr}`);

    const result = trimmedStr.split(',');
    return result;
  }

  /**
   * Remove given item from the array. If the
   * item appears multiple times, all will be
   * removed.
   *
   * @param {[]} list array of objects (only string is tested)
   * @param {*} item item to check in list, recognizable by Array.indexOf()
   * @return {[]} same list but with item removed
   */
  static RemoveFromArray(list, item) {
    if (list == null || list.length === 0) { return list; }
    let idx = list.indexOf(item);
    while (idx >= 0) {
      list.splice(idx, 1);
      idx = list.indexOf(item);
    }
    return list;
  }


  /**
   * Convert the stringified array returned by redis to array
   *
   * @param {string} text clear text to check against hashed. No-op if already array
   * @return {[]} list result array
   */
   static Text2Array(text = '') {
    if (Array.isArray(text)) {
      return text;
    }
    const re = new RegExp(/^\[.*\]$/g);
    if (!re.test(text) || text.length < 1) {
      // console.log('Text2Array: text: ', text, ' failed regexp check');
      return text;
    }
    let result = text.slice(1, -1);
    let result_t = '';
    result = result.replace(/"/g, '');
    result_t = result.replace(',', '');
    result = result && result_t !== '' ? result.split(',') : null;
    return result;
  }

  // ----------------------------- USERNAMES ----------------------------

  /**
   * Compare two username strings and report if they are the same. This
   * will ignore case and trim white spaces.
   *
   * @param {string} username1
   * @param {string} username2
   * @return {boolean} true if usernames are equivalent
   */
  static UsernameEquals(username1, username2) {
    return Util.StringEquals(username1, username2, true, true, true);
  }


  /**
   * Render a {first_name} {last_name} where each's first
   * letter is capitalized. If either first or last name
   * is empty/null, then only return one of them.
   *
   * @param {string} fname
   * @param {string} lname
   * @return {string} `${first} ${last}` or one of them
   */
  static CraftName(fname, lname) {
    const fn = Util.FirstAlphaNumeric(fname, false, null);
    const ln = Util.FirstAlphaNumeric(lname, false, null);

    if (Util.StringIsEmpty(fn)) {
      if (Util.StringIsEmpty(ln)) { return ''; }
      return ln;
    } else if (Util.StringIsEmpty(ln)) {
      return fn;
    }
    return `${fn} ${ln}`;
  }

  /**
   * Given a string, return the first character that is
   * an alphanumeric. This means a letter or a number.
   *
   * @param {string} s
   * @param {boolean} toUpperCase convert the alpha character to upper case?
   * @param {string} defaultVal default value in case no alphanumeric in string
   * @return {string} first character matching or defaultVal
   */
  static FirstAlphaNumeric(s, toUpperCase = false, defaultVal = '') {
    if (s == null) { return defaultVal; }
    let c;
    for (let i = 0; i < s.length; i++) {
      c = s.charAt(i);
      if ((c >= 'A' && c <= 'Z') ||
        (c >= 'a' && c <= 'z') ||
        (c >= '1' && c <= '9')) {
        return toUpperCase ? c.toUpperCase() : c;
      }
    }
    return defaultVal;
  } // FirstAlphaNumeric

  /**
   * Sanitize a word including trimming, and optionally
   * lowercasing and white space removal.
   *
   * @param {*} input input string, or can be a string
   * @param {*} lowerCase convert to lower case.
   */
  static SanitizeWord(input, lowerCase = false) {
    if (input == null) { return null; }
    let cleaned = String(input).trim();
    if (lowerCase === true) { cleaned = cleaned.toLowerCase(); }

    return cleaned;
  }

  /**
   * Validate username and return lowercase version of it.
   *
   * @param {string} inputName
   * @return {string} all lowercased and white space removed.
   * If null, then either input is null or input string is invalid.
   * Either way it's invalid.
   * @see ~UsernameIsValid
   */
  static NormalizeUsername(inputName) {
    if (inputName == null) { return null; }

    const u = String(inputName).toLowerCase().trim();

    const verdict = UsernamePattern.test(u);
    if (verdict == null) {
      console.log('username invalid: ', inputName);
      console.trace();
    }

    return verdict ? u : null;
  }

  /**
   * Check username to see if it is a valid string, e.g., no spaces,
   * or certain special characters and length
   * @param {string} inputName
   * @return {boolean} true if string format is valid, false if not
   */
  static UsernameIsValid(inputName) {
    const candidate = Util.NormalizeUsername(inputName);
    if (candidate == null) { return false; }

    if (ReservedUsernames.includes(candidate)) { return false; }

    return ((candidate.length >= UserProps.USERNAME_MIN_LENGTH) && (candidate.length <= UserProps.USERNAME_MAX_LENGTH));
  }

  /**
   * Check nickname (screen name) to see if it is a valid string
   *
   * @param {string} inputName
   * @param {boolean} nullOK is null acceptable?
   * @return {boolean} true if string format is valid, false if not
   */
  static NicknameIsValid(inputName, nullOK = false) {
    if (Util.StringIsEmpty(inputName, true, true)) { return !!nullOK; }

    return ((inputName.length >= UserProps.NICKNAME_MIN_LENGTH) && (inputName.length <= UserProps.NICKNAME_MAX_LENGTH));
  }

  static NormalizeEmail(input) {
    return input ? input.trim().toLowerCase() : null;
  }

  /**
   * Determine if the given string has a valid email format.
   *
   * @param {string} input string to test
   * @return {boolean} true if valid email structure
   */
  static EmailIsValid(input) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  }

  /**
   * Determine if the given string has a valid birthday format.
   *
   * @param {string} input string to test
   * @return {boolean} true if valid email structure
   */
  static BirthdayIsValid(input) {
    return /^\d{4}[/-](0[1-9]|1[012])[/-](0[1-9]|[12][0-9]|3[01])$/.test(input);
  }

  /**
   *
   * @param {string} input
   */
  static PasswordLengthOK(input) {
    if (!input) { return false; }

    return input.length >= PASSWORD_MIN_LENGTH && input.length <= PASSWORD_MAX_LENGTH;
  }

  /**
   * Check if the give input string to be used as password
   * is valid.
   *
   * @param {string} input string to validate as password
   * @param {string=} userId username to check for inclusion (optional)
   * @return {*} error code or 0 (number) for being valid
   */
  static PasswordIsValid(input, userId = null) {
    // const _invalid = 1;
    if (Util.StringIsEmpty(input)) { return PASS_TOO_SHORT; }

    const lc_pwd = String(input).toLowerCase().trim();
    const lc_userId = userId ? String(userId).toLowerCase().trim() : null;

    if (lc_userId && lc_pwd.includes(lc_userId)) {
      return PASS_INCL_NAME;
    }

    const u = String(input).trim();

    if (u.indexOf(' ') !== -1) { return PASS_BAD_CHARS; }

    if (u.length < PASSWORD_MIN_LENGTH) { return PASS_TOO_SHORT; }

    if (u.length > PASSWORD_MAX_LENGTH) { return PASS_TOO_SHORT; }

    return 0;
  }

  /**
   * Strip character at the beginning and end
   * of the string that is collectively used to
   * quote or wrap the string. Beginning or end
   * must match in order for stripping to happen.
   *
   * Optionally, specify a character explicitly
   * and that will be used for stripping.
   *
   * @param {string} str string to strip wrapper
   * @param {string=} charLeft left character to look for explicitly.
   * If specified, both beginning and ending must
   * match this char.
   * @param {string=} charRight right character to look for explicitly
   * if specified. It's useful if it's not same as left char but
   * matching like brackets. If null, then will use charLeft if
   * specified.
   */
  static StripWrapper(str, charLeft = null, charRight = null) {
    const len = (str == null) ? 0 : str.length;

    const charRightMap = {
      '{': '}',
      '[': ']',
      '(': ')',
      '<': '>',
      '"': '"',
      '\'': '\'',
      '`': '`',
    };

    if (len < 2) { return str; }

    const c0 = str.charAt(0);
    if (charLeft == null) {
      charLeft = c0;
      if (charRightMap[charLeft] == null) { return str; }
    }
    if (charRight == null) {
      charRight = charRightMap[charLeft];
      if (charRight == null) { charRight = charLeft; }
    }

    if ((c0 !== charLeft) || (str.charAt(len - 1) !== charRight)) { return str; }
    str = str.substring(1, len - 1);
    return str;
  } // Stripwrapper

  /**
   * Strip prefix from the given string
   *
   * @param {string} str string to strip
   * @param {string} prefix prefix to match and strip
   * @param {boolean} ignoreCase true to match prefix
   * @return {string} string with prefix stripped if matched,
   * or else return original
   */
  static StripPrefix(str, prefix, ignoreCase = true) {
    const s = ignoreCase ? str.toLowerCase() : str;
    const p = ignoreCase ? prefix.toLowerCase() : prefix;
    // console.log(`s=${s}, prefix=${p}, indexOf(prefix): ${s.indexOf(prefix)}`);
    if (s.indexOf(p) !== 0) { return str; }

    return str.substring(prefix.length);
  }

  /**
   * Utility to check if an object is empty
   *
   * @param {{}} o
   */
  static ObjectIsEmpty(o) {
    if (o == null) { return true; }
    return Object.entries(o).length === 0 && o.constructor === Object;
  }


  /**
   * Strip http:// or https:// from the given
   * host expression or URL.
   *
   * @param {string} hostExpr host/url string
   * @return {string} stripped if http:// or https:// found.
   * host string will all be lower cased regardless!
   */
  static StripHttpFromURL(hostExpr) {
    hostExpr = hostExpr.toLowerCase();
    if (hostExpr.startsWith('http://')) { hostExpr = hostExpr.slice(7); } else if (hostExpr.startsWith('https://')) { hostExpr = hostExpr.slice(8); }
    return hostExpr;
  }

  /**
   * Add a parameter/value pair to existing URL string.
   * If will check for "?". If exist, then will use
   * ampersand for subsequent parameter. if not, then
   * it assumes first parameter and will use "?"
   *
   * @param {string} url existing URL string
   * @param {string} label parameter label
   * @param {string} value value in String
   * @return {string} new URL string
   */
  static AddParamToURL(url, label, value) {
    if (Util.StringIsEmpty(label) || Util.StringIsEmpty(url)) { return url; }

    if (value == null) { value = ''; } // avoid printing "null" as string

    const paramPrefix = (url.indexOf('?') >= 0) ? '&' : '?';

    return `${url}${paramPrefix}${label}=${value}`;
  }

  static AssertInstanceOf(object, classObj, classname, method, msg, ...args) {
    if (object instanceof classObj) { return true; }
    console.assert(false, `${classname}.${method}: ${msg}`, args);
    return false;
  }

  /**
   * Support for insertion into the RHS of something
   * like incl="value1|value2|value3|..."
   *
   * Currently values must be unique, so redundant values will
   * not be appended
   *
   * @param {string=} valuesString current stirng, eg. "value1|value2", or null is fine
   * @param {string[]} newOptions one or more values in array, eg ["value3"]
   * @param {string} delimitor character to use to separate
   * @return {string} new value string, eg., "value1|value2|value3" or no change
   * if value already exists
   *
   * @see ~RemoveValueFromValuesString
   * @see ~HasValueInValuesString
   */
  static AddValueToValuesString(valuesString, value, delimitor = '|', uppercase = true) {
    const values = valuesString ? valuesString.split(delimitor) : [];
    if (uppercase) { value = value.toUpperCase(); }
    if (values.indexOf(value) >= 0) { return valuesString; }    // no change

    values.push(value);
    return values.join(delimitor);
  }

  /**
   * Remove a value from a value string like: "value1|value2|value3"
   *
   * @param {string} valueString
   * @param {string} value
   * @param {string} delmitor
   * @param {boolean} uppercase true to convert all values to upper case to compare
   *
   * @see ~AddValueToValuesString
   */
  static RemoveValueFromValuesString(valuesString, value, delimitor = '|', uppercase = true) {
    const values = valuesString ? valuesString.split(delimitor) : [];
    if (uppercase) { value = value.toUpperCase(); }
    const pos = values.indexOf(value);
    if (pos < 0) { return valuesString; }

    values.splice(pos, 1);
    return values.join(delimitor);
  }

  /**
   * Given a string containing multiple values delimited, this Utility
   * offers a richer sematic/converson from regular string.split()
   *
   * @param {string} valueString
   * @param {string} delimitor
   * @param {boolean} uppercase true to convert all values to upper case
   * @return {string[]} array of all values parsed from given value string
   *
   * @see ~HasValueInValuesString
   * @see ~AddValueToValuesString
   * @see ~RemoveValueFromValuesString
   */
  static GetValuesInValuesString(valuesString, delimitor = '|', uppercase = true) {
    if (valuesString == null) { return []; }
    if (uppercase) { valuesString = valuesString.toUpperCase(); }
    const values = valuesString.split(delimitor);
    return values;
  }

  /**
   * Check if a value exists in a value string like: "value1|value2|value3"
   *
   * @param {string} valueString
   * @param {string} value1 first value to check
   * @param {string} value2 optionally second value to check if first one not in
   * @param {string} delimitor
   * @return {boolean}
   *
   * @see ~GetValueInValuesString
   * @see ~AddValueToValuesString
   * @see ~RemoveValueFromValuesString
   */
  static HasValueInValuesString(valuesString, value1, value2, delimitor = '|', uppercase = true) {
    let values;
    try {
      if (valuesString == null) { return false; }
      if (uppercase) { valuesString = valuesString.toUpperCase(); }
      values = valuesString.split(delimitor);
      if (uppercase && value1) {
        value1 = value1.toUpperCase();
      }
      if (value1 && values.includes(value1)) {
        return true;
      }
      if (uppercase && value2) {
        value2 = value2.toUpperCase();
      }
      return value2 ? values.includes(value2) : false;
    } catch (err) {
      console.error(`Value String: ${valuesString}, value:`, values);
      console.log(err);
      return false;
    }
  }

  /**
   * Count number of fields in the given object/json
   *
   * @param {{}} obj
   * @return {number} number of fields
   */
  static ObjectSize(obj) {
    if (!obj) { return 0; }

    let size = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  }

  /**
   * Given a sequence of keys in a string path, traverse the nested json
   * and retrieve the value.
   *
   * @param {{}} jsonObj data to traverse
   * @param {string} path path of keys with delimitor
   * @param {*} defaultVal return value if value not found
   * @param {string=} delim delimitor for paths. Default is dot '.'
   *
   * @see ~GetEmbeddedJSONKeys
   */
  static GetEmbeddedJSONPaths(jsonObj, path, defaultVal = null, delim = '.') {
    const keyArray = (path == null) ? null : String(path).split(delim);
    // console.log(`path: ${path} => keyArray:`, keyArray);
    return (keyArray == null) ? defaultVal : Util.GetEmbeddedJSONKeys(jsonObj, keyArray, defaultVal);
  }

  /**
   * Given a sequence of keys as array,traverse the nested json and return the value.
   *
   * @param {{}} jsonObj data to traverse
   * @param {string=} keyArray array of successive keys to navigate inside json
   * @return {{}} either matched embedded JSON or passed in JSON if
   * path is empty
   *
   * @see ~GetEmbeddedJSONPaths
   */
  static GetEmbeddedJSONKeys(jsonObj, keyArray, defaultVal = null) {
    if (!Array.isArray(keyArray)) { return defaultVal; }

    if (keyArray.length === 0) { return defaultVal; }

    const key = keyArray[0];
    let value = jsonObj[key];

    // console.log(`key: ${key}, value:`, JSON.stringify(value));

    if (keyArray.length > 1) {
      // continue depth or return
      const subpath = keyArray.slice(1);
      if (typeof (value) === 'object') { value = Util.GetEmbeddedJSONKeys(value, subpath); }
    }
    return (value == null) ? defaultVal : value;
  } // GetEmbeddedJSON

  /**
   * Given an object with properties, extract a subset
   * using the inclusion and exclusion field name list.
   *
   * @param {{}} jsonObj object to extract properties from
   * @param {string[]} inFields array of property names to include
   * @param {string[]} excFields array of property names to exclude.
   * If property name is found in both include and exclude list,
   * the exclusion will win.
   * @param {*} defaultVal return this if null or empty results
   * @return {{}} new object with subset of properties
   *
   * @see ~ImportObjectFields
   */
  static ExportObjectFields(jsonObj, inFields = null, exFields = null, defaultVal = {}) {
    let value;
    const results = {};
    let count = 0;
    for (const label in jsonObj) {
      if (inFields && !(inFields.includes(label))) { continue; }
      if (exFields && (exFields.includes(label))) { continue; }
      value = jsonObj[label];
      results[label] = value;
      count++;
    }
    return (count > 0) ? results : defaultVal;
  } // GetObjectFields

  /**
   * Import data into a json object
   *
   * @param {{}} jsonObj main data structure to receive the import data
   * @param {{}} importData json data to add to main data or replace
   * @param {*} override true to override, false to ignore
   * @return {{}} old data or null if none was replaced
   *
   * @see ~ExportObjectFields
   */
  static ImportObjectFields(jsonObj, importData, override = false) {
    const oldData = {};
    let replaceCount = 0;
    let value;
    for (const label in importData) {
      value = jsonObj[label];
      if (value) {
        oldData[label] = value;
        replaceCount++;
      }
      jsonObj[label] = importData[label];
    }
    return (replaceCount > 0) ? oldData : null;
  } // ImportObjectFields

  /**
   *
   * @param {string[]} list1
   * @param {string[]} list2
   */
  static MergeStrings(list1, list2) {
    if (list2 == null) { return list1; }
    if (list1 == null) { return list2; }
    const merged = [...list1, ...list2];
    return Util.UniqueArray(merged);
  }

  /**
   * Make the given array list unique
   *
   * @param {[]} list array to remove exact duplicate objects
   * @return {[]} same array but minus duplicates
   */
  static UniqueArray(list) {
    if (list == null || !Array.isArray(list)) { return list; }

    const a = list;   // use the same array (for now)
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) { a.splice(j--, 1); }
      }
    }

    return a;
  }

  /**
   * Takes a list that is resulted from a merge of lists returned by different get user feed functions
   * such as GetDeclaredUsertags, GetDeclaredHashtags. Then the method will remove duplicates in the list
   * but keep a record of the count of occurrence of each item and sort the result list based on the occurence
   * counts - this is an initial version of sort by relevance.
   *
   * @param {[]} list array to remove exact duplicate objects
   * @param {boolean} inc increment order?
   * @return {[]} sorted unique array
   *
   * @see TagService.GetDeclaredUsertags
   * @see TagService.GetDeclaredHashtags
   */
  static UniqueArraySortByRelevance(list, inc = false) {
    // Get tag appearance count, bigger appearance count = better relevance
    const entrymap = {};
    for (const e of list) {
      entrymap[e] = entrymap.hasOwnProperty(e) ? entrymap[e] + 1 : 1;
    }
    if (Util.IsNull(entrymap)) {
      return [];
    }

    // Sort htapmap, utapmap by value (appearance count)
    const entrymap_sorted = new Map(Object.entries(entrymap).sort((a, b) => {
      if (inc) {
        return a[1] - b[1];
      }
      return b[1] - a[1];
    }));

    return Array.from(entrymap_sorted.keys());
  }

  /**
   * Take two arrays and return union
   * @param {[]} array1
   * @param {[]} array2
   * @return {[]} unique merged array
   */
  static Union2Arrays(array1, array2) {
    const s = new Set([...array1, ...array2]);
    return Array.from(s);
  }

  /**
   * Compare two arrays that goes deep
   *
   * @param {Array} list1
   * @param {Array} list2
   *
   * @return {boolean} true if values are same, false if not
   */
  static CompareArrays(list1, list2, stack = null) {
    // if the other array is a falsy value, return
    if (list1 === list2) { return true; }

    if (!list1 || !list2) { return false; }

    // compare lengths - can save a lot of time
    if (list1.length !== list2.length) { return false; }

    for (let i = 0, l = list1.length; i < l; i++) {
      // Check if we have nested arrays
      if (list1[i] instanceof Array && list2[i] instanceof Array) {
        if (stack == null) {
          stack = new Set();
        } else if (stack.has(list1) || stack.has(list2)) {
          // circular?
          console.warn('CmpAr: deep nesting/circulr?');
          // console.warn("  Trace List 1:", list1);
          // console.warn("  Trace List 2:", list2);
          return false;
        }
        stack.add(list1);
        stack.add(list2);
        // recurse into the nested arrays
        if (Util.CompareArrays(list1[i], list2[i], stack) === false) { return false; }
      } else if (list1[i] !== list2[i]) {
        // Warning - two different object instances will never be equal: {x:20} !== {x:20}
        return false;
      }
    }
    return true;
  }

  /**
   * Capitalize the first character of the given string. The entire
   * word is lowercased first.
   *
   * @param {string} s
   * @return {string} capitalized word
   */
  static Capitalize(s) {
    const text = (typeof s !== 'string') ? String(s).toLowerCase() : s.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * @param {string} s, the string to get from
   * @param {boolean} lowercase, convert the string to lowercase
   * @param {string} defalutvalue, if no string can be get, the default value to return
   */
  static GetString(s, lowercase = true, defaultvalue = null) {
    if (lowercase) {
      return (typeof s === 'string') ? s.toLowerCase() : defaultvalue;
    }

    return (typeof s === 'string') ? s : defaultvalue;
  }

  /**
   * Capitalize a string of words, like a title.
   *
   * @param {string} s string containing one or more words
   * @return {string} new string that lowercased all and
   * capitalize first letter of each word.
   */
  static CapitalizeTitle(s) {
    const words = s.toLowerCase().split(' ');
    const capWords = [];
    for (let i = 0; i < words.length; i++) {
      capWords.push(Util.Capitalize(words[i]));
    }
    return capWords.join(' ');
  }

  /**
   * Convert a string value to boolean by taking best
   * guess for the intention. values "true", "on", "yes",
   * or any positive number all means true
   *
   * @param {*} value
   * @param {boolean} defaultVal if value given is null/undefined
   * @return {boolean} boolean true or false
   */
  static toBoolean(value, defaultVal = false) {
    if (value == null) { return defaultVal; }
    if (typeof (value) === 'boolean') { return value; }
    if (typeof (value) === 'number') { return (value > 0); }
    if (typeof (value) !== 'string') { value = `${value}`; }
    switch (String(value).toLowerCase()) {
      case 'true':
      case 't':
      case '1':
      case 'on':
      case 'yes':
      case 'y':
        return true;

      case 'false':
      case 'f':
      case '0':
      case 'no':
      case 'n':
        return false;

      default:
        return defaultVal;
    }
  } // toBoolean

  /**
   * Convert a string value to a number, catches null
   * or other exceptions and return a desired default.
   *
   * @param {*} value anything that Number() can convert to number
   * @param {number=} defaultVal if value given is null or error
   * @return {number} numeric value or defaultVal
   */
  static toNumber(value, defaultVal = null) {
    if ((value === null) || (value === undefined)) {
      return defaultVal;
    }
    if (typeof (value) === 'number') { return value; }
    try {
      if (typeof (value) === 'string') { value = Number(value); } else { value = Number(String(value)); }  // justin case
      return (typeof (value) === 'number') ? value : defaultVal;
    } catch (e) {
      console.trace(e);
      return defaultVal;
    }
  } // toNumber

  /**
   * Compare two values as numbers. Both will be converted
   * to Number first. This is especially useful if the two
   * values are equivalent integer but represented differently,
   * e.g., one is a string
   *
   * @param {*} v1
   * @param {*} v2
   * @returns {boolean} true if numeric representation is the same
   */
  static NumberEquals(v1, v2) {
    const n1 = Util.toNumber(v1, 'b1');
    const n2 = Util.toNumber(v2, 'b2');
    return n1 === n2;
  }

  /**
   * Given a number, determine which suffix to add for
   * position: st (1s), nd (2s), rd(3s), or th(others).
   * The exception is the modulo of 100 where 11th, 12th, and 13th
   * break this rule.
   *
   * NOTE: This is ENGLISH only!!!!!
   *
   * @param {number} value must be an integer and positive number!
   * @param {string} lang language/locale (not implemented)
   * @param {*} defaultVal in case of exception (not integer)
   * @return {string} appropriate suffix (st, nd, rd, or th)
   */
  static GetNth(value, lang = null, defaultVal = null) {
    if (Util.NotNull(value)) { value = Number(value); }
    if (!Number.isInteger(value) || (value < 0)) { return defaultVal; }

    let suffix = 'th';
    // Do the exception first (11th, 12th, and 13th)
    const double = (value > 99) ? value % 100 : value;
    if ((double >= 10) && (double <= 20)) { return suffix; }

    const single = (value > 9) ? value % 10 : value;
    switch (single) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
      // use "th"
    }
    return suffix;
  } // GetNth

  static IntegerToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  /**
   * Given RGB values in 3 separate integers, return a hex string representing
   * RGB.
   *
   * @param {string} r integer (byte) value for red
   * @param {string} g integer (byte) value for green
   * @param {string} b integer (byte) value for blue
   * @return {string} hex format of '#000000'
   */
  static RgbToHex(r, g, b) {
    return `#${this.integerToHex(r)}${this.integerToHex(g)}${this.integerToHex(b)}`;
  }

  /**
   * Decode 3-byte hex string into R, G, B values. If not in a hex format that it
   * understands, original value will be returne (e.g., "yellow", "black")
   *
   * @param {string} hex hex value to decode
   * @return {{r,g,b}} decoded structure, or original input value if not hex format.
   */
  static HexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : hex;
  }

  static GenRandom(seed = null, bytes = 4, base = 36) {
    const byteMask = {
      2: 0x0000FFFF,
      4: 0xFFFFFFFF,
      8: 0x0000FFFFFFFFFFFF,
      16: 0xFFFFFFFFFFFFFFFF,
    };
    if (seed == null) { seed = Date.now(); } else if (typeof seed !== 'number') { seed = Util.HashString(seed); }
    const v = seed & byteMask[bytes];
    return ((v < 0) ? -v : v).toString(base).toUpperCase();
  }

  static GenRandomLong() {
    const s = Math.trunc(Math.random() * 10000000000000);
    return s;
  }

  static CloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Manual recursive clone instead of doing
   * JSON.parse(JSON.stringify(obj)). This allows
   * filtering or in-copy changes.
   *
   * @param {object} obj
   */
  static RecursiveClone(obj) {
    const clone = {};
    for (const i in obj) {
      if (Util.NotNull(obj[i]) && typeof (obj[i]) === 'object') { clone[i] = Util.CloneObject(obj[i]); } else { clone[i] = obj[i]; }
    }
    return clone;
  }

  /**
   * Clone an instance of a class. Note this
   * retains class type but does shallow copy only.
   *
   * @param {object} origInstance
   */
  static CloneInstance(origInstance) {
    const newInstance = Object.assign(Object.create(Object.getPrototypeOf(origInstance)), origInstance);
    return newInstance;
  }

  /**
   * Sort array of objects by a specified UNIQUE field's label.
   *
   * WARNING: this function assumes the values from specified field
   * are UNIQUE!! If not, then only one will be in the sorted result!!!
   *
   * @param {{}[]} objArray array of object with a label used to sort
   * @param {string} label property label needed in each object. MUST BE UNIQUE
   * @return {{}[]} sorted object array
   */
  static SortUniqueObjectsByLabel(objArray, label, comparer = null) {
    const arraySize = objArray ? objArray.length : 0;
    const objMap = Util.MapUniqueObjectsByField(objArray, label, true);

    const keys = Object.keys(objMap);

    // need to support comparer
    // keys.sort(comparer);
    keys.sort();    // NEED TO IMPORT MY OWN SORT THAT CARRIES DATA!!!

    let key;
    const sorted = [];
    for (let j = 0; j < arraySize; j++) {
      key = keys[j];
      sorted.push(objMap[key]);
    }
    return sorted;
  } // SortUniqueObjectsByLabel

  /**
   * Sort array of objects by a specified non-unique field's label, and
   * with secondary options to append text
   *
   * WARNING: this function assumes the values from specified field
   * are UNIQUE!! If not, then only one will be in the sorted result!!!
   *
   * @param {{}[]} objArray array of object with a label used to sort
   * @param {string} label property label needed in each object. The value
   * for this field do not have to be unique.
   * @param {string=} label2 secondary field to use as tiebreaker in sorting.
   * This is TBD as implementation by Util.MapObjectsFieldField() is TBD.
   * @param {function=} comparer user-supplied comparison function (TBD)
   * @return {{}[]} sorted object array
   */
  static SortObjectsByLabel(objArray, label, label2 = null, comparer = null) {
    // const _m = "SortObjectByLabel";
    const objMap = Util.MapObjectsByField(objArray, label, label2, true);
    // console.log(_m, "array: ", objArray, "map: ", objMap);

    const keys = Object.keys(objMap);
    const arraySize = keys ? keys.length : 0;

    // need to support comparer
    // keys.sort(comparer);
    keys.sort();    // NEED TO IMPORT MY OWN SORT THAT CARRIES DATA!!!
    // console.log(_m, "sorted keys: ", keys);

    let key;
    const sorted = [];
    let sameKeyObjs;
    for (let i = 0; i < arraySize; i++) {
      key = keys[i];
      sameKeyObjs = objMap[key];
      // console.log(_m, `key: ${key}: sameKeyObjs:`, sameKeyObjs);
      if (Array.isArray(sameKeyObjs)) {
        if (sameKeyObjs.length === 1) { sorted.push(sameKeyObjs[0]); } else {
          // multiple values with the same key
          let value;
          for (let j = 0; j < sameKeyObjs.length; j++) {
            value = sameKeyObjs[j];
            // secondary field to compare / append - TBD
            sorted.push(value);
          }
        }
      } else { sorted.push(sameKeyObjs); }
    }
    return sorted;
  } // SortObjectsByLabel

  /**
   * Sort a data map by matching its key with a
   * given field in the corresponding object.
   * An example of this use is keyword (as key)
   * match against title field in the object.
   *
   * @param {{}} dataMap object with key/object pairs
   * @param {string} fieldName
   * @return {{}} new map
   */
  static SortMapByMatchPct(dataMap, fieldName, matchWord) {
    if (dataMap == null) {
      console.trace(`${Util}.SortMapByMatchPct: null dataMap`);
      return null;
    }
    const keys = Object.keys(dataMap);
    const size = keys ? keys.length : 0;

    let key;
    let text;
    let object;
    let matchPct;
    const keyPct = [];
    for (let i = 0; i < size; i++) {
      key = keys[i];
      object = dataMap[key];
      text = object ? object[fieldName] : null;
      matchPct = Util.StringMatchPct(matchWord, text, true, true, true);
      if (matchPct > 99) { console.log(`SortMapByMatchPct: key: ${key}, value: ${text}: pct: ${matchPct}`); }
      keyPct.push((`000${matchPct}`).substr(-3, 3) + key);
    }
    keyPct.sort().reverse();
    const resultMap = {};
    for (let i = 0; i < size; i++) {
      key = keyPct[i].substr(3);
      text = dataMap[key];
      resultMap[key] = text;
    }
    return resultMap;
  } // SortMapByMatchPct

  /**
   * Create a object map out of object array using the
   * specified field value as key
   *
   * @param {{}[]} objArray
   * @param {string} label property label as key to the object
   * @return {{}} object map
   *
   * @see ~MapObjectsByField
   */
  static MapUniqueObjectsByField(objArray, label, keepNull = true) {
    if (objArray == null) { return null; }

    const arraySize = objArray ? objArray.length : 0;
    let key;
    let obj;
    const objMap = {};
    for (let i = 0; i < arraySize; i++) {
      obj = objArray[i];
      key = obj[label];
      if (key == null && (keepNull === false)) { continue; }
      objMap[key] = obj;
    }
    return objMap;
  } // MapObjectsByField

  /**
   * Create a object map out of object array using the
   * specified field value as key. The difference with
   * MapUniqueObjectsByField() is the returned map will
   * associate an array of objects with each key, allowing
   * non-unique values with the given field label.
   *
   * @param {{}[]} objArray
   * @param {string} label property label as key to the object
   * @param {string=} label2 secondary field to use as tiebreaker (TBD)
   * @return {{string:object[]}} object map
   *
   * @see ~MapUniqueObjectsByField
   */
  static MapObjectsByField(objArray, label, label2, keepNull = true) {
    if (objArray == null) { return null; }

    const arraySize = objArray ? objArray.length : 0;
    let key;
    let obj;
    const objMap = {};
    for (let i = 0; i < arraySize; i++) {
      obj = objArray[i];
      key = obj[label];
      if (Util.NotNull(obj[label2])) { key += ` ${obj[label2]}`; }
      if (key == null && (keepNull === false)) { continue; }
      if (objMap[key] == null) { objMap[key] = []; }
      objMap[key] = obj;
    }
    return objMap;
  } // MapObjectsByField

  /**
   * Extract a property value from each element in array and
   * put them in its own array
   *
   * @param {{}[]} objArray
   * @param {string} label property label to get data from
   * @return {*[]} array of values, or null if input array is null
   */
  static ExtractFieldFromObjects(objArray, label, keepNull = true) {
    if (objArray == null) { return null; }

    const arraySize = objArray ? objArray.length : 0;
    let value;
    const valueArray = [];
    let obj;
    for (let i = 0; i < arraySize; i++) {
      obj = objArray[i];
      value = obj[label];
      if (value == null && (keepNull === false)) { continue; }
      valueArray.push(value);
    }
    return valueArray;
  } // ExtractFieldFromObjects
} // class Util

export class MemoryUtil {

  static get HEAP_USED() { return process.memoryUsage()['heapUsed']; }
  static get HEAP_TOTAL() { return process.memoryUsage()['heapTotal']; }
  static get RSS() { return process.memoryUsage()['rss']; }
  static get EXTERNAL() { return process.memoryUsage()['external']; }

  /**
   * Return what process.memoryUsage() returns
   *
   * return {object}
   */
  static GetStat(field) {
    return field ? process.memoryUsage()[field] : process.memoryUsage();
  }

  /**
   * @return {string}
   */
  static GetMemStatLine() {
    const memrec = process.memoryUsage();
    const used = memrec['heapUsed'];
    const total = memrec['heapTotal'];
    const utilpct = Math.round((used / total) * 100);
    const usedMB = Math.round(used / 1048576);
    const totalMB = Math.round(total / 1048576);
    const rssMB = Math.round(memrec['rss'] / 1048576);
    const extMB = Math.round(memrec['external'] / 1048576);
    const msg = `Mem Util: ${utilpct}% (${usedMB}MB/${totalMB}MB)  RSS: ${rssMB}MB  Extern: ${extMB}MB`;
    return msg;
  }

}

const monthAbbrev = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const S_MIN = 60;
export const S_HOUR = S_MIN * 60;
export const S_DAY = S_HOUR * 24;
export const S_WEEK = S_DAY * 7;
export const S_YEAR = S_DAY * 365.25;
export class TimeUtil {

  static Ts2MMYYYY(ts) {
    const d = new Date(ts);
    const mm = monthAbbrev[d.getMonth()];
    const yyyy = d.getFullYear();
    const out = `${mm}, ${yyyy}`;
    return out;
  }

  static Ts2MMYYYYV2(ts, locale = 'en') {
    // if (locale !== 'en') {

    //   if (locale === 'zh') { locale = 'zh-cn'; } else { locale = 'zh-tw'; }

    //   return moment(ts).locale(locale).format('YYYY年M月');
    // }

    return moment(ts).locale(locale).format('MMMM YYYY');
  }

  static Ts2MMDDYYYY(ts) {
    const d = new Date(ts);
    const mm = monthAbbrev[d.getMonth()];
    const dd = d.getDate();
    const yyyy = d.getFullYear();
    const out = `${mm} ${dd}, ${yyyy}`;
    return out;
  }

  static Ts2YYYY_MM_DD(ts) {
    const d = new Date(ts);
    const mm = monthAbbrev[d.getMonth()];
    const dd = d.getDate();
    const yyyy = d.getFullYear();
    const out = `${yyyy}_${mm}_${dd}`;
    return out;
  }

  /**
   * Print time format (suitable for log entries)
   *
   * @param {number=} ts timestamp, or null for now
   * @param {boolean} includeMillis
   */
  static Ts2YY_MM_DD_hh_mm_ss(ts = null, includeMillis = false) {
    const d = new Date(ts);
    const MM = String(d.getMonth()).padStart(2, '0');
    const DD = String(d.getDate()).padStart(2, '0');
    const YY = String(d.getFullYear() % 100).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const ms = String(d.getMilliseconds()).padStart(3, '0');
    const out = includeMillis
      ? `${MM}/${DD}/${YY} ${hh}:${mm}:${ss}.${ms}`
      : `${MM}/${DD}/${YY} ${hh}:${mm}:${ss}`;
    return out;
  }

  static Ts2hh_mm_MM_DD_YYYY(ts = null) {
    const d = new Date(ts);
    const MM = monthAbbrev[d.getMonth()];
    const DD = String(d.getDate()).padStart(2, '0');
    const YYYY = d.getFullYear();
    let hh = String(d.getHours()).padStart(2, '0');
    let AP = hh >= 12? "PM" :'AM';

    if (hh > 12) {
      hh -= 12;
    }

    const mm = String(d.getMinutes()).padStart(2, '0');
    const out = `${hh}:${mm} ${AP} ${MM} ${DD}, ${YYYY}`;

    return out;
  }

  /**
   * Return time difference, where second
   * time is relative to first. The different
   * with "SinceTime" is this one can return
   * negative.
   *
   * @param {number} ts1 original time
   * @param {number=} ts2 reference time
   * @param {*} ago
   */
  static DeltaTime(ts1, ts2, ago = false) {
    let negative = '';
    if (ts1 > ts2) {
      const tmp = ts2;
      ts2 = ts1;
      ts1 = tmp;
      negative = '-';
    }
    const label = negative + TimeUtil.SinceTime(ts1, ts2, ago);
    return label;
  } // ElapsedTime

  /**
   * Get time since in simple abbreviation. This is a simple
   * method for users to see the elapsed time, so no precise
   * details, just either 1 minute ago or 1m, 3 days go or 3d, etc.
   *
   * @param {number} ts1 time already past
   * @param {number=} ts2 time greater than ts1 or null for now
   * @return {boolean} true for verbose including "ago", false for abbrev
   * like "1m", "3h", 2d", "3w", "2yr"
   */
  static SinceTime(ts1, ts2 = null, verbose = false) {
    if (ts2 == null) { ts2 = Date.now(); }

    // const _m = "TimeUtil.SinceTime";
    const elapsed = Math.trunc((ts2 - ts1) / 1000);

    let value;
    let unit;
    let label = null;
    if (elapsed >= (S_YEAR - S_WEEK)) {
      value = Math.trunc((elapsed / S_YEAR) + 0.5);
      unit = verbose ? ' years ago' : 'yr';
    } else if (elapsed >= (S_WEEK - (S_HOUR * 12))) {
      value = Math.trunc((elapsed / S_WEEK) + 0.5);
      unit = verbose ? ' weeks ago' : 'w';
    } else if (elapsed >= (S_DAY - S_HOUR)) {
      value = Math.trunc((elapsed / S_DAY) + 0.5);
      unit = verbose ? ` day${value === 1 ? '' : 's'} ago` : 'd';
    } else if (elapsed >= (S_HOUR - S_MIN)) {
      value = Math.trunc((elapsed / S_HOUR) + 0.5);
      unit = verbose ? ` hour${value === 1 ? '' : 's'} ago` : 'h';
    } else if (elapsed >= S_MIN) {
      value = Math.trunc((elapsed / S_MIN) + 0.5);
      unit = verbose ? ` minute${value === 1 ? '' : 's'} ago` : 'm';
    } else {
      value = elapsed;
      if (value < 5) {
        label = verbose ? 'just now' : 'now';
      } else { unit = verbose ? ' seconds ago' : 's'; }
    }

    // console.log(`${_m}: Time from ${ts1} to ${ts2} is ${elapsed} seconds => ${label}`);
    return label || String(value) + unit;
  } // Sincetime

  /**
   * Get time since in simple abbreviation. This is a simple
   * method for users to see the elapsed time, so no precise
   * details, just either 1 minute ago or 1m, 3 days go or 3d, etc.
   *
   * @param {number} ts1 time already past
   * @param {number=} ts2 time greater than ts1 or null for now
   * @return {boolean} true for verbose including "ago", false for abbrev
   * like "1m", "3h", 2d", "3w", "2yr"
   */
  static SinceTimeV2(ts1, ts2 = null, verbose = false) {
    if (ts2 == null) { ts2 = Date.now(); }

    const elapsed = Math.trunc((ts2 - ts1) / 1000);

    let value;
    let unit;
    let label = null;
    if (elapsed >= (S_WEEK - (S_HOUR * 12))) {
      value = this.Ts2MMDDYYYY(ts1);
      unit = '';
    } else if (elapsed >= (S_DAY - S_HOUR)) {
      value = Math.trunc((elapsed / S_DAY) + 0.5);
      unit = verbose ? ` day${value === 1 ? '' : 's'} ago` : 'd';
    } else if (elapsed >= (S_HOUR - S_MIN)) {
      value = Math.trunc((elapsed / S_HOUR) + 0.5);
      unit = verbose ? ` hour${value === 1 ? '' : 's'} ago` : 'h';
    } else if (elapsed >= S_MIN) {
      value = Math.trunc((elapsed / S_MIN) + 0.5);
      unit = verbose ? ` minute${value === 1 ? '' : 's'} ago` : 'm';
    } else {
      value = elapsed;
      if (value < 5) {
        label = verbose ? 'just now' : 'now';
      } else { unit = verbose ? ' seconds ago' : 's'; }
    }

    // console.log(`${_m}: Time from ${ts1} to ${ts2} is ${elapsed} seconds => ${label}`);
    return label || String(value) + unit;
  } // SincetimeV2

  // Deprecated go to see SinceTimeV5
  static SinceTimeV3(ts1, ts2 = null, verbose = false) {
    if (ts2 == null) { ts2 = Date.now(); }

    const t1 = moment(ts1);
    const t2 = moment(ts2);

    const mins = t2.diff(t1, 'minutes');
    // console.log("mins=" + mins);
    if (mins < 60) { // in the same day
      // console.log(mins<60);
      const _mins = t2.diff(t1, 'minutes');
      return `${_mins}m`;
    }

    const hours = t2.diff(t1, 'hours');
    // console.log("hours=" + hours);
    if (hours < 24) { // in the same day
      const _hours = t2.diff(t1, 'hours');
      return `${_hours}h`;
    }
    // console.log("days=" + days);

    ts1 = new Date(ts1);
    ts2 = new Date(ts2);
    const years = ts1.getFullYear() - ts2.getFullYear();
    // console.log("years=" + years);
    if (years === 0) { // in the same year
      return t1.locale('zh-hk').format('MMM DD');
    }
    // console.log(t1.format('MMM DD YYYY'));
    return t1.locale('zh-hk').format('MMM DD YYYY');
  }

  static SinceTimeV4(ts1, ts2 = null, verbose = false) {
    if (ts2 == null) { ts2 = Date.now(); }

    ts1 = new Date(ts1);
    ts2 = new Date(ts2);
    const years = ts1.getFullYear() - ts2.getFullYear();
    if (years === 0) { return false; }
    // the full date return true.
    return true;
  }

  static SinceTimeV5(ts1, ts2 = null, locale = 'en', verbose = false) {
    if (ts2 == null) { ts2 = Date.now(); }

    const t1 = moment(ts1);
    const t2 = moment(ts2);

    // const sec = t2.diff(t1, 'seconds');
    // if (sec < 60) {
    //   if(locale !== 'en') {
    //     const _sec = t1.locale('zh-'+locale).fromNow(!verbose);
    //     return _sec.replace(/\s*/g,"");
    //   }
    //   return '1m';
    // }

    const min = t2.diff(t1, 'minutes');
    const seconds = parseInt(t2.diff(t1, 'seconds'));
    if (min < 60) {
      if (locale !== 'en') {
        if (locale === 'zh') { locale = 'zh-cn'; }
        

        const _mins = t1.locale(locale).fromNow(!verbose);
        return _mins;
      }
      if (seconds < 5) {
        return t("getter_fe.timeline.common.justNow");
      } else if (seconds < 60) { 
        return seconds === 0? 1 + "s" : seconds + "s"; 
      } 
      return `${min}m`;

    }


    const hours = t2.diff(t1, 'hours');
    // console.log("hours=" + hours);
    if (hours < 24) { // in the same day
      if (locale !== 'en') {
        if (locale === 'zh') { locale = 'zh-cn'; }
        

        const _hours = t1.locale(locale).fromNow(!verbose);
        return _hours;
      }

      return `${hours}h`;
    }

    const years = t1.get('y') - t2.get('y');
    // console.log("years=" + years);
    if (years === 0) { // in the same year
      if (locale !== 'en') {
        if (locale === 'zh') { locale = 'zh-cn'; } else { locale = 'en'; }

        return t1.locale(locale).format('MMM Do');
      }
      return t1.locale(locale).format('MMM D');
    }

    // console.log(t1.format('MMM DD YYYY'));
    return t1.locale(locale).format('LL');
  }

  static MilliSeconds(ts, valueOnly = false) {
    const secs = ts / 1000;
    return valueOnly ? secs : `${secs}s`;
  }

  /**
   *
   * @param {number} startTS
   * @param {boolean} valueOnly
   * @return {number|string}
   */
  static GetElapsedMillis(startTS, valueOnly = false) {
    const elapsed = Date.now() - startTS;
    return TimeUtil.MilliSeconds(elapsed, valueOnly);
  }


} // TimeUtil


export default Util;
