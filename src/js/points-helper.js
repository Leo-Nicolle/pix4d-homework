import * as math2d from "math2d";

class PointsHelper {
  constructor() {}

  // transform an array of two points into a line object for math2d
  segmentToMath2dLine([pointA, pointB]) {
    const direction = math2d.vecNormalize(
      math2d.vecSubtract(pointB.position, pointA.position)
    );
    return {
      dirX: direction.x,
      dirY: direction.y,
      x0: pointA.position.x,
      y0: pointA.position.y
    };
  }
  // checks if a point is "between the extremities of the segment"
  isPointOnSegment(point, [pointA, pointB]) {
    const segmentDirection = math2d.vecSubtract(pointB, pointA);
    // needs a little drawing to figure it out
    return (
      math2d.vecDot(math2d.vecSubtract(point, pointA), segmentDirection) >= 0 &&
      math2d.vecDot(math2d.vecSubtract(point, pointB), segmentDirection) <= 0
    );
  }

  updatePoints({ mouseData, points, hoverThreshold }) {
    if (!mouseData.position) return points;
    let hovered = false;
    return points.map(point => {
      const isHovered =
        !hovered &&
        math2d.vecDistance(mouseData.position, point.position) < hoverThreshold;
      // prevents from hovering multiple points
      hovered = hovered || isHovered;
      return {
        ...point,
        isHovered
      };
    });
  }

  getHoveredLines({ mouseData, points, hoverThreshold }) {
    const hoveredLineIndex = points.find(({ isHovered }) => isHovered)
      ? -1
      : points
          // find out which segment is hovered or not
          .findIndex((point, i, array) => {
            //ignore last point: polyline is not closed
            if (i === array.length - 1) return;
            const segment = [point, array[i + 1]];
            const projection = math2d.lineProjectPoint(
              this.segmentToMath2dLine(segment),
              mouseData.position
            );
            // check if the projection lies on the segment (cursor between the 2 points )
            return (
              this.isPointOnSegment(projection, [
                segment[0].position,
                segment[1].position
              ]) &&
              // check if the projection is close enough from cursor
              math2d.vecDistance(projection, mouseData.position) <
                hoverThreshold
            );
          });
    return {
      hoveredLineIndex,
      hoveredLine: points.slice(hoveredLineIndex, hoveredLineIndex + 2)
    };
  }
}

const pointsHelper = new PointsHelper();
export default pointsHelper;
