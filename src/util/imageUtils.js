import uuid from "react-uuid";
import AppConsts from "src/app/AppConsts";

export const blobToBase64 = (value) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      }
    };
    reader.readAsDataURL(value);
  });

export function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}
export function zoomImage(url, width = 500, height = 0) {
  return url && url.replace(/(\.[^\.]+$)/, `_${width}x${height}$1`);
}

export function handleMediaUrl(server, url) {
  if (!url || typeof url !== "string") {
    return null;
  }
  if (url?.startsWith("/")) {
    return server + url;
  }
  if (url?.startsWith("https://") || url?.startsWith("http://")) {
    return url;
  }
  return server + "/" + url;
}

export function dataURLtoFile(dataurl, filename = "base64image.png") {
  if (!/;base64,/.test(dataurl)) return dataurl;
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${uuid()}-${filename}`, {type: mime});
}

export function handleImgOnError(e) {
  const img = e.target;
  if (img.src.indexOf(AppConsts.URL_UNKNOWN_USER) === -1) {
    img.src = AppConsts.URL_UNKNOWN_USER;
  }
}

export function getVideoDuration(videoFile) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.src = window.URL.createObjectURL(videoFile.handle);
  });
}

/**
 * Compress Image
 * @param {File} file
 * @param {Number} quality
 * @param {Number} maxSideLength
 * @param {Number} maxFileSize
 */
export const compressImage = ({
  file,
  quality = 0.95,
  maxSideLength = 1200,
  maxFileSize = 5 * 1024 * 1024,
}) => {
  return new Promise((resolve, reject) => {
    const name = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const src = e.target.result;
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        if (file.size < maxFileSize && Math.min(w, h) < maxSideLength) {
          resolve(file);
          return;
        }
        const whRatio = w / h;
        let newW;
        let newH;
        if (w < h) {
          newW = Math.min(maxSideLength, w);
          newH = newW / whRatio;
        } else {
          newH = Math.min(maxSideLength, h);
          newW = newH * whRatio;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = newW;
        canvas.height = newH;
        // Rotate according to orientation
        getOrientation(file, function (orientation) {
          if (orientation === 6) {
            // Rotate 90°
            canvas.width = newH;
            canvas.height = newW;
            ctx.rotate(Math.PI / 2);
            ctx.translate(0, -newH);
          } else if (orientation === 3) {
            // Rotate 180°
            ctx.rotate(Math.PI);
            ctx.translate(-newW, -newH);
          }
          // After PNG is compressed, the background will become black, so need to set white.
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, newW, newH);
          ctx.drawImage(img, 0, 0, newW, newH);
          const base64 = canvas.toDataURL(file.type, quality);
          const bytes = window.atob(base64.split(",")[1]);
          // Handle exceptions and convert the ascii code less than 0 to greater than 0
          const ab = new ArrayBuffer(bytes.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
          }
          file = new Blob([ab], {type: file.type});
          file = new window.File([file], name, {type: file.type});
          resolve(file);
        });
      };
      img.onerror = (e) => {
        reject(e);
      };
    };
    reader.onerror = (e) => {
      reject(e);
    };
  });
};

/**
 * Get the orientation value of the original image
 * @param {File} file
 * @param {Function} callback
 */
function getOrientation(file, callback) {
  var reader = new FileReader();
  reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
  reader.onload = function (event) {
    var view = new DataView(event.target.result);

    if (view.getUint16(0, false) !== 0xffd8) return callback(-2);

    var length = view.byteLength;
    var offset = 2;

    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;

      if (marker === 0xffe1) {
        if (view.getUint32((offset += 2), false) !== 0x45786966) {
          return callback(-1);
        }
        var little = view.getUint16((offset += 6), false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;

        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) === 0x0112) {
            return callback(view.getUint16(offset + i * 12 + 8, little));
          }
        }
      } else if ((marker & 0xff00) !== 0xff00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };
}

/**
 * Change url to short one
 * @param {Object} options
 * @param {Array}  options.urls
 * @param {Number} options.width
 * @param {Number} options.height
 * @param {Number} options.maxLength
 * @returns short urls
 */
export const getShortUrls = ({
  urls = [],
  width = 0,
  height = 0,
  maxLength = 30,
}) => {
  const result = urls.slice(0, 1).map((url) => {
    let fullUrl = url;
    if (!/^https?:\/\//.test(url)) {
      fullUrl = handleMediaUrl(
        process.env.REACT_APP_MEDIA_BASE,
        /\.(mp4|m3u8)$/.test(url) ? url : zoomImage(url, width, height),
      );
    }
    return (
      fullUrl.slice(0, maxLength) + (fullUrl.length > maxLength ? "..." : "")
    );
  });
  return result;
};

/**
 * Get poster of video
 * @param {String} path
 * @param {Number | Function} secs
 * @param {Function} callback
 */
export const getVideoImage = (path, secs = 0) => {
  return new Promise((resolve) => {
    var me = this,
      video = document.createElement("video");
    video.onloadedmetadata = function () {
      if ("function" === typeof secs) {
        secs = secs(this.duration);
      }
      this.currentTime = Math.min(
        Math.max(0, (secs < 0 ? this.duration : 0) + secs),
        this.duration,
      );
    };
    video.onseeked = function (e) {
      var canvas = document.createElement("canvas");
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var img = new Image();
      img.src = canvas.toDataURL();
      resolve(img.src);
    };
    video.onerror = function (e) {
      resolve(undefined);
    };
    video.src = path;
  });
};

export const getImageStyleFromMetadata = (
  imageMetadata,
  containerWidth,
  containerHeight,
) => {
  const {
    wid,
    hgt,
    meta: {heads},
  } = imageMetadata;

  if (!containerWidth || !containerHeight || !heads?.length) {
    return {objectPosition: "50% 50%"};
  }
  containerWidth -= 2; // 2px border
  containerHeight -= 2; // 2px border

  const getRealDimensions = (imageWidth, imageHeight) => {
    return [containerWidth, (containerWidth / imageWidth) * imageHeight];
  };

  const availableSpaceToMove = (realImageHeight) => {
    return (realImageHeight - containerHeight) / 2;
  };

  const pixelsToCenter = (
    headTop,
    headBottom,
    imageHeight,
    realImageHeight,
  ) => {
    const headCenter = (headTop + headBottom) / 2 / imageHeight; // decimal value relative head center
    const headPositionInRealImage = headCenter * realImageHeight;
    return realImageHeight / 2 - headPositionInRealImage;
  };

  const [x, headTop, x2, headBottom] = heads[0].box;

  const [_, realHeight] = getRealDimensions(wid, hgt);

  const toCenter = pixelsToCenter(headTop, headBottom, hgt, realHeight);
  const availableSpace = availableSpaceToMove(realHeight);

  let pixels = 0;

  if (availableSpace <= 0) {
    return {objectPosition: "50% 50%"};
  }

  if (toCenter >= 0) {
    pixels = Math.min(availableSpace, toCenter);
  } else {
    pixels = Math.max(availableSpace * -1, toCenter);
  }

  return {objectPosition: `50% ${pixels}px`};
};

export const getTiledImageStyleFromMetadata = (
  imageMetadata,
  containerWidth,
  containerHeight,
) => {
  const {
    wid,
    hgt,
    meta: {heads},
  } = imageMetadata;

  if (!containerWidth || !containerHeight || !heads?.length) {
    return {height: "100%"};
  }

  const getRealDimensions = (imageWidth, imageHeight) => {
    return [containerWidth, (containerWidth / imageWidth) * imageHeight];
  };

  const availableSpaceToMove = (realImageHeight) => {
    return containerHeight - realImageHeight;
  };

  const pixelsToCenter = (
    headTop,
    headBottom,
    imageHeight,
    realImageHeight,
  ) => {
    const headCenter = (headTop + headBottom) / 2 / imageHeight; // decimal value relative head center
    const headPositionInRealImage = headCenter * realImageHeight;
    const containerCenter = containerHeight / 2;
    return containerCenter - headPositionInRealImage;
  };

  const [x, headTop, x2, headBottom] = heads[0].box;

  const [_, realHeight] = getRealDimensions(wid, hgt);

  if (realHeight < containerHeight) {
    return {height: "100%"};
  }

  const toCenter = pixelsToCenter(headTop, headBottom, hgt, realHeight);
  const availableSpace = availableSpaceToMove(realHeight);

  if (toCenter >= 0) {
    return {
      objectPosition: `50% 0px`,
    };
  }

  return {
    objectPosition: `50% ${Math.max(toCenter, availableSpace)}px`,
  };
};

export const getImageInfo = (file) => {
  return new Promise((resolve) => {
    var _URL = window.URL || window.webkitURL;
    var objectUrl = _URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      resolve({
        width: this.width,
        height: this.height,
      });
      _URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
};
