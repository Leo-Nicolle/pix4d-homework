<template>
  <div id="app">
    <Toolbar
      :flight-plans="flightPlans"
      @save-flight-plan="onSaveFlightPlan"
      @load-flight-plan="onLoadFlightPlan"
      @delete-flight-plan="onDeleteFlightPlan"
    />
    <MapContainer />
    <Help />
  </div>
</template>

<script>
import MapContainer from "./components/MapContainer.vue";
import Toolbar from "./components/ToolBar.vue";
import Help from "./components/Help.vue";

import eventBus from "./js/event-bus";

export default {
  name: "App",
  components: {
    MapContainer,
    Toolbar,
    Help
  },
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
    // communication with server (localStorage)
    fetchFlightPlans() {
      this.flightPlans = JSON.parse(localStorage.getItem("flight-plans"));
      return this.flightPlans;
    },
    uploadFlightPlans(flightPlans) {
      localStorage.setItem("flight-plans", JSON.stringify(this.flightPlans));
    },
    // initialisation of localStorage
    createFlightPlansIfNotExists() {
      if (this.fetchFlightPlans()) return;
      this.flightPlans = [];
      this.uploadFlightPlans();
    },
    // emition of save and load events to the app
    onSaveFlightPlan() {
      const savedState = {};
      eventBus.emit("save", savedState);
      this.flightPlans = this.flightPlans.concat(savedState);
      this.uploadFlightPlans();
    },
    onLoadFlightPlan(index) {
      const savedState = this.flightPlans[index];
      if (!savedState) {
        // resets the map if there is no flight plan
        eventBus.emit("reset");
        return;
      }
      // on page load the toolbar will trigger onload as soon as it is ready
      // but at this moment the other components are not
      // so we wait for the next tick. Could have also been done in
      // toolbar.vue
      eventBus.emit("load", savedState);
    },
    onDeleteFlightPlan(index) {
      this.flightPlans = this.flightPlans.filter((e, i) => i !== +index);
      this.uploadFlightPlans();
    }
  }
};
</script>

<style></style>
