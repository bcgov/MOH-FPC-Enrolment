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
      declaration1: "Information collection notice acknowledged.",
      declaration2: "Signature not required.",
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
