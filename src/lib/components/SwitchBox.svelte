<script lang="ts">
  import Switch from "./Switch.svelte";

  type Props = {
    label: string;
    toggled: boolean;
    onChange?: (value: boolean) => void;
  };

  let { label, toggled = $bindable(), onChange }: Props = $props();
</script>

<div class="switch-box" id="show-controls">
  <p id="controls-label">{label}</p>
  <Switch bind:toggled {onChange} />
</div>

<style>
  .switch-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
  }
  p {
    margin: 0;
  }
</style>
