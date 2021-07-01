
import XMSocialIndexable from './XMSocialIndexable';
import { ModelType, ModelFolder } from '../ModelConsts';
import XCommentFeed from '../post/XCommentFeed';
import XMComment from './XMComment';


const _CLSNAME = 'XCommentInfo';

/**
 * CommentInfo - holds essential data/properties from XMComment,
 * XMCommentStats, and whatever that is best optimized as
 * an aggregate set.
 *
 * NOTE: This is designed as a transient instance
 *
 */
class XCommentInfo extends XMComment {
  static get COMMENT_STATS_ID() { return 'cmstatsId'; }

  /**
   *
   * @param {string} clsname
   * @param {{}} props
   */
  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XCommentInfo;
  }

  setCommentStatsId(id) {
    return this.setCommentStatsId(XCommentInfo.COMMENT_STATS_ID, id);
  }

  /**
   * ID of the comments stats object
   *
   * @return {string} suitable poststat's ID
   */
  getCommentStatsId(defaultVal = null) {
    const data = this.getData(false);
    return data ? XCommentInfo.GetCommentStatsId(data, defaultVal) : defaultVal;
  }

  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /**
   * Not used as it's expected to be embedded.
   */
  static GetFolderName() {
    return ModelFolder.NONE;
  }

  static GetName() {
    return _CLSNAME;
  }

  /**
   * Return the short identifier for this type. This should
   * be overriden by subclasses.
   */
  static GetTypeID() {
    return ModelType.COMMENT_INFO;
  }

  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string}
   */
  static GetCommentId(jsonObj, defaultVal = null) {
    jsonObj = jsonObj ? XCommentInfo.Unwrap(jsonObj) : null;
    const idVal = jsonObj ? jsonObj[XCommentInfo.PROP_ID] : null;
    return idVal || defaultVal;
  }

  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string}
   */
  static GetCommentStatsId(jsonObj, defaultVal = null) {
    jsonObj = jsonObj ? XCommentInfo.Unwrap(jsonObj) : null;
    let idVal = XCommentInfo.GetObjectField(jsonObj, XCommentInfo.COMMENT_STATS_ID, null);
    if (idVal == null) {
      idVal = XCommentInfo.GetId(jsonObj, null);
    }
    return idVal || defaultVal;
  }

  /**
   *
   * @param {string} postId
   * @return {XMPostComment}
   */
  static CreateFromComment(xComment, xCommentStats) {
    const newObj = new XCommentInfo();
    const existingData = xComment.getData(false);
    if (existingData) { newObj.data = { ...existingData }; } else { newObj.newInit(); }

    return newObj;
  }

} // class Comment

XCommentInfo.RegisterType(XCommentInfo);

export default XCommentInfo;
