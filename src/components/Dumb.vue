<template>
  <div class="polyline">
    <l-circle-marker
      v-for="(point, i) in points"
      :key="`point-${i}`"
      :lat-lng="point.coordinates"
      :radius="point.isHovered ? 6 : 4"
      :color="point.isHovered ? 'green' : 'blue'"
    />
  </div>
</template>

<script>
import { LCircleMarker } from "vue2-leaflet";
import module from "../mixins/module";
export default {
  name: "Dumb",
  components: {
    LCircleMarker
  },
  mixins: [module],
  props: {
    mouseData: Object
  },
  data() {
    return {
      points: [{ coordinates: [47, -1.0] }]
    };
  },
  watch: {
    mouseData: function(mouseData) {
      if (!this.isMyMode) return;
      this.update(mouseData.position);
    }
  },
  mounted() {
    this.initiate("dumb");
    this.update();
  },
  methods: {
    update(mousePosition) {}
  }
};
</script>

<style>
.leaflet-interactive {
  cursor: inherit;
}
</style>
