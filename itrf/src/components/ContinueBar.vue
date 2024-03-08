<template>
  <div class="continue-bar">
    <div class="d-flex flex-row-reverse p-3 container">
      <ButtonComponent
        class="continue-button"
        :label="buttonLabel"
        :has-loader="hasLoader"
        :data-cy="getCypressValue()"
        @click="onContinue()"
      />
    </div>
  </div>
</template>

<script>
import Button from "./Button.vue";
import cypressMixin from "../mixins/cypress-mixin.js";

export default {
  name: "ContinueBar",
  components: {
    ButtonComponent: Button,
  },
  mixins: [cypressMixin],
  props: {
    hasLoader: {
      type: Boolean,
      default: false,
    },
    buttonLabel: {
      type: String,
      default: "Continue",
    },
  },
  emits: ["continue"],
  methods: {
    onContinue() {
      this.$emit("continue");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.continue-bar {
  background-color: #f2f2f2;
  position: sticky;
  bottom: 0;
}

.continue-button {
  background-color: #003366;
  color: #f4f4f4;
  border-color: #003366;
}
</style>
