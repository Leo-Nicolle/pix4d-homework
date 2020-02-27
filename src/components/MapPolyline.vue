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
    mouse: Object
  },
  data() {
    return {
      points: [
        { coordinates: [47.18, -1.4] },
        { coordinates: [47.18, -1.1] },
        { coordinates: [47.18, -0.9] }
      ],
      pointHovered: null,
      notHoveredLines: [],
      hoveredLines: [],
      hoverThreshold: 6
    };
  },
  watch: {
    // triggered by mousemove, updates which points and lines are hovered
    mouse: function({ position }) {
      this.update(position);
    }
  },
  mounted() {
    this.initiate("polyline");
    this.update();
  },
  methods: {
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
        this.hoveredLines.length || this.pointHovered
          ? "pointer"
          : this.isMyMode
          ? "crosshair"
          : "";
      this.$store.commit("setCursor", cursor);
      this.$store.commit("hover", this.pointHovered || this.hoveredLines[0]);
    }
  }
};
</script>

<style scoped></style>
