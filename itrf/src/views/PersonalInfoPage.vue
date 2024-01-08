<template>
    <div>
        <ProgressBar :routes="stepRoutes" :currentPath="$route.path" />
        <PageContent>
            <div class="container pt-3 pt-sm-5 mb-5">
                <h1>Personal Information</h1>
                <hr/>
                <p>Enter your name as it appears in your BC Services Card</p>
                <Input
                    :label="'First name'"
                    :className="'mt-3'"
                    :inputStyle="mediumStyles"
                    v-model="firstName"
                    :required="true"
                />
                <Input
                    :label="'Last name'"
                    :className="'mt-3'"
                    :inputStyle="mediumStyles"
                    v-model="lastName"
                    :required="true"
                />
                <div class="row">
                    <div class="col-sm-7">
                    <DateInput
                        label='Birthdate'
                        className='mt-3'
                        v-model='birthDate'
                        :required="true"
                    />
                    <Input
                        :label="'Personal Health Number (PHN)'"
                        :className="'mt-3'"
                        :inputStyle="smallStyles"
                        v-model="phn"
                        :required="true"
                    />
                    <Input
                        :label="'Pharmacare Registration Number (optional)'"
                        :className="'mt-3'"
                        :inputStyle="smallStyles"
                        v-model="regNum"
                        :required="true"
                    />
                    </div>
                    <div class="col-sm-5">
                        <TipBox title="Tip: PHN number">
                            <p>The 10 digit number can be found on the back of your <a href="https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/personal-health-identification/your-bc-services-card" target="_blank">BC Services Card</a>.</p>
                            <div class="bcid-container">
                                <div class="bcid-image-container">
                                <img src="../images/bcid-sample-front.png"
                                    alt="BC Services Card sample front"
                                    class="bcid"/>
                                </div>
                                <div class="bcid-image-container">
                                <img src="../images/bcid-sample-back.png"
                                    alt="BC Services Card sample back"
                                    class="bcid"/>
                                </div>
                            </div>
                        </TipBox>
                    </div>
                </div>  
            </div>
        </PageContent>
        <ContinueBar @continue="nextPage()" :buttonLabel="'Continue'" />
    </div>
</template>

<style scoped>
.mt-3 {
    font-weight: bolder;
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
  
<script>
import ProgressBar from '../components/ProgressBar.vue';
import PageContent from '../components/PageContent.vue';
import ContinueBar from '../components/ContinueBar.vue';
import Input from '../components/Input.vue';
import DateInput from '../components/DateInput.vue';
import TipBox from '../components/TipBox.vue';
import { stepRoutes, routes } from '../router/index';
import pageStateService from '../services/page-state-service.js';
import { isPastPath } from '../router/index';
import { mediumStyles, smallStyles,} from '../constants/input-styles';

export default {
    name: 'PersonalInfoPage',
    components: {
        ProgressBar,
        PageContent,
        ContinueBar,
        Input,
        DateInput,
        TipBox
    },
    data: () => {
        return {
            stepRoutes,
            smallStyles,
            mediumStyles,
            firstName: "",
            lastName: "",
            birthDate: null,
            phn: "",
            regNum: "",
        };
    },
    created() {
    },
    methods: {
        nextPage() {
            const path = routes.DECLARATION.path;
            pageStateService.setPageComplete(path);
            pageStateService.visitPage(path);
            this.$router.push(path);
        }
    },
    beforeRouteLeave(to, from, next){
        pageStateService.setPageIncomplete(from.path);
        if (pageStateService.isPageComplete(to.path) || isPastPath(to.path, from.path)) {
            next();
        } else {
            next();
            // Will uncomment once there's page validation
            // next({
            //     path: routes.PERSONAL_INFO.path,
            //     replace: true
            // });
        }
    }
}
</script>
  