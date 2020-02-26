<template>
  <div class="map">
    <l-map
      :style="{ cursor, height: '350px' }"
      :zoom="zoom"
      :center="center"
      @mousemove="onMouseMove"
      ref="map"
    >
      <l-tile-layer :url="url"> </l-tile-layer>
      <MapPolyline :cursorLatLng="cursorLatLng" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
import MapPolyline from "./MapPolyline";
import { mapState } from "vuex";

import "leaflet/dist/leaflet.css";
export default {
  name: "Map",
  props: {},
  components: {
    LMap,
    LTileLayer,
    MapPolyline
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      cursorLatLng: { lat: 0, lng: 0 },
      zoom: 8,
      center: [47.31322, -1.319482]
    };
  },
  mounted() {
    this.$store.commit("setLeafLetMap", this.$refs.map.mapObject);
  },
  computed: mapState(["cursor"]),
  methods: {
    onMouseMove(evt) {
      this.cursorLatLng = evt.latlng;
      evt.originalEvent.stopPropagation();
    },
    onDragStart(evt) {},
    onDragEnd(evt) {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  max-width: 100%;
}
</style>
