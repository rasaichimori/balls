import type { Position, Vector } from "./utils/geometry";

export class Ball {
  x: number;
  y: number;
  o: Position;
  velocityX: number;
  velocityY: number;
  a: Vector = { x: 0, y: 0 };
  id: string;
  radius: number;
  mass: number;
  simTimeRemaining = 0;
  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    radius: number,
    mass: number,
    id: string
  ) {
    this.x = x;
    this.y = y;
    this.o = { x, y };
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.id = id;
    this.radius = radius;
    this.mass = mass;
  }
}
