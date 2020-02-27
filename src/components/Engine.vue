<template>
  <div class="engine">
    <Map @mousemove="onMouseMove">
      <template v-slot:layers>
        <MapPolyline :mouse="mouse" />
      </template>
    </Map>
  </div>
</template>

<script>
import Map from "./Map";
import MapPolyline from "./MapPolyline";

export default {
  name: "Engine",
  components: {
    Map,
    MapPolyline
  },
  props: {},
  data() {
    return {
      mouse: {}
    };
  },
  mounted() {},
  methods: {
    onMouseMove(mouse) {
      this.mouse = mouse;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
