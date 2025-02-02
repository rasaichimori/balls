import { Ball } from "./balls";
import { Segment } from "./segment";
import type { EditMode, SelectMode } from "./types";
import type { Position } from "./utils/geometry";
import { constrain, distance, DoCirclesOverlap } from "./utils/math";

export let gravity = 0.08;

export let bounciness = 0.9;
let bounceEdge = false;

let userMadeCounter = 0;

let width: number = 1000;
let height: number = 1000;

type Collision = {
  ball1Id: string;
  ball2Id: string;
  fake: boolean;
};

export function runSimulationStep(
  Allballs: { [key: string]: Ball },
  Allsegs: { [key: string]: Segment }
) {
  var collisions: Collision[] = [];
  var fakeBalls: { [key: string]: Ball } = {};

  let nSimUdate = 4;
  const simElapsedTime = 1 / nSimUdate;

  let maxSimSteps = 15;

  // main simulation loop
  for (let i = 0; i < nSimUdate; i++) {
    for (const ballId in Allballs) {
      const ball = Allballs[ballId];
      if (
        isNaN(ball.x) ||
        isNaN(ball.y) ||
        Math.abs(ball.a.x) > 99999 ||
        Math.abs(ball.a.y) > 99999
      ) {
        delete Allballs[ballId];
      }
      ball.simTimeRemaining = simElapsedTime;
    }

    for (let j = 0; j < maxSimSteps; j++) {
      //updating positions
      for (const ballId in Allballs) {
        const ball = Allballs[ballId];

        if (ball.simTimeRemaining > 0) {
          ball.o.x = ball.x;
          ball.o.y = ball.y;

          ball.a.x = -ball.velocityX * 0.01;
          ball.a.y = -ball.velocityY * 0.01 + gravity;
          ball.velocityX += ball.a.x * ball.simTimeRemaining;
          ball.velocityY += ball.a.y * ball.simTimeRemaining;
          ball.x += ball.velocityX * ball.simTimeRemaining;
          ball.y += ball.velocityY * ball.simTimeRemaining;

          if (bounceEdge) {
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

      // checking all collisions
      for (const ballId in Allballs) {
        const ball = Allballs[ballId];
        //checking collisions with edges
        for (const segId in Allsegs) {
          let edge = Allsegs[segId];
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
            const newId = `${fakeBalls.length}`;
            const fakeball = new Ball(
              closestPointX,
              closestPointY,
              -ball.velocityX,
              -ball.velocityY,
              edge.radius,
              ball.mass * 0.8,
              newId
            );
            fakeBalls[newId] = fakeball;
            collisions.push({
              ball1Id: ball.id,
              ball2Id: fakeball.id,
              fake: true,
            });

            let Overlap = d - ball.radius - fakeball.radius;
            ball.x -= (Overlap * (ball.x - fakeball.x)) / d;
            ball.y -= (Overlap * (ball.y - fakeball.y)) / d;
          }
        }

        //checking collisions with other balls
        for (const targetId in Allballs) {
          const target = Allballs[targetId];
          if (ball.id != target.id) {
            if (DoCirclesOverlap(ball, target)) {
              let DistBetween = distance(ball, target);
              let Overlap = (DistBetween - ball.radius - target.radius) / 2;
              ball.x -= (Overlap * (ball.x - target.x)) / DistBetween;
              ball.y -= (Overlap * (ball.y - target.y)) / DistBetween;
              target.x += (Overlap * (ball.x - target.x)) / DistBetween;
              target.y += (Overlap * (ball.y - target.y)) / DistBetween;

              collisions.push({
                ball1Id: ball.id,
                ball2Id: target.id,
                fake: false,
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
      collisions.forEach((collision) => {
        const ball1 = Allballs[collision.ball1Id];
        const ball2 = collision.fake
          ? fakeBalls[collision.ball2Id]
          : Allballs[collision.ball2Id];

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

        Allballs[collision.ball1Id].velocityX = tx * dpTan1 + nx * m1;
        Allballs[collision.ball1Id].velocityY = ty * dpTan1 + ny * m1;

        if (collision.fake) {
          fakeBalls[collision.ball2Id].velocityX = tx * dpTan2 + nx * m2;
          fakeBalls[collision.ball2Id].velocityY = ty * dpTan2 + ny * m2;
        } else {
          Allballs[collision.ball2Id].velocityX = tx * dpTan2 + nx * m2;
          Allballs[collision.ball2Id].velocityY = ty * dpTan2 + ny * m2;
        }
      });

      collisions = [];
      fakeBalls = {};
    }
  }
}

export function changeNumberOfBalls(
  Allballs: { [key: string]: Ball },
  numberOfBalls: number
) {
  if (numberOfBalls > 0) {
    for (let i = 0; i < numberOfBalls; i++) {
      let r = Math.random() * 5 + 5;
      const newId = `random${userMadeCounter}`;
      Allballs[newId] = new Ball(
        Math.random() * width, //xposition
        Math.random() * height, //yposition
        (Math.random() - 0.5) * 2, //xspeed or velocity
        (Math.random() - 0.5) * 2, //vypeed
        r,
        r * 50,
        newId
      );
      userMadeCounter++;
    }
  } else {
    for (let i = 0; i < numberOfBalls; i++) {
      const id = Object.keys(Allballs)[0];
      delete Allballs[id];
    }
  }
}

export function toggleFullScreen(
  Allballs: { [key: string]: Ball },
  Allsegs: { [key: string]: Segment },
  fullScreen: boolean
) {
  if (fullScreen) {
    for (const ballId in Allballs) {
      const ball = Allballs[ballId];
      ball.x += window.innerWidth / 2 - 500 / 2;
      ball.y += window.innerHeight / 2 - 500 / 2;
    }
    for (const segId in Allsegs) {
      const seg = Allsegs[segId];
      seg.start.x += window.innerWidth / 2 - 500 / 2;
      seg.end.x += window.innerWidth / 2 - 500 / 2;
      seg.start.y += window.innerHeight / 2 - 500 / 2;
      seg.end.y += window.innerHeight / 2 - 500 / 2;
    }
  } else {
    for (const ballId in Allballs) {
      const ball = Allballs[ballId];
      ball.x -= window.innerWidth / 2 - 500 / 2;
      ball.y -= window.innerHeight / 2 - 500 / 2;
    }
    for (const segId in Allsegs) {
      const seg = Allsegs[segId];
      seg.start.x -= window.innerWidth / 2 - 500 / 2;
      seg.end.x -= window.innerWidth / 2 - 500 / 2;
      seg.start.y -= window.innerHeight / 2 - 500 / 2;
      seg.end.y -= window.innerHeight / 2 - 500 / 2;
    }
  }
}

export function removeAll(Allballs: { [key: string]: Ball }) {
  Allballs = {};
}

let userAction: "addingBall" | "addingSeg" | undefined = undefined;

export function checkUserAction(
  Allballs: { [key: string]: Ball },
  Allsegs: { [key: string]: Segment },
  props: {
    editMode: EditMode;
    selectMode: SelectMode;
    mouse: Position;
    pressed: boolean;
  }
) {
  const { editMode, selectMode, mouse, pressed } = props;
  const mouseOverCanvas =
    mouse.x > 0 && mouse.x < width && mouse.y > 0 && mouse.y < height;
  if (pressed) {
    if (editMode === "addBall") {
      if (mouseOverCanvas) {
        if (userAction === undefined) {
          userMadeCounter++;
          const newId = `user${userMadeCounter}`;
          userAction = "addingBall";
          Allballs[newId] = new Ball(
            mouse.x, //xposition
            mouse.y, //yposition
            0, //xspeed or velocity
            0, //vypeed
            0,
            0,
            newId
          );
        } else {
          const newId = `user${userMadeCounter}`;
          Allballs[newId].velocityX = 0;
          Allballs[newId].velocityY = 0;
          Allballs[newId].radius = constrain(
            distance(Allballs[newId], mouse),
            0,
            50
          );
          Allballs[newId].mass = Allballs[newId].radius * 50;
        }
      }
    }
    if (editMode === "addSeg") {
      if (mouseOverCanvas) {
        if (!userAction) {
          userMadeCounter++;
          const newId = `seg${userMadeCounter}`;
          userAction = "addingSeg";
          Allsegs[newId] = new Segment(
            mouse, //yposition
            mouse, //vypeed
            5,
            newId
          );
        } else {
          const newId = `seg${userMadeCounter}`;
          Allsegs[newId].end = mouse;
        }
      }
    }
  } else {
    userAction = undefined;
    if (selectedBall != -1) {
      if (selectMode === "velocity") {
        Allballs[selectedBall].velocityX =
          0.05 * (Allballs[selectedBall].x - mouse.x);
        Allballs[selectedBall].velocityY =
          0.05 * (Allballs[selectedBall].y - mouse.y);
      }
      selectedBall = -1;
    }
    selectedSeg = -1;
  }
}
