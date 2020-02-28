<template>
  <div class="polyline">
    <l-circle-marker
      v-for="(point, i) in points"
      :key="`point-${i}`"
      :lat-lng="point.latLng"
      :radius="point.isHovered ? 6 : 4"
      :color="point.isHovered ? 'green' : 'red'"
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
import pointsController from "../js/points-controller";
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
      dragingPoint: null,
      hoverThreshold: 6
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
      this.points = pointsController.updatePoints({
        mouseData,
        points: this.points,
        hoverThreshold: this.hoverThreshold
      });
      //drag if necessary
      const {
        hoveredLine,
        hoveredLineIndex
      } = pointsController.getHoveredLines({
        mouseData,
        points: this.points,
        hoverThreshold: this.hoverThreshold
      });
      this.hoveredLine = hoveredLine;
      this.hoveredLineIndex = hoveredLineIndex;
      this.updateState();
    },
    onMapMouseMove(mouseData) {
      if (!this.isMyMode) return;
      this.drag(mouseData);
      this.update(mouseData);
    },
    onMapClick(mouseData) {
      if (!this.isMyMode) return;

      const isRightClick = mouseData.evt.originalEvent.button === 2;
      if (this.hovered && isRightClick) {
        this.points = this.points.filter(point => point !== this.hovered);
      }
      if (!this.hovered && !isRightClick) {
        this.points = this.points.concat({
          latLng: mouseData.latLng,
          position: mouseData.position
        });
      }
      this.update(mouseData);
    },
    onMapTransformChange(transform) {
      this.points = this.points.map(point => transform(point));
    },
    drag(mouseData) {
      if (!mouseData.dragging) return;

      this.points = this.points.map(point => {
        if (!point.isHovered) return point;
        return {
          ...point,
          latLng: mouseData.latLng,
          position: mouseData.position
        };
      });
      if (this.hoveredLineIndex > -1) {
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
      }
    },
    updateState() {
      const cursor = this.hovered ? "pointer" : "crosshair";
      this.$store.commit("setCursor", cursor);
    }
  }
};
</script>

<style>
.leaflet-interactive {
  cursor: inherit;
}
</style>
