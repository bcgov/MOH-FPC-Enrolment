<template>
  <div>
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Maintenance Mode</h1>
        <hr />
        <p>{{ maintenanceMessage }}</p>
      </div>
    </PageContent>
  </div>
</template>

<script>
import PageContent from "../components/PageContent.vue";
import logService from "../services/log-service.js";
import { routes } from "../router/index.js";

export default {
  name: "MaintenancePage",
  components: {
    PageContent,
  },
  data: () => {
    return {
      maintenanceMessage:
        "This application is currently unavailable due to maintenance. Please try again later.",
    };
  },
  created() {
    this.applicationUuid = this.$store.state.applicationUuid;
    logService.logNavigation(
      this.$store.state.applicationUuid,
      routes.MAINTENANCE.path,
      routes.MAINTENANCE.title,
    );
    if (
      this &&
      this.$store &&
      this.$store.state &&
      this.$store.state.maintenanceMessage
    ) {
      this.maintenanceMessage = this.$store.state.maintenanceMessage;
    }
  },
};
</script>
