import XMActivityLog from '../activity/XMActivityLog';
import ModelType from '../ModelConsts';

export default class SocialModelHelper {

  /**
   *
   * @param {XMSocialIndexable} obj
   * @param {string} action
   * @return {XMActivityLog}
   */
  static CreateActivityLogFromSocialIndexable(obj, action = null) {

    const xActivity = new XMActivityLog();

    if (action == null) { action = ''; }

    const postId = obj.getPostId();
    const posterId = obj.getPosterId();
    const isComment = obj.isComment();
    const type = isComment ? ModelType.COMMENT : ModelType.POST;
    const objId = obj.getId();
    xActivity.setInitiator(posterId);
    xActivity.setSourceObject(ModelType.USER, posterId);
    xActivity.setTargetObject(type, objId, posterId);
    xActivity.setPostId(postId);

    return xActivity;
  }
}
