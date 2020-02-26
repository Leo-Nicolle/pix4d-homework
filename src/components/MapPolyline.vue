<template>
  <div class="polyline">
    <l-circle-marker
      v-for="(point, i) in points"
      v-bind:key="i"
      :lat-lng="point.coordinates"
      :radius="6"
      :color="'red'"
    >
    </l-circle-marker>

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
      notHoveredLines: [],
      hoveredLines: [],
      cursor: ""
    };
  },
  watch: {
    cursorLatLng: function(cursorLatLng) {
      const cursorPosition = this.leafletMap.latLngToLayerPoint(cursorLatLng);

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
              // check if the projection lies on the segment (cursor between the 2 points )
              this.isPointOnSegment(projection, [segment[0], segment[1]]) &&
              // check if the projection is close enough from cursor
              math2d.vecDistance(projection, cursorPosition) < 10;

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
      this.$store.commit(
        "setCursor",
        this.hoveredLines.length ? "pointer!important" : ""
      );
    }
  },
  methods: {
    screenCoordToLatLng(points) {
      return points.map(point => this.leafletMap.layerPointToLatLng(point));
    },
    segmentToMath2dLine([pointA, pointB]) {
      const direction = math2d.vecNormalize(math2d.vecSubtract(pointB, pointA));
      return {
        dirX: direction.x,
        dirY: direction.y,
        x0: pointA.x,
        y0: pointA.y
      };
    },
    isPointOnSegment(point, segment) {
      const segmentDirection = math2d.vecSubtract(segment[1], segment[0]);
      // needs a little drawing to check it
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
