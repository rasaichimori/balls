import { Ball } from "./balls";
import { Segment } from "./segment";
import { distance, DoCirclesOverlap } from "./utils/math";

export function runSimulationStep(context: {
  Allballs: Map<string, Ball>;
  Allsegs: Map<string, Segment>;
  gravity: number;
  bounciness: number;
  bounceOffEdges: boolean;
  width: number;
  height: number;
}) {
  const {
    Allballs,
    Allsegs,
    gravity,
    bounciness,
    bounceOffEdges,
    width,
    height,
  } = context;

  const fakeBalls: Map<string, Ball> = new Map();

  let nSimUdate = 4;
  const simElapsedTime = 1 / nSimUdate;

  let maxSimSteps = 15;

  // main simulation loop
  for (let i = 0; i < nSimUdate; i++) {
    for (const [id, ball] of Allballs) {
      if (
        isNaN(ball.x) ||
        isNaN(ball.y) ||
        Math.abs(ball.a.x) > 99999 ||
        Math.abs(ball.a.y) > 99999
      ) {
        Allballs.delete(id);
      }
      ball.simTimeRemaining = simElapsedTime;
    }

    for (let j = 0; j < maxSimSteps; j++) {
      //updating positions
      for (const [id, ball] of Allballs) {
        if (ball.simTimeRemaining > 0) {
          ball.o.x = ball.x;
          ball.o.y = ball.y;

          ball.a.x = -ball.velocityX * 0.01;
          ball.a.y = -ball.velocityY * 0.01 + gravity;
          ball.velocityX += ball.a.x * ball.simTimeRemaining;
          ball.velocityY += ball.a.y * ball.simTimeRemaining;
          ball.x += ball.velocityX * ball.simTimeRemaining;
          ball.y += ball.velocityY * ball.simTimeRemaining;

          if (bounceOffEdges) {
            if (ball.x < ball.radius) {
              ball.x = ball.radius;
              ball.velocityX *= -1;
            }
            if (ball.x > width - ball.radius) {
              ball.x = width - ball.radius;
              ball.velocityX *= -1;
            }
            if (ball.y < ball.radius) {
              ball.y = ball.radius;
              ball.velocityY *= -1;
            }
            if (ball.y > height - ball.radius) {
              ball.y = height - ball.radius;
              ball.velocityY *= -1;
            }
          } else {
            if (ball.x < -ball.radius) {
              ball.x = width + ball.radius;
            }
            if (ball.x > width + ball.radius) {
              ball.x = -ball.radius;
            }
            if (ball.y < -ball.radius) {
              ball.y = height + ball.radius;
            }
            if (ball.y > height + ball.radius) {
              ball.y = -ball.radius;
            }
          }
        }
      }

      const collisions: {
        ball1: Ball;
        ball2: Ball;
      }[] = [];
      // checking all collisions
      for (const [id, ball] of Allballs) {
        //checking collisions with edges
        for (const [id, edge] of Allsegs) {
          let LineX1 = edge.end.x - edge.start.x;
          let LineY1 = edge.end.y - edge.start.y;

          let LineX2 = ball.x - edge.start.x;
          let LineY2 = ball.y - edge.start.y;

          let EdgeLength = LineX1 * LineX1 + LineY1 * LineY1;

          let t =
            Math.max(
              0,
              Math.min(EdgeLength, LineX1 * LineX2 + LineY1 * LineY2)
            ) / EdgeLength;

          let closestPointX = edge.start.x + t * LineX1;
          let closestPointY = edge.start.y + t * LineY1;

          let d = Math.sqrt(
            (ball.x - closestPointX) * (ball.x - closestPointX) +
              (ball.y - closestPointY) * (ball.y - closestPointY)
          );

          if (d <= ball.radius + edge.radius) {
            const newId = `${fakeBalls.size}`;
            const fakeball = new Ball(
              closestPointX,
              closestPointY,
              -ball.velocityX,
              -ball.velocityY,
              edge.radius,
              ball.mass * 0.8,
              newId
            );
            fakeBalls.set(newId, fakeball);
            collisions.push({
              ball1: ball,
              ball2: fakeball,
            });

            let Overlap = d - ball.radius - fakeball.radius;
            ball.x -= (Overlap * (ball.x - fakeball.x)) / d;
            ball.y -= (Overlap * (ball.y - fakeball.y)) / d;
          }
        }

        //checking collisions with other balls
        for (const [targetId, target] of Allballs) {
          if (ball.id != target.id) {
            if (DoCirclesOverlap(ball, target)) {
              let DistBetween = distance(ball, target);
              let Overlap = (DistBetween - ball.radius - target.radius) / 2;
              ball.x -= (Overlap * (ball.x - target.x)) / DistBetween;
              ball.y -= (Overlap * (ball.y - target.y)) / DistBetween;
              target.x += (Overlap * (ball.x - target.x)) / DistBetween;
              target.y += (Overlap * (ball.y - target.y)) / DistBetween;

              collisions.push({
                ball1: ball,
                ball2: target,
              });
            }
          }
        }

        let ballSpeed = Math.sqrt(
          ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY
        );
        let actualDistance = Math.sqrt(
          (ball.x - ball.o.x) * (ball.x - ball.o.x) +
            (ball.y - ball.o.y) * (ball.y - ball.o.y)
        );
        let actualTime = actualDistance / ballSpeed;
        ball.simTimeRemaining = ball.simTimeRemaining - actualTime;
      }

      //dealing with collisions
      for (const collision of collisions) {
        const ball1 = collision.ball1;
        const ball2 = collision.ball2;

        if (ball1 === undefined || ball2 === undefined) {
          continue;
        }
        let d = distance(ball1, ball2);
        let nx = (ball2.x - ball1.x) / d;
        let ny = (ball2.y - ball1.y) / d;

        let tx = -ny;
        let ty = nx;

        let dpTan1 = ball1.velocityX * tx + ball1.velocityY * ty;
        let dpTan2 = ball2.velocityX * tx + ball2.velocityY * ty;

        let dpNorm1 = ball1.velocityX * nx + ball1.velocityY * ny;
        let dpNorm2 = ball2.velocityX * nx + ball2.velocityY * ny;

        let m1 =
          (bounciness *
            (dpNorm1 * (ball1.mass - ball2.mass) + 2 * ball2.mass * dpNorm2)) /
          (ball1.mass + ball2.mass);
        let m2 =
          (dpNorm2 * (ball2.mass - ball1.mass) + 2 * ball1.mass * dpNorm1) /
          (ball1.mass + ball2.mass);

        collision.ball1.velocityX = tx * dpTan1 + nx * m1;
        collision.ball1.velocityY = ty * dpTan1 + ny * m1;

        collision.ball2.velocityX = tx * dpTan2 + nx * m2;
        collision.ball2.velocityY = ty * dpTan2 + ny * m2;
      }
      fakeBalls.clear();
    }
  }
}
