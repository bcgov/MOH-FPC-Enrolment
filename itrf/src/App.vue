<script setup>
  import GetStartedPage from './views/GetStartedPage.vue';
</script>

<template>
  <GetStartedPage/>
</template>

<style lang="scss">
main {
  padding: 0;
}

label {
  margin: 0 !important;
}

input[type="radio"] {
  min-width: 18px;
  width: 18px;
  height: 18px;
}

.footer {
  position: fixed;
  width: 100vw;
  bottom: 0;
}

.text-danger {
  color: #D8292F !important;
}

.bottom {
  position: fixed;
  right: 40px;
  bottom: 0;
}

.mb {
  margin-bottom: 80px;
}

.submission-type {
  background: #eee;
  padding: 4px 8px 0 8px;
  display: flex;
  flex: 1;
  align-items: center;

  .name {
    width: 50%;
    text-align: right;
    padding-right: 8px;
  }

  .radios {
    width: 50%;
    padding: 0 6px;
  }
}
</style>
