<script lang="ts">
  import Footer from "./lib/components/Footer.svelte";
  import InfoModal from "./lib/components/InfoModal.svelte";
  import LeftControls from "./lib/components/LeftControls.svelte";
  import P5CanvasContainer from "./lib/components/P5CanvasContainer.svelte";
  import RightControls from "./lib/components/RightControls.svelte";
  import SwitchBox from "./lib/components/SwitchBox.svelte";
  import type { SelectMode } from "./lib/types";
  import type { EditMode } from "./lib/types";

  //right controls
  let showControls = $state(true);
  let fullScreen = $state(false);
  let bounceOffEdges = $state(false);
  let ballColor = $state("#eee");
  let barColor = $state("rgb(0, 100, 255)");
  let background = $state("#000");
  let gravity = $state(0.08);
  let barThickness = $state(5);
  let bounciness = $state(1);

  //left controls
  let editMode = $state<EditMode>("edit");
  let selectMode = $state<SelectMode>("position");
  let changeNumberOfBalls: ((number: number) => void) | undefined = $state();
</script>

<div class="container">
  <div class="background"></div>
  <p id="header" class="title">ball physics</p>
  <P5CanvasContainer
    {fullScreen}
    {bounceOffEdges}
    {editMode}
    {selectMode}
    {ballColor}
    {barColor}
    {background}
    {gravity}
    {barThickness}
    {bounciness}
    bind:changeNumberOfBalls
  />
  <LeftControls
    {showControls}
    bind:editMode
    bind:selectMode
    {changeNumberOfBalls}
  />
  <RightControls
    {showControls}
    bind:fullScreen
    bind:bounceOffEdges
    bind:ballColor
    bind:barColor
    bind:background
    bind:gravity
    bind:barThickness
    bind:bounciness
  />
  <div class="show-controls">
    <SwitchBox label={"Show Controls"} bind:toggled={showControls} />
  </div>
  <InfoModal />
  <Footer />
</div>

<style>
  .background {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: -2;
    background-color: #111;
    transition: all 0.5s ease;
  }

  .title {
    position: fixed;
    left: 50%;
    padding-top: 50px;
    transform: translateX(-50%);
    font-weight: 1;
    text-align: center;

    @media screen and (max-width: 800px) {
      position: fixed;
      top: -50px;
      left: 50%;
      padding-top: 50px;
      transform: translateX(-50%);
      font-weight: 1;
      /*	color: gray;*/
      /*	letter-spacing: 10px;*/
      text-align: center;
    }
  }

  .show-controls {
    position: absolute;
    right: 100px;
    bottom: 50px;
    width: 200px;

    @media screen and (max-width: 800px) {
      display: none;
    }
  }
</style>
