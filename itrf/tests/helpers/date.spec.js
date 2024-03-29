import { parseISO } from "date-fns";
import {
  getISODateString,
  formatDate,
  formatDateDisplay,
  isValidISODateString,
} from "../../src/helpers/date";
import { it, describe, expect } from "vitest";

describe("Date helpers", () => {
  const oneDigitDate = parseISO("2021-07-01");
  const twoDigitDate = parseISO("2021-07-21");

  it("getISODateString", () => {
    expect(getISODateString("2021", "07", "08")).toEqual("2021-07-08");
    expect(getISODateString("2021", "7", "8")).toEqual("2021-07-08");
    expect(getISODateString(2021, 7, 8)).toEqual("2021-07-08");
    expect(getISODateString(null, 7, 8)).toEqual("0000-07-08");
    expect(getISODateString(2021, null, 8)).toEqual("2021-00-08");
    expect(getISODateString(2021, 7, null)).toEqual("2021-07-00");
    expect(getISODateString(null, null, null)).toEqual("0000-00-00");
    expect(getISODateString(undefined, undefined, undefined)).toEqual(
      "0000-00-00",
    );
    expect(getISODateString(NaN, NaN, NaN)).toEqual("0000-00-00");
  });

  it("isValidISODateString", () => {
    expect(isValidISODateString("2021-07-08")).toBe(true);
    expect(isValidISODateString("2021-08-01")).toBe(true);
    expect(isValidISODateString("0000-01-01")).toBe(true);
    expect(isValidISODateString("2021-02-31")).toBe(false);
    expect(isValidISODateString("0000-00-00")).toBe(false);
    expect(isValidISODateString(123)).toBe(false);
    expect(isValidISODateString("2021")).toBe(false);
    expect(isValidISODateString("ABC")).toBe(false);
    expect(isValidISODateString("ABCD-EF-GH")).toBe(false);
    expect(isValidISODateString("2021-8-1")).toBe(false);
    expect(isValidISODateString("2021-01-0A")).toBe(false);
    expect(isValidISODateString("2021-0B-01")).toBe(false);
    expect(isValidISODateString("202C-01-01")).toBe(false);
    expect(isValidISODateString(undefined)).toBe(false);
    expect(isValidISODateString(null)).toBe(false);
    expect(isValidISODateString(NaN)).toBe(false);
  });

  it("formatDate", () => {
    expect(formatDate(oneDigitDate)).toEqual("2021-07-01");
    expect(formatDate(twoDigitDate)).toEqual("2021-07-21");
    expect(formatDate(123)).toEqual(123);
    expect(formatDate(undefined)).toEqual(undefined);
    expect(formatDate(null)).toEqual(null);
    expect(formatDate(NaN)).toEqual(NaN);
  });

  it("formatDateDisplay", () => {
    expect(formatDateDisplay(oneDigitDate)).toEqual("July 1, 2021");
    expect(formatDateDisplay(twoDigitDate)).toEqual("July 21, 2021");
    expect(formatDateDisplay(123)).toEqual(123);
    expect(formatDateDisplay(undefined)).toEqual(undefined);
    expect(formatDateDisplay(null)).toEqual(null);
    expect(formatDateDisplay(NaN)).toEqual(NaN);
  });
});
