<template>
  <div class="error-box container">
    <div class="row align-items-center">
      <div class="col-md-1 pr-0 text-center text-danger">
        <font-awesome-icon icon="times-circle" size="3x" />
      </div>
      <div class="col-md-10 py-2">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
  
<style scoped>
.error-box {
    border-radius: 10px;
    border: 1px solid rgb(0, 0, 0);
    background-color: #fccece;
    padding: 10px;
    color: rgb(0, 0, 0);
}
</style>
