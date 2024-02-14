import axios from 'axios';

const BASE_API_PATH = '/itrf/api';
const VALIDATE_PERSON_URL = `${BASE_API_PATH}/itrfIntegration/validatePerson`;
const SUBMIT_FORM_URL = `${BASE_API_PATH}/itrfIntegration/submitForm`;

class ApiService {
  submitForm(formState) {
    const headers = this._getHeaders(formState.captchaToken);
    const taxYear = new Date().getFullYear() - 2;
    const yesAnswer = 'yes';
    const noAnswer = 'no'; 
    const declaration1 = 'I certify that the information given in this application form is true, correct, and complete';
    const declaration2 = 'I certify that I (and my spouse or common-law partner, if applicable) have filed an income tax return with the CRA for tax year';

    const jsonPayload = {
        uuid: formState.applicationUuid,
        regNumber: null, // null value since regNumber (optional) is removed from the front-end
        taxYear: taxYear,
        spouse: formState.applicantHasSpouse === true ? yesAnswer : noAnswer,
        consent: yesAnswer, // declaration page is removed so consent will be always yes
        declaration1: declaration1,
        declaration2: declaration2,
        person: {
            lastName: formState.lastName,
            firstName: formState.firstName,
            phn: formState.phn,
            birthDate: formState.birthDate
        }
    };
    console.log('JSON Payload:', jsonPayload);
    const itrfApplicationUuid = formState.applicationUuid;
    const url = `${SUBMIT_FORM_URL}/${itrfApplicationUuid}`;
    return this._sendPostRequest(url, headers, jsonPayload);
  }

  validatePerson(formState) {
    const headers = this._getHeaders(formState.captchaToken);
    const jsonPayload = {
        uuid: formState.applicationUuid,
        person: {
            lastName: formState.lastName,
            firstName: formState.firstName,
            phn: formState.phn,
            birthDate: formState.birthDate
        }
    };
    console.log('JSON Payload:', jsonPayload);
    return this._sendPostRequest(VALIDATE_PERSON_URL, headers, jsonPayload);
  }

  _sendPostRequest(url, headers, payload) {
    return axios.post(url, payload, { headers });
  }

  _getHeaders(token) {
    return {
      "Content-Type": "application/json",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token
    };
  }
}

export default new ApiService();
