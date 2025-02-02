<script lang="ts">
  let { label, backgrounds, selectedBg = $bindable() } = $props();
</script>

<div class="bg-cont">
  <p>{label}</p>
  <div class="bg-mode">
    {#each backgrounds as bg}
      <button
        class="bg-thumb"
        onclick={() => (selectedBg = bg)}
        style="background: {bg}"
        aria-label="Select background {bg}"
      ></button>
    {/each}
  </div>
</div>

<style>
  .bg-mode {
    display: flex;
  }

  .bg-thumb {
    border: solid;
    width: 50px;
    height: 50px;
    margin: 0px 3px;
    background-size: cover;
    transition: all 0.1s;
  }

  .bg-thumb:hover {
    cursor: pointer;
    transform: rotate(10deg);
  }
</style>
