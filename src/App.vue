<template>
  <div id="app">
    <Toolbar />
    <MapContainer />
  </div>
</template>

<script>
import MapContainer from "./components/MapContainer.vue";
import Toolbar from "./components/ToolBar.vue";

export default {
  name: "App",
  components: {
    MapContainer,
    Toolbar
  }
};
</script>

<style></style>
