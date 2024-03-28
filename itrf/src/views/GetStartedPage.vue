<template>
  <div>
    <ConsentModal v-if="showConsentModal" @close="handleCloseConsentModal" />
    <ProgressBar :routes="stepRoutes" :current-path="$route.path" />
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Get started</h1>
        <hr />
        <h2>Welcome</h2>
        <p>
          Complete this form if you have been asked to let BC PharmaCare know
          that you filed your taxes with the Canada Revenue Agency (CRA) for
          2022. This allows PharmaCare to check your income with the CRA and set
          your Fair PharmaCare deductible and family maximum.
        </p>
        <p>
          Your Fair PharmaCare deductible and family maximum are normally
          calculated using your net income from two years ago. If we are not
          able to verify your net income with the CRA, your PharmaCare
          deductible is set to the default maximum of $10,000. This means Fair
          PharmaCare will help with costs only after you spend $10,000 on
          eligible prescription drugs and/or medical supplies.
        </p>
        <br />
        <h2>You can use this form if</h2>
        <ul>
          <li>You are registered for Fair PharmaCare</li>
          <li>
            You have given PharmaCare your consent to verify your net income
            with the CRA
          </li>
          <li>
            You and your spouse or common-law partner (if applicable) have filed
            your
            {{ incomeTaxReturnYear }} income tax return with the CRA
          </li>
        </ul>
        <br />
        <h2>
          If you were unable to file taxes for year {{ incomeTaxReturnYear }}
        </h2>
        <p>
          You may not have been able to file taxes in Canada two years ago. You
          may have worked in another country or you may have been a minor (under
          18) with no income. In this case, you may be able to report your
          income using the Fair PharmaCare Proof of Income Affidavit.
          <a
            href="https://www2.gov.bc.ca/assets/gov/health/forms/5357fil.pdf"
            target="_blank"
            >Download a copy</a
          >
          or contact us at 1-800-663-7100 (toll-free), 604-683-7151 (Lower
          Mainland) to have one sent to you.
        </p>
        <br />
        <h2>Other tax years</h2>
        <p>
          If you received a letter from PharmaCare / HIBC referring to a tax
          year other than {{ incomeTaxReturnYear }}, do not use this online
          form. Download and mail the
          <a
            href="https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/fair-pharmacare-plan"
            target="_blank"
            >print form</a
          >
          or contact us for support.
        </p>
        <br />
        <h2>Taxes filed for {{ incomeTaxReturnYear }}</h2>
        <p>
          <b>
            Have you filed your {{ incomeTaxReturnYear }} income tax return with
            the CRA?
          </b>
        </p>
        <Radio
          id="filed-income-tax-return"
          v-model="hasFiledIncomeTaxReturn"
          name="filed-income-tax-return"
          :required="true"
          :items="radioOptionsFiledIncomeTaxReturn"
          cypress-id="filed-income-tax-return"
        />
        <div
          v-if="
            v$.hasFiledIncomeTaxReturn.$dirty &&
            v$.hasFiledIncomeTaxReturn.required.$invalid
          "
          class="text-danger"
          aria-live="assertive"
        >
          Select an option to answer the question.
        </div>
        <div
          v-if="hasFiledIncomeTaxReturn == 'N'"
          class="text-danger"
          aria-live="assertive"
        >
          <ErrorBox>
            <p>
              <b>
                You can't submit this form if you have not filed your taxes for
                the year {{ incomeTaxReturnYear }}.
              </b>
            </p>
            <p>
              If you have an urgent medical need for prescriptions, please
              contact us at 1-800-663-7100 (toll-free) or at 604-683-7151 (Lower
              Mainland).
            </p>
          </ErrorBox>
        </div>
        <br />
        <p><b>Do you have a spouse or common-law partner?</b></p>
        <Radio
          id="spouse"
          v-model="hasSpouse"
          name="spouse"
          :required="true"
          :items="radioOptionsHasSpouse"
          cypress-id="spouse"
        />
        <div
          v-if="v$.hasSpouse.$dirty && v$.hasSpouse.required.$invalid"
          class="text-danger"
          aria-live="assertive"
        >
          Select an option to answer the question.
        </div>
        <br />
        <div v-if="hasSpouse === 'Y'" class="ml-4 mb-0">
          <p>
            <b>
              Have they filed their {{ incomeTaxReturnYear }} income tax return
              with the CRA?
            </b>
          </p>
          <Radio
            id="spouse-filed-income-tax-return"
            v-model="hasSpouseFiledIncomeTaxReturn"
            name="spouse-filed-income-tax-return"
            :required="true"
            :items="radioOptionsHasSpouseFiledIncomeTaxReturn"
          />
          <div
            v-if="
              v$.hasSpouseFiledIncomeTaxReturn.$dirty &&
              v$.hasSpouseFiledIncomeTaxReturn.required.$invalid
            "
            class="text-danger"
            aria-live="assertive"
          >
            Select an option to answer the question.
          </div>
          <div
            v-if="hasSpouseFiledIncomeTaxReturn == 'N'"
            class="text-danger"
            aria-live="assertive"
          >
            <ErrorBox>
              <p>
                <b>
                  You can't submit this form if your spouse or common-law
                  partner has not filed their taxes for the year
                  {{ incomeTaxReturnYear }}.
                </b>
              </p>
              <p>
                If you have an urgent medical need for prescriptions, please
                contact us at 1-800-663-7100 (toll-free) or at 604-683-7151
                (Lower Mainland).
              </p>
            </ErrorBox>
          </div>
        </div>
      </div>
    </PageContent>
    <ContinueBar
      :button-label="'Continue'"
      cypress-id="continue-bar"
      @continue="nextPage()"
    />
  </div>
