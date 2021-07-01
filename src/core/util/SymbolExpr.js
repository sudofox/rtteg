import JSON5 from 'json5';
import Util from '../Util';

/**
 * Utilities on embedding properties into a symbol to form a
 * symbol expression. Parsing and comparison are also available
 * but not necessarily complete.
 *
 * The format of the string is "symbol:{label1:value1,label2:value2}"
 *
 * NOTE: TagUtil utilize these for tag expressions.
 */
export class SymbolExpr {
  /**
   * Return symbol name portion of the symbol expression in the
   * format of name[:{props}]
   *
   * @param {string} symbol expression which may have the optional props
   * @param {function} normalizer function to normalize the name portion
   * @return {string} name portion of the symbol expression
   * @see ~GetSymbolName
   */
  static StripProps(symbol, normalizer = null) {
    if (!symbol) {
      return null;
    }
    const idx = symbol.indexOf(':');
    if (idx === -1) {
      return normalizer ? normalizer(symbol) : symbol;
    }

    const name = symbol.substring(0, idx);
    return normalizer ? normalizer(name) : name;
  }

  /**
   * Determine if the given symbol has properties attached to
   * it. The format of a symbol without property is just the name
   * it self, but with properties, it has a JSON "Stringified"
   * property: name:{label1:value1,label2:value2,...}
   *
   * @param {string} symbol express to check if has symbol:{props}
   */
  static HasProps(symbol) {
    const idx = symbol.indexOf(':{');
    return idx !== -1;
  }

  /**
   * Return name portion of the symbol expression in the
   * format of name[:{props}]
   *
   * @param {string} symbol expression which may have the optional props
   * @param {boolean} normalizer function to normalize the name portion
   * @return {string} name portion of the symbol expression
   *
   * @see #StripProps
   * @see #ParseSymbol
   * @see #ComposeSymbol
   */
  static GetSymbolName(symbol, normalizer = null) {
    return SymbolExpr.StripProps(symbol, normalizer);
  }

  /**
   * Parse a symbol expression and return props separately if exists
   *
   * @param {string} symbol format: '#field:{type:"<modelType>",_id:"<objId>"}'
   * where pound sign is optional
   * @param {boolean} parseProps if false, leave props as string. If true, parse into object
   * @param {boolean} normalizer function to normalize the name portion
   * @return {[tagname,{props}]} array element 0 is tagname, then array[1] is props object
   *
   * @see #GetSymbol
   * @see #StripProps
   * @see #ComposeSymbol
   */
  static ParseSymbol(symbol, parseProps = false, normalizer = null) {
    if (symbol.startsWith('#')) {
      symbol = symbol.substring(1);
    }

    const idx = symbol.indexOf(':{');
    if (idx === -1) {
      return [symbol];
    }

    const name = symbol.substring(0, idx);
    let props = symbol.substring(idx + 1);
    if (parseProps) {
      try {
        props = JSON5.parse(props);
      } catch (e) {
        console.error('PS: ?Error:', JSON5.stringify(props));
        console.log(e);
      }
    }
    const result = [normalizer ? normalizer(name) : name, props];
    return result;
  } // ParseSymbol

  /**
   * Compose a complete symbol expression with given name and property object
   *
   * @param {string} symbol tagname only
   * @param {object} props props to add
   * @param {function} normalizer function to run on the symbol before concatenate
   * @return {string} symbol expression in string
   *
   * @see #GetSymbol
   * @see #ParseSymbol
   * @see #CompareSymbol
   */
  static ComposeSymbol(symbol, props, normalizer = null) {
    if (typeof props === 'object') {
      props = JSON5.stringify(props);
    } else {
      props = String(props);
    }

    return `${symbol}:${props}`;
  }

  /**
   * Compare two symbol names without regards for the values of the props
   *
   * @param {string} symbol1 string in the format of name[:{props}]
   * @param {string} symbol2 string in the format of name[:{props}]
   * @param {*} normalizer transform any part of the name
   * @return {boolean} true if match
   *
   * @see #GetSymbolName
   * @see #ParseSymbol
   * @see #ComposeSymbol
   */
  static CompareSymbols(symbol1, symbol2, normalizer = null) {
    const name1 = SymbolExpr.StripProps(symbol1, normalizer);
    const name2 = SymbolExpr.StripProps(symbol2, normalizer);

    // console.log(`CompareSymbols: name1: ${name1}, name2: ${name2}`);
    return name1 === name2;
  }

