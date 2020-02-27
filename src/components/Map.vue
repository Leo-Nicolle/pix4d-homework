<template>
  <div class="map">
    <l-map
      ref="map"
      :style="{ cursor, height: '350px' }"
      :zoom="zoom"
      :center="center"
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @contextmenu="onContextMenu"
      @click="onClick"
    >
      <l-tile-layer :url="url" />
      <slot name="layers" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
import { mapState } from "vuex";
import module from "../mixins/module";

import "leaflet/dist/leaflet.css";
export default {
  name: "Map",
  components: {
    LMap,
    LTileLayer
  },
  mixins: [module],
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 8,
      center: [47.31322, -1.319482]
    };
  },
  mounted() {
    this.initiate("default");
    // hack to be able to access the map's state from anywhere.
    // modules can need to project points from local to latlng etc
    this.$store.commit("setLeafLetMap", this.$refs.map.mapObject);
  },
  methods: {
    getEventData(evt, data) {
      return {
        ...data,
        latLng: evt.latlng,
        position: this.leafletMap.latLngToLayerPoint(evt.latlng),
        evt
      };
    },
    onMouseMove(evt) {
      this.$emit("mousemove", this.getEventData(evt, { mousemove: true }));

      if (this.isMyMode) {
        this.$store.commit("setCursor", "");
      } else {
        evt.originalEvent.stopPropagation();
        return false;
      }
    },
    onMouseDown(evt) {
      this.$emit("mousedown", this.getEventData(evt, { mousedown: true }));
      if (this.mode !== "default" || this.hovered || this.selected) {
        evt.originalEvent.stopPropagation();
      }
    },
    onMouseUp(evt) {
      console.log("mouseup");
      this.$emit("mouseup", this.getEventData(evt, { mouseup: true }));
    },
    onClick(evt) {
      console.log("click ");

      this.$emit("click", this.getEventData(evt, { mouseclick: true }));
      // evt.originalEvent.stopPropagation();
    },
    onContextMenu(evt) {
      console.log(evt.originalEvent);
      this.$emit("click", this.getEventData(evt, { mouseclick: true }));
      evt.originalEvent.preventDefault();
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
