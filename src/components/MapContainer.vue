<template>
  <div class="engine">
    <Map>
      <template v-slot:layers>
        <MapPolylineLayer />
      </template>
    </Map>
  </div>
</template>

<script>
import Map from "./Map";
import MapPolylineLayer from "./MapPolylineLayer";

export default {
  name: "MapContainer",
  components: {
    Map,
    MapPolylineLayer
  }
};
</script>

<style scoped></style>
