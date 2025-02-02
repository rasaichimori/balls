<script lang="ts">
  import type { p5 } from "p5-svelte";
  import P5 from "p5-svelte";
  import { Ball } from "../balls";
  import { mouseOverSeg, Segment } from "../segment";
  import { distance } from "../utils/math";
  import type { EditMode, SelectMode, UserAction } from "../types";
  import { runSimulationStep } from "../scene";
  import BottomInfo from "./BottomInfo.svelte";

  type Props = {
    fullScreen: boolean;
    editMode: EditMode;
    background: string;
    ballColor: string;
    barColor: string;
    userAction: UserAction;
    selectMode: SelectMode;
  };
  let {
    fullScreen,
    editMode,
    background,
    barColor,
    ballColor,
    userAction,
    selectMode,
  }: Props = $props();

  let frameRate = $state(0);
  let ballCount = $state(500);

  let selectedBall = $state<string>();
  let selectedSeg = $state<string>();

  let Allballs: { [key: string]: Ball } = {};
  let Allsegs: { [key: string]: Segment } = {};

  const sketch = (p5: p5) => {
    $effect(() => {
      if (window.innerWidth > 800) {
        if (fullScreen) {
          p5.resizeCanvas(window.innerWidth, window.innerHeight, true);
        } else {
          p5.resizeCanvas(500, 500, true);
        }
      } else {
        p5.resizeCanvas(500, 500, true);
      }
    });

    p5.setup = () => {
      p5.createCanvas(window.innerWidth, window.innerHeight);
      //create Balls
      for (let i = 0; i < 20; i++) {
        let r = Math.random() * 5 + 5;
        Allballs[i] = new Ball(
          Math.random() * p5.width, //xposition
          Math.random() * p5.height, //yposition
          (Math.random() - 0.5) * 2, //xspeed or velocity
          (Math.random() - 0.5) * 2, //vypeed
          r,
          r * 50,
          `ball-${i}`
        );
      }

      //Create Line Segments
      for (let i = 0; i < 5; i++) {
        Allsegs[i] = new Segment(
          { x: Math.random() * p5.width, y: Math.random() * p5.height },
          { x: Math.random() * p5.width, y: Math.random() * p5.height },
          5,
          `Segment-${i}`
        );
      }
    };

    p5.draw = () => {
      p5.background(background);
      runSimulationStep(Allballs, Allsegs);
      frameRate = Math.round(p5.frameRate());
      ballCount = Object.keys(Allballs).length;
    };
  };

  let selectedStart = false;
  function checkSegmentUserAction(p5: p5, segment: Segment) {
    const mouse = { x: p5.mouseX, y: p5.mouseY };
    if (mouseOverSeg(segment, mouse)) {
      if (p5.mouseIsPressed) {
        if (editMode === "remove") {
          delete Allsegs[segment.id];
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
            selectedSeg = segment.id;
            selectedStart = true;
          }
          if (distance(segment.end, mouse) <= segment.radius) {
            userAction = "segment selected";
            selectedSeg = segment.id;
            selectedStart = false;
          }
        }
      } else {
        if (selectedSeg === segment.id) {
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

  function displaySegment(p5: p5, segment: Segment) {
    if (mouseOverSeg(segment, { x: p5.mouseX, y: p5.mouseY })) {
      p5.strokeWeight(segment.radius * 2 + 2);
      p5.stroke(3, 144, 252);
    }

    if (selectedSeg === segment.id) {
      p5.strokeWeight(segment.radius * 2 + 2);
      p5.stroke(255);
    }

    p5.line(segment.start.x, segment.start.y, segment.end.x, segment.end.y);

    p5.stroke(barColor + "0.5)");
    p5.strokeWeight(segment.radius * 2);
    p5.line(segment.start.x, segment.start.y, segment.end.x, segment.end.y);
    p5.noStroke();
    p5.fill(barColor + "1)");
    p5.ellipse(segment.start.x, segment.start.y, segment.radius * 2);
    p5.ellipse(segment.end.x, segment.end.y, segment.radius * 2);
  }

  function displayBall(p5: p5, ball: Ball) {
    const mouse = { x: p5.mouseX, y: p5.mouseY };

    p5.noStroke();
    if (
      (editMode == "edit" || editMode == "remove") &&
      (selectedBall == ball.id || distance(ball, mouse) <= ball.radius)
    ) {
      p5.strokeWeight(5);
      p5.stroke(3, 144, 252);
    }
    if (p5.mouseIsPressed) {
      if (distance(ball, mouse) <= ball.radius) {
        if (editMode === "remove") {
          delete Allballs[ball.id];
        }
      }
      if (editMode === "edit") {
        if (selectedBall === undefined && !userAction) {
          if (distance(ball, mouse) <= ball.radius) {
            selectedBall = ball.id;
            userAction = "ball selected";
          }
        } else {
          if (selectedBall == ball.id) {
            if (selectMode == "position") {
              ball.x = mouse.x;
              ball.y = mouse.y;
            }
          }
        }
      }
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
