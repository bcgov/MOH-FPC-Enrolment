<template>
  <div id="app">
    <HeaderComponent :title="pageTitle" image-path="/itrf/images/" />
    <router-view></router-view>
    <FooterComponent :version="version" />
  </div>
</template>

<script>
import "./styles/style.css";
import "./styles/bootstrap-theme.min.css";
import project from "../package.json";
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data: () => {
    return {
      version: project.version,
      pageTitle: "Fair PharmaCare Taxes Filed",
    };
  },
  created() {
    document.title = this.pageTitle;
    // eslint-disable-next-line no-unused-vars
    const applicationUuid = this.$store.state.applicationUuid;
  },
  methods: {},
};
</script>

<style scoped>
main {
  padding: 0;
}

@media only screen and (max-width: 575px) {
  .container.stepper {
    padding: 0;
  }
}
</style>
