module.exports = {
  extends: ["plugin:vue/recommended"],
  rules: {
    "no-console": "off",
    "no-unused-vars": "off",
    "vue/require-default-prop": [
      "warning",
      {
        required: false,
        "non-required": false
      }
    ],
    "vue/no-unused-components": ["warning", { ignoreWhenBindingPresent: true }],
    "vue/require-default-prop": ["warning"]
  }
};
