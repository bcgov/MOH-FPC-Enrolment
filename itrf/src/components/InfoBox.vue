<template>
  <div class="info-box container">
    <div class="row align-items-center">
      <div class="col-md-1 pr-0 text-center text-info">
        <font-awesome-icon class="info-circle" icon="info-circle" size="3x" />
      </div>
      <div class="col-md-10 py-2">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-box {
  border-radius: 10px;
  border: 2px solid rgb(151, 188, 255);
  background-color: #d0e6ff;
  padding: 10px;
}

.info-circle {
  color: rgb(41, 136, 199);
}
</style>
