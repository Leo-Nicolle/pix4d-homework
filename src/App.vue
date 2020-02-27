<template>
  <div id="app">
    <Toolbar />
    <Engine />
  </div>
</template>

<script>
import Engine from "./components/Engine.vue";
import Toolbar from "./components/ToolBar.vue";

export default {
  name: "App",
  components: {
    Engine,
    Toolbar
  }
};
</script>

<style></style>
