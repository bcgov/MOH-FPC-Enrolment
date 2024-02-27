<template>
  <div id="app">
    <Header :title="pageTitle" image-path="/itrf/images/" />
    <router-view></router-view>
    <Footer :version="version" />
  </div>
</template>

<script>
import "./styles/style.css";
import "./styles/bootstrap-theme.min.css";
import project from "../package.json";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  data: () => {
    return {
      version: project.version,
      pageTitle: "Fair PharmaCare Taxes Filed",
    };
  },
  created() {
    document.title = this.pageTitle;
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
