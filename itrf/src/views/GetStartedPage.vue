<template>
    <div>
      <!-- <ConsentModal v-if="showConsentModal"
                    @close="handleCloseConsentModal" /> -->
        <PageContent>
            <div class="container pt-3 pt-sm-5 mb-5">
                <h1>Get Started</h1>
                <hr/>
                <p>The Fair PharmaCare deductible and family maximum for this year are normally calculated using your net income from two years ago.  If HIBC is not able to verify your net income with the Canada Revenue Agency (CRA), then your Fair PharmaCare deductible will be set to the default maximum of $10,000.  This means that Fair PharmaCare will assist you only after you spend more than $10,000 on eligible prescription drugs and/or medical supplies.</p>
                <h2>You can use this form</h2>
                <ul>
                    <li>You are registered for Fair Pharmacare.</li>
                    <li>You have given HIBC your consent to verify your net income with the CRA.</li>
                    <li>You and your spouse (if applicable) have filed your income tax return with the CRA for the tax year 2021.</li>
                </ul>
                <h2>If you were unable to file taxes for year 2021</h2>
                <p>You may not have been able to file taxes in Canada. You may have worked in another country two years ago or were a minor (under 18) with no income. In this case, you may be required to document your income on the Fair PharmaCare Proof of Income Affidavit. Download a copy or contact HIBC at 1-800-663-7100 (toll-free), 604-683-7151 (Lower Mainland) to have one sent to you.</p>
                <h2>Income tax return filling</h2>
                <p>Have you filed your income tax return with Canada Revenue Agency (CRA) for the year 2021?</p>
                <Radio 
                    id='filed-income-tax-return'
                    name='filed-income-tax-return'
                    v-model='hasFiledIncomeTaxReturn'
                    :required="true"
                    :items='radioOptionsFiledIncomeTaxReturn'/>
                <p>Do you have a spouse?</p>
                <Radio 
                    id='spouse'
                    name='spouse'
                    v-model='hasSpouse'
                    :required="true"
                    :items='radioOptionsHasSpouse'/>
                <!-- <div v-if="hasSpouse === 'Y'"> -->
                    <p class="ml-4 mb-0">Have they filed their income tax return with Canada Revenue Agency (CRA) for the year 2021?</p>
                    <Radio 
                        id='spouse-filed-income-tax-return'
                        name='spouse-filed-income-tax-return'
                        v-model='hasSpouseFiledIncomeTaxReturn'
                        :required="true"
                        :items='radioOptionsHasSpouseFiledIncomeTaxReturn'/>
                <!-- </div> -->
            </div>
      </PageContent>
      <!-- <ContinueBar @continue='nextPage()' cypressId="continueBar"/> -->
    </div>
</template>
  
<script>
import PageContent from '../components/PageContent.vue';
import Radio from '../components/Radio.vue';
export default {
    name: 'HomePage',
    components: {
        PageContent,
        Radio
    },
    data: () => {
        return {
            hasFiledIncomeTaxReturn: null,
            radioOptionsFiledIncomeTaxReturn: null,
            radioOptionsHasSpouse: null
            // showConsentModal: true,
        };
    },
    created() {
        this.radioOptionsFiledIncomeTaxReturn = [
            {
                id: 'yes',
                label: 'Yes',
                value: 'Y',
            },
            {
                id: 'no',
                label: 'No',
                value: 'N',
            }
        ];
        this.radioOptionsHasSpouse = [
            {
                id: 'yes',
                label: 'Yes',
                value: 'Y',
            },
            {
                id: 'no',
                label: 'No',
                value: 'N',
            }
        ];
        this.radioOptionsHasSpouseFiledIncomeTaxReturn = [
            {
                id: 'yes',
                label: 'Yes',
                value: 'Y',
            },
            {
                id: 'no',
                label: 'No',
                value: 'N',
            }
        ];
    },
}
</script>
  