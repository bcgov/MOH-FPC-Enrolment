<template>
  <div>
    <ProgressBar :routes="stepRoutes" :current-path="$route.path" />
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1>Personal Information</h1>
        <hr />
        <p>
          Enter your name as it appears on your driver's licence, BC Services
          Card or CareCard.
        </p>
        <div class="row">
          <div class="col-sm-7">
            <InputComponent
              v-model="firstName"
              label="First name"
              aria-label="First name"
              id="first-name"
              :class-name="'mt-3'"
              :input-style="mediumStyles"
              :required="true"
              cypress-id="firstName"
              @input="handleAPIValidationReset"
              @blur="handleBlurField(v$.firstName)"
            />
            <div
              v-if="v$.firstName.$dirty && v$.firstName.required.$invalid"
              class="text-danger"
              aria-live="assertive"
            >
              First name is required.
            </div>
            <div
              v-if="
                v$.firstName.$dirty &&
                !v$.firstName.required.$invalid &&
                v$.firstName.nameValidator.$invalid
              "
              class="text-danger"
              aria-live="assertive"
            >
              First name must begin with a letter and cannot include special
              characters except hyphens, periods, apostrophes and blank
              characters.
            </div>
            <InputComponent
              v-model="lastName"
              label="Last name"
              aria-label="Last name"
              id="last-name"
              :class-name="'mt-3'"
              :input-style="mediumStyles"
              :required="true"
              cypress-id="lastName"
              @input="handleAPIValidationReset"
              @blur="handleBlurField(v$.lastName)"
            />
            <div
              v-if="v$.lastName.$dirty && v$.lastName.required.$invalid"
              class="text-danger"
              aria-live="assertive"
            >
              Last name is required.
            </div>
            <div
              v-if="
                v$.lastName.$dirty &&
                !v$.lastName.required.$invalid &&
                v$.lastName.nameValidator.$invalid
              "
              class="text-danger"
              aria-live="assertive"
            >
              Last name must begin with a letter and cannot include special
              characters except hyphens, periods, apostrophes and blank
              characters.
            </div>
            <DateInput
              id="birthdate"
              v-model="birthdate"
              label="Birthdate"
              aria-label="Birthdate"
              class-name="mt-3"
              :required="true"
              :watch-for-model-change="true"
              :use-invalid-state="true"
              cypress-id="birthdate"
              @input="handleAPIValidationReset"
              @process-date="handleProcessBirthdate($event)"
              @blur="handleBlurField(v$.birthdate)"
            />
            <div
              v-if="
                v$.birthdate.$dirty &&
                !v$.birthdate.dateDataValidator.$invalid &&
                v$.birthdate.required.$invalid
              "
              class="text-danger"
              aria-live="assertive"
            >
              Birthdate is required.
            </div>
            <div
              v-if="
                v$.birthdate.$dirty && v$.birthdate.dateDataValidator.$invalid
              "
              class="text-danger"
              aria-live="assertive"
            >
              Invalid birthdate.
            </div>
            <div
              v-if="
                v$.birthdate.$dirty &&
                !v$.birthdate.required.$invalid &&
                v$.birthdate.distantPastValidator.$invalid
              "
              class="text-danger"
              aria-live="assertive"
            >
              Invalid birthdate.
            </div>
            <div
              v-if="
                v$.birthdate.$dirty &&
                !v$.birthdate.required.$invalid &&
                v$.birthdate.birthdate16YearsValidator.$invalid
              "
              class="text-danger"
              aria-live="assertive"
            >
              Invalid birthdate.
            </div>
            <PhnInput
              v-model="phn"
              label="Personal Health Number (PHN)"
              aria-label="Personal Health Number (PHN)"
              id="personal-health-number"
              class="mt-3"
              placeholder="1111 111 111"
              :input-style="smallStyles"
              :required="true"
              cypress-id="phn"
              @input="handleAPIValidationReset"
              @blur="handleBlurField(v$.phn)"
            />
            <div
              v-if="v$.phn.$dirty && v$.phn.required.$invalid"
              class="text-danger"
              aria-live="assertive"
            >
              Personal Health Number is required.
            </div>
            <div
              v-if="
                v$.phn.$dirty &&
                !v$.phn.required.$invalid &&
                (v$.phn.phnValidator.$invalid ||
                  v$.phn.phnFirstDigitValidator.$invalid)
              "
              class="text-danger"
              aria-live="assertive"
            >
              Personal Health Number is not valid.
            </div>
            <br />
            <div
              v-if="isAPIValidationErrorShown"
              class="text-danger"
              aria-live="assertive"
            >
              <ErrorBox>
                <p><b>Validation error</b></p>
                <p>
                  The information provided does not match our records. Please
                  try again one more time. If the validation result is
                  unsuccessful a third time, please contact
                  <a
                    href="https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/contact-us"
                    target="_blank"
                    >Health Insurance BC</a
                  >
                  to process your Income Tax Return Filed form.
                </p>
              </ErrorBox>
            </div>
            <div
              v-if="isSystemUnavailable"
              class="text-danger"
              aria-live="assertive"
            >
              Unable to continue, system unavailable. Please try again later.
            </div>
          </div>

          <div class="col-sm-5">
            <TipBox title="Tip: PHN number" class="mt-2">
              <p>
                The 10-digit number can be found on the back of your driver's
                licence,
                <a
                  href="https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/personal-health-identification/your-bc-services-card"
                  target="_blank"
                >
                  BC Services Card
                </a>
                or CareCard.
              </p>
              <div class="bcid-container">
                <div class="bcid-image-container">
                  <img
                    src="../images/bcid-sample-front.png"
                    alt=""
                    class="bcid"
                  />
                </div>
                <div class="bcid-image-container">
                  <img
                    src="../images/bcid-sample-back.png"
                    alt=""
                    class="bcid"
                  />
                </div>
              </div>
            </TipBox>
          </div>
        </div>
      </main>
    </PageContent>
    <ContinueBar
      :button-label="'Submit'"
      :has-loader="isLoading"
      cypress-id="continueBar"
      @continue="nextPage()"
    />
  </div>
