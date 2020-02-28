<template>
  <div class="engine">
    <Map>
      <template v-slot:layers>
        <MapPolyline />
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
  }
};
</script>

<style scoped></style>
