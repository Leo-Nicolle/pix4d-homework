<template>
  <div class="engine">
    <Map>
      <template v-slot:layers>
        <MapPolyline />
        <Dumb />
      </template>
    </Map>
  </div>
</template>

<script>
import Map from "./Map";
import MapPolyline from "./MapPolyline";
import Dumb from "./Dumb";

export default {
  name: "InterractiveMap",
  components: {
    Map,
    Dumb,
    MapPolyline
  },
  props: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
