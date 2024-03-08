module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:cypress/recommended",
    "prettier",
  ],
  rules: {
    "no-unused-vars": "warn",
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
  parserOptions: {
    ecmaVersion: 13, //allows eslint to correctly parse class properties, eg. page-state-service.js
  },
};
