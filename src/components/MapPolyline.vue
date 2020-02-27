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
import { LMap, LCircleMarker, LPolyline, LTooltip } from "vue2-leaflet";
import * as math2d from "math2d";
import { mapState } from "vuex";
import module from "../mixins/module";

export default {
  name: "MapPolyline",
  components: {
    LCircleMarker,
    LTooltip,
    LPolyline
  },
  mixins: [module],
  computed: mapState(["leafletMap"]),
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
    // transform an array of points in screen coords to an array of points in latlng
    screenCoordToLatLng(points) {
      return points.map(point => this.leafletMap.layerPointToLatLng(point));
    },
    // transform an array of two points into a line object for math2d
    segmentToMath2dLine([pointA, pointB]) {
      const direction = math2d.vecNormalize(math2d.vecSubtract(pointB, pointA));
      return {
        dirX: direction.x,
        dirY: direction.y,
        x0: pointA.x,
        y0: pointA.y
      };
    },
    // checks if a point is "between the extremities of the segment"
    isPointOnSegment(point, segment) {
      const segmentDirection = math2d.vecSubtract(segment[1], segment[0]);
      // needs a little drawing to figure it out
      return (
        math2d.vecDot(
          math2d.vecSubtract(point, segment[0]),
          segmentDirection
        ) >= 0 &&
        math2d.vecDot(
          math2d.vecSubtract(point, segment[1]),
          segmentDirection
        ) <= 0
      );
    },
    update(mousePosition) {
      if (mousePosition) {
        this.updateHoveredPoints(mousePosition);
        this.updateHoveredLines(mousePosition);
      } else {
        this.notHoveredLines = [
          this.points.map(({ coordinates }) => coordinates)
        ];
      }

      this.updateState();
    },
    updateState() {
      const cursor =
        this.hoveredLines.length || this.pointHovered
          ? "pointer"
          : this.mode === "polyline"
          ? "crosshair"
          : "";
      this.$store.commit("setCursor", cursor);
      this.$store.commit("hover", this.pointHovered || this.hoveredLines[0]);
    },
    updateHoveredPoints(mousePosition) {
      this.points = this.points.map(point => {
        point.isHovered =
          math2d.vecDistance(
            mousePosition,
            this.leafletMap.latLngToLayerPoint(point.coordinates)
          ) < this.hoverThreshold;
        return point;
      });
      this.pointHovered = this.points.find(({ isHovered }) => isHovered);
    },
    updateHoveredLines(mousePosition) {
      const { notHoveredLines, hoveredLines } = this.points
        .map(({ coordinates }) =>
          this.leafletMap.latLngToLayerPoint(coordinates)
        )
        .reduce(
          (result, point, i, array) => {
            //ignore last point: polyline is not closed
            if (i === array.length - 1) return result;
            const segment = [point, array[i + 1]];
            const projection = math2d.lineProjectPoint(
              this.segmentToMath2dLine(segment),
              mousePosition
            );

            const lineIsHovered =
              // cant hover both a line and a point
              !this.pointHovered &&
              // check if the projection lies on the segment (cursor between the 2 points )
              this.isPointOnSegment(projection, [segment[0], segment[1]]) &&
              // check if the projection is close enough from cursor
              math2d.vecDistance(projection, mousePosition) <
                this.hoverThreshold;

            const latLngSegment = this.screenCoordToLatLng(segment);
            if (lineIsHovered) {
              result.hoveredLines.push(latLngSegment);
            } else {
              result.notHoveredLines.push(latLngSegment);
            }
            return result;
          },
          { notHoveredLines: [], hoveredLines: [] }
        );
      this.notHoveredLines = notHoveredLines;
      this.hoveredLines = hoveredLines;
    }
  }
};
</script>

<style scoped></style>
