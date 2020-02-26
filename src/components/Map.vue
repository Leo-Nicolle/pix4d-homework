<template>
  <div class="map">
    <l-map
      style="height: 350px"
      :zoom="zoom"
      :center="center"
      @mousemove="onMouseMove"
      ref="map"
    >
      <l-tile-layer :url="url"> </l-tile-layer>
      <MapPolyline :cursorLatLng="cursorLatLng" :leafletMap="leafletMap" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LCircleMarker, LPolyline } from "vue2-leaflet";
import MapPolyline from "./MapPolyline";

import "leaflet/dist/leaflet.css";
export default {
  name: "Map",
  props: {},
  components: {
    LMap,
    LCircleMarker,
    LTileLayer,
    LPolyline,
    MapPolyline
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      cursorLatLng: { lat: 0, lng: 0 },
      zoom: 8,
      center: [47.31322, -1.319482],
      markerLatLng: [47.31322, -1.319482],
      leafletMap: null
    };
  },
  mounted() {
    this.leafletMap = this.$refs.map.mapObject;
  },
  methods: {
    onMouseMove(evt) {
      this.cursorLatLng = evt.latlng;
    },
    onDragStart(evt) {},
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
