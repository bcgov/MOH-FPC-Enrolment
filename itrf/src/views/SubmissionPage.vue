<template>
    <div>
        <ProgressBar :routes="stepRoutes" :currentPath="$route.path" />
        <PageContent>
            <div class="container pt-3 pt-sm-5 mb-5">
            </div>
        </PageContent>
    </div>
</template>
  
<script>
import ProgressBar from '../components/ProgressBar.vue';
import PageContent from '../components/PageContent.vue';
import { stepRoutes } from "../router/index";

export default {
    name: 'DeclarationPage',
    components: {
        ProgressBar,
        PageContent,
    },
    data: () => {
        return {
            stepRoutes,
        };
    },
    created() {
    },
}
</script>
  