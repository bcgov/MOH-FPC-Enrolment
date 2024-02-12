export const padLeadingZeros = (number, size) => {
  if (!number) {
    number = 0;
  }
  if (!size) {
    size = 0;
  }
  if (number === 0 && size === 0) {
    return '';
  }
  let result = number + '';
  while (result.length < size) {
    result = '0' + result;
  }
  return result;
};
