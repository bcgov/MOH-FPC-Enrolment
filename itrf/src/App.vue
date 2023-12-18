<script setup>
  import GetStartedPage from './views/GetStartedPage.vue';
</script>

<template>
  <div id="app">
    <main>
      <GetStartedPage/>
    </main>
  </div>
  <Footer :version='version' />
</template>

<script>
import "./styles/style.css";
import "./styles/bootstrap-theme.min.css";
import project from '../package.json';
import Footer from "../src/components/Footer.vue";

export default {
  name: "App",
  components: {
  },
  data: () => {
    return {
      version: project.version,
      pageTitle: "Income Tax Return Filed Form"
    };
  },
  created() {
    document.title = this.pageTitle;
  },
  methods: {
  },
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