</template>

<script>
import apiService from "../services/api-service";
import ProgressBar from "../components/ProgressBar.vue";
import PageContent from "../components/PageContent.vue";
import ContinueBar from "../components/ContinueBar.vue";
import InputComponent from "../components/InputComponent.vue";
import DateInput from "../components/DateInput.vue";
import {
  distantPastValidator,
  birthdate16YearsValidator,
} from "../components/DateInput.vue";
import PhnInput from "../components/PhnInput.vue";
import { phnValidator } from "../components/PhnInput.vue";
import {
  nameValidator,
  dateDataValidator,
  phnFirstDigitValidator,
} from "../helpers/validators";
import TipBox from "../components/TipBox.vue";
import ErrorBox from "../components/ErrorBox.vue";
import pageStateService from "../services/page-state-service.js";
import { mediumStyles, smallStyles } from "../constants/input-styles";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {
  SET_BIRTHDATE,
  SET_FIRST_NAME,
  SET_LAST_NAME,
  SET_PHN,
  SET_REFERENCE_NUMBER,
} from "../store";
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition,
} from "../helpers/scroll";
import { stepRoutes, routes, isPastPath } from "../router/index.js";
import logService from "../services/log-service.js";

export default {
  name: "PersonalInfoPage",
  components: {
    ProgressBar,
    PageContent,
    ContinueBar,
    InputComponent,
    DateInput,
    PhnInput,
    TipBox,
    ErrorBox,
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (
      pageStateService.isPageComplete(to.path) ||
      isPastPath(to.path, from.path)
    ) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = routes.PERSONAL_INFO.path;
      next({
        path: toPath,
        replace: true,
      });
      setTimeout(() => {
        scrollTo(topScrollPosition);
      }, 0);
    }
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data: () => {
    return {
      stepRoutes,
      smallStyles,
      mediumStyles,
      firstName: "",
      lastName: "",
      birthdate: null,
      phn: "",
      birthdateData: null,
      isLoading: false,
      isAPIValidationErrorShown: false,
      isSystemUnavailable: false,
      applicationUuid: null,
    };
  },
  created() {
    this.firstName = this.$store.state.firstName;
    this.lastName = this.$store.state.lastName;
    this.birthdate = this.$store.state.birthdate;
    this.phn = this.$store.state.phn;
    this.token = this.$store.state.captchaToken;
    this.applicationUuid = this.$store.state.applicationUuid;

    logService.logNavigation(
      this.$store.state.applicationUuid,
      routes.PERSONAL_INFO.path,
      routes.PERSONAL_INFO.title,
    );
  },
  validations() {
    const validations = {
      firstName: {
        required,
        nameValidator,
      },
      lastName: {
        required,
        nameValidator,
      },
      birthdate: {
        required,
        dateDataValidator,
        distantPastValidator,
        birthdate16YearsValidator,
      },
      phn: {
        required,
        phnValidator,
        phnFirstDigitValidator,
      },
    };
    return validations;
  },
  methods: {
    nextPage() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
      this.v$.$touch();

      if (this.v$.$invalid) {
        scrollToError();
        return;
      }

      this.isLoading = true;

      this.$store.commit(SET_FIRST_NAME, this.firstName);
      this.$store.commit(SET_LAST_NAME, this.lastName);
      this.$store.commit(SET_BIRTHDATE, this.birthdate);
      this.$store.commit(SET_PHN, this.phn);
      const formState = this.$store.state;

      apiService
        .validatePerson(this.token, formState)
        .then((response) => {
          // Handle HTTP success.
          const returnCode = response.data.returnCode;

          switch (returnCode) {
            case "success": // Validation success.
              logService.logInfo(this.applicationUuid, {
                event: "validation success (validatePerson)",
                response: response.data,
              });
              this.handleValidationSuccess(formState);
              break;
            case "failure": // PHN does not match name.
              this.isAPIValidationErrorShown = true;
              logService.logInfo(this.applicationUuid, {
                event: "validation failure (validatePerson)",
                response: response.data,
              });
              scrollToError();
              this.isLoading = false;
              break;
            case "3": // System unavailable.
              this.isSystemUnavailable = true;
              logService.logError(this.applicationUuid, {
                event:
                  "validation failure (validatePerson endpoint unavailable)",
                response: response.data,
              });
              scrollToError();
              this.isLoading = false;
              break;
            default: //-1 error code, schema error, etc
              this.isSystemUnavailable = true;
              logService.logError(this.applicationUuid, {
                event:
                  "validation failure (validatePerson schema error or other unexpected problem)",
                response: response.data,
              });
              scrollToError();
              this.isLoading = false;
          }
        })
        .catch((error) => {
          // Handle HTTP error.
          this.isLoading = false;
          this.isSystemUnavailable = true;
          logService.logError(this.applicationUuid, {
            event: "HTTP error (validatePerson endpoint unavailable)",
            status: error.response.status,
          });
          scrollToError();
        });
    },
    handleValidationSuccess(formState) {
      //this function accepts formState as an argument to help ensure there are no mutations to the store between the validation check and the final submission
      apiService
        .submitForm(this.token, formState)
        .then((response) => {
          // Handle HTTP success.
          const returnCode = response.data.returnCode;
          this.$store.commit(SET_REFERENCE_NUMBER, response.data.refNumber);

          this.isLoading = false;

          switch (returnCode) {
            case "success": // Submit form success.
              logService.logSubmission(
                this.applicationUuid,
                {
                  event: "submission success (submitForm)",
                  response: response.data,
                },
                response.data.refNumber,
              );
              this.handleSubmitForm();
              break;
            case "failure": // API error
              this.isAPIValidationErrorShown = true;
              logService.logError(this.applicationUuid, {
                event: "validation failure (submitForm)",
                response: response.data,
              });
              scrollToError();
              break;
            case "3": // System unavailable.
              this.isSystemUnavailable = true;
              logService.logError(this.applicationUuid, {
                event: "validation failure (submitForm endpoint unavailable)",
                response: response.data,
              });
              scrollToError();
              break;
            default: //-1 error code, schema error, etc
              this.isSystemUnavailable = true;
              logService.logError(this.applicationUuid, {
                event:
                  "validation failure (submitForm schema error or other unexpected problem)",
                response: response.data,
              });
              scrollToError();
          }
        })
        .catch((error) => {
          // Handle HTTP error.
          this.isLoading = false;
          this.isSystemUnavailable = true;
          logService.logError(this.applicationUuid, {
            event: "HTTP error (submitForm endpoint unavailable)",
            status: error.response.status,
          });
          scrollToError();
        });
    },
    handleSubmitForm() {
      // Navigate to next path.
      const toPath = routes.SUBMISSION.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    handleBlurField(validationObject) {
      if (validationObject) {
        validationObject.$touch();
      }
    },
    handleProcessBirthdate(data) {
      this.birthdateData = data;
    },
    handleAPIValidationReset() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
    },
  },
};
</script>

<style scoped>
.mt-3 {
  font-weight: bolder;
}
.container {
  margin-top: 0;
}
.bcid-container {
  display: flex;
  flex-flow: row wrap;
}
.bcid-image-container {
  width: 50%;
  padding: 5px;
}
.bcid {
  width: auto;
  max-width: 100%;
  height: auto;
}
</style>
