import {
  getISODateString,
  isValidISODateString,
} from './date';

export const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

export const dateDataValidator = (_, vm) => {
  const data = vm.birthdateData;
  if (!data || (!data.year && typeof data.month !== 'number' && !data.day)) {
    return true;
  }
  const year = data.year;
  const month = data.month;
  const day = data.day;
  if (!(year && typeof month === 'number' && day)
    && (year || typeof month === 'number' || day)) {
    return false;
  }
  const isoDateString = getISODateString(year, month + 1, day);
  return isValidISODateString(isoDateString);
};

export const dateDataRequiredValidator = (dateData) => {
  return () => {
    if (!dateData || !dateData.year && typeof dateData.month !== 'number' && !dateData.day) {
      return false;
    }
    return true;
  };
};

export const phnFirstDigitValidator = (value) => {
  if (typeof(value) !== 'string') {
    return false;
  }
  return value[0] === '9';
};
