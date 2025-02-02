<script lang="ts">
  type Props = {
    fullScreen: boolean;
    ballCount: number;
    frameRate: number;
  };
  let { fullScreen, frameRate, ballCount }: Props = $props();
</script>

<div class="bottom-info">
  <p>
    fps: <span class="frame-rate-display {fullScreen ? 'full-screen' : ''}"
      >{frameRate}</span
    >
  </p>
  <p>ball count: <span id="ballCount">{ballCount}</span></p>
</div>

<style>
  .bottom-info {
    display: flex;
    justify-content: space-between;
  }

  p {
    margin: 0px;
  }

  .frame-rate-display {
    margin: 0;
    /*	transform: translate(-50%,0);*/
    position: relative;

    &.full-screen {
      position: absolute;
      left: 10px;
      top: 10px;
    }

    @media screen and (max-width: 800px) {
      margin: 0;
      /*	transform: translate(-50%,0);*/
      position: fixed;
      top: 0;
      left: 0;
    }
  }
</style>
