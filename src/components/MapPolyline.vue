<template>
  <div class="polyline">
    <l-circle-marker
      v-for="(point, i) in points"
      v-bind:key="`point-${i}`"
      :lat-lng="point.coordinates"
      :radius="point.isHovered ? 6 : 4"
      :color="point.isHovered ? 'green' : 'red'"
    />
    <l-polyline
      v-for="(line, i) in hoveredLines"
      v-bind:key="`hovered-${i}`"
      :color="'green'"
      :weight="6"
      :lat-lngs="line"
    />
    <l-polyline
      v-for="(line, i) in notHoveredLines"
      v-bind:key="`notHovered-${i}`"
      :color="'red'"
      :lat-lngs="line"
    />
  </div>
</template>

<script>
import { LMap, LCircleMarker, LPolyline, LTooltip } from "vue2-leaflet";
import * as math2d from "math2d";
import { mapState } from "vuex";
export default {
  name: "MapPolyline",
  components: {
    LCircleMarker,
    LTooltip,
    LPolyline
  },
  computed: mapState(["leafletMap"]),
  props: {
    cursorLatLng: Object
  },
  data() {
    return {
      points: [{ coordinates: [47.18, -1.4] }, { coordinates: [47.18, -1.1] }],
      isPointHovered: false,
      notHoveredLines: [],
      hoveredLines: [],
      hoverThreshold: 6,
      cursor: ""
    };
  },
  watch: {
    // triggered by mousemove, updates which points and lines are hovered
    cursorLatLng: function(cursorLatLng) {
      const cursorPosition = this.leafletMap.latLngToLayerPoint(cursorLatLng);
      this.updateHoveredPoints(cursorPosition);
      this.updateHoveredLines(cursorPosition);
    }
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
    updateHoveredPoints(cursorPosition) {
      this.points = this.points.map(point => {
        point.isHovered =
          math2d.vecDistance(
            cursorPosition,
            this.leafletMap.latLngToLayerPoint(point.coordinates)
          ) < this.hoverThreshold;
        return point;
      });
      let isPointHovered = this.points.some(({ isHovered }) => isHovered);
      this.$store.commit("setCursor", isPointHovered ? "pointer" : "");
      this.isPointHovered = isPointHovered;
    },
    updateHoveredLines(cursorPosition) {
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
              cursorPosition
            );

            const lineIsHovered =
              // cant hover both a line and a point
              !this.isPointHovered &&
              // check if the projection lies on the segment (cursor between the 2 points )
              this.isPointOnSegment(projection, [segment[0], segment[1]]) &&
              // check if the projection is close enough from cursor
              math2d.vecDistance(projection, cursorPosition) <
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
      this.$store.commit("setCursor", hoveredLines.length ? "pointer" : "");
    }
  }
};
</script>

<style scoped></style>
