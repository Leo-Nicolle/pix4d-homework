<template>
  <div id="app">
    <Toolbar
      :flight-plans="flightPlans"
      @save="onSave"
      @load="onLoad"
      @delete-flight-plan="onDeleteFlightPlan"
    />
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
  data() {
    return {
      flightPlans: []
    };
  },
  mounted() {
    this.createFlightPlansIfNotExists();
    this.fetchFlightPlans();
  },
  methods: {
    fetchFlightPlans() {
      this.flightPlans = JSON.parse(localStorage.getItem("flight-plans"));
      return this.flightPlans;
    },
    uploadFlightPlans(flightPlans) {
      localStorage.setItem("flight-plans", JSON.stringify(this.flightPlans));
    },
    createFlightPlansIfNotExists() {
      if (this.fetchFlightPlans()) return;
      this.flightPlans = [];
      this.uploadFlightPlans();
    },
    onSave() {
      const savedState = {};
      eventBus.emit("save", savedState);
      this.flightPlans = this.flightPlans.concat(savedState);
      this.uploadFlightPlans();
    },
    onLoad(index) {
      const savedState = this.flightPlans[index];
      if (!savedState) return;
      eventBus.emit("load", savedState);
    },
    onDeleteFlightPlan(index) {
      this.flightPlans = this.flightPlans.filter((e, i) => i !== +index);
      this.uploadFlightPlans();
    },
    saveState(savedState) {
      savedState.globalStore = this.$store.state;
    },
    loadState({ globalStore }) {
      if (!globalStore) return;
      this.$store.replaceState(globalStore);
    }
  }
};
</script>

<style></style>
