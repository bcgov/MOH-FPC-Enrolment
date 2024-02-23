import axios from 'axios';

const BASE_API_PATH = '/itrf/api/';
const VALIDATE_PERSON_URL = BASE_API_PATH + 'itrfIntegration/validatePerson';
const SUBMIT_APPLICATION_URL = BASE_API_PATH + 'itrfIntegration/submitForm';

class ApiService {
    validatePerson(token, formState) {
    const headers = this.getHeaders(token);
    const jsonPayload = {
      "uuid": formState.applicationUuid,
      "person": {
        lastName: formState.lastName,
        firstName: formState.firstName,
        phn: formState.phn,
        birthDate: formState.birthdate
      },
    }
    return axios.post(VALIDATE_PERSON_URL+`/${formState.applicationUuid}`, jsonPayload, 
    {
      headers
    });
  }

  submitForm(token, formState) {
    const headers = this.getHeaders(token);
    const taxYear = new Date().getFullYear() - 2;
    const jsonPayload = {
      uuid: formState.applicationUuid,
      taxYear,
      spouse: formState.applicantHasSpouse === "Y" ? "yes" : "no",
      consent: "yes",
      declaration1: "I certify that the information given in this application form is true, correct, and complete",
      declaration2: `I certify that I (and my spouse, if applicable) have filed an income tax return with the CRA for tax year ${taxYear}.`,
      "person": {
        lastName: formState.lastName,
        firstName: formState.firstName,
        phn: formState.phn,
        birthDate: formState.birthdate
      },
    }
    return axios.post(SUBMIT_APPLICATION_URL+`/${formState.applicationUuid}`, 
      JSON.stringify(jsonPayload),
    {
      headers
    });
  }

  getHeaders(token) {
    const encoded = btoa("placeholderusername:placeholderpassword");
    return {
      "Content-Type": "application/json",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token,
      "Authorization": "Basic " + encoded
    }
  }
}

export default new ApiService();
