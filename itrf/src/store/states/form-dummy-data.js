import { v4 as uuidv4 } from "uuid";

export default {
  firstName: "KDAF",
  lastName: "WCL",
  phn: "950 297 6289",
  birthdate: new Date("Sat Nov 23 1985 16:00:00 GMT-0800"),
  applicantHasFiledIncomeTaxReturn: "Y",
  applicantHasSpouse: "N",

  applicationUuid: uuidv4(),
  apiResponse: null,
  submissionDate: null,
  isInfoCollectionNoticeOpen: true,
  captchaToken: null,
  spouseHasFiledIncomeTaxReturn: null,

  applicantConsent: null,
  maintenanceMessage: null,
  referenceNumber: null,
};
