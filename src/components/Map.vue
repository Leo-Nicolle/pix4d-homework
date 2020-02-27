<template>
  <div class="map">
    <l-map
      ref="map"
      :style="{ cursor, height: '350px' }"
      :zoom="zoom"
      :center="center"
      @click="onClick"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mousedown="onMouseDown"
      @contextmenu="onContextMenu"
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
      currentMouseData: {},
      mouseDown: false,
      hasDragged: false,
      center: [47.31322, -1.319482]
    };
  },
  computed: {
    leafletMap: function() {
      return this.$refs.map.mapObject;
    }
  },
  mounted() {
    this.initiate("default");
    // hack to be able to access the map's state from anywhere.
    // modules can need to project points from local to latlng etc
    // this.$store.commit("setLeafLetMap", this.$refs.map.mapObject);
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
      this.hasDragged = this.mouseDown;
      const data = this.getEventData(evt, { dragging: this.mouseDown });

      const currentData = this.currentData || data;
      data.delta = {
        latLng: {
          lat: data.latLng.lat - currentData.latLng.lat,
          lng: data.latLng.lng - currentData.latLng.lng
        },
        position: {
          lat: data.position.lat - currentData.position.lat,
          lng: data.position.lng - currentData.position.lng
        }
      };
      this.mapEventsBus.$emit("mousemove", data);
      evt.originalEvent.stopPropagation();
    },
    onMouseDown(evt) {
      this.mouseDown = true;
      this.hasDragged = false;
      this.mapEventsBus.$emit("click", this.getEventData(evt));
      //
      // this.$emit("mousedown");
      // if (this.mode !== "default" || this.hovered || this.selected) {
      //   evt.originalEvent.stopPropagation();
      // }
    },
    onMouseUp(evt) {
      this.mouseDown = false;
      this.mapEventsBus.$emit("mouseup", this.getEventData(evt));
    },
    onClick(evt) {
      if (this.hasDragged) return;
      this.mapEventsBus.$emit("click", this.getEventData(evt));
      // evt.originalEvent.stopPropagation();
    },
    onContextMenu(evt) {
      this.mapEventsBus.$emit("click", this.getEventData(evt));
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
