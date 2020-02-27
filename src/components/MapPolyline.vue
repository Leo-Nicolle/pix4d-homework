<template>
  <div class="polyline">
    <l-circle-marker
      v-for="(point, i) in points"
      :key="`point-${i}`"
      :lat-lng="point.latLng"
      :radius="point.isHovered ? 6 : 4"
      :color="point.isHovered ? 'green' : 'red'"
    />
    <!-- <l-polyline
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
    /> -->
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
  data() {
    return {
      points: [],
      notHoveredLines: [],
      hoveredLines: [],
      dragingPoint: null,
      hoverThreshold: 6
    };
  },
  computed: {},
  mounted() {
    this.initiate("polyline");
    this.update();
  },
  methods: {
    onMapMouseMove(mouseData) {
      if (!this.isMyMode) return;
      // check hovered points
      this.drag(mouseData);
      this.points = pointsController.updatePoints({
        mouseData,
        points: this.points,
        hoverThreshold: this.hoverThreshold
      });
      //drag if necessary
      this.updateState();
      // data.ingoreHoverLine = !mousePosition || hoveredPoint;
      // const {
      //   hoveredLines,
      //   notHoveredLines
      // } = pointsController.getHoveredLines(data);
      // this.hoveredLines = hoveredLines;
      // this.notHoveredLines = notHoveredLines;
      // this.points = points;
      // this.hoveredPoint = hoveredPoint;
      // this.updateState();
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
      // add point if nothing is hovered on a left click
      // if (!this.hoveredPoint && !this.hoveredLines.length && !isRightClick) {
      //
      // }
      // // remove hovered point on a right click
      // if (isRightClick && this.hoveredPoint) {
      // }
      // // remove hovered line on a right click
      // if (isRightClick && this.hoveredLines.length) {
      //   const index = this.hoveredLines[0].index;
      //
      // }
    },
    drag(mouseData) {
      if (!mouseData.dragging) return;

      // if (this.points.includes(this.hovered)) {
      this.points = this.points.map(point => {
        if (!point.isHovered) return point;
        return {
          ...point,
          latLng: mouseData.latLng,
          position: mouseData.position
        };
      });
      // }
      // if (this.hoveredLines.length) {
      //   this.dragLine({
      //     startPoint: mouseData.previous.latLng,
      //     endPoint: mouseData.latLng
      //   });
      // }
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
    dragPointTo(mouseData) {
      this.points = this.points.map(point => {
        if (!point.isHovered) return point;
        return { latLng: mouseData.latLng, position: mouseData.position };
      });
    },
    update(mousePosition) {
      // const data = {
      //   mousePosition,
      //   points: this.points,
      //   hoverThreshold: this.hoverThreshold,
      //   leafletMap: this.leafletMap
      // };
      // const { points, hoveredPoint } = pointsController.getHoveredPoints(data);
      // data.ingoreHoverLine = !mousePosition || hoveredPoint;
      // const {
      //   hoveredLines,
      //   notHoveredLines
      // } = pointsController.getHoveredLines(data);
      // this.hoveredLines = hoveredLines;
      // this.notHoveredLines = notHoveredLines;
      // this.points = points;
      // this.hoveredPoint = hoveredPoint;
      // this.updateState();
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
