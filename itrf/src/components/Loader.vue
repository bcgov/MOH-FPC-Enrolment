<template>
  <div>
    <div :class="loaderCss" />
    <div v-if="page">Loading... Please Wait</div>
  </div>
</template>

<script>
// import "@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Loader",
  props: {
    page: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      loaderCss: this.page ? "bcgov-page-loader" : "bcgov-btn-loader",
    };
  },
};
</script>

<style scoped>
.bcgov-page-loader {
  height: 60px;
  width: 60px;
  color: #494949;
  border: 7px solid;
  border-radius: 50%;
  border-top-color: transparent;
  animation: rotate 2s linear infinite;
  display: inline-block;
}

.bcgov-btn-loader {
  height: 15px;
  width: 15px;
  color: #ffffff;
  border: 2px solid;
  border-radius: 50%;
  border-top-color: transparent;
  animation: rotate 2s linear infinite;
  display: inline-block;
  margin-left: 10px;
  margin-top: 3px;
  vertical-align: text-top;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.test-container {
  background: rgba(225, 232, 242, 1);
  width: 200px;
}
</style>
