import * as fixtureDataTest from "./data-test";
import * as fixtureDataDev from "./data-dev";

//api intercepts should always be enabled in the local environment so the build pipeline doesn't fail due to an API issue
//api intercepts are disabled in DEV/TEST by default
//this way these tests can actually check whether the APIs are working or not

const envData = {
  //Data-dev or data-test data will be assigned here
  testFirstName: "",
  testLastName: "",
  testBirthDateDay: "",
  testBirthDateMonth: 0, //integer. January = 1, December = 12, etc
  testBirthDateYear: "",
  testPhn: "",
};

if (Cypress.env("environment") === "test") {
  Object.assign(envData, fixtureDataTest);
  envData.enableIntercepts = false;
} else if (Cypress.env("environment") === "dev") {
  Object.assign(envData, fixtureDataDev);
  envData.enableIntercepts = false;
} else {
  //local environment
  Object.assign(envData, fixtureDataDev);
  envData.enableIntercepts = true;
}

//uncomment to force intercepts on or off (eg. while testing an API in local development )
// envData.enableIntercepts = false;

export default envData;
