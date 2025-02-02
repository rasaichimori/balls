<script lang="ts">
  type Props = {
    toggled: boolean;
    onChange?: (value: boolean) => void;
  };

  let { toggled = $bindable(), onChange }: Props = $props();

  const onchange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    toggled = input.checked;
    onChange?.(toggled);
  };
</script>

<label class="switch">
  <input type="checkbox" id="controls-sw" checked={toggled} {onchange} />
  <span class="sw round"></span>
</label>

<style>
  .switch {
    position: relative;
    display: inline-block;
    width: 45px;
    height: 25px;
  }

  .switch input {
    display: none;
  }

  .sw {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #555;
    -webkit-transition: 0.2s;
    transition: 0.2s;
  }

  .sw:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 6%;
    top: 50%;
    transform: translate(0%, -50%);
    background-color: white;
    -webkit-transition: 0.2s;
    transition: 0.2s;
  }

  input:checked + .sw {
    background-color: #989;
  }

  input:checked + .sw:before {
    -webkit-transform: translate(100%, -50%);
    -ms-transform: translate(100%, -50%);
    transform: translate(100%, -50%);
  }

  /* Rounded sliders */
  .sw.round {
    border-radius: 30px;
  }

  .sw.round:before {
    border-radius: 50%;
  }
</style>
