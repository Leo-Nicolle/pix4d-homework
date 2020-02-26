<template>
  <div id="app">
    <Toolbar />
    <Map />
  </div>
</template>

<script>
import Map from "./components/Map.vue";
import Toolbar from "./components/ToolBar.vue";

export default {
  name: "App",
  components: {
    Map,
    Toolbar
  }
};
</script>

<style></style>
