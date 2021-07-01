import CryptoJS from "crypto-js";

export const fileToMd5 = (file) => {
  if (!file) {
    return;
  }

  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.addEventListener("load", function () {
      let hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(reader.result));
      let md5 = hash.toString(CryptoJS.enc.Hex);
      resolve(md5);
    });

    reader.addEventListener("onerror", function () {
      reject("");
    });

    reader.readAsBinaryString(file);
  });
};
