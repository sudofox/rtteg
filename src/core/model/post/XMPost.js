import Util from '../../Util';
import XMPostItem from '../activity/XMPostItem';
import { ModelType, ModelFolder } from '../ModelConsts';
import SocialModelHelper from '../social/SocialModelHelper';
import XMSocialIndexable from '../social/XMSocialIndexable';

const _CLSNAME = 'XMPost'; // match class name


/**
 * Model a User Post, which can be variety of types, including
 * comments.
 */
class XMPost extends XMSocialIndexable {

  constructor(clsname = _CLSNAME, props = null) {
    super(clsname, props);
    this.class = XMPost;
    this._enableACL();
  }

  /**
   * Polymorphic override parent.
   *
   * @return {boolean} true
   */
  isPost() {
    return true;
  }

  /**
   * Answers the question whether this post is a repost
   * with content, which mean the original post is
   * embedded (but in the future, embedding may not
   * mean it's a repost)
   *
   * @return {booelan} true if this is a repost with original
   * content
   */
  isRepost() {
    // for now, embedding implies adding original content on top
    // of original. However, in the futrure, this may NOT be
    // the case.
    return Util.NotNull(this.get(XMPost.PROP_EMBEDDED_POST, null));
  }

  /**
   * Return this post's Id. It's same with getId()
   * but be consistent at parent class level.
   *
   * @return {string}
   */
  getPostId() {
    return this.getId();
  }

  /**
   * Store the reposted/shared object as an embedded object.
   *
   * @param {XMPost} xPostObj object to be stored.
   * @return {*} old value, if any
   *
   * @see ~CreateRepost
   * @see ~hasRepostObject
   * @see ~getRepostObject
   */
  embedPost(xPostObj) {
    // first, we are going to make a copy
    const clonedPost = XMSocialIndexable.CloneInstance(xPostObj);
    try {
      // only XMPost as XMComment should not have embedded content
      // right now...
      clonedPost.clear(XMPost.PROP_EMBEDDED_POST);
    } catch (err) {
      console.log(err);
    }
    const oldObj = this.set(XMPost.PROP_EMBEDDED_POST, clonedPost);
    const origPostId = xPostObj.getId();
    const origUserId = xPostObj.getOwnerId();
    this.setOriginalPostInfo(origPostId, origUserId);
    return oldObj;
  }

  /**
   * Create an XPostItem object that is suitable to be used
   * inside XPostFeed, or use as input to functions that takes
   * only XPostItem. This post object and any piggybacked data
   * will be copied to the newly created post item.
   *
   * @param {string=} receiverId optional (for printing perspective)
   * @return {XPostItem}
   */
  createXPostItem(receiverId = null, action = null) {
    const xActivity = SocialModelHelper.CreateActivityLogFromSocialIndexable(this, action);
    xActivity.setPostId(this.getId());

    const xPostItem = XMPostItem.CreateFromActivity(receiverId, xActivity);

    // copy all in aux_data which some will be of interest
    xPostItem.setAuxData(this.getAuxData(true));

    // add self as a piggyback object
    xPostItem.setXAuxObject(this);

    return xPostItem;
  }


  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /**
   * Return the default folder/table/collection name used
   * for storing categories.
   *
   * @return {string}
   */
  static GetFolderName() {
    return ModelFolder.POST;
  }

  /** @return {string} */
  static GetName() {
    return _CLSNAME;
  }

  /** @return {string} */
  static GetTypeID() {
    return ModelType.POST;
  }

  /**
   * Create a new instance. Default is no public read. Caller
   * must explicitly call setPublicREAD(true).
   *
   * @param {string=} postId assigned Id, if any
   * @return {XMPost} new instance
   */
  static CreateNew(postId = null, isPrivate = false) {
    const newObj = new XMPost();
    newObj.initNew();
    newObj.setCreatedTS();

    if (postId) {
      newObj._setId(postId);
    }

    return newObj;
  }

  static CreatePostNotFound(postId) {
    const newObj = XMPost.CreateNew(postId);

    newObj.setNotFound(true);
    newObj.setText('Content Not Found');

    return newObj;
  }

  /**
   * Create a new post object that is a repost of another
   * post. This is not a simple share but a stanalone
   * post of its own but just reference/embed another
   * post.
   *
   * @param {string=} postId unique Id to assign to this post. This shold
   * be null on the client side as server will assign an unique Id
   * @param {string} userId reposter's userId
   * @param {string} origPostId specify the ID of the original post
   * @param {XMPost=} origPostObj optional on the client side to include
   * as server will load the post and embed
   * @return {XMPost} note no _id is assigned and use default ACL
   */
  static CreateFromOriginalInfo(origPostId, origPosterId) {
    // copy over entire content with cloning
    const newPost = XMPost.CreateNew();

    newPost.setOriginalPostInfo(origPostId, origPosterId);

    return newPost;
  }

  static CreateFromOriginalPost(xPostObj) {
    const newPost = XMPost.CreateNew();
    newPost.embedPost(newPost);
    return newPost;
  }

} // class XMPost

XMPost.RegisterType(XMPost);


export default XMPost;
