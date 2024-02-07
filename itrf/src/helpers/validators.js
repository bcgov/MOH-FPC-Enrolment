import {
  getISODateString,
  isValidISODateString,
} from './date';

export const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

export const dateDataValidator = (dateData) => {
  return () => {
    if (!dateData || !dateData.year && typeof dateData.month !== 'number' && !dateData.day) {
      return true;
    }
    const year = dateData.year;
    const month = dateData.month;
    const day = dateData.day;
    if (!(year && typeof month === 'number' && day)
      && (year || typeof month === 'number' || day)) {
      return false;
    }
    const isoDateString = getISODateString(year, month + 1, day);
    return isValidISODateString(isoDateString);
  };
};

export const phnFirstDigitValidator = (value) => {
  if (typeof(value) !== 'string') {
    return false;
  }
  return value[0] === '9';
};
