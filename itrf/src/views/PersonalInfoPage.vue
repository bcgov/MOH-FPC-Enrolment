<template>
    <div>
        <ProgressBar :routes="stepRoutes" :currentPath="$route.path" />
        <PageContent>
            <div class="container pt-3 pt-sm-5 mb-5">
                <h1>Personal Information</h1>
                <hr/>
                <p>Enter your name as it appears in your BC Services Card</p>
                <div class="row">
                    <div class="col-sm-7">
                        <Input
                            :label="'First name'"
                            :className="'mt-3'"
                            :inputStyle="mediumStyles"
                            v-model="firstName"
                            :required="true"
                        />
                        <div class="text-danger"
                            v-if="v$.firstName.$dirty && v$.firstName.required.$invalid"
                            aria-live="assertive">First name is required.
                        </div>
                        <div class="text-danger"
                            v-if="v$.firstName.$dirty && !v$.firstName.required.$invalid && v$.firstName.nameValidator.$invalid"
                            aria-live="assertive">First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.
                        </div>
                        <Input
                            :label="'Last name'"
                            :className="'mt-3'"
                            :inputStyle="mediumStyles"
                            v-model="lastName"
                            :required="true"
                        />
                        <div class="text-danger"
                            v-if="v$.lastName.$dirty && v$.lastName.required.$invalid"
                            aria-live="assertive">Last name is required.
                        </div>
                        <div class="text-danger"
                            v-if="v$.lastName.$dirty && !v$.lastName.required.$invalid && v$.lastName.nameValidator.$invalid"
                            aria-live="assertive">Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.
                        </div>
                        <DateInput
                            label='Birthdate'
                            className='mt-3'
                            v-model='birthdate'
                            :required="true"
                        />
                        <div class="text-danger"
                            v-if="v$.birthdate.$dirty && v$.birthdate.required.$invalid"
                            aria-live="assertive">Birthdate is required.
                        </div>
                        <div class="text-danger"
                            v-if="v$.birthdate.$dirty && !v$.birthdate.required.$invalid && v$.birthdate.dateDataValidator.$invalid"
                            aria-live="assertive">Invalid birthdate.
                        </div>
                        <div class="text-danger"
                            v-if="v$.birthdate.$dirty && !v$.birthdate.required.$invalid && v$.birthdate.distantPastValidator.$invalid"
                            aria-live="assertive">Invalid birthdate.
                        </div>
                        <div class="text-danger"
                            v-if="v$.birthdate.$dirty && !v$.birthdate.required.$invalid && v$.birthdate.birthdate16YearsValidator.$invalid"
                            aria-live="assertive">Invalid birthdate.
                        </div>
                        <PhnInput
                            label="Personal Health Number (PHN)"
                            class="mt-3"
                            placeholder="1111 111 111"
                            :inputStyle="smallStyles"
                            v-model="phn"
                            :required="true"
                        />
                        <div class="text-danger"
                            v-if="v$.phn.$dirty && v$.phn.required.$invalid"
                            aria-live="assertive">Personal Health Number is required.
                        </div>
                        <div class="text-danger"
                            v-if="v$.phn.$dirty && !v$.phn.required.$invalid && (v$.phn.phnValidator.$invalid || v$.phn.phnFirstDigitValidator.$invalid)"
                            aria-live="assertive">Personal Health Number is not valid.</div>
                        </div>
                    <div class="col-sm-5">
                        <TipBox title="Tip: PHN number" class="mt-2">
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
  
<script>
import ProgressBar from '../components/ProgressBar.vue';
import PageContent from '../components/PageContent.vue';
import ContinueBar from '../components/ContinueBar.vue';
import Input from '../components/Input.vue';
import DateInput from '../components/DateInput.vue';
import { distantPastValidator, birthdate16YearsValidator } from '../components/DateInput.vue';
import PhnInput from '../components/PhnInput.vue';
import { phnValidator } from '../components/PhnInput.vue';
import { nameValidator, dateDataValidator, phnFirstDigitValidator } from '../helpers/validators';
import TipBox from '../components/TipBox.vue';
import { stepRoutes, routes } from '../router/index';
import pageStateService from '../services/page-state-service.js';
import { isPastPath } from '../router/index';
import { mediumStyles, smallStyles,} from '../constants/input-styles';
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
    name: 'PersonalInfoPage',
    components: {
        ProgressBar,
        PageContent,
        ContinueBar,
        Input,
        DateInput,
        PhnInput,
        TipBox
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
        };
    },
    created() {
        this.firstName = this.$store.state.firstName;
        this.lastName = this.$store.state.lastName;
        this.birthdate = this.$store.state.birthdate;
        this.phn = this.$store.state.phn;
    },
    setup () {
        return { v$: useVuelidate() }
    },
    validations() {
        const validations = {
            firstName: {
                required,
                nameValidator
            },
            lastName: {
                required,
                nameValidator
            },
            birthdate: {
                required,
                dateDataValidator,
                distantPastValidator,
                birthdate16YearsValidator
            },
            phn: {
                required,
                phnValidator,
                phnFirstDigitValidator
            }
        };
        return validations;
    },
    methods: {
        nextPage() {
            this.v$.$touch();

            if (this.v$.$invalid) {
                return;
            }

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
  