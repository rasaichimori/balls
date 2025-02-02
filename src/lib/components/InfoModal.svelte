<script lang="ts">
  import Question from "$assets/icon/question.png";
  let open = $state(false);
</script>

<div id="info">
  <div
    id="question-image"
    role="button"
    aria-label="Open info modal"
    tabindex="0"
    onclick={() => (open = true)}
    onkeydown={(e) => e.key === "Enter" && (open = true)}
  >
    <img src={Question} alt="question" />
  </div>
  {#if open}
    <div id="info-modal">
      <button id="close-button" onclick={() => (open = false)}>x</button>
      <p>
        This is a simulation that shows uses a 2D ball physics engine that I
        created from scratch without any physics libraries! Just pure
        JavaScript. I am also using p5 to display the circles on the canvas.
      </p>
      <p>
        To modify the parameters, click the show setting toggle at the bottom
        right. This you allow you to change how the simulation looks, as well as
        parameters such as gravity, the number of balls, and how they interact.
      </p>
      <p>
        I followed an incredibly helpful youtube tutorial series by <a
          href="https://www.youtube.com/@javidx9"
          target="_blank">javidx9</a
        > which explained the main concepts in detail and demonstrated them in c++.
        At the moment, there are no other rigid bodies at play because circles are
        the easiest to calculate without angular velocities. Of course, there are
        plenty of amazing libraries like matter.js that wouldn’t require you to create
        a physics library from scratch, but you this was just a project to test myself
        with.
      </p>
      <p>Enjoy!</p>
    </div>
  {/if}
</div>

<style>
  #question-image {
    position: fixed;
    bottom: 30px;
    left: 20px;
    width: 25px;
    z-index: 10;
  }

  #question-image:hover {
    cursor: pointer;
  }

  #question-image img {
    width: 25px;
  }

  #info-modal {
    position: absolute;
    border-radius: 10px;
    width: 400px;
    left: 50px;
    bottom: 30px;
    background-color: #eee;
    padding: 20px;
    color: black;
  }

  #info-modal #close-button {
    position: relative;
    border-radius: 50%;
    left: 100%;
    border: solid;
    background-color: #333;
    transform: translate(-50%, -50%);
  }
</style>
