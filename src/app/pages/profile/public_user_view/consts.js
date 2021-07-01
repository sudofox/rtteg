export const days = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];

export const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const getYears = () => {
  let currentYear = new Date().getFullYear();
  let years = [];

  let startYear = currentYear - 150;
  while (startYear <= currentYear) {
    years.push(startYear++);
  }

  return years.reverse();
};

export const MIN_USERNAME_LENGTH = 1;
export const MAX_USERNAME_LENGTH = 50;
export const MAX_BIO_LENGTH = 160;
export const MAX_LOCATION_LENGTH = 30;
export const MAX_WEBSITE_LENGTH = 100;
