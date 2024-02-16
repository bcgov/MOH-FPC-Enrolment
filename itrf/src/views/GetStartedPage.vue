<template>
    <div>
      <ConsentModal v-if="showConsentModal"
                    @close="handleCloseConsentModal" />
        <ProgressBar :routes="stepRoutes" :currentPath="$route.path" />
        <PageContent>
            <div class="container pt-3 pt-sm-5 mb-5">
                <h1>Get Started</h1>
                <hr/>
                <h2>Welcome</h2>
                <p>The Fair PharmaCare deductible and family maximum for this year are normally calculated using your net income from two years ago.  If we are not able to verify your net income with the Canada Revenue Agency (CRA), then your Fair PharmaCare deductible will be set to the default maximum of $10,000.  This means that Fair PharmaCare will assist you only after you spend more than $10,000 on eligible prescription drugs and/or medical supplies.</p><br>
                <h2>You can use this form if</h2>
                <ul>
                    <li>You are registered for Fair PharmaCare.</li>
                    <li>You have given Fair PharmaCare your consent to verify your net income with the CRA.</li>
                    <li>You and your spouse or common-law partner (if applicable) have filed your income tax return with the CRA for the tax year {{ incomeTaxReturnYear }}.</li>
                </ul><br>
                <h2>If you were unable to file taxes for year {{ incomeTaxReturnYear }}</h2>
                <p>You may not have been able to file taxes in Canada two years ago. You may have worked in another country two years ago or were a minor (under 18) with no income. In this case, you may be required to document your income on the Fair PharmaCare Proof of Income Affidavit. <a href="https://www2.gov.bc.ca/assets/gov/health/forms/5357fil.pdf" target="_blank">Download a copy</a> or contact us at 1-800-663-7100 (toll-free), 604-683-7151 (Lower Mainland) to have one sent to you.</p><br>
                <h2>Income tax return filing</h2>
                <p><b>Have you filed your income tax return with CRA for the year {{ incomeTaxReturnYear }}?</b></p>
                <Radio 
                    id='filed-income-tax-return'
                    name='filed-income-tax-return'
                    v-model='hasFiledIncomeTaxReturn'
                    :required="true"
                    :items='radioOptionsFiledIncomeTaxReturn'/>
                <div class="text-danger"
                    v-if="v$.hasFiledIncomeTaxReturn.$dirty && v$.hasFiledIncomeTaxReturn.required.$invalid"
                    aria-live="assertive">Select an option to answer the question.
                </div>
                <div class="text-danger"
                    v-if="hasFiledIncomeTaxReturn == 'N'"
                    aria-live="assertive">
                    <ErrorBox>
                        <p><b>You can't submit this form if you have not filed your taxes for the year {{ incomeTaxReturnYear }}.</b></p>
                        <p>If you have an urgent medical need for prescriptions, please contact us at 1-800-663-7100 (toll-free) or at 604-683-7151 (Lower Mainland).</p>
                    </ErrorBox>
                </div><br>
                <p><b>Do you have a spouse or common-law partner?</b></p>
                <Radio 
                    id='spouse'
                    name='spouse'
                    v-model='hasSpouse'
                    :required="true"
                    :items='radioOptionsHasSpouse'/>
                    <div class="text-danger"
                            v-if="v$.hasSpouse.$dirty && v$.hasSpouse.required.$invalid"
                            aria-live="assertive">Select an option to answer the question.
                    </div><br>
                <div class="ml-4 mb-0" v-if="hasSpouse === 'Y'">
                    <p><b>Have they filed their income tax return with CRA for the year {{ incomeTaxReturnYear }}?</b></p>
                    <Radio 
                        id='spouse-filed-income-tax-return'
                        name='spouse-filed-income-tax-return'
                        v-model='hasSpouseFiledIncomeTaxReturn'
                        :required="true"
                        :items='radioOptionsHasSpouseFiledIncomeTaxReturn'/>
                        <div class="text-danger"
                            v-if="v$.hasSpouseFiledIncomeTaxReturn.$dirty && v$.hasSpouseFiledIncomeTaxReturn.required.$invalid"
                            aria-live="assertive">Select an option to answer the question.</div>
                        <div class="text-danger"
                            v-if="hasSpouseFiledIncomeTaxReturn == 'N'"
                            aria-live="assertive">
                            <ErrorBox>
                                <p><b>You can't submit this form if your spouse or common-law partner has not filed their taxes for the year {{ incomeTaxReturnYear }}.</b></p>
                                <p>If you have an urgent medical need for prescriptions, please contact us at 1-800-663-7100 (toll-free) or at 604-683-7151 (Lower Mainland).</p>
                            </ErrorBox>
                        </div>
                </div>
            </div>
        </PageContent>
      <ContinueBar @continue="nextPage()" :buttonLabel="'Continue'" />
    </div>
