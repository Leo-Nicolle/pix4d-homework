<template>
  <div class="engine">
    <Map
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @click="onClick"
    >
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
  name: "InterractiveMap",
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
      //delta
      mouseData.previous = {
        position: this.mouseData.position,
        latLng: this.mouseData.latLng
      };
      this.mouseData = mouseData;
    },
    onMouseDown(mouseData) {
      this.mousedown = true;
      this.mouseData.mouseDown = mouseData;
    },
    onMouseUp() {
      this.mousedown = false;
      this.mouseData.mouseDown = null;
    },
    onClick(mouseData) {
      this.mouseData = mouseData;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
