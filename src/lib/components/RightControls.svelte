<script lang="ts">
  import BackgroundPicker from "./BackgroundPicker.svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import SliderBox from "./SliderBox.svelte";
  import SwitchBox from "./SwitchBox.svelte";

  type Props = {
    showControls: boolean;
    fullScreen: boolean;
    bounceOffEdges: boolean;
    ballColor: string;
    barColor: string;
    background: string;
    gravity: number;
    barThickness: number;
    bounciness: number;
  };

  let {
    showControls,
    fullScreen = $bindable(),
    bounceOffEdges = $bindable(),
    ballColor = $bindable(),
    barColor = $bindable(),
    background = $bindable(),
    gravity = $bindable(),
    barThickness = $bindable(),
    bounciness = $bindable(),
  }: Props = $props();
</script>

<div class="slider-cont {showControls ? 'show' : 'hide'}" id="slider-cont">
  <SliderBox
    label={"gravity"}
    bind:value={gravity}
    min={0}
    max={0.7}
    step={0.01}
  />

  <ColorPicker
    bind:selectedColor={ballColor}
    label={"ball color"}
    colors={[
      "#eee",
      "#444",
      "#d6d2b5",
      "#93ae88",
      "#d48c8c",
      "#a2b9c5",
      "#ff0000",
    ]}
  />
  <ColorPicker
    bind:selectedColor={barColor}
    label={"bar color"}
    colors={[
      "rgb(255, 255, 255)",
      "rgb(20, 20, 20)",
      "rgb(255, 0, 255)",
      "rgb(147, 255, 136)",
      "rgb(255, 255, 207)",
      "rgb(0, 100, 255)",
      "rgb(255, 150, 0)",
    ]}
  />
  <SwitchBox label={"bounce off edges:"} bind:toggled={bounceOffEdges} />
  <SliderBox
    label={"bar thickness"}
    bind:value={barThickness}
    min={0}
    max={30}
    step={1}
  />
  <SliderBox
    label={"bounciness"}
    bind:value={bounciness}
    min={0}
    max={2}
    step={0.01}
  />
  <BackgroundPicker
    bind:selectedBg={background}
    label={"background color:"}
    backgrounds={["#fff", "#ddddd9", "#000", "#eeede9"]}
  />
  <SwitchBox label={"full screen:"} bind:toggled={fullScreen} />
</div>

<style>
  .slider-cont {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 16px;
    top: 100px;
    right: 100px;
    width: 300px;
    transition: all 0.2s ease;

    &.show {
      transform: translate(0, 0);
    }
    &.hide {
      transform: translateX(400px);
    }

    @media screen and (max-width: 800px) {
      width: 90vw;
      z-index: -2;
      position: absolute;
      background-image: none;
      padding-top: 100px;
      transition: all 0.2s ease;
      top: 70vh;
      left: 5vw;
    }
  }
</style>
