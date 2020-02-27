import * as math2d from "math2d";

class PointsController {
  constructor() {}

  screenCoordToLatLng(points, leafletMap) {
    return points.map(point => leafletMap.layerPointToLatLng(point));
  }
  // transform an array of two points into a line object for math2d
  segmentToMath2dLine([pointA, pointB]) {
    const direction = math2d.vecNormalize(math2d.vecSubtract(pointB, pointA));
    return {
      dirX: direction.x,
      dirY: direction.y,
      x0: pointA.x,
      y0: pointA.y
    };
  }
  // checks if a point is "between the extremities of the segment"
  isPointOnSegment(point, segment) {
    const segmentDirection = math2d.vecSubtract(segment[1], segment[0]);
    // needs a little drawing to figure it out
    return (
      math2d.vecDot(math2d.vecSubtract(point, segment[0]), segmentDirection) >=
        0 &&
      math2d.vecDot(math2d.vecSubtract(point, segment[1]), segmentDirection) <=
        0
    );
  }

  getHoveredPoints({ mousePosition, points, hoverThreshold, leafletMap }) {
    if (!mousePosition) return { points };
    points = points.map(point => {
      point.isHovered =
        math2d.vecDistance(
          mousePosition,
          leafletMap.latLngToLayerPoint(point.coordinates)
        ) < hoverThreshold;
      return point;
    });
    return {
      hoveredPoint: points.find(({ isHovered }) => isHovered),
      points
    };
  }

  getHoveredLines({
    mousePosition,
    leafletMap,
    points,
    ingoreHoverLine,
    hoverThreshold
  }) {
    if (ingoreHoverLine) {
      return {
        notHoveredLines: [points.map(({ coordinates }) => coordinates)],
        hoveredLines: []
      };
    }

    return (
      points
        // transform points into local coordinates
        .map(({ coordinates }) => leafletMap.latLngToLayerPoint(coordinates))
        // find out which segment is hovered or not
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
              // check if the projection lies on the segment (cursor between the 2 points )
              this.isPointOnSegment(projection, [segment[0], segment[1]]) &&
              // check if the projection is close enough from cursor
              math2d.vecDistance(projection, mousePosition) < hoverThreshold;

            const latLngSegment = this.screenCoordToLatLng(segment, leafletMap);
            if (lineIsHovered) {
              result.hoveredLines.push(latLngSegment);
            } else {
              result.notHoveredLines.push(latLngSegment);
            }
            return result;
          },
          { notHoveredLines: [], hoveredLines: [] }
        )
    );
  }
}

const pointsController = new PointsController();
export default pointsController;
