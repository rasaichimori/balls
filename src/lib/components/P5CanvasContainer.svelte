<script lang="ts">
  import type { p5 } from "p5-svelte";
  import P5 from "p5-svelte";
  import { Ball } from "../balls";
  import { mouseOverSeg, Segment } from "../segment";
  import { constrain, distance } from "../utils/math";
  import type { EditMode, SelectMode, UserAction } from "../types";
  import { runSimulationStep } from "../scene";
  import BottomInfo from "./BottomInfo.svelte";

  type Props = {
    fullScreen: boolean;
    bounceOffEdges: boolean;
    bounciness: number;
    gravity: number;
    editMode: EditMode;
    background: string;
    ballColor: string;
    barColor: string;
    barThickness: number;
    selectMode: SelectMode;
    changeNumberOfBalls: ((number: number) => void) | undefined;
  };
  let {
    fullScreen,
    bounceOffEdges,
    bounciness,
    gravity,
    editMode,
    background,
    barColor,
    ballColor,
    barThickness,
    selectMode,
    changeNumberOfBalls = $bindable(),
  }: Props = $props();

  let frameRate = $state(0);
  let ballCount = $state(0);

  let selectedBall: Ball | undefined;
  let selectedSeg: Segment | undefined;

  let Allballs: Map<string, Ball> = new Map();
  let Allsegs: Map<string, Segment> = new Map();

  let userAction: UserAction = undefined;

  let p5instance: p5 | undefined = $state();

  let first = false;
  $effect(() => {
    if (window.innerWidth > 800) {
      if (p5instance === undefined) {
        return;
      }
      if (fullScreen) {
        p5instance.resizeCanvas(window.innerWidth, window.innerHeight, true);
        for (const [ballId, ball] of Allballs) {
          ball.x += window.innerWidth / 2 - 500 / 2;
          ball.y += window.innerHeight / 2 - 500 / 2;
        }
        for (const [segId, seg] of Allsegs) {
          seg.start.x += window.innerWidth / 2 - 500 / 2;
          seg.end.x += window.innerWidth / 2 - 500 / 2;
          seg.start.y += window.innerHeight / 2 - 500 / 2;
          seg.end.y += window.innerHeight / 2 - 500 / 2;
        }
      } else {
        if (!first) {
          first = true;
          return;
        }
        p5instance.resizeCanvas(500, 500, true);
        for (const [ballId, ball] of Allballs) {
          ball.x -= window.innerWidth / 2 - 500 / 2;
          ball.y -= window.innerHeight / 2 - 500 / 2;
        }
        for (const [segId, seg] of Allsegs) {
          seg.start.x -= window.innerWidth / 2 - 500 / 2;
          seg.end.x -= window.innerWidth / 2 - 500 / 2;
          seg.start.y -= window.innerHeight / 2 - 500 / 2;
          seg.end.y -= window.innerHeight / 2 - 500 / 2;
        }
      }
    } else {
      p5instance?.resizeCanvas(500, 500, true);
    }
  });

  changeNumberOfBalls = (numberOfBalls: number) => {
    if (numberOfBalls > 0) {
      if (p5instance === undefined) {
        return;
      }
      for (let i = 0; i < numberOfBalls; i++) {
        let r = Math.random() * 5 + 5;
        const newId = `random${userMadeCounter}`;
        Allballs.set(
          newId,
          new Ball(
            Math.random() * p5instance.width, //xposition
            Math.random() * p5instance.height, //yposition
            (Math.random() - 0.5) * 2, //xspeed or velocity
            (Math.random() - 0.5) * 2, //vypeed
            r,
            r * 50,
            newId
          )
        );
        userMadeCounter++;
      }
    } else {
      for (let i = 0; i < -numberOfBalls; i++) {
        if (Allballs.size === 0) {
          return;
        }
        const [id] = Array.from(Allballs)[0];
        Allballs.delete(id);
      }
    }
  };

  const sketch = (p5: p5) => {
    p5instance = p5;
    p5.setup = () => {
      p5.createCanvas(500, 500);
      //create Balls
      for (let i = 0; i < 20; i++) {
        let r = Math.random() * 5 + 5;
        Allballs.set(
          `ball-${i}`,
          new Ball(
            Math.random() * p5.width, //xposition
            Math.random() * p5.height, //yposition
            (Math.random() - 0.5) * 2, //xspeed or velocity
            (Math.random() - 0.5) * 2, //vypeed
            r,
            r * 50,
            `ball-${i}`
          )
        );
      }

      //Create Line Segments
      for (let i = 0; i < 5; i++) {
        Allsegs.set(
          `Segment-${i}`,
          new Segment(
            { x: Math.random() * p5.width, y: Math.random() * p5.height },
            { x: Math.random() * p5.width, y: Math.random() * p5.height },
            5,
            `Segment-${i}`
          )
        );
      }
    };

    p5.draw = () => {
      p5.background(background);
      checkUserAction(p5);
      runSimulationStep({
        Allballs,
        Allsegs,
        gravity,
        bounciness,
        bounceOffEdges,
        width: p5.width,
        height: p5.height,
      });
      frameRate = Math.round(p5.frameRate());
      ballCount = Allballs.size;

      for (const [id, ball] of Allballs) {
        checkBallUserAction(p5, ball);
        displayBall(p5, ball);
      }
      for (const [id, segment] of Allsegs) {
        segment.radius = barThickness;
        checkSegmentUserAction(p5, segment);
        displaySegment(p5, segment);
      }
      if (selectedBall !== undefined) {
        p5.stroke("blue");
        p5.strokeWeight(5);
        p5.line(selectedBall.x, selectedBall.y, p5.mouseX, p5.mouseY);
      }
    };
  };

  let selectedStart = false;

  let userMadeCounter = 0;
  export function checkUserAction(p5: p5) {
    const mouse = { x: p5.mouseX, y: p5.mouseY };
    const mouseOverCanvas =
      mouse.x > 0 && mouse.x < p5.width && mouse.y > 0 && mouse.y < p5.height;
    if (p5.mouseIsPressed) {
      if (editMode === "addBall") {
        if (mouseOverCanvas) {
          if (userAction === undefined) {
            userMadeCounter++;
            const newId = `user${userMadeCounter}`;
            userAction = "addingBall";
            Allballs.set(
              newId,
              new Ball(
                mouse.x, //xposition
                mouse.y, //yposition
                0, //xspeed or velocity
                0, //vypeed
                0,
                0,
                newId
              )
            );
          } else {
            const newBall = Allballs.get(`user${userMadeCounter}`);
            if (newBall === undefined) {
              return;
            }
            newBall.velocityX = 0;
            newBall.velocityY = 0;
            newBall.radius = constrain(distance(newBall, mouse), 0, 50);
            newBall.mass = newBall.radius * 50;
          }
        }
      }
      if (editMode === "addSeg") {
        if (mouseOverCanvas) {
          if (!userAction) {
            userMadeCounter++;
            const newId = `seg${userMadeCounter}`;
            userAction = "addingSeg";
            Allsegs.set(
              newId,
              new Segment(
                mouse, //yposition
                mouse, //vypeed
                5,
                newId
              )
            );
          } else {
            const newBall = Allsegs.get(`seg${userMadeCounter}`);
            if (newBall === undefined) {
              return;
            }
            newBall.end = mouse;
          }
        }
      }
    } else {
      userAction = undefined;
      if (selectedBall !== undefined) {
        if (selectMode === "velocity") {
          selectedBall.velocityX = 0.05 * (selectedBall.x - mouse.x);
          selectedBall.velocityY = 0.05 * (selectedBall.y - mouse.y);
        }
        selectedBall = undefined;
      }
      selectedSeg = undefined;
    }
  }

  function checkSegmentUserAction(p5: p5, segment: Segment) {
    const mouse = { x: p5.mouseX, y: p5.mouseY };
    if (mouseOverSeg(segment, mouse)) {
      if (p5.mouseIsPressed) {
        if (editMode === "remove") {
          Allsegs.delete(segment.id);
        }
      }
    }

    if (p5.mouseIsPressed) {
      if (editMode !== "edit") {
        return;
      }
      if (selectedSeg === undefined) {
        if (!userAction) {
          if (distance(segment.start, mouse) <= segment.radius) {
            userAction = "segment selected";
            selectedSeg = segment;
            selectedStart = true;
          }
          if (distance(segment.end, mouse) <= segment.radius) {
            userAction = "segment selected";
            selectedSeg = segment;
            selectedStart = false;
          }
        }
      } else {
        if (selectedSeg?.id === segment.id) {
          if (selectedStart) {
            segment.start.x = mouse.x;
            segment.start.y = mouse.y;
          } else {
            segment.end.x = mouse.x;
            segment.end.y = mouse.y;
          }
        }
      }
    }
  }

  function checkBallUserAction(p5: p5, ball: Ball) {
    const mouse = { x: p5.mouseX, y: p5.mouseY };
    if (p5.mouseIsPressed) {
      if (distance(ball, mouse) <= ball.radius) {
        if (editMode === "remove") {
          Allballs.delete(ball.id);
        }
      }
      if (editMode === "edit") {
        if (selectedBall === undefined && !userAction) {
          if (distance(ball, mouse) <= ball.radius) {
            selectedBall = ball;
            userAction = "ball selected";
          }
        } else {
          if (selectedBall?.id === ball.id) {
            if (selectMode == "position") {
              ball.x = mouse.x;
              ball.y = mouse.y;
            }
          }
        }
      }
    }
  }

  function displaySegment(p5: p5, segment: Segment) {
    if (mouseOverSeg(segment, { x: p5.mouseX, y: p5.mouseY })) {
      p5.strokeWeight(segment.radius * 2 + 2);
      p5.stroke(3, 144, 252);
    }

    if (selectedSeg?.id === segment.id) {
      p5.strokeWeight(segment.radius * 2 + 2);
      p5.stroke(255);
    }

    p5.line(segment.start.x, segment.start.y, segment.end.x, segment.end.y);
    const color = p5.color(barColor);
    color.setAlpha(128);
    p5.stroke(color);
    p5.strokeWeight(segment.radius * 2);
    p5.line(segment.start.x, segment.start.y, segment.end.x, segment.end.y);
    p5.noStroke();
    color.setAlpha(255);
    p5.fill(color);
    p5.ellipse(segment.start.x, segment.start.y, segment.radius * 2);
    p5.ellipse(segment.end.x, segment.end.y, segment.radius * 2);
  }

  function displayBall(p5: p5, ball: Ball) {
    const mouse = { x: p5.mouseX, y: p5.mouseY };

    p5.noStroke();
    if (
      (editMode === "edit" || editMode === "remove") &&
      (selectedBall?.id === ball.id || distance(ball, mouse) <= ball.radius)
    ) {
      p5.strokeWeight(5);
      p5.stroke(3, 144, 252);
    }
    p5.fill(ballColor);
    p5.ellipse(ball.x, ball.y, ball.radius * 2);
  }
</script>

<div class="canvas-container {fullScreen ? 'fullscreen' : ''}" id="cont">
  <div class="p5canv {fullScreen ? 'fullscreen' : ''}" id="p5canv">
    <P5 {sketch} />
  </div>
  <BottomInfo {fullScreen} {frameRate} {ballCount} />
</div>

<style>
  .canvas-container {
    position: fixed;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -250px);
    z-index: -1;

    &.fullscreen {
      top: 0px;
      transform: translate(-50%, 0);
    }
  }
</style>
