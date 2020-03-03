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
import loadSave from "./mixins/load-save";

export default {
  name: "App",
  components: {
    MapContainer,
    Toolbar
  },
  mixins: [loadSave],
  methods: {
    onSave() {
      eventBus.emit("save");
    },
    onLoad() {
      eventBus.emit("load");
    },
    saveState() {
      localStorage.setItem("global-store", JSON.stringify(this.$store.state));
    },
    loadState() {
      const savedState = localStorage.getItem("global-store");
      if (!savedState) return;
      this.$store.replaceState(JSON.parse(savedState));
    }
  }
};
</script>

<style></style>
