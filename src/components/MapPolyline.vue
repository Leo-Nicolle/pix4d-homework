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
      :lat-lngs="line.points"
    />
    <l-polyline
      v-for="(line, i) in notHoveredLines"
      :key="`notHovered-${i}`"
      :color="'red'"
      :lat-lngs="line.points"
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
    mouseData: function(mouseData) {
      if (!this.isMyMode) return;
      if (mouseData.dragging) {
        this.drag(mouseData);
      } else if (mouseData.mouseclick) {
        console.log("add", mouseData);
        this.onClick(mouseData);
      }
      this.update(mouseData.position);
    }
  },
  mounted() {
    this.initiate("polyline");
    this.update();
  },
  methods: {
    onClick(mouseData) {
      const isRightClick = mouseData.evt.originalEvent.button === 2;
      // add point if nothing is hovered on a left click
      if (!this.hoveredPoint && !this.hoveredLines.length && !isRightClick) {
        this.points = this.points.concat({
          coordinates: [mouseData.latLng.lat, mouseData.latLng.lng]
        });
      }
      // remove hovered point on a right click
      if (isRightClick && this.hoveredPoint) {
        this.points = this.points.filter(point => !point.isHovered);
      }
      // remove hovered line on a right click
      if (isRightClick && this.hoveredLines.length) {
        const index = this.hoveredLines[0].index;
        this.points = this.points.filter(
          (point, i) => i < index || i > index + 1
        );
      }
    },
    drag(mouseData) {
      if (this.hoveredPoint) {
        this.dragPointTo(mouseData.latLng);
      }
      if (this.hoveredLines.length) {
        this.dragLine({
          startPoint: mouseData.previous.latLng,
          endPoint: mouseData.latLng
        });
      }
    },
    dragLine({ startPoint, endPoint }) {
      const index = this.hoveredLines[0].index;
      const vector = {
        lat: endPoint.lat - startPoint.lat,
        lng: endPoint.lng - startPoint.lng
      };
      this.points = this.points
        .slice(0, index)
        .concat(
          this.points.slice(index, index + 2).map(point => ({
            coordinates: [
              vector.lat + point.coordinates[0],
              vector.lng + point.coordinates[1]
            ]
          }))
        )
        .concat(this.points.slice(index + 2));
      // console.log(points, vector);
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
