import type { Circle, Position } from "./geometry";

export function DoCirclesOverlap(circle1: Circle, circle2: Circle) {
  return distance(circle1, circle2) <= circle1.radius + circle2.radius;
}

export function distance(point1: Position, point2: Position) {
  return Math.sqrt(
    (point2.x - point1.x) * (point2.x - point1.x) +
      (point2.y - point1.y) * (point2.y - point1.y)
  );
}

export function constrain(number: number, min: number, max: number) {
  var newNum = number;
  if (newNum > max) {
    newNum = max;
  }
  if (newNum < min) {
    newNum = min;
  }
  //	var newNum = Math.min(Math.max(parseFloat(number), min), max);
  return newNum;
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
