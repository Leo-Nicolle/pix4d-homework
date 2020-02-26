module.exports = {
  extends: ["plugin:vue/recommended"],
  rules: {
    "no-console": "off",
    "no-unused-vars": "off",
    "vue/require-default-prop": [1],
    "vue/no-unused-components": [1, { ignoreWhenBindingPresent: true }]
  }
};
