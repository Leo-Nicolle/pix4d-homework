<template>
  <div id="app">
    <Toolbar />
    <InterractiveMap />
  </div>
</template>

<script>
import InterractiveMap from "./components/InterractiveMap.vue";
import Toolbar from "./components/ToolBar.vue";

export default {
  name: "App",
  components: {
    InterractiveMap,
    Toolbar
  }
};
</script>

<style></style>
