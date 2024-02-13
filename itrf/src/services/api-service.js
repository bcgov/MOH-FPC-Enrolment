import axios from 'axios';

const BASE_API_PATH = '/itrf/api/';
const VALIDATE_LAST_NAME_PHN_URL = BASE_API_PATH + 'itrfIntegration/validatePerson';
const SUBMIT_APPLICATION_URL = BASE_API_PATH + 'itrfIntegration/submitForm';

class ApiService {
    validatePerson(token, applicationUuid, lastName, phn) {
    const headers = this.getHeaders(token);
    return axios.post(VALIDATE_LAST_NAME_PHN_URL, {
      applicationUuid,
      lastName,
      phn,
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
