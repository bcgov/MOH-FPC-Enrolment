import axios from 'axios';

const BASE_API_PATH = '/itrf/api/';
const VALIDATE_PERSON_URL = BASE_API_PATH + 'itrfIntegration/validatePerson';
const SUBMIT_APPLICATION_URL = BASE_API_PATH + 'itrfIntegration/submitForm';

class ApiService {
    validatePerson(token, formState) {
    const headers = this.getHeaders(token);
    return axios.post(VALIDATE_PERSON_URL, {
      applicationUuid: formState.applicationUuid,
      "person": {
        lastName: formState.lastName,
        firstName: formState.firstName,
        phn: formState.phn,
        birthDate: formState.birthDate
      },
    }, 
    {
      headers
    });
  }

  submitForm(token, formState) {
    const headers = this.getHeaders(token);
    const taxYear = new Date().getFullYear();
    return axios.post(SUBMIT_APPLICATION_URL, {
      applicationUuid: formState.applicationUuid,
      // regNumber should be removed in final product, but I have it commented below for testing purposes
      // "regNumber": "12345",
      taxYear,
      spouse: formState.spouse,
      "consent": "yes",
      "declaration1": "I certify that the information given in this application form is true, correct, and complete",
	    "declaration2": `I certify that I (and my spouse, if applicable) have filed an income tax return with the CRA for tax year ${taxYear}.`,
      "person": {
        lastName: formState.lastName,
        firstName: formState.firstName,
        phn: formState.phn,
        birthDate: formState.birthDate
      },
    }, 
    {
      headers
    });
  }

  getHeaders(token) {
    return {
      "Content-Type": "application/json",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token
    }
  }
}

export default new ApiService();
