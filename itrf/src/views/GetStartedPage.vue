<template>
    <div>
      <!-- <ConsentModal v-if="showConsentModal"
                    @close="handleCloseConsentModal" /> -->
        <ProgressBar :routes="stepRoutes" :currentPath="$route.path" />
        <PageContent>
            <div class="container pt-3 pt-sm-5 mb-5">
                <h1>Get Started</h1>
                <hr/>
                <p>The Fair PharmaCare deductible and family maximum for this year are normally calculated using your net income from two years ago.  If HIBC is not able to verify your net income with the Canada Revenue Agency (CRA), then your Fair PharmaCare deductible will be set to the default maximum of $10,000.  This means that Fair PharmaCare will assist you only after you spend more than $10,000 on eligible prescription drugs and/or medical supplies.</p><br>
                <h2>You can use this form</h2>
                <ul>
                    <li>You are registered for Fair Pharmacare.</li>
                    <li>You have given HIBC your consent to verify your net income with the CRA.</li>
                    <li>You and your spouse (if applicable) have filed your income tax return with the CRA for the tax year {{ incomeTaxReturnYear }}.</li>
                </ul><br>
                <h2>If you were unable to file taxes for year {{ incomeTaxReturnYear }}</h2>
                <p>You may not have been able to file taxes in Canada. You may have worked in another country two years ago or were a minor (under 18) with no income. In this case, you may be required to document your income on the Fair PharmaCare Proof of Income Affidavit. <a href="https://www2.gov.bc.ca/assets/gov/health/forms/5357fil.pdf" target="_blank">Download a copy</a> or contact HIBC at 1-800-663-7100 (toll-free), 604-683-7151 (Lower Mainland) to have one sent to you.</p><br>
                <h2>Income tax return filling</h2>
                <p><b>Have you filed your income tax return with Canada Revenue Agency (CRA) for the year {{ incomeTaxReturnYear }}?</b></p>
                <Radio 
                    id='filed-income-tax-return'
                    name='filed-income-tax-return'
                    v-model='hasFiledIncomeTaxReturn'
                    :required="true"
                    :items='radioOptionsFiledIncomeTaxReturn'/><br>
                <p><b>Do you have a spouse?</b></p>
                <Radio 
                    id='spouse'
                    name='spouse'
                    v-model='hasSpouse'
                    :required="true"
                    :items='radioOptionsHasSpouse'/><br>
                <div class="ml-4 mb-0" v-if="hasSpouse === 'Y'">
                    <p><b>Have they filed their income tax return with Canada Revenue Agency (CRA) for the year {{ incomeTaxReturnYear }}?</b></p>
                    <Radio 
                        id='spouse-filed-income-tax-return'
                        name='spouse-filed-income-tax-return'
                        v-model='hasSpouseFiledIncomeTaxReturn'
                        :required="true"
                        :items='radioOptionsHasSpouseFiledIncomeTaxReturn'/>
                </div>
            </div>
        </PageContent>
      <ContinueBar @continue="nextPage()" :buttonLabel="'Continue'" />
    </div>
</template>
  
<script>
import ProgressBar from '../components/ProgressBar.vue';
import PageContent from '../components/PageContent.vue';
import Radio from '../components/Radio.vue';
import ContinueBar from '../components/ContinueBar.vue';
import { stepRoutes, routes } from '../router/index';
import pageStateService from '../services/page-state-service.js';

export default {
    name: 'GetStartedPage',
    components: {
        ProgressBar,
        PageContent,
        Radio,
        ContinueBar
    },
    data: () => {
        return {
            stepRoutes: stepRoutes,
            incomeTaxReturnYear: null,
            hasFiledIncomeTaxReturn: null,
            hasSpouse: null,
            hasSpouseFiledIncomeTaxReturn: null,
            radioOptionsFiledIncomeTaxReturn: null,
            radioOptionsHasSpouse: null
            // showConsentModal: true,
        };
    },
    created() {
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
    },
    methods: {
        nextPage() {
            const path = routes.PERSONAL_INFO.path;
            pageStateService.setPageComplete(path);
            pageStateService.visitPage(path);
            this.$router.push(path);
        },
    },
    beforeRouteLeave(to, from, next){
        pageStateService.setPageIncomplete(from.path);
        if (pageStateService.isPageComplete(to.path)){
            next();
        } else {
            next();
            // Will uncomment once there's page validation
            // next({
            //     path: routes.GET_STARTED.path,
            //     replace: true
            // });
        }
    }
}
</script>
  