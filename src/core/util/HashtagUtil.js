import Util from '../Util';


/** In tagname qualifying extras are delimted with "--" after the initial tagname, like sports--usa */
export const PHRASE_SPLIT = '--';

/** Word split "-" is used within tagnames in place of space character, like los-angeles */
export const WORD_SPLIT = '-';

export const TAG_SPLIT = ';';

export const TAG_PROP_REL = 'rel';

export const TAGNUM_PREFIX = '~';

/** In English only */
const uselessWords = new Set([
  'a', 'an', 'for', 'the', 'to', 'from', 'for', 'has', 'is', 'have', 'are', 'am',
  'or', 'and', 'but', 'what', 'how', 'who', 'where', 'here', 'there', 'you',
  'we', 'they', 'them', 'been',
]);

const uselessPrefix = new Set([
  'the', 'dr', 'dr.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.', 'la', 'el',
]);

const uselessSuffix = new Set([
  'jr', 'jr.', 'sr', 'sr.',
]);

/** Good for English only. "los/las" in Spanish should be omitted unless in name? */
const noBreakPrefixes = new Set([
  'san', 'los', 'las',
]);

// const symbolText = {
//     '&' : 'and'
// };

// const _CLSNAME = "HashtagUtil";

/**
 * Utility functions related to tag manipulations (hashtag
 * and usertag)
 */
export default class HashtagUtil {
  static get PHRASE_SPLIT() { return PHRASE_SPLIT; }
  static get WORD_SPLIT() { return WORD_SPLIT; }
  static get TAG_SPLIT() { return TAG_SPLIT; }

  static TextScanUrlsAt(s) {
    return Util.ExtractURLs(s);
  }

  /**
   * Scan a text string and return list of words prefixed
   * by has (#) and at symbol (@).
   *
   * @param {string} s1 text to process
   * @param {boolean} allLowerCase true to ignore case by convert all to lower case
   * @param {boolean} trackOther true to track all other words
   * @param {boolean} removeUseless if trackOther is true, then this can remove useless words
   * @return {[Array, Array, Array]} array of hashtags (no #), usertags (no @), and remainder bucket
   */
  static TextScanTagsAt(s, allLowerCase = true, trackOthers = false, removeUseless = true, retainCase = false) {
    const hashBucket = [];
    const atBucket = [];
    const wordBucket = [];

    const rawHashBucket = retainCase ? [] : null;
    const rawAtBucket = retainCase ? [] : null;
    const rawWordBucket = retainCase ? [] : null;

    // with colon and question mark, can't keep url together
    const seps = /[\s.?,;:!()]/;

    const tokens = s ? s.split(seps) : null;
    // console.log(">>>>>> tokens: ", tokens);
    const size = tokens ? tokens.length : 0;
    let token;
    let ch1;
    let word;
    let lcWord;
    for (let i = 0; i < size; i++) {
      token = tokens[i].trim();
      if (token.length < 2) { continue; }
      ch1 = token.charAt(0);
      if (ch1 === '#') {
        word = token.substring(1);
        if (allLowerCase === true) { word = word.toLowerCase(); }
        if (!hashBucket.includes(word)) {
          hashBucket.push(word);
          if (retainCase) { rawHashBucket.push(token.substring(1)); }
        }
      } else if (ch1 === '@') {
        word = token.substring(1);
        if (allLowerCase === true) { word = word.toLowerCase(); }
        if (!atBucket.includes(word)) {
          atBucket.push(word);
          if (retainCase) { rawAtBucket.push(token.substring(1)); }
        }
      } else if (trackOthers) {
        lcWord = token.toLowerCase();
        if (allLowerCase === true) { word = lcWord; }
        if (removeUseless) {
          if (this.IsUseless(lcWord)) { continue; }
          if (this.IsUselessPrefix(lcWord)) { continue; }
          if (this.IsUselessSuffix(lcWord)) { continue; }
        }

        if (!wordBucket.includes(word)) {
          // return word in original case if ignore case is false!
          wordBucket.push(allLowerCase ? lcWord : token);
          if (retainCase) { rawWordBucket.push(token); }
        }
      }
    }

    return retainCase
      ? [rawHashBucket, rawAtBucket, rawWordBucket]
      : [hashBucket, atBucket, wordBucket];
  }


