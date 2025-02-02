<script lang="ts">
  type Props = {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
  };
  let { label, value = $bindable(), min, max, step }: Props = $props();
</script>

<div class="slider-box">
  <p>{label}:</p>
  <p class="values">{value}</p>
  <input class="slider" type="range" {min} {max} bind:value {step} />
</div>

<style>
  .slider-box {
    position: relative;
    width: 100%;
    height: 45px;
    transition: all 0.2s ease;
  }

  .slider {
    appearance: none;
    -webkit-appearance: none;
    border-radius: 10px;
    background: #222;
    height: 5px;
    margin: 0;
    width: 100%;
    transition: background 0.2s;
  }

  .slider:hover {
    background: #444;
    cursor: pointer;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #666;
    cursor: pointer;
    transition: all 0.2s;
  }

  .slider::-webkit-slider-thumb:hover {
    width: 20px;
    height: 20px;
  }

  .slider::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #666;
    cursor: pointer;
  }

  .values {
    position: absolute;
    right: 0px;
    top: 0px;
  }

  p {
    margin: 0;
  }
</style>