  /**
   * Return the value of a property label encoded within the
   * tag expression string
   *
   * @param {string} symbol expression string in format of: name[:{props}]
   * @param {string} key lookup value
   * @param {*} defaultVal
   *
   * @see ~HasProperty
   * @see ~SetProperty
   */
  static GetPropertyValue(symbol, key, defaultVal = null) {
    const parsed = SymbolExpr.ParseSymbol(symbol, true);
    if (parsed == null || parsed.length === 1) {
      return defaultVal;
    } // no properties
    const props = parsed[1];
    return props[key] ? props[key] : defaultVal;
  }

  /**
   * Determine if the given key value exists inthe properties
   * of the given tag expression string.
   *
   * @param {string} symbolExpr expression string in format of: name[:{props}]
   * @param {string} key property label to check
   * @return {boolean} true if exists, false if not
   *
   * @see #GetProperty
   * @see #SetProperty

   */
  static HasProperty(symbolExpr, key) {
    const parsed = SymbolExpr.ParseSymbol(symbolExpr, true);
    if (parsed == null || parsed.length === 1) {
      return false;
    }
    const props = parsed[1];
    return props.hasOwnProperty(key);
  } // HasProperty

  /**
   * Set a property value of the given tag expression string.
   * The tag can be just symbol name itself.
   * NOTE: this is not efficient way to set multiple properties.
   * Best to construct such object and compose directly.
   *
   * @param {string} symbolExpr expression string in format of name[:{props}]
   * or just name if no properties
   * @param {string} key property label
   * @param {value} value value to assign to key and can be null
   * @return {string} symbol expression including the new property key/value
   *
   * @see ~HasProperty
   * @see ~GetProperty
   */
  static SetProperty(symbolExpr, key, value) {
    const parsed = SymbolExpr.ParseSymbol(symbolExpr, true);
    const props = parsed == null || parsed.length === 1 ? {} : parsed[1];
    props[key] = value;
    return SymbolExpr.ComposeSymbol(parsed[0], props);
  } // SetProperty

  /**
   * Remove a property label/value of the given tag expression string.
   * The tag can be just symbol name itself.
   * NOTE: this is not efficient way to set multiple properties.
   * Best to construct such object and compose directly.
   *
   * @param {string} symbolExpr expression string in format of name[:{props}]
   * or just name if no properties
   * @param {string} key property label
   * @param {value} value value to assign to key and can be null
   * @return {string} symbol expression with property label/value removed,
   * or itself if nothing is removed. If no more properties, then
   * only the tagname portion is returned, not tagname:{}
   *
   * @see ~HasProperty
   * @see ~GetProperty
   */
  static RemoveProperty(symbolExpr, key) {
    const parsed = SymbolExpr.ParseSymbol(symbolExpr, true);
    let props = parsed == null || parsed.length === 1 ? {} : parsed[1];
    if (!props[key]) {
      return symbolExpr;
    } // no symbol - bail

    delete props[key];
    if (Util.ObjectIsEmpty(props)) {
      props = null;
    }
    return props == null
      ? parsed[0]
      : SymbolExpr.ComposeSymbol(parsed[0], props);
  } // RemoveProperty

  /**
   * Take a text/template that may contain symbol expressions
   * that are identified with a wrapping "#[#symbolExpr]#" style.
   * The text is parsed into sequential fragments, where some
   * are the symbol expressions while others are straight text.
   *
   * @param {string} text text to parse
   * @return {string[]} sequential parts in an array, with
   * symbole expressions wrapper removed but the inner prefix "#"
   * is retained.
   */
  static ParseExprWrappers(text) {
    // eslint-disable-next-line
    let frags = text.split(/(\#\[|\]\#)/g);
    frags = frags.filter((f) => {
      return f !== '#[' && f !== ']#' && f !== '';
    });
    // console.log(`ParseExprWrappers: frags:`, frags);
    return frags || [];
  }
} // EmbedProp

export default SymbolExpr;
