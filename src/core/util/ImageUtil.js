import SymbolExpr from '../util/SymbolExpr';
import Util from '../Util';

/**
 * Utility functions related to images and image paths
 *
 */

const _CLSNAME = 'ImageUtil';

export class ImageUtil {
  static get CACHE_ROOT() { return 'cache'; }
  static get TAG_ROOT() { return 'cache/t'; }
  static get TAG_ICON_ROOT() { return 'cache/t/ico'; }
  static get THUMBNAIL_DIR() { return 'tn'; }
  static get THUMBNAIL_ROOT() { return 'cache/tn'; }

  static get CACHE_PREFIX() { return '/cache/'; }
  static get THUMBNAIL_PREFIX() { return '/cache/tn/'; }
  static get CACHE_ROOT_PATH() { return '/cache'; }
  static get USER_ICON_PATH() { return 'cache/u/ico'; }
  static get USER_IMAGE_PATH() { return 'cache/u/img'; }

  /**
     * Derive a thumbnail file path within cache directory
     * for the given type of object, its ID (including username), and theme.
     *
     * @param {string} objectType one of "post", "comment", etc.
     * @param {*} objectId
     * @param {string=} themeId style type. If null then store as default.jpg
     * @param {string} version TBD
     * @param {string} cacheRoot root path for the cache. If null, use default
     *
     * @see ~DeriveRLThumbnailCachePath
     */
  static DeriveThumbnailCachePath(objectType, objectId, themeId, version, cacheRoot = null) {
    if (cacheRoot == null) { cacheRoot = this.CACHE_ROOT; }
    const cachePrefix = `${cacheRoot}/${this.THUMBNAIL_DIR}/${objectType}`;
    // console.log("DeriveThumbnail: objectId: ", objectId);
    const objRootPath = Util.FilePathDelim3_Min9(objectId);
    const vext = (Util.StringIsEmpty(version)) ? '' : `_${version}`;
    const fspec = themeId
      ? `${cachePrefix}/${objRootPath}/theme/${themeId}${vext}.jpg`
      : `${cachePrefix}/${objRootPath}/theme/notheme${vext}.jpg`;


    return fspec;
  }

  /**
     * Derive post thumbnail path within cache directory
     *
     * @param {string} postId
     * @param {string} cacheRoot root path for the cache. If null, use default
     *
     */
  static DerivePostThumbnailCachePath(postId, cacheRoot = null) {
    if (cacheRoot == null) { cacheRoot = this.CACHE_ROOT; }
    const cachePrefix = `${cacheRoot}/${this.THUMBNAIL_DIR}/post`;
    // console.log("DerivePostThumbnailCachePath: objectId: ", objectId);
    const objRootPath = Util.FilePathDelim3_Min9(postId);
    const fspec = `${cachePrefix}/${objRootPath}.jpg`;
  }

  /**
     * Derive a image file path within cache directory.
     *
     * @param {string} objectType one of "post", etc
     * @param {string=} userId if null, then use "tmp" as the container
     * @param {string} filename should have an extension already
     * @param {string} cacheRoot root path for the cache. If null, use default
     * @return {string} derived filename inside cache/temp directory
     *
     */
  static DeriveImageCachePath(userId, filename, cacheRoot = null) {
    if (cacheRoot == null) { cacheRoot = this.CACHE_ROOT; }
    if (userId == null) { userId = 'tmp'; }
    const cachePrefix = `${cacheRoot}/images/users/${userId}`;
    // console.log("DeriveThumbnail: objectId: ", objectId);
    const brokenFilename = Util.FilePathDelim3_Min9(filename);
    const fspec = `${cachePrefix}/${brokenFilename}`;

    return fspec;
  }

  /**
     * Derive a image file path within cache directory.
     *
     * @param {string} objectType one of "image", "video", etc.
     * @param {string=} userId if null, then use "tmp" as the container
     * @param {string} filename should have an extension already
     * @param {string} cacheRoot root path for the cache. If null, use default
     * @return {string} derived filename inside cache/temp directory
     *
     */
  static DeriveUploadPath(objectType, userId, filename, cacheRoot = null) {
    if (cacheRoot == null) { cacheRoot = this.CACHE_ROOT; }
    if (userId == null) { userId = 'tmp'; }
    if (objectType == null) { objectType = 'misc'; }
    const folderPath = `${cacheRoot}/user/${userId}/upload/${objectType}`;
    // console.log("DeriveThumbnail: objectId: ", objectId);
    const brokenFilename = Util.FilePathDelim3_Min9(filename);
    const fspec = `${folderPath}/${brokenFilename}`;

    return fspec;
  }


  /**
     * Process given URL and construct as absolute
     * if it is a relative path but has an inline
     * src provider.
     *
     * @param {string} urlExpr take an URL value that
     * might be a relative path, but may have inline
     * property "src" that contain provider type.
     * @param {string} provider optional provider if known.
     * If this is not null, then will not parse urlExpr
     * to check for inline "src"
     * @return {string} expand URL if relative, or
     * return as-is if already absoulte
     */
  static AbsoluteIconURL(urlExpr, provider = null) {
    if (urlExpr == null) { return null; }
    const _m = `${_CLSNAME}.AbsURL`;
    if ((provider == null) && SymbolExpr.HasProps(urlExpr)) {
      provider = SymbolExpr.GetPropertyValue(urlExpr, 'src', null);
    }
    if (provider == null) { return urlExpr; } // no provider - return as-is

    const path = SymbolExpr.GetSymbolName(urlExpr);
    if (path == null) {
      console.error(`${_m}: bad url expr: ${urlExpr}`);
      return urlExpr;
    }
    let url = null;
    switch (provider) {
      case 'tmdb':
        if (path.startsWith('/')) { url = `https://image.tmdb.org/t/p/w500${path}`; }
        break;

      case 'fa':
        // console.log(`${_m}: provider "fa" not supported anymore.`);
        break;

      default:
        console.log(`${_CLSNAME}: Provider unknown: ${provider}`);
    }
    return url || urlExpr;
  } // AbsoluteIconURL

  /**
     * Derive an image subpath for optimal filesystem storage
     * of a tag (category). Because there can be millions of tags,
     * we can't just have all image files in one flag directory,
     * so will try to "fan-out".
     *
     * @param {string} tagname string name to use to derive
     * @param {boolean} inclRoot true to prepend with tag's
     * root directory in cache
     */
  static DeriveTagIconDir(tagname, inclRoot = true) {
    if ((tagname == null) || (tagname.length === 0)) { return null; }

    // remove special characters
    let basestr = tagname.replace(/[^a-zA-Z]/g, '');
    if (basestr.length === 0) {
      console.error(`${_CLSNAME}: Oops. tagname stripped to nothing: ${tagname}`);
      basestr = tagname;  // oops
    }

    // for now, just use u9p to first 3 character as folder name
    let dir = basestr.substring(0, 3);

    if (inclRoot) { dir = `${ImageUtil.TAG_ICON_ROOT}/${dir}`; }

    return dir;
  }
}

export default ImageUtil;