</template>

<script>
import ProgressBar from "../components/ProgressBar.vue";
import PageContent from "../components/PageContent.vue";
import Radio from "../components/Radio.vue";
import ContinueBar from "../components/ContinueBar.vue";
import pageStateService from "../services/page-state-service.js";
import logService from "../services/log-service.js";
import spaEnvService from "../services/spa-env-service";
import ConsentModal from "../components/ConsentModal.vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import ErrorBox from "../components/ErrorBox.vue";
import {
  SET_IS_INFO_COLLECTION_NOTICE_OPEN,
  SET_APPLICANT_HAS_FILED_INCOME_TAX_RETURN,
  SET_APPLICANT_HAS_SPOUSE,
  SET_SPOUSE_HAS_FILED_INCOME_TAX_RETURN,
  SET_MAINTENANCE_MESSAGE,
} from "../store/index";
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition,
} from "../helpers/scroll";
import { stepRoutes, routes, isPastPath } from "../router/index.js";

const validateQuestions = (_value, vm) => {
  if (
    (vm.hasFiledIncomeTaxReturn === "Y" && vm.hasSpouse === "N") ||
    (vm.hasFiledIncomeTaxReturn === "Y" &&
      vm.hasSpouse === "Y" &&
      vm.hasSpouseFiledIncomeTaxReturn === "Y")
  ) {
    return true;
  }
  return false;
};

export default {
  name: "GetStartedPage",
  components: {
    ProgressBar,
    PageContent,
    Radio,
    ContinueBar,
    ConsentModal,
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
      const toPath = routes.GET_STARTED.path;
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
      isPageLoaded: false,
      isValidated: false,
      stepRoutes: stepRoutes,
      incomeTaxReturnYear: null,
      hasFiledIncomeTaxReturn: null,
      hasSpouse: null,
      hasSpouseFiledIncomeTaxReturn: null,
      radioOptionsFiledIncomeTaxReturn: null,
      radioOptionsHasSpouse: null,
      showConsentModal: true,
      applicationUuid: null,
    };
  },
  async created() {
    this.applicationUuid = this.$store.state.applicationUuid;
    await spaEnvService
      .loadEnvs()
      .then(() => {
        if (
          spaEnvService.values &&
          spaEnvService.values.SPA_ENV_ITRF_MAINTENANCE_FLAG === "true"
        ) {
          this.$store.commit(
            SET_MAINTENANCE_MESSAGE,
            spaEnvService.values.SPA_ENV_ITRF_MAINTENANCE_MESSAGE,
          );
          const toPath = routes.MAINTENANCE.path;
          pageStateService.setPageComplete(toPath);
          pageStateService.visitPage(toPath);
          this.$router.push(toPath);
        }
      })
      .catch((error) => {
        logService.logError(this.applicationUuid, {
          event: "HTTP error getting values from spa-env-server",
          status: error.response.status,
        });
      });
    logService.logNavigation(
      this.applicationUuid,
      routes.GET_STARTED.path,
      routes.GET_STARTED.title,
    );
    this.hasFiledIncomeTaxReturn =
      this.$store.state.applicantHasFiledIncomeTaxReturn;
    this.hasSpouse = this.$store.state.applicantHasSpouse;
    this.hasSpouseFiledIncomeTaxReturn =
      this.$store.state.spouseHasFiledIncomeTaxReturn;
    this.showConsentModal = this.$store.state.isInfoCollectionNoticeOpen;
    this.radioOptionsFiledIncomeTaxReturn = [
      {
        id: "filed-income-tax-return-y",
        label: "Yes",
        value: "Y",
      },
      {
        id: "filed-income-tax-return-n",
        label: "No",
        value: "N",
      },
    ];
    this.radioOptionsHasSpouse = [
      {
        id: "spouse-y",
        label: "Yes",
        value: "Y",
      },
      {
        id: "spouse-n",
        label: "No",
        value: "N",
      },
    ];
    this.radioOptionsHasSpouseFiledIncomeTaxReturn = [
      {
        id: "spouse-filed-income-tax-return-y",
        label: "Yes",
        value: "Y",
      },
      {
        id: "spouse-filed-income-tax-return-n",
        label: "No",
        value: "N",
      },
    ];
    this.incomeTaxReturnYear = new Date().getFullYear() - 2;
    this.$nextTick(() => {
      this.isPageLoaded = true;
    });
  },
  validations() {
    const validations = {
      isValidated: {
        validateQuestions,
      },
      hasFiledIncomeTaxReturn: {
        required,
      },
      hasSpouse: {
        required,
      },
      hasSpouseFiledIncomeTaxReturn: {},
    };
    if (this.hasSpouse === "Y") {
      validations.hasSpouseFiledIncomeTaxReturn.required = required;
    }
    return validations;
  },
  methods: {
    nextPage() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        scrollToError();
        return;
      }
      this.$store.commit(
        SET_APPLICANT_HAS_FILED_INCOME_TAX_RETURN,
        this.hasFiledIncomeTaxReturn,
      );
      this.$store.commit(SET_APPLICANT_HAS_SPOUSE, this.hasSpouse);
      this.$store.commit(
        SET_SPOUSE_HAS_FILED_INCOME_TAX_RETURN,
        this.hasSpouseFiledIncomeTaxReturn,
      );

      // Navigate to next path.
      const toPath = routes.PERSONAL_INFO.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    handleCloseConsentModal() {
      this.showConsentModal = false;
      this.$store.commit(SET_IS_INFO_COLLECTION_NOTICE_OPEN, false);
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 0;
}
</style>
