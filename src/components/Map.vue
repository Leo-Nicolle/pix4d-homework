<template>
  <div class="map">
    <l-map
      style="height: 350px"
      :zoom="zoom"
      :center="center"
      @dragStartHandler="onDragStart"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @mousemove="onMouseMove"
    >
      <l-tile-layer :url="url"></l-tile-layer>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPolyline } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
export default {
  name: "Map",
  components: {
    LMap,
    LTileLayer,
    LPolyline
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 8,
      center: [47.31322, -1.319482],
      polyline: []
    };
  },
  methods: {
    onMouseMove(evt) {
      // console.log(evt.latlng);
    },
    onDragStart(evt) {
      console.log("dragsstart", evt, evt.latlng);
    },
    onDragEnd(evt) {
      console.log("dragsend", evt);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  max-width: 100%;
}
</style>
