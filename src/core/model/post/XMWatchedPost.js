
import { ModelType, ModelFolder } from '../ModelConsts';
import { XMWatched } from '../social/XMWatch';

const _CLSNAME = 'XMWatchedPost';

/**
 * Model who a user follows in a separate managed object.
 * The unique ID will be the same with the user ID, but
 * data stored in separate space, using different folder
 * name.
 */
class XMWatchedPost extends XMWatched {

  /**
   *
   * @param {string} clsname
   * @param {*} props
   * @see #CreateNew
   */
  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMWatchedPost;
  }


  // *************************************************************
  //
  // Class/static methods.
  //
  // *************************************************************

  /**
   * Convenient method to check if the given object
   * is an instance of this class (XMWatchedRL)
   */
  static IsInstance(obj) {
    return obj instanceof XMWatchedPost;
  }

  /**
   * Return the default folder/table/collection name used
   * for storing stats
   */
  static GetFolderName() {
    return ModelFolder.WATCHED_POST;
  }

  static GetName() {
    return _CLSNAME;
  }

  static GetTypeID() {
    return ModelType.WATCHED_POST;
  }

  /**
   * Create a new instance
   *
   * @param {string} userId User ID, which is also the ID of this object
   * @param {string} desc optional
   */
  static CreateNew(userId, tracking = false) {
    const newObj = new XMWatchedPost();
    newObj.initNew();
    newObj._setId(userId);   //

    if (tracking) { newObj.enableTrackingNew(); }

    return newObj;
  }
} // class XMWatchedPost


XMWatchedPost.RegisterType(XMWatchedPost);

export default XMWatchedPost;
