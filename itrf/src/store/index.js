import { createStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

// For Submission
export const SET_APPLICATION_UUID = "setApplicationUuid";
export const SET_API_RESPONSE = "setApiResponse";
export const SET_SUBMISSION_DATE = 'setSubmissionDate';
export const RESET_FORM = "resetForm";
export const NEW_FORM = "newForm";

// For Info Collection Notice
export const SET_IS_INFO_COLLECTION_NOTICE_OPEN = 'setIsInfoCollectionNoticeOpen';
export const SET_CAPTCHA_TOKEN = 'setCaptchaToken';

// For Get Started Page
export const SET_APPLICANT_HAS_FILED_INCOME_TAX_RETURN = 'setApplicantHasFiledIncomeTaxReturn';
export const SET_APPLICANT_HAS_SPOUSE = 'setApplicantHasSpouse';
export const SET_SPOUSE_HAS_FILED_INCOME_TAX_RETURN = 'setSpouseHasFiledIncomeTaxReturn';

// For Personal Info Page
export const SET_FIRST_NAME = "setFirstName";
export const SET_LAST_NAME = "setLastName";
export const SET_BIRTHDATE = "setBirthdate";
export const SET_PHN= "setPHN";
export const SET_APPLICANT_CONSENT = "setApplicantConsent";

export const MODULE_NAME = 'itrfModule';

export default createStore({
  namespaced: false,
  state: () => {
    const state = {
      applicationUuid: uuidv4(),
      apiResponse: null,
      submissionDate: null,
      isInfoCollectionNoticeOpen: true,
      captchaToken: null,
      applicantHasFiledIncomeTaxReturn: null,
      applicantHasSpouse: null,
      spouseHasFiledIncomeTaxReturn: null,
      firstName: null,
      lastName: null,
      birthdate: null,
      phn: null,
      applicantConsent: null
    };
    return state;
  },
  mutations: {
    setApplicationUuid(state, payload) {
        state.applicationUuid = payload;
    },
    setApiResponse(state, payload) {
        state.apiResponse = payload;
    },
    setSubmissionDate(state, payload) {
        state.submissionDate = payload;
    },
    setIsInfoCollectionNoticeOpen(state, payload) {
        state.isInfoCollectionNoticeOpen = payload;
    },
    setCaptchaToken(state, payload) {
        state.captchaToken = payload;
    },
    setApplicantHasFiledIncomeTaxReturn(state, payload) {
        state.applicantHasFiledIncomeTaxReturn = payload;
    },
    setApplicantHasSpouse(state, payload) {
        state.applicantHasSpouse = payload;
    },
    setSpouseHasFiledIncomeTaxReturn(state, payload) {
        state.spouseHasFiledIncomeTaxReturn = payload;
    },
    setFirstName(state, payload) {
        state.firstName = payload;
    },
    setLastName(state, payload) {
        state.lastName = payload;
    },
    setBirthdate(state, payload) {
        state.birthdate = payload;
    },
    setPHN(state, payload) {
        state.phn = payload;
    },
    setApplicantConsent(state, payload) {
        state.applicantConsent = payload;
    }
  },
  actions: {
    resetForm({ commit }) {
      commit(SET_APPLICATION_UUID, uuidv4());
      commit(SET_API_RESPONSE, null);
      commit(SET_SUBMISSION_DATE, null);
      commit(SET_IS_INFO_COLLECTION_NOTICE_OPEN, null);
      commit(SET_CAPTCHA_TOKEN, null);
      commit(SET_APPLICANT_HAS_FILED_INCOME_TAX_RETURN, null);
      commit(SET_APPLICANT_HAS_SPOUSE, null);
      commit(SET_SPOUSE_HAS_FILED_INCOME_TAX_RETURN, null);
      commit(SET_FIRST_NAME, null);
      commit(SET_LAST_NAME, null);
      commit(SET_BIRTHDATE, null);
      commit(SET_PHN, null);
      commit(SET_APPLICANT_CONSENT, null);
    },
    newForm({ commit }) {
      commit(SET_APPLICATION_UUID, uuidv4());
      commit(SET_API_RESPONSE, null);
      commit(SET_SUBMISSION_DATE, null);
      commit(SET_IS_INFO_COLLECTION_NOTICE_OPEN, null);
      commit(SET_CAPTCHA_TOKEN, null);
      commit(SET_APPLICANT_HAS_FILED_INCOME_TAX_RETURN, null);
      commit(SET_APPLICANT_HAS_SPOUSE, null);
      commit(SET_SPOUSE_HAS_FILED_INCOME_TAX_RETURN, null);
      commit(SET_FIRST_NAME, null);
      commit(SET_LAST_NAME, null);
      commit(SET_BIRTHDATE, null);
      commit(SET_PHN, null);
      commit(SET_APPLICANT_CONSENT, null);
    }
  },
  getters: {}
});
