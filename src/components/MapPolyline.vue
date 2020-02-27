<template>
  <div class="polyline">
    <l-circle-marker
      v-for="(point, i) in points"
      :key="`point-${i}`"
      :lat-lng="point.coordinates"
      :radius="point.isHovered ? 6 : 4"
      :color="point.isHovered ? 'green' : 'red'"
    />
    <l-polyline
      v-for="(line, i) in hoveredLines"
      :key="`hovered-${i}`"
      :color="'green'"
      :weight="6"
      :lat-lngs="line"
    />
    <l-polyline
      v-for="(line, i) in notHoveredLines"
      :key="`notHovered-${i}`"
      :color="'red'"
      :lat-lngs="line"
    />
  </div>
</template>

<script>
import { LCircleMarker, LPolyline } from "vue2-leaflet";
import module from "../mixins/module";
import pointsController from "../js/points-controller";

export default {
  name: "MapPolyline",
  components: {
    LCircleMarker,
    LPolyline
  },
  mixins: [module],
  props: {
    mouseData: Object
  },
  data() {
    return {
      points: [
        { coordinates: [47.18, -1.4] },
        { coordinates: [47.18, -1.1] },
        { coordinates: [47.18, -0.9] }
      ],
      hoveredPoint: null,
      notHoveredLines: [],
      hoveredLines: [],
      hoverThreshold: 6
    };
  },
  watch: {
    // triggered by mousemove, updates which points and lines are hovered
    mouseData: function({ position, dragging, latLng }) {
      if (!this.isMyMode) return;
      if (dragging) {
        this.drag(latLng);
      }
      this.update(position);
    }
  },
  mounted() {
    this.initiate("polyline");
    this.update();
  },
  methods: {
    drag(latLng) {
      if (this.hoveredPoint) {
        this.dragPointTo(latLng);
      }
    },
    dragPointTo(latLng) {
      this.points = this.points.map(point => {
        if (!point.isHovered) return point;
        return { coordinates: [latLng.lat, latLng.lng] };
      });
    },
    update(mousePosition) {
      const data = {
        mousePosition,
        points: this.points,
        hoverThreshold: this.hoverThreshold,
        leafletMap: this.leafletMap
      };
      const { points, hoveredPoint } = pointsController.getHoveredPoints(data);
      data.ingoreHoverLine = !mousePosition || hoveredPoint;
      const {
        hoveredLines,
        notHoveredLines
      } = pointsController.getHoveredLines(data);
      this.hoveredLines = hoveredLines;
      this.notHoveredLines = notHoveredLines;
      this.points = points;
      this.hoveredPoint = hoveredPoint;
      this.updateState();
    },
    updateState() {
      const cursor =
        this.hoveredLines.length || this.hoveredPoint ? "pointer" : "crosshair";
      this.$store.commit("setCursor", cursor);
      this.$store.commit("hover", this.hoveredPoint || this.hoveredLines[0]);
    }
  }
};
</script>

<style>
.leaflet-interactive {
  cursor: inherit;
}
</style>
