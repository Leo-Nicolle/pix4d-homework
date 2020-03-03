<template>
  <div class="polyline">
    <l-circle-marker
      v-for="(point, i) in points"
      :key="`point-${i}`"
      :lat-lng="point.latLng"
      :radius="point.isHovered ? 6 : 4"
      :color="point.isHovered ? 'green' : 'red'"
      :fill="true"
    />
    <l-polyline :color="'red'" :lat-lngs="points.map(point => point.latLng)" />
    <l-polyline
      :color="'green'"
      :weight="6"
      :lat-lngs="hoveredLine.map(point => point.latLng)"
    />
  </div>
</template>

<script>
import { LCircleMarker, LPolyline } from "vue2-leaflet";
import module from "../mixins/module";
import pointsHelper from "../js/points-helper";
export default {
  name: "MapPolylineLayer",
  components: {
    LCircleMarker,
    LPolyline
  },
  mixins: [module],
  data() {
    return {
      points: [],
      notHoveredLines: [],
      hoveredLine: [],
      hoveredLineIndex: -1,
      hoverThreshold: 6,
      dataToSave: ["points"]
    };
  },
  computed: {
    hovered: function() {
      return (
        this.points.find(({ isHovered }) => isHovered) ||
        this.hoveredLineIndex > -1
      );
    }
  },
  mounted() {
    this.initiate("polyline");
  },
  methods: {
    update(mouseData) {
      // check if points are hovered
      this.points = pointsHelper.updatePoints({
        mouseData,
        points: this.points,
        hoverThreshold: this.hoverThreshold
      });
      // check if lines are hovered
      const { hoveredLine, hoveredLineIndex } = pointsHelper.getHoveredLines({
        mouseData,
        points: this.points,
        hoverThreshold: this.hoverThreshold
      });
      this.hoveredLine = hoveredLine;
      this.hoveredLineIndex = hoveredLineIndex;
      // update pointer
      const cursor = this.hovered ? "pointer" : "crosshair";
      this.$store.commit("setCursor", cursor);
    },
    onMapMouseMove(mouseData) {
      if (!this.isMyMode) return;
      this.drag(mouseData);
      this.update(mouseData);
    },
    onMapClick(mouseData) {
      if (!this.isMyMode) return;

      const isRightClick = mouseData.evt.originalEvent.button === 2;
      // remove hovered point on right click
      if (this.hovered && isRightClick) {
        this.points = this.points.filter(point => point !== this.hovered);
      }
      // add point on left click if nothing is hovered
      if (!this.hovered && !isRightClick) {
        this.points = this.points.concat({
          latLng: mouseData.latLng,
          position: mouseData.position
        });
      }
      // add a point on left click if a line is hovered
      if (this.hoveredLineIndex > -1 && !isRightClick && !mouseData.dragging) {
        this.points = this.points
          .slice(0, this.hoveredLineIndex + 1)
          .concat({
            latLng: mouseData.latLng,
            position: mouseData.position
          })
          .concat(this.points.slice(this.hoveredLineIndex + 1));
      }
      this.update(mouseData);
    },
    onMapTransformChange(transform) {
      this.points = this.points.map(point => transform(point));
    },
    drag(mouseData) {
      if (!mouseData.dragging) return;
      // drag hovered point
      this.points = this.points.map(point => {
        if (!point.isHovered) return point;
        return {
          ...point,
          latLng: mouseData.latLng,
          position: mouseData.position
        };
      });
      if (this.hoveredLineIndex < 0) return;
      // drag hovered line
      this.points = this.points.map((point, i) => {
        if (this.hoveredLineIndex < i - 1 || this.hoveredLineIndex > i)
          return point;
        return {
          ...point,
          latLng: {
            lat: point.latLng.lat + mouseData.delta.latLng.lat,
            lng: point.latLng.lng + mouseData.delta.latLng.lng
          },
          position: {
            x: point.position.x + mouseData.delta.position.x,
            y: point.position.y + mouseData.delta.position.y
          }
        };
      });
    },
    resetState() {
      this.points = [];
    }
  }
};
</script>

<style>
.leaflet-interactive {
  cursor: inherit;
}
</style>
