import ObjectBase from '../ObjectBase';

/**
 * Consts related to UI styling and rendering that can be done
 * both at backend as well as front-end/web
 */
export class VisualConsts extends ObjectBase {
  static get COLOR_BRAND_PRIMARY() { return '#397ab1'; }
  static get COLOR_BG_INVERTED() { return '#838698'; }

  static get COLOR_BLACK_LITE() { return '#555555'; }
  static get COLOR_GREY() { return '#dddddd'; }
  static get COLOR_LIGHT_GREY() { return '#f9f9f9'; }
  static get COLOR_DARK_GREY() { return '#777777'; }
  static get COLOR_DARKER_GREY() { return '#444444'; }
  static get COLOR_OFF_WHITE() { return '#fafafa'; }
  static get COLOR_GREEN() { return '#e4ede0'; }
  static get COLOR_BLUE() { return '#dfe7ed'; }
  static get COLOR_RED() { return '#eddfdf'; }
  static get COLOR_PURPLE() { return '#9333ff'; }
  static get COLOR_PINK_LITE() { return '#f2f2f2'; }
  static get COLOR_GOLD_METELLIC() { return '#d4af37'; }
  static get COLOR_GOLD_YELLOW() { return '#ffdf00'; }
  static get COLOR_GOLD_OLD() { return '#cfb53b'; }

  static get FONT_FAMILY() { return 'Helvetica, Arial, sans-serif'; }

  static get COLOR_TEXT_INSTRUCTIONS() { return 'blue'; }

  static get COLOR_ERROR_MSG() { return 'red'; }
  static get COLOR_INFORM_MSG() { return 'blue'; }

  static get DEFAULT_POST_WIDTH() { return 1200; } // 16:9
  static get DEFAULT_POST_HEIGHT() { return 675; }

  static get DEFAULT_THUMBNAIL_WIDTH() { return 764; } // 1.91:1
  static get DEFAULT_THUMBNAIL_HEIGHT() { return 400; }
  static get DEFAULT_THUMBNAIL_FGCOLOR() { return '#397ab1'; }
  static get DEFAULT_THUMBNAIL_BGCOLOR() { return '#fafafa'; }
}

/**
 * HTML Render property and parameter labels
 */
export class RenderProps extends VisualConsts {
  static get PROP_WIDTH() { return 'width'; }
  static get PROP_HEIGHT() { return 'height'; }

  // static get PROP_FGCOLOR() { return "fgcolor"; }
  // static get PROP_BGCOLOR() { return "bgcolor"; }
  // static get PROP_BGIMAGE_URL() { return "bgimgurl"; }
  // static get PROP_INCL_TITLE() { return "inclttl"; }

  static get LAYOUT_TILE() { return 'tile'; }
  static get LAYOUT_LIST() { return 'list'; }

  static get PARAM_BG_IMAGE() { return 'bgimg'; }
  static get PARAM_LAYOUT_THEME() { return 'theme'; }

  static get PROP_FGCOLOR() { return 'fgcolor'; }
  static get PROP_BGCOLOR() { return 'bgcolor'; }
  static get PROP_BGIMGURL() { return 'bgimgurl'; }
  static get PROP_INCL_TITLE() { return 'inclttl'; }

}

/**
 * Post-specific rendering consts
 */
export class PostRenderConsts extends RenderProps {
  static get POST_LAYOUT_DEFAULT() { return 'default'; }

}

/**
 * See UIStyleConsts in frontend app for styles not rendered at backend
 */
export class StyleConsts extends VisualConsts {


}


export default VisualConsts;
