
import XMSocialIndexable from './XMSocialIndexable';
import { ModelType, ModelFolder, MessageProps } from '../ModelConsts';
import XMPostItem from '../activity/XMPostItem';
import SocialModelHelper from './SocialModelHelper';


const _CLSNAME = 'Comment';
/**
 * Model a XMcomment
 *
 */
class XMComment extends XMSocialIndexable {

  /**
     * The object ID of the Object Model associated with this
     * comment object.
     */
  static get POST_ID() { return MessageProps.COMMENT_POST_ID; }

  /**
     *
     */
  static get PARENT_COMMENT_ID() { return MessageProps.PARENT_COMMENT_ID; }

  /**
     *
     * @param {string} clsname
     * @param {{}} props
     */
  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMComment;
    this._enableACL();
  }

  /**
   * Polymorphic override parent.
   *
   * @return {boolean} true
   */
  isComment() {
    return true;
  }

  /**
     * Set ID of post that this comment is associated with,
     * regardless if it's a direct reply or nested.
     *
     *
     * @param {string} objectId
     * @return {string} previously set value, or null if none
     */
  setPostId(objectId) {
    return this.set(XMComment.POST_ID, objectId);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {string=} either post's ID or null if no post (sub-comment)
     */
  getPostId(defaultVal = null) {
    return this.get(XMComment.POST_ID, defaultVal);
  }

  /**
     *
     * @param {string} commentId
     */
  setParentCommentId(commentId) {
    return this.set(XMComment.PARENT_COMMENT_ID, commentId);
  }

  /**
   *
   * @param {string} commentId
   */
  getParentOwnerId(defaultVal = null) {
    return this.get(XMComment.PARENT_COMMENT_ID, defaultVal);
  }

  setParentOwnerId(ownerId) {
    return this.set(XMComment.PROP_PARENT_OWNER_ID, ownerId);
  }

  /**
     *
     * @param {*} defaultVal
     * @return {string=} parent comment id, if any
     */
  getParentCommentId(defaultVal = null) {
    return this.get(XMComment.PARENT_COMMENT_ID, defaultVal);
  }

  /**
   *
   * @param {*} defaultVal
   * @return {XMPost} piggybacked/preloaded Post object
   */
  getPost(defaultVal = null) {
    return this.getAuxDataXField(ModelType.POST, null);
  }

  /**
   * If comment stats is piggybacked in the AUX_DATA field,
   * this convenient method will extract it and wrap it
   *
   * @param {*} defaultVal
   * @return {XMCommentStats}
   */
  getCommentStats(defaultVal = null) {
    return this.getAuxDataXField(ModelType.COMMENT_STATS, null);
  }

  /**
   * If userInfo is piggybacked in the AUX_DATA field,
   * this convenient method will extract it and wrap it
   *
   * @param {*} defaultVal
   * @return {XUserInfo}
   */
  getUserInfoMap(defaultVal = null) {
    return this.getAuxDataXField(ModelType.USERINFO, null);
  }

  /**
   *
   * @param {string=} receiverId optional (for printing perspective)
   * @return {XPostItem}
   */
  createXPostItem(receiverId = null, action = null) {
    const xActivity = SocialModelHelper.CreateActivityLogFromSocialIndexable(this, action);

    const xPostItem = XMPostItem.CreateFromActivity(receiverId, xActivity);

    return xPostItem;
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
    return ModelFolder.COMMENT;
  }

  static GetName() {
    return _CLSNAME;
  }

  /**
   * Return the short identifier for this type. This should
   * be overriden by subclasses.
   */
  static GetTypeID() {
    return ModelType.COMMENT;
  }

  /**
   *
   * @param {{}} jsonObj
   * @param {*} defaultVal
   * @return {string}
   */
  static GetPostId(jsonObj, defaultVal = null) {
    const idVal = jsonObj ? XMComment.Unwrap(jsonObj)[XMComment.POST_ID] : null;
    return idVal || defaultVal;
  }

  /**
   *
   * @param {*} defaultVal
   * @return {string=} parent comment id, if any
   */
  static GetParentCommentId(jsonObj, defaultVal = null) {
    return XMComment.GetObjectField(jsonObj, XMComment.PARENT_COMMENT_ID, defaultVal);
  }


  /**
     *
     * @param {string} parentCommentId if specified, then this comment
     * is a reply to an existing comment, not to psot
     * @param {string} postId if specified but parentCommentId is null,
     * then this comment replies directly to a post
     * @return {XMPostComment}
     */
  static CreateNew(parentCommentId, postId) {
    const newObj = new XMComment();
    newObj.initNew();
    newObj.setCreatedTS();

    if (parentCommentId) {
      newObj.setParentCommentId(parentCommentId);
    }
    if (postId) {
      newObj.setPostId(postId);
    }
    return newObj;
  }

  static CreateCommentNotFound(commentId) {
    const newObj = XMComment.CreateNew(commentId);

    newObj.setNotFound(true);
    newObj.setText('Content Not Found');

    return newObj;
  }

} // class Comment

XMComment.RegisterType(XMComment);

export default XMComment;
