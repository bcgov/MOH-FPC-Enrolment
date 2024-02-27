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
          <p><b>Your Income Tax Return Filed form has been submitted.</b></p>
          <p>
            <b>Reference Number is: {{ referenceNumber }}</b>
          </p>
        </SuccessBox>
        <br />

        <h2>Next steps</h2>
        <hr />
        <p><b>Print or save this page for your records.</b></p>
        <p>
          When we have verified your income with the CRA, you will receive a
          Confirmation of Coverage letter within 1-2 weeks.
        </p>
        <br />

        <h2>Personal information</h2>
        <ReviewTable :elements="personalInfoData" />
      </div>
    </PageContent>
  </div>
</template>

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

<script>
import PageContent from "../components/PageContent.vue";
import ReviewTable from "../components/ReviewTable.vue";
import SuccessBox from "../components/SuccessBox.vue";
import { formatDate } from "../helpers/date.js";

export default {
  name: "DeclarationPage",
  components: {
    PageContent,
    ReviewTable,
    SuccessBox,
  },
  data: () => {
    return {
      dateSubmitted: null,
      referenceNumber: "1234567890",
    };
  },
  created() {
    this.dateSubmitted = formatDate(new Date());
  },
  methods: {
    printPage() {
      window.print();
    },
  },
  computed: {
    personalInfoData() {
      const items = [];
      const firstName = "TEST";
      const lastName = "DATA";
      const birthDate = "January 01, 2000";
      const phn = "9999 999 998";
      const hasSpouse = "Yes";
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
          value: birthDate,
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
};
</script>
