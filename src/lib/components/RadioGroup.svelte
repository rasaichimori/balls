<script lang="ts" generics="T">
  type RadioOptions = {
    value: T;
    label: string;
  };
  type Props = {
    name: string;
    options: RadioOptions[];
    selectedOption: T;
    onChange?: (value: T) => void;
  };
  let {
    name,
    options,
    selectedOption = $bindable(),
    onChange,
  }: Props = $props();

  const onchange = (value: T) => {
    selectedOption = value;
    onChange?.(value);
  };
</script>

<div class="radio-group" id="number-mode">
  {#each options as option, i}
    <div class="radio-button">
      <input
        type="radio"
        id={`${name}-${i}`}
        {name}
        onchange={() => onchange(option.value)}
        checked={selectedOption === option.value}
      />
      <label for={`${name}-${i}`}>{option.label}</label>
    </div>
  {/each}
</div>

<style>
  .radio-group {
    border: 1px solid #666;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    flex-direction: row;
  }

  .radio-button {
    border: #666 solid 1px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    width: 100%;
  }

  .radio-group input {
    display: none;
  }

  .radio-button label {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 4px 8px 4px 8px;
  }

  .radio-button:hover {
    cursor: pointer;
    background: #eee;
  }

  .radio-group label:hover {
    cursor: pointer;
  }

  .radio-button:has(input:checked) {
    background: #989;
  }
</style>
