
import cjk from 'cjk-regex';
import SymbolExpr from './SymbolExpr';
import Util from '../Util';
import ModelType, { UserProps } from '../model/ModelConsts';

/** In tagname qualifying extras are delimted with "--" after the initial tagname, like sports--usa */
export const PHRASE_SPLIT = '--';

/** Word split "-" is used within tagnames in place of space character, like los-angeles */
export const WORD_SPLIT = '-';

export const TAG_SPLIT = ';';

export const TAG_PROP_REL = 'rel';

export const TAGNUM_PREFIX = '~';

/** In English only */
const uselessWords = new Set([
  'a', 'for', 'the', 'to', 'from', 'for',
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

const symbolText = {
  '&': 'and',
};

// const _CLSNAME = "TagUtil";

export class TagUtil {
  static get PHRASE_SPLIT() { return PHRASE_SPLIT; }
  static get WORD_SPLIT() { return WORD_SPLIT; }
  static get TAG_SPLIT() { return TAG_SPLIT; }

  /**
   * Determine if the tagname given is a generated number.
   * If it's a number alone, then it's generated.
   *
   * @param {*} tagname
   */
  static IsNumberID(tagname) {
    return TagUtil.GetGenIDNumber(tagname) !== -1;
  }

  /**
   * Determine if the tagname given implies it is a topic.
   * This is a simple check for "-topic" as the convention
   *
   * @param {string} tagname
   * @return {boolean} true if "-topic" is within the tagname
   * (not necessarily at the end)
   */
  static IsTopic(tagname) {
    return tagname ? tagname.indexOf('-topic') >= 0 : false;
  }

  /**
   * Determine if the tagname given is a generated number.
   * If it's a number alone, then it's generated.
   *
   * @param {string} tagname
   */
  static GetGenIDNumber(tagname) {
    if (tagname && !Util.IsString(tagname)) {
      console.error('GetGenIDNumber; not string: ', (typeof tagname), ' -> ', String(tagname));
      tagname = String(tagname);
    }
    if ((tagname == null) || (!tagname.startsWith(TAGNUM_PREFIX))) { return -1; }
    try {
      return Number(parseInt(tagname.substring(1), 36));
    } catch (err) {
      console.log(err);
      return -1;
    }
  } // GetNumberID

  /**
   * Given a number, encode into a 'generated ID',
   * which is a prefix + radix 36.
   *
   * @param {number} number
  * @param {string=} prefix optional prefix to add after converting
  * to radix 36 and before uuencoding
  * @return {string} encoded number suitable to be used as a compact ID

   */
  static EncodeGenID(number, prefix = null) {
    const n36 = number.toString(36);
    return (prefix || TAGNUM_PREFIX) + n36;
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
   * Convert a text string that is assumed to be a single word
   * into a tag. If you are not sure, use Text2Tag as entry point.
   *
   * @param {string} text to process
   * @param {*} qualifiers append as suffix. this is usually super/parent tags
   */
  static _Word2Tag(text, lc = false) {
    // Step 1, lower-case all if desired
    let wordStr = lc ? text.toLowerCase().trim() : text.trim();

    // Step 2, remove some punctuations
    // TO-DO: find better / more efficient method for removal
    wordStr = wordStr.replace(',', '');
    wordStr = wordStr.replace(';', ' ');
    wordStr = wordStr.replace('-', ' ');
    wordStr = wordStr.replace('_', ' ');
    wordStr = wordStr.replace(':', ' ');
    wordStr = wordStr.replace('.', ' ');
    wordStr = wordStr.replace('!', ' ');
    wordStr = wordStr.replace('~', ' ');
    wordStr = wordStr.replace('=', ' ');
    wordStr = wordStr.replace('(', ' ');
    wordStr = wordStr.replace(')', ' ');
    wordStr = wordStr.replace('@', ' ');
    wordStr = wordStr.replace('#', ' ');
    wordStr = wordStr.replace('$', ' ');
    wordStr = wordStr.replace('%', ' ');
    wordStr = wordStr.replace('^', ' ');
    wordStr = wordStr.replace('*', ' ');

    // Step 2, tokenize all words by spaces
    const tokens = wordStr.split(' ');
    const words = [];
    const wordCount = tokens.length;
    let token;
    for (let i = 0; i < wordCount; i++) {
      token = tokens[i];
      if (token === '') { continue; }   // probably extra spaces
      // if ((i === 0) && TagUtil.IsUselessPrefix(token))
      //     continue;
      // if ((i === (wordCount - 1) && TagUtil.IsUselessSuffix(token)))
      //     continue;
      // if (TagUtil.IsUseless(token))
      //     continue;

      // convert meaningful symbolx, like '&' to 'and'
      if (Util.NotNull(symbolText[token])) { token = symbolText[token]; }

      // now strip any non-alphanumeric character
      if (!token.replace) {
        console.error(`_Word2Tag(${text}) has a bad token:`, token);
      }
      token = token.replace(/[^0-9a-z]/gi, '');

      words.push(token);
    }

    return words.reduce((acc, cur) => {
      if (cur) {
        acc = acc ? `${acc}-${cur}` : cur;
      }
      return acc;
    }, '');
  } // _Word2Tag

  /**
   * Convert a text string (e.g., a title) to tag. So something
   * like "The Fast & Furious 5" would/should be "fast-furious-5"
   * after stripping the useless and non-alpha words.
   * NOTE: characters like ',' or '|' or ptag phrase separate like '--'
   * will be used as word separator.
   *
   * @param {string} text to process
   * @param {string} suffix append at end of the result with "--".
   * This is usually super/parent tags. For example, "movies" can be used for a movie title.
   */
  static Text2Tag(text, suffix = null) {
    if (text == null) { return null; }

    let wordStr = text.toLowerCase().trim();

    wordStr = wordStr.replace(',', '|');
    wordStr = wordStr.replace(PHRASE_SPLIT, '|');

    const tokens = wordStr.split('|');
    const words = [];
    let token;
    let word;
    let tag;
    for (let i = 0; i < tokens.length; i++) {
      token = tokens[i].trim();
      if (token === '') { continue; }
      word = TagUtil._Word2Tag(token, false);
      if (word && word !== '') { words.push(word); }
    }
    tag = words.join(PHRASE_SPLIT);

    // In few instances some special characters may result to nothing, leaving
    // multiple hyphens. So should try to detect (eg., "term1---term2-term3") and
    // remove with minimal overhead.

    if (Util.NotNull(suffix)) { tag += PHRASE_SPLIT + suffix; }
    return tag;
  } // Text2Tag


  /**
   * Given a list of tags, split each to many keywords
   * based on "-"
   *
   * @param {string[]} tags array of tag names which might have props
   * space, and "-" for context, like "San_Jose-CA-USA". Props are OK and will be stripped
   * @param {boolean} toLowerCase true to convert to lower case
   * @param {boolean} removeSpace true to remove space (using _ as placeholder)
   * @param {boolean} splitWords
   * @param {set} setBucket Set collection to add if unique within set
   * @param {boolean} firstOnly if word uses PHRASE_SPLIT, then only keep the first part.
   * @return {array} array of individualized keywords
   */
  static SplitTags(tags, toLowerCase = false, removeSpace = false, splitWords = true, setBucket = null, firstOnly = false) {
    const strippedTags = [];
    const tagCount = tags ? tags.length : 0;
    let t;
    for (let i = 0; i < tagCount; i++) {
      t = TagUtil.SplitTag(tags[i], toLowerCase);
      if (t) { strippedTags.push(t); }
    }
    return strippedTags;
  }

  /**
   * Given a tag, split to many keywords
   * based on "-".
   *
   * @param {string} tagname standard tagname, which can have "_" for
   * space, and "-" for context, like "San_Jose-CA-USA". Props are OK and will be stripped
   * @param {boolean} toLowerCase true to convert to lower case
   * @param {boolean} removeSpace true to remove space (using _ as placeholder)
   * @param {boolean} splitWords
   * @param {set} setBucket Set collection to add if unique within set
   * @param {boolean} firstOnly if word uses PHRASE_SPLIT, then only keep the first part.
   * @return {array} array of individualized keywords
   */
  static SplitTag(tagname, toLowerCase = false, removeSpace = false, splitWords = true, setBucket = null, firstOnly = false) {
    if (tagname == null) {
      console.error('SplitTag', 'tagname is NULL!');
      return null;
    }

    tagname = TagUtil.StripProps(tagname);

    // get the case over with
    if (toLowerCase) { tagname = tagname.toLowerCase(); }

    let words = tagname.split(PHRASE_SPLIT);
    if ((firstOnly === true) && (words.length > 1)) {
      // only use the part before "--"
      words = words.splice(0, 1);
    }

    // console.log(`SplitTag: Initial ${tagname} --> ${words}`);
    if (words && words.length > 0) {
      let word;
      let hasParts;
      for (let i = 0; i < words.length; i++) {
        word = words[i];
        if (TagUtil.IsUseless(word)) {
          // console.log(`SplitTag: Word ${word} is useless; skipping...`);
          continue;
        }

        // Now, if word can be broken up to more words, then
        // let's do that to expand keywords
        hasParts = word.indexOf(WORD_SPLIT) >= 1;
        // console.log(`SplitTag: ${word} has parts: ${hasParts}`);
        if (hasParts && (splitWords === true)) {
          // split into multiple words minus useless ones
          const parts = word.split(WORD_SPLIT);

          // First, check for no-break prefixes
          if (TagUtil.NoBreakPrefix(parts[0]) === false) {
            if (TagUtil.IsUselessPrefix(parts[0])) { parts.shift(); }  // remove the useless prefix
            parts.forEach((part) => {
              if (TagUtil.IsUseless(part) === false) { words.push(part); }
            });
          }
        }
        if (removeSpace && hasParts) {
          word = word.replace(WORD_SPLIT, '');
          words.push(word);
        }
      }
    }
    if (setBucket) {
      words.forEach(setBucket.add, setBucket);
      // words.forEach(w => setBucket.add(w));
    }
    // console.log("SplitTag", `Final: ${tagname} ==> ${words}`);
    return words;
  } // SplitTag

  /**
   * Convert a Set of tags to keywords
   *
   * @param {Set} tags as a Set
   * @param {boolean} toLowerCase convert to lower case
   * @param {boolean} removeSpace
   *
   * @return {Set} unique keywords
   */
  static TagsToKeywords(tags) {
    if (tags == null) { return null; }

    const toLowerCase = true;
    const removeSpace = false;
    const splitWords = true;
    const bucket = new Set();
    tags.forEach((tag) => {
      TagUtil.SplitTag(tag, toLowerCase, removeSpace, splitWords, bucket);
    });
    return bucket;
  }

  /**
   * Process all tag expression strings in an array and group them
   * by a specific label and matching value in the properties.
   *
   * @param {string} label label to match value in properties of each tag
   * @param {string} value defaultValue supply value in case value does not exist
   * @param {Array} tags can be array or set
   *
   * @see #GroupTagsByRel
   * @see #GetTagsByProp
   * @see #IndexOfTagByProp
   */
  static GroupTagsByProp(label, defaultValue = 'default', tags) {
    const relMap = {};
    if (Util.NotNull(tags)) {
      tags.forEach((tag) => {
        // eslint-disable-next-line
        let [tagname, props] = TagUtil.ParseTag(tag, true);

        // console.error(`GroupTagByRel: tagname: ${tagname}, props:`, props);
        let relname = props ? props[label] : null;
        if (relname == null) { relname = defaultValue; }
        if (relMap[relname] == null) { relMap[relname] = [tag]; } else { relMap[relname].push(tag); }
      });
    }
    return relMap;
  } // GroupTagsByProp

  /**
   * Process all tag expression strings in an array and group them
   * by TAG_PROP_REL property / key.
   *
   * @param {Array} tags can be array or set
   * @param {string} relname relationship (key) name to use to group
   */
  static GroupTagsByRel(tags, relname = 'isa') {
    return TagUtil.GroupTagsByProp(TAG_PROP_REL, relname, tags);
  }


  /**
   * Process all tag expression strings in an array and group them
   * by a specific label and matching value in the properties.
   *
   * @param {string} label label to match value in properties of each tag
   * @param {string[]} tags can be array or set
   * @param {*} defaultVal in case no result
   *
   * @return {string[]} array of tag expressions matching label and optionally labelled value
   *
   * @see #GetTagsByRel
   * @see #GroupTagsByProp
   * @see #IndexOfTagByProp
   */
  static GetTagsByProp(tags, label, value = null, defaultVal = null) {
    const result = [];
    tags.forEach((tag) => {
      // eslint-disable-next-line
      let [tagname, props] = TagUtil.ParseTag(tag, true);

      // console.error(`GetTagsByProp: label: ${label}, value: ${value}`);
      if (props && props.hasOwnProperty(label)) {
        // console.error(`GetTagsByProp: tagname: ${tagname}: props:`, props);
        if (value == null) { result.push(tag); } else {
          const propValue = props[label];
          if (value === propValue) { result.push(tag); }
        }
      } // if tag has property with label
    }); // for each tag expression
    return (result.length > 0) ? result : defaultVal;
  } // GetTagsByProp

  /**
   *
   * @param {string[]} tags
   * @param {*} relname relationship name. If this is null, then all tags with TAG_PROP_REL
   * property are returned.
   * @param {*} defaultVal
   *
   * @return {string[]} array of tag expressions matching rel type and optionally rel value
   *
   * @see #GroupTagsByRel
   */
  static GetTagsByRel(tags, relname = null, defaultVal = null) {
    return TagUtil.GetTagsByProp(tags, TAG_PROP_REL, relname, defaultVal);
  }

  /**
   * Process all tag expression strings in an array and get values of
   * a matching property label
   *
   * @param {string[]} tags can be array or set
   * @param {string} label label to match value in properties of each tag, eg., TAG_PROP_REL
   * @param {*} defaultVal in case no result
   *
   * @return {string[]} array values matching property label of given tag expressions
   *
   * @see #GetRelnameOfTags
   * @see #GetTagsByProp
   */
  static GetPropValueOfTags(tags, label, defaultVal = null) {
    const resultSet = new Set();
    tags.forEach((tag) => {
      // eslint-disable-next-line
      let [tagname, props] = TagUtil.ParseTag(tag, true);

      // console.error(`GetPropValueOfTags: label: ${label}, value: ${value}`);
      if (props && props.hasOwnProperty(label)) {
        // console.error(`GetPropValueOfTags: tagname: ${tagname}: props:`, props);
        const value = props[label];
        if (Util.NotNull(value)) { resultSet.add(value); }
      } // if tag has property with label
    }); // for each tag expression
    return (resultSet.size > 0) ? Array.from(resultSet) : defaultVal;
  } // GetPropValueOfTags

  /**
   *
   * @param {string[]} tags
   * @param {*} defaultVal default value to return if no match at all
   *
   * @return {string[]} array of rel values
   *
   * @see #GroupTagsByRel
   */
  static GetRelnamesOfTags(tags, defaultVal = null) {
    return TagUtil.GetPropValueOfTags(tags, TAG_PROP_REL, defaultVal);
  }


  /**
   * Check if the given tag expression string (with inline properties)
   * has the given property label and optional value. Check stops at
   * first match.
   *
   * @param {string[]} tags can be array or set
   * @param {string} label label to match value in properties of each tag, e.g., TAG_PROP_REL
   * @param {string} value value to match with the label, e.g., "isa". If null then
   * any value is valid match.
   *
   * @return {number} index
   *
   * @see #GetTagsByProp
   * @see #GroupTagsByProp
   */
  static IndexOfTagByProp(tags, label, value = null) {
    const tagsCount = tags ? tags.length : 0;
    let tag;
    for (let idx = 0; idx < tagsCount; idx++) {
      tag = tags[idx];
      // eslint-disable-next-line
      let [tagname, props] = TagUtil.ParseTag(tag, true);

      // console.error(`IndexOfTagByProp: label: ${label}, value: ${value}, tagname: ${tagname}: props:`, props);
      if (props && props.hasOwnProperty(label)) {
        if (value == null) { return idx; }

        const propValue = props[label];
        // console.error(`   value: ${value}  propValue: ${propValue}`);
        if (value === propValue) { return idx; }
      } // if tag has property with label
    } // for each tag expression
    return -1;
  } // IndexOfTagsByProp

  /**
   * Return index of the first tag in the tags array that has
   * a TAG_PROP_REL property, or optionally has the given relname value.
   *
   * @param {string[]} tags
   * @param {string} relname value to match, e.g. "isa". If null, then
   * any value will match for the relationship property TAG_PROP_REL.
   *
   * @return {number} index
   *
   * @see #GetTagsByRel
   * @see #GroupTagsByRel
   * @see #HasTagsByRel
   * @see #IndexOfTagname
   */
  // static IndexOfTagByRel(tags, relname=null) {
  //     return TagUtil.IndexOfTagByProp(tags, TAG_PROP_REL, relname);
  // }

  /**
   * Check if the given tag expression string (with inline properties)
   * has the given property label and optional value. Check stops at
   * first match.
   *
   * @param {string[]} tags can be array or set
   * @param {string} nameCheck tagname to check. Will be normalized
   *
   * @return {number} index -1 means does not exist
   *
   * @see #IndexOfTagByRel
   * @see ~hasTag
   */
  static IndexOfTagname(tags, nameCheck) {
    if (tags == null) { return -1; }

    nameCheck = TagUtil.GetTagname(nameCheck, true);    // normalize it
    const tagsCount = tags.length;

    let tagexpr;
    let tagname;
    for (let idx = 0; idx < tagsCount; idx++) {
      tagexpr = tags[idx];
      tagname = TagUtil.GetTagname(tagexpr, true);
      // console.log(`IndexOfTagname: checking at ${idx}: nameCheck: ${nameCheck}, tagname: ${tagname}  tag: ${tagexpr}`);
      if (tagname === nameCheck) {
        // console.log(`IndexOfTagname: matched at ${idx}: nameCheck: ${nameCheck}, tagname: ${tagname}  tag: ${tagexpr}`);
        return idx;
      }
    } // for each tag expression
    return -1;
  } // IndexOfTagname

  /**
   * Remove a tag from list of tagnames.
   *
   * @param {string[]} tagnames
   * @param {string} tagname
   * @return {string} removed tagname or null if nothing is removed
   */
  static RemoveTag(tagnames, tagname) {
    if ((tagnames == null) || (tagname == null)) { return null; }
    const idx = TagUtil.IndexOfTagname(tagnames, tagname);
    if (idx < 0) { return null; }
    const removed = tagnames.splice(idx, 1);
    if ((removed === null) || (removed.length === 0)) { return null; }
    return removed[0]; // expect only one
  }

  /**
   *
   * @param {string[]} tagnames array of tagname each with possible
   * inline props
   * @param {string} tagname tagname to check. Any inline props will
   * be stripped.
   * @param {boolean} simpleCheck true to use array indexOf. No normalizing input or
   * strip any expressions
   *
   * @see ~IndexOfTagname
   */
  static HasTag(tagnames, tagname, simpleCheck = false) {
    // console.log(`${_CLSNAME}.HasTag`, `tagnames: ${tagnames}, tagname: ${tagname}`);
    if (tagnames == null) { return false; }
    if (simpleCheck) { return tagnames.indexOf(tagname) > -1; }
    return TagUtil.IndexOfTagname(tagnames, tagname) >= 0;
  }

  /**
   * Find a tagname string within a list of tagnames and
   * return it. This is not a straight comparison as
   * the match must be only the tagname part, so any
   * inline properties will need to be ignored.
   *
   * @param {string[]} tagnames array of tagnames (or expressions)
   * @param {string} tagname tagname to check. it can have inline
   * props too.
   * @param {*} defaultVal
   */
  static GetTag(tagnames, tagname, defaultVal = null) {
    const idx = TagUtil.IndexOfTagname(tagnames, tagname);
    return (idx >= 0) ? tagnames[idx] : defaultVal;
  }

  /**
   * Return verdict if there is a tag in the tag expression array
   * where 1) a TAG_PROP_REL property exists, and/or 2) given relname
   * value is matched.
   *
   * @param {string[]} tags
   * @param {string} relname e.g., "isa" or null if don't match value
   *
   * @return {boolean} true if match found, false if none
   *
   * @see #GetTagsByRel
   * @see #GroupTagsByRel
   * @see #HasTagsByRel
   */
  static HasTagByRel(tags, relname = null) {
    return TagUtil.IndexOfTagByProp(tags, TAG_PROP_REL, relname) >= 0;
  }

  /**
   * Return tagname portion of the tag string expression in the
   * format of tagname[:{props}]
   *
   * @param {string} tag expression which may have the optional props
   * @param {boolean} normalize need to check for case and special characters?
   * @return {string} tagname portion of the tag expression
   * @see #GetTagname
   */
  static StripProps(tag, normalize = false) {
    return SymbolExpr.StripProps(tag, normalize ? TagUtil.NormalizeTag : null);
  }

  /**
   * Return whether the tagname has properties append to it.
   *
   * @param {string} tag format of tag[:{"label1":value1, "label2":value2, ...}]
   */
  static HasProps(tag) {
    return SymbolExpr.HasProps(tag);
  }

  /**
   * Return tagname portion of each tagname within the array
   *
   * @param {string[]} tags array of tag names which might have props
   * @param {boolean} normalize need to check for case and special characters?
   */
  static StripTagsProps(tags, normalize = false) {
    const strippedTags = [];
    const tagCount = tags ? tags.length : 0;
    let t;
    for (let i = 0; i < tagCount; i++) {
      t = TagUtil.StripProps(tags[i], normalize);
      if (t) { strippedTags.push(t); }
    }
    return strippedTags;
  }

  /**
   * Return tagname portion of the tag string expression in the
   * format of tagname[:{props}]
   *
   * @param {string} tag expression which may have the optional props
   * @param {boolean} normalize need to check for case and special characters?
   * @return {string} tagname portion of the tag expression
   *
   * @see ~StripProps
   * @see ~ParseTag
   * @see ~ComposeTag
   */
  static GetTagname(tag, normalize = false) {
    return SymbolExpr.GetSymbolName(tag, normalize ? TagUtil.NormalizeTag : null);
  }

  /**
   * Parse a tag string and return props separately if exists
   *
   * @param {*} tag tag name string with optional properties
   * @param {*} parseProps if false, leave props as string. If true, parse into object
   * @param {boolean} normalize tag after parsing
   * @return {[tagname,{props}]} array element 0 is tagname, then array[1] is props object
   *
   * @see ~GetTagname
   * @see ~StripProps
   * @see ~ComposeTag
   */
  static ParseTag(tag, parseProps = false, normalize = false) {
    return SymbolExpr.ParseSymbol(tag, parseProps, normalize ? TagUtil.NormalizeTag : null);
  } // ParseTag

  /**
   * Compose a complete tag with given name and property object to form
   * tagname[:{props}]
   *
   * @param {string} tagname tagname only
   * @param {{}}} props props to add
   * @return {string} tag expression in string of form tagname[:{props}]
   *
   * @see ~GetTagname
   * @see ~ParseTag
   * @see ~CompareTag
   */
  static ComposeTag(tagname, props) {
    return SymbolExpr.ComposeSymbol(tagname, props, TagUtil.NormalizeTag);
  }

  /**
   * Compare two tag names without regards for the values of the props
   *
   * @param {string} tag1 string in the format of tagname[:{props}]
   * @param {string} tag2 string in the format of tagname[:{props}]
   * @param {*} normalize transform any part of the tagname if uppercase or have
   * special characters
   * @return {boolean} true if match
   *
   * @see ~GetTagname
   * @see ~ParseTag
   * @see ~ComposeTag
   */
  static CompareTags(tag1, tag2, normalize = false) {
    return SymbolExpr.CompareSymbols(tag1, tag2, normalize ? TagUtil.NormalizeTag : null);
  }

  /**
   * Return the value of a property label encoded within the
   * tag expression string
   *
   * @param {string} tag expression string in format of: tagname[:{props}]
   * @param {string} key lookup value
   * @param {*} defaultVal
   *
   * @see ~HasProperty
   * @see ~SetProperty
   */
  static GetPropertyValue(tag, key, defaultVal = null) {
    const parsed = TagUtil.ParseTag(tag, true);
    if ((parsed == null) || (parsed.length === 1)) { return defaultVal; } // no properties
    const props = parsed[1];
    return props[key] ? props[key] : defaultVal;
  }

  /**
   * Determine if the given key value exists in the properties
   * of the given tag expression string.
   *
   * @param {string} tag expression string in format of: tagname[:{props}]
   * @param {string} key property label to check
   * @return {boolean} true if exists, false if not
   *
   * @see ~GetProperty
   * @see ~SetProperty
   * @see ~RemoveProperty
   */
  static HasProperty(tag, key) {
    return SymbolExpr.HasProperty(tag, key);
  } // HasProperty

  /**
   * Set a property value of the given tag expression string.
   * The tag can be just tag string.
   * NOTE: this is not efficient way to set multiple properties.
   * Best to construct such object and compose directly.
   *
   * @param {string} tag expression in format of tagname[:{props}]
   * @param {string} key property label
   * @param {string} value value to assign to key and can be null
   * @return {string} tag expression including the new property key/value
   *
   * @see ~HasProperty
   * @see ~GetProperty
   * @see ~RemoveProperty
   */
  static SetProperty(tag, key, value) {
    return SymbolExpr.SetProperty(tag, key, value);
  } // SetProperty

  /**
   * Remove a property that exists as inline property expression
   * in the format of tagname:{label1:value1,label2:value2} including
   * property inline protective and parsable quotes.
   *
   * @param {string} tag
   * @param {string} key
   * @see ~HasProperty
   * @see ~GetProperty
   */
  static RemoveProperty(tag, key) {
    return SymbolExpr.RemoveProperty(tag, key);
  }

  /**
   * Check on the input string and convert any special
   * characters and spaces so it conforms to tag name
   * format. One such example is any space would be
   * replaced with "-".
   *
   * @param {string} text tag name that may be entered by user.
   * NOTE: it can still have attached properties using the
   * format: tagStr[:{props}]
   *
   * @see TagUtil.StripProps  to strip property with normalize option
   */
  static NormalizeTag(tagStr, lc = true) {
    const idx = tagStr.indexOf(':');
    let text = (idx === -1) ? tagStr : tagStr.substring(0, idx);
    const propStr = (idx === -1) ? null : tagStr.substring(idx + 1);
    text = lc ? text.toLowerCase().trim() : text.trim();
    /**
     * Mar 11, ddm - truncate by max size
     */
    text = text.slice(0, UserProps.TAG_MAX_LENGTH);

    // now strip any non-alphanumeric character.
    // THIS CAN BE REAL HEAVY!!! Need to revisit
    // NOTE: also must keep TAGNUM_PREFIX (tilde)
    // eslint-disable-next-line
    const cjk_charset = cjk();
    if (cjk_charset.toRegExp().test(text)) {
      // todo punctuation
      console.log('Supporting CJK hashtag: ', text);
    } else {
      text = text.replace(/[^0-9a-z_]/gi, '');
      text = text.replace(' ', WORD_SPLIT);
    }

    return propStr ? (`${text}:${propStr}`) : text;
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

export default TagUtil;

