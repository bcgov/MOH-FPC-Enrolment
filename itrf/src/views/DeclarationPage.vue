<!-- DECLARATION PAGE IS NO LONGER NEEDED FOR ITRF but keep the file for reference. -->
<template>
  <div>
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Declaration</h1>
        <hr />
        <p><b>Please read and click to sign.</b></p>
        <p>
          I certify that the information given in this application form is true,
          correct and complete.
        </p>
        <p>
          I certify that I (and my spouse or common-law partner, if applicable)
          have filed an income return with the CRA for the tax year
          {{ incomeTaxReturnYear }}.
        </p>
        <Checkbox
          id="applicant-consent"
          v-model="isAuthorized"
          :label="applicantConsentLabel"
        />
        <br />
        <div class="container info pb-5">
          <InfoBox class="pt-4">
            <p>
              <b
                >After clicking the Submit button, do not navigate away from
                this page. Please wait for the submission process to
                complete.</b
              >
            </p>
          </InfoBox>
        </div>
      </div>
    </PageContent>
  </div>
</template>

<script>
import PageContent from "../components/PageContent.vue";
import Checkbox from "../components/Checkbox.vue";
import InfoBox from "../components/InfoBox.vue";

export default {
  name: "DeclarationPage",
  components: {
    PageContent,
    Checkbox,
    InfoBox,
  },
  data: () => {
    return {
      isAuthorized: null,
      incomeTaxReturnYear: null,
    };
  },
  computed: {
    applicantConsentLabel() {
      // TO-DO: Replace TEST with the actual store value from the first and last name on the Personal Info Page"
      let label = "TEST DATA";
      return label;
    },
  },
  created() {
    this.incomeTaxReturnYear = new Date().getFullYear() - 2;
  },
};
</script>

<style scoped>
.info {
  position: absolute;
  bottom: 0;
}
</style>
