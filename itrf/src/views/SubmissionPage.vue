<template>
  <div>
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-5">
        <div class="row align-items-end mt-3">
          <div class="col-9">
            <h1 class="mb-0">Confirmation of submission</h1>
          </div>
          <div class="col-3 text-right">
            <a href="javascript:void(0)" class="print-btn" @click="printPage()"
              ><b>Print or save as PDF</b>
              <font-awesome-icon icon="print" />
            </a>
            <div class="tip-container">
              <font-awesome-icon class="ml-2" icon="info-circle" />
              <div class="tip">
                To save as a PDF, in the print window, select “Save as PDF”
              </div>
            </div>
          </div>
        </div>
        <hr />
        <p>
          <b>Date submitted: {{ dateSubmitted }}</b>
        </p>
        <SuccessBox>
          <p><b>Your Fair PharmaCare Taxes Filed form has been received.</b></p>
          <p>
            <b>Reference number is: {{ referenceNumber }}</b>
          </p>
        </SuccessBox>
        <br />

        <h2>Next steps</h2>
        <hr />
        <p><b>Print or save this page for your records.</b></p>
        <p>
          We will verify your income with the CRA. Please allow two to three
          weeks for delivery of your Confirmation of Fair PharmaCare Assistance
          letter. This letter will have your deductible and family maximum for
          {{ yearSubmitted }}.
        </p>
        <br />

        <h2>Personal information</h2>
        <ReviewTable :elements="personalInfoData" />
      </div>
    </PageContent>
  </div>
</template>

<script>
import PageContent from "../components/PageContent.vue";
import ReviewTable from "../components/ReviewTable.vue";
import SuccessBox from "../components/SuccessBox.vue";
import { formatDate, formatDateDisplay } from "../helpers/date.js";
import pageStateService from "../services/page-state-service.js";
import { routes } from "../router/index.js";
import { scrollTo } from "../helpers/scroll";
import { RESET_FORM } from "../store/index.js";
import logService from "../services/log-service.js";

export default {
  name: "DeclarationPage",
  components: {
    PageContent,
    ReviewTable,
    SuccessBox,
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    this.$store.dispatch(RESET_FORM);
    if (to.path === routes.GET_STARTED.path) {
      next();
    } else {
      // Navigate to self.
      const toPath = routes.GET_STARTED.path;
      next({ path: toPath });
    }
    setTimeout(() => {
      scrollTo(0);
    }, 0);
  },
  data: () => {
    return {
      dateSubmitted: null,
      yearSubmitted: null,
      referenceNumber: "1234567890",
    };
  },
  computed: {
    personalInfoData() {
      const items = [];
      const firstName = this.$store.state.firstName;
      const lastName = this.$store.state.lastName;
      const birthdate = formatDateDisplay(this.$store.state.birthdate);
      const phn = this.$store.state.phn;
      const hasSpouse =
        this.$store.state.applicantHasSpouse == "N" ? "No" : "Yes";
      items.push(
        {
          label: "First name",
          value: firstName,
        },
        {
          label: "Last name",
          value: lastName,
        },
        {
          label: "Birthdate",
          value: birthdate,
        },
        {
          label: "Personal Health Number (PHN)",
          value: phn,
        },
        {
          label: "Has a spouse or common-law partner",
          value: hasSpouse,
        },
      );
      return items;
    },
  },
  created() {
    this.dateSubmitted = formatDate(new Date());
    this.yearSubmitted = new Date().getFullYear();
    this.referenceNumber = this.$store.state.referenceNumber;

    logService.logNavigation(
      this.$store.state.applicationUuid,
      routes.SUBMISSION.path,
      routes.SUBMISSION.title,
    );
  },
  methods: {
    printPage() {
      window.print();
    },
  },
};
</script>

<style scoped>
.tip-container {
  position: relative;
  display: inline-block;
  color: black;
}
.tip-container .tip {
  visibility: hidden;
  width: 220px;
  background-color: #f2f2f2;
  color: #606060;
  text-align: center;
  padding: 2px 4px;
  border: 2px solid #606060;
  font-weight: normal;
  font-size: 13.33px;
  right: 25px;
  position: absolute;
  z-index: 1;
}
.tip-container:hover .tip {
  visibility: visible;
}
</style>
