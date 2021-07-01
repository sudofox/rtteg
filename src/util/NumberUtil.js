export const formatLongNumber = (num) => {
  if (num <= 0) return 0;
  let val = parseInt(num);
  if (val < 1000) return val;

  // thousands, millions, billions etc..
  let s = ["", "K", "M", "B", "T"];
  let sNum = Math.floor(("" + val).length / 3);
  let sVal = parseFloat(
    (sNum != 0 ? val / Math.pow(1000, sNum) : val).toPrecision(4),
  );

  if (sVal < 1 && sNum === 2) {
    sVal = sVal * 1000;
    sNum = 1;
  } else if (sVal < 1 && sNum === 3) {
    sVal = sVal * 1000;
    sNum = 2;
  } else if (sVal < 1 && sNum === 4) {
    sVal = sVal * 1000;
    sNum = 3;
  } else if (sVal % 1 != 0) {
    sVal = String(Math.floor(sVal * 10) / 10);
  }

  // handle long decimal values
  if (("" + sVal).split(".")[1]?.length > 2) {
    sVal = sVal.toFixed(2);
  }

  return sVal + s[sNum];
};

export const shortNum = (num, sigfigs_opt) => {
  // Set default sigfigs to 2
  sigfigs_opt = typeof sigfigs_opt === "undefined" ? 2 : sigfigs_opt;
  if (num <= 0) return 0;
  // Only assigns sig figs and suffixes for numbers > 1
  if (num < 1000) return num;
  // if (num <= 1) return num.toPrecision(sigfigs_opt);
  // Calculate for numbers > 1
  let power10 = Math.round((Math.log(num) / Math.LN10) * 1e6) / 1e6;
  let power10ceiling = Math.floor(power10) + 1;
  // 0 = '', 1 = 'K', 2 = 'M', 3 = 'B', 4 = 'T'
  let SUFFIXES = ["", "K", "M", "B", "T"];
  // 100: power10 = 2, suffixNum = 0, suffix = ''
  // 1000: power10 = 3, suffixNum = 1, suffix = 'K'
  let suffixNum = Math.floor(power10 / 3);
  let suffix = SUFFIXES[suffixNum];
  // Would be 1 for '', 1000 for 'K', 1000000 for 'M', etc.
  let suffixPower10 = Math.pow(10, suffixNum * 3);
  let base = num / suffixPower10;
  let baseRound = base.toFixed(sigfigs_opt);

  return baseRound + suffix;
};
