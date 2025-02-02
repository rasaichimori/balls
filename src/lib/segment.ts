import type { Position } from "./utils/geometry";
import { distance } from "./utils/math";

export class Segment {
  start: Position;
  end: Position;
  radius: number;
  id: string;
  constructor(start: Position, end: Position, radius: number, id: string) {
    this.start = start;
    this.end = end;
    this.id = id;
    this.radius = radius;
  }
}

export function mouseOverSeg(segment: Segment, mouse: Position): boolean {
  const lineLength = distance(segment.start, segment.end); // Calculate the length of the line segment

  // Calculate distances from the mouse to both endpoints
  const d1 = distance(mouse, segment.start);
  const d2 = distance(mouse, segment.end);

  // Check if the mouse is within the line segment's bounding box
  if (
    d1 + d2 <= lineLength + segment.radius &&
    d1 < lineLength &&
    d2 < lineLength
  ) {
    // Calculate the perpendicular distance from the mouse to the line
    const numerator = Math.abs(
      (segment.end.x - segment.start.x) * (segment.start.y - mouse.y) -
        (segment.start.x - mouse.x) * (segment.end.y - segment.start.y)
    );
    const denominator = distance(segment.start, segment.end);
    const d = numerator / denominator;
    return d < segment.radius;
  }
  return (
    distance(segment.start, mouse) < segment.radius ||
    distance(segment.end, mouse) < segment.radius
  );
}
