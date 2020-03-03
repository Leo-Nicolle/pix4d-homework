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
      @update:zoom="onTranformChange"
      @update:center="onTranformChange"
      @update:bounds="onTranformChange"
    >
      <l-tile-layer :url="url" />
      <slot name="layers" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
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
      zoom: 7,
      currentMouseData: {},
      mouseDown: false,
      dragging: false,
      center: [46.777, 8.212]
    };
  },
  computed: {
    leafletMap: function() {
      return this.$refs.map.mapObject;
    }
  },
  watch: {
    mode: function() {
      if (!this.isMyMode) return;
      this.$store.commit("setCursor", "grab");
    }
  },
  mounted() {
    this.initiate("map");
  },
  methods: {
    getEventData(evt, data) {
      this.currentData = {
        ...data,
        dragging: this.dragging,
        latLng: evt.latlng,
        position: this.leafletMap.latLngToLayerPoint(evt.latlng),
        evt
      };
      return this.currentData;
    },
    // mouse events
    onMouseMove(evt) {
      const currentData = this.currentData;
      this.dragging = this.mouseDown;
      const data = this.getEventData(evt);
      data.delta = currentData
        ? {
            latLng: {
              lat: data.latLng.lat - currentData.latLng.lat,
              lng: data.latLng.lng - currentData.latLng.lng
            },
            position: {
              x: data.position.x - currentData.position.x,
              y: data.position.y - currentData.position.y
            }
          }
        : {
            latLng: {
              lat: 0,
              lng: 0
            },
            position: {
              x: 0,
              y: 0
            }
          };
      this.mapEventsBus.emit("mousemove", data);
    },
    onMouseDown(evt) {
      this.mouseDown = true;
      this.dragging = false;
      this.mapEventsBus.emit("mousedown", this.getEventData(evt));
    },
    onMouseUp(evt) {
      this.mouseDown = false;
      this.mapEventsBus.emit("mouseup", this.getEventData(evt));
    },
    onClick(evt) {
      this.mapEventsBus.emit("click", this.getEventData(evt));
    },
    onContextMenu(evt) {
      this.mapEventsBus.emit("click", this.getEventData(evt));
      evt.originalEvent.preventDefault();
    },
    // map event
    onTranformChange() {
      const transform = point => ({
        ...point,
        position: this.leafletMap.latLngToLayerPoint(point.latLng)
      });
      this.mapEventsBus.emit("transform-change", transform);
    },
    // handle event as a module.
    onMapMouseMove(mouseData) {
      if (this.isMyMode) {
        this.leafletMap.dragging.enable();
      } else {
        this.leafletMap.dragging.disable();
        mouseData.evt.originalEvent.preventDefault();
      }
    }
  }
};
</script>

<style scoped>
.map {
  max-width: 100%;
}
</style>
