<template>
    <div>
        <ProgressBar :routes="stepRoutes" :currentPath="$route.path" />
        <PageContent>
            <div class="container pt-3 pt-sm-5 mb-5">
                <h1>Declaration</h1>
                <hr/>
                <p>Please read and click to sign.</p>
                <p>I certify that the information given in this application form is true, correct, and complete.</p>
                <p>I certify that I (and my spouse, if applicable) have filed an income return with the CRA for tax year {{ incomeTaxReturnYear }}.</p>
                <Checkbox 
                    :label="applicantConsentLabel"
                    id="applicant-consent"
                    v-model="isAuthorized" /> <br/>
                <div class="container pt-0">
                    <div class="alert alert-info">
                        <p>After clicking Submit, do not navigate away from this page. Please wait for the submission process to complete.</p>
                    </div>
                </div>
            </div>
        </PageContent>
        <ContinueBar @continue="nextPage()" :buttonLabel="'Submit'" />
    </div>
</template>

<style scoped>
.alert {
  bottom: 0;
  left: 0;
}
</style>
  
<script>
import ProgressBar from '../components/ProgressBar.vue';
import PageContent from '../components/PageContent.vue';
import ContinueBar from '../components/ContinueBar.vue';
import Checkbox from '../components/Checkbox.vue';
import { stepRoutes, routes } from '../router/index';
import pageStateService from '../services/page-state-service.js';

export default {
    name: 'DeclarationPage',
    components: {
        ProgressBar,
        PageContent,
        ContinueBar,
        Checkbox,
    },
    data: () => {
        return {
            stepRoutes,
            isAuthorized: null,
            incomeTaxReturnYear: null
        };
    },
    created() {
        this.incomeTaxReturnYear = new Date().getFullYear() - 2;
    },
    computed: {
        applicantConsentLabel() {
            // TO-DO: Replace TEST with the actual store value from the first and last name on the Personal Info Page"
            let label = 'TEST';
            return label;
        }
    },
    methods: {
        nextPage() {
            const path = routes.SUBMISSION.path;
            pageStateService.setPageComplete(path);
            pageStateService.visitPage(path);
            this.$router.push(path);
        }
    }
}
</script>
  