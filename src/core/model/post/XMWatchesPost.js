
import { ModelType, ModelFolder } from '../ModelConsts';
import { XMWatches } from '../social/XMWatch';

const _CLSNAME = 'XMWatchesPost';

/**
 * Model who a user watchs in a separate managed object.
 * The unique ID will be the same with the user ID, but
 * data stored in separate space, using different folder
 * name.
 */
class XMWatchesPost extends XMWatches {
  /**
   *
   * @param {string} clsname
   * @param {*} props
   * @see #CreateNew
   */
  constructor(clsname = _CLSNAME, props) {
    super(clsname, props);
    this.class = XMWatchesPost;
  }


  // *************************************************************
  //
  // Class/static methods. This should also include any
  // methods that can be used as helper for generic
  // JSON data structure should be implemented here
  // and called by instance methods.
  //
  // *************************************************************

  /**
   * Convenient method to check if the given object
   * is an instance of this class (XMUser)
   */
  static IsInstance(obj) {
    return obj instanceof XMWatchesPost;
  }

  /**
   * Return the default folder/table/collection name used
   * for storing stats
   */
  static GetFolderName() {
    return ModelFolder.WATCHES_POST;
  }

  static GetName() {
    return _CLSNAME;
  }

  static GetTypeID() {
    return ModelType.WATCHES_POST;
  }

  /**
   * Create a new instance
   *
   * @param {string} userId User ID, which is also the ID of this object
   * @param {string} title category title, optional
   * @param {string} desc optional
   */
  static CreateNew(userId, tracking = false) {
    const newObj = new XMWatchesPost();
    newObj.initNew();
    newObj._setId(userId);   //

    if (tracking) { newObj.enableTrackingNew(); }

    return newObj;
  }

} // class XMWatchesPost


XMWatchesPost.RegisterType(XMWatchesPost);

export default XMWatchesPost;
