<template>
  <div class="engine">
    <Map @mousemove="onMouseMove" @mousedown="onMouseDown" @mouseup="onMouseUp">
      <template v-slot:layers>
        <MapPolyline :mouse-data="mouseData" />
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
      mouseData: {},
      mousedown: false
    };
  },
  mounted() {},
  methods: {
    onMouseMove(mouseData) {
      mouseData.dragging = this.mousedown;
      this.mouseData = mouseData;
    },
    onMouseDown() {
      this.mousedown = true;
    },
    onMouseUp() {
      this.mousedown = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
