<template>
  <div id="app">
    <Toolbar @save="onSave()" @load="onLoad()" />
    <MapContainer />
  </div>
</template>

<script>
import MapContainer from "./components/MapContainer.vue";
import Toolbar from "./components/ToolBar.vue";
import eventBus from "./js/event-bus";

export default {
  name: "App",
  components: {
    MapContainer,
    Toolbar
  },
  methods: {
    onSave() {
      eventBus.emit("save");
    },
    onLoad() {
      eventBus.emit("load");
    }
  }
};
</script>

<style></style>
