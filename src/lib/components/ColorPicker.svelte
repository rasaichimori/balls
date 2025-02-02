<script lang="ts">
  let { label, colors, selectedColor = $bindable() } = $props();
</script>

<div class="color-cont">
  <p>{label}:</p>
  <div class="color-mode">
    {#each colors as color}
      <button
        class="color"
        onclick={() => (selectedColor = color)}
        style="background: {color}"
        aria-label="Select color {color}"
      ></button>
    {/each}
  </div>
</div>

<style>
  button {
    padding: 0;
  }

  .color-cont {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
  }

  .color-mode {
    display: flex;
    justify-content: right;
    align-items: center;
  }

  .color {
    border: solid;
    height: 10px;
    width: 10px;
    margin: 0px 3px;
    border-radius: 50%;
    transition: all 0.1s;
  }

  .color:hover {
    transform: scale(1.3);
    cursor: pointer;
  }

  p {
    margin: 0;
  }
</style>
