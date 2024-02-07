import {
  getISODateString,
  isValidISODateString,
} from './date';
import {
  addDays,
  isBefore,
  startOfToday,
} from 'date-fns';

export const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

export const dateDataRequiredValidator = (dateData) => {
  return () => {
    if (!dateData || !dateData.year && typeof dateData.month !== 'number' && !dateData.day) {
      return false;
    }
    return true;
  };
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

export const pastDateValidator = (value) => {
  return isBefore(value, addDays(startOfToday(), 1));
};

export const optionalInvalidDateValidator = (validator) => {
  return (value, vm) => {
    if (!(value instanceof Date) || isNaN(value)) {
      return true;
    }
    return validator(value, vm);
  };
};

export const phnFirstDigitValidator = (value) => {
  if (typeof(value) !== 'string') {
    return false;
  }
  return value[0] === '9';
};

export const optionalValidator = (validator) => {
  return (value, vm) => {
    if (!value) {
      return true;
    }
    return validator(value, vm);
  };
};