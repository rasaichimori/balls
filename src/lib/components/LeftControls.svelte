<script lang="ts">
  import type { EditMode, SelectMode } from "../types";
  import RadioGroup from "./RadioGroup.svelte";
  import SwitchBox from "./SwitchBox.svelte";
  import SetVel from "$assets/instructions/setvel.gif";
  import AddBall from "$assets/instructions/addball.gif";
  import AddSeg from "$assets/instructions/addseg.gif";
  import Remove from "$assets/instructions/remove.gif";

  type Props = {
    showControls: boolean;
    editMode: EditMode;
    selectMode: SelectMode;
    changeNumberOfBalls: ((number: number) => void) | undefined;
  };

  let {
    showControls,
    editMode = $bindable(),
    selectMode = $bindable(),
    changeNumberOfBalls,
  }: Props = $props();

  let numberMode = $state<"add" | "remove">("add");
  const changeBallNumber = (number: number) => {
    changeNumberOfBalls?.(number * (numberMode === "add" ? 1 : -1));
  };

  const onNumberModeChange = (value: "add" | "remove") => {
    if (value === "add" && editMode === "remove") {
      editMode = "edit";
    }
    if (value === "remove" && editMode !== "edit") {
      editMode = "remove";
    }
    numberMode = value;
  };
</script>

<div class="controls-cont {showControls ? 'show' : 'hide'}" id="controls-cont">
  <RadioGroup
    name={"number-mode"}
    options={[
      { value: "add", label: "Add" },
      { value: "remove", label: "Remove" },
    ]}
    selectedOption={numberMode}
    onChange={onNumberModeChange}
  />
  <div>
    <button id="change-1" onclick={() => changeBallNumber(1)}>1</button>
    <button id="change-5" onclick={() => changeBallNumber(5)}>5</button>
    <button id="change-10" onclick={() => changeBallNumber(10)}>10</button>
    <button id="change-20" onclick={() => changeBallNumber(20)}>20</button>
    {#if numberMode === "remove"}
      <button id="change-all" onclick={() => changeBallNumber(10000)}
        >all</button
      >
    {/if}
  </div>

  <p>Modes:</p>
  {#if numberMode === "add"}
    <RadioGroup
      name={"ball-mode"}
      options={[
        { value: "edit", label: "Edit" },
        { value: "addBall", label: "Add Ball" },
        { value: "addSeg", label: "Add Segment" },
      ]}
      bind:selectedOption={editMode}
    />
  {:else}
    <RadioGroup
      name={"ball-mode"}
      options={[
        { value: "edit", label: "Edit" },
        { value: "remove", label: "Remove Object" },
      ]}
      bind:selectedOption={editMode}
    />
  {/if}

  <div id="modes-explained">
    {#if editMode === "edit"}
      <SwitchBox
        label={`Set ${selectMode} on select`}
        toggled={selectMode === "position"}
        onChange={(value) => {
          selectMode = value ? "position" : "velocity";
        }}
      />
      <div id="edit-mode-text" class="mode-text">
        <p>
          This mode allows you to edit segments and balls at the same time. To
          edit the segment, click the edge of the segment and drag to move that
          point of the segment.
        </p>
        <p>
          For the balls, there are two ways to edit them. Within edit mode, you
          can chose to change the ball’s position when one is click and dragged.
          To do this, the bottom toggle button should say “set position on
          select”
        </p>
        <p>
          You can give any ball a certain velocity with a click and drag as
          well.
        </p>
        <img class="mode-gif" src={SetVel} alt="set velocity gif" />
      </div>
    {:else if numberMode === "add"}
      {#if editMode === "addBall"}
        <div id="add-ball-mode-text" class="mode-text">
          <p>
            This mode allows you to create a ball on click. The ball will be
            created where your mouse is. If you click and drag, you’ll be able
            to set the size of the ball as well.
          </p>
          <img class="mode-gif" src={AddBall} alt="add ball gif" />
        </div>
      {:else}
        <div id="add-segment-mode-text" class="mode-text">
          <p>
            This mode allows you to create a segment on click. Click and drag
            anywhere on the simulation screen to create the segment.
          </p>
          <img class="mode-gif" src={AddSeg} alt="add seg gif" />
        </div>
      {/if}
    {:else}
      <div id="remove-objects-mode-text" class="mode-text">
        <p>
          To remove any item on the simulation screen, just click on it. You can
          also hold down the mouse button and move it around to remove all the
          objects the mouse comes in contact with.
        </p>
        <img class="mode-gif" src={Remove} alt="remove gif" />
      </div>
    {/if}
  </div>
</div>

<style>
  .mode-text {
    display: flex;
    flex-direction: column;
  }
  p {
    margin: 0;
  }

  .controls-cont {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 16px;
    top: 100px;
    left: 100px;
    width: 300px;
    transition: all 0.2s ease;

    &.show {
      transform: translate(0, 0);
    }
    &.hide {
      transform: translateX(-400px);
    }

    @media screen and (max-width: 800px) {
      width: 90vw;
      z-index: -2;
      position: absolute;
      background-image: none;
      padding-top: 100px;
      transition: all 0.2s ease;
      top: 150vh;
      left: 5vw;
    }
  }

  #modes-explained {
    height: 300px;
    overflow-y: scroll;
    p {
      margin: 15px 0;
    }
  }

  #modes-explained::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }

  .mode-gif {
    position: relative;
    width: 100%;
  }
</style>
