<template>
    <div>
        <ProgressBar :routes="stepRoutes" :currentPath="$route.path" />
        <PageContent>
            <div class="container pt-3 pt-sm-5 mb-5">
                <h1>Declaration</h1>
            </div>
        </PageContent>
        <ContinueBar @continue="nextPage()" :buttonLabel="'Submit'" />
    </div>
</template>
  
<script>
import ProgressBar from '../components/ProgressBar.vue';
import PageContent from '../components/PageContent.vue';
import ContinueBar from '../components/ContinueBar.vue';
import { stepRoutes, routes } from '../router/index';
import pageStateService from '../services/page-state-service.js';

export default {
    name: 'DeclarationPage',
    components: {
        ProgressBar,
        PageContent,
        ContinueBar
    },
    data: () => {
        return {
            stepRoutes,
        };
    },
    created() {
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
  