  /**
   * Convert (tagname) to lower case.
   *
   * @param {string} text text to convert to lower case
   * @return {string} lowercased text or null if empty
   */
  static LC(text) {
    if (text == null) {
      console.error('LC: Cannot lower case a NULL text.');
      return text;
    }
    return String(text).toLowerCase();
  }

  /**
   * Given text of format "title {category}", return
   * just title.
   *
   * @param {string} text
   */
  static StripBracket(text) {
    const newText = text.replace(/\{(.+?)\}/g, '');
    return newText.trim();
  }

  static IsUseless(word) {
    if (word == null) { return true; }
    return uselessWords.has(word.toLowerCase());
  }

  static IsUselessPrefix(word) {
    if (word == null) { return true; }
    return uselessPrefix.has(word.toLowerCase());
  }

  static IsUselessSuffix(word) {
    if (word == null) { return true; }
    return uselessSuffix.has(word.toLowerCase());
  }

  static NoBreakPrefix(prefix) {
    if (prefix == null) { return true; }
    return noBreakPrefixes.has(prefix.toLowerCase());
  }

  /**
   * Given a tag, if it has "_", like
   * "San_Jose", then convert to "SanJose", or "sanjose"
   * if going all lowercase
   *
   * @param {*} tagname
   * @param {boolean} toLowerCase true to go lowercase
   * @return {string} new processed string
   */
  static JoinSpace(tagname, toLowerCase = false) {
    if (tagname == null) { return null; }

    // NOTE: word split uses single "-" while double "--" is used
    // to split terms. The replace logic below will replace both,
    // so make sure to split terms first if you don't want them
    // all concatenated.
    let _newtag = tagname ? tagname.replace(WORD_SPLIT, '') : null;
    if (toLowerCase) { _newtag = _newtag.toLowerCase(); }
    return _newtag;
  }

  /**
   * Given a Set of wordSets, consolidate all into a single
   * set of unique tagnames.
   *
   * @param {Array} tagSets Set of word Sets
   * @return {Set} Set of unique tagnames
   */
  static UnionTagSets(tagSets) {
    const _m = 'unionTagSets';

    if (tagSets == null) {
      console.error(`${_m}: null input tagSets`);
      return new Set();
    }

    if (tagSets.length === 1) {
      const loneSet = tagSets[0];
      if (loneSet === null) {
        console.error(`${_m}: the only element in tagSets is NULL`);
      }
      return loneSet || new Set();
    }

    // TODO: find union as first priority, then by indiv. matched words
    // For now, create one giant set and then sort as array
    // console.log(`${_m}: total ${tagSets.length} wordSets...`);
    const resultSet = new Set();

    let wordSet;
    for (let i = 0; i < tagSets.length; i++) {
      wordSet = tagSets[i];
      // console.log(`   WordSet[${i}] has ${wordSet.size} words... content:`, wordSet);
      wordSet.forEach((word) => {
        resultSet.add(word);
      });
    }
    return resultSet;
  } // UnionTagSets

  /**
   * Given a Set of wordSets, consolidate all into a single
   * set of unique tagnames
   *
   * @param {Array} tagSets Set of word Sets
   * @return {Set} Set of unique tagnames
   */
  static IntersectTagSets(tagSets) {
    const _m = 'intersectTagSets';

    if (tagSets.length === 1) {
      const loneSet = tagSets[0];
      if (loneSet == null) {
        console.error(`${_m}: the only element in tagSets is NULL`);
      }
      return loneSet || new Set();
    }

    // console.log(`${_m}: total ${tagSets.length} wordSets...`);
    // let resultSet = new Set();

    let workingSet = tagSets[0];
    for (let i = 1; i < tagSets.length; i++) {
      const targetSet = tagSets[i];
      workingSet = new Set([...workingSet].filter(word => targetSet.has(word)));
    }
    return workingSet;
  } // IntersectTagSets
}