</template>

<style scoped>
.container {
    margin-top: 0;
}
</style>
  
<script>
import ProgressBar from '../components/ProgressBar.vue';
import PageContent from '../components/PageContent.vue';
import Radio from '../components/Radio.vue';
import ContinueBar from '../components/ContinueBar.vue';
import { stepRoutes, routes } from '../router/index';
import pageStateService from '../services/page-state-service.js';
import ConsentModal from '../components/ConsentModal.vue';
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import ErrorBox from '../components/ErrorBox.vue';
import {
    SET_IS_INFO_COLLECTION_NOTICE_OPEN,
    SET_APPLICANT_HAS_FILED_INCOME_TAX_RETURN,
    SET_APPLICANT_HAS_SPOUSE,
    SET_SPOUSE_HAS_FILED_INCOME_TAX_RETURN    
} from "../store/index"
import { scrollTo, scrollToError } from '../helpers/scroll';

const validateQuestions = (_value, vm) => {
  if ((vm.hasFiledIncomeTaxReturn === 'Y' && vm.hasSpouse === 'N')
    || (vm.hasFiledIncomeTaxReturn === 'Y' && vm.hasSpouse === 'Y' && vm.hasSpouseFiledIncomeTaxReturn === 'Y')) {
    return true;
  }
  return false;
}

export default {
    name: 'GetStartedPage',
    components: {
        ProgressBar,
        PageContent,
        Radio,
        ContinueBar,
        ConsentModal,
        ErrorBox
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
        };
    },
    created() {
        this.hasFiledIncomeTaxReturn = this.$store.state.applicantHasFiledIncomeTaxReturn;
        this.hasSpouse = this.$store.state.applicantHasSpouse;
        this.hasSpouseFiledIncomeTaxReturn = this.$store.state.spouseHasFiledIncomeTaxReturn;
        this.showConsentModal = this.$store.state.isInfoCollectionNoticeOpen;
        this.radioOptionsFiledIncomeTaxReturn = [
            {
                id: 'filed-income-tax-return-y',
                label: 'Yes',
                value: 'Y',
            },
            {
                id: 'filed-income-tax-return-n',
                label: 'No',
                value: 'N',
            }
        ];
        this.radioOptionsHasSpouse = [
            {
                id: 'spouse-y',
                label: 'Yes',
                value: 'Y',
            },
            {
                id: 'spouse-n',
                label: 'No',
                value: 'N',
            }
        ];
        this.radioOptionsHasSpouseFiledIncomeTaxReturn = [
            {
                id: 'spouse-filed-income-tax-return-y',
                label: 'Yes',
                value: 'Y',
            },
            {
                id: 'spouse-filed-income-tax-return-n',
                label: 'No',
                value: 'N',
            }
        ];
        this.incomeTaxReturnYear = new Date().getFullYear() - 2;
        this.$nextTick(() => {
            this.isPageLoaded = true;
        })
    },  
    setup () {
        return { v$: useVuelidate() }
    },
    validations() {
        const validations = {
            isValidated: {
                validateQuestions
            },
            hasFiledIncomeTaxReturn: {
                required
            },
            hasSpouse: {
                required
            },
            hasSpouseFiledIncomeTaxReturn: {}
        };
        if (this.hasSpouse === 'Y'){
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

            this.$store.commit(SET_APPLICANT_HAS_FILED_INCOME_TAX_RETURN, this.hasFiledIncomeTaxReturn);
            this.$store.commit(SET_APPLICANT_HAS_SPOUSE, this.hasSpouse);
            this.$store.commit(SET_SPOUSE_HAS_FILED_INCOME_TAX_RETURN, this.hasSpouseFiledIncomeTaxReturn);

            const path = routes.PERSONAL_INFO.path;
            pageStateService.setPageComplete(path);
            pageStateService.visitPage(path);
            this.$router.push(path);
            scrollTo(0);
        },
        handleCloseConsentModal() {
            this.showConsentModal = false;
            this.$store.commit(SET_IS_INFO_COLLECTION_NOTICE_OPEN, false);

        },
    },
    beforeRouteLeave(to, from, next){
        pageStateService.setPageIncomplete(from.path);
        next();
    }
}
</script>
  