<script lang="ts">
  import { onMount } from "svelte";
  import type { Frame, State } from "$lib/types";

  let canvas: HTMLCanvasElement | null;
  let ctx: CanvasRenderingContext2D | null;
  let CANVAS_HEIGHT: number;
  let CANVAS_WIDTH: number;
  let playerImage: HTMLImageElement;
  const spriteWidth = 575; // Total Sprite Width divided by number of columns
  const spriteHeight = 523;

  let gameFrame = 0;
  let staggerFrames = 5;

  let selectedPlayerState: State;

  const spriteAnimations: { [key: string]: Frame } = {};
  const animationStates: State[] = [
    {
      name: "idle",
      frames: 7,
    },
    {
      name: "jump",
      frames: 7,
    },
    {
      name: "fall",
      frames: 7,
    },
    {
      name: "run",
      frames: 9,
    },
    {
      name: "dizzy",
      frames: 11,
    },
    {
      name: "sit",
      frames: 5,
    },
    {
      name: "roll",
      frames: 7,
    },
    {
      name: "bite",
      frames: 7,
    },
    {
      name: "ko",
      frames: 12,
    },
    {
      name: "getHit",
      frames: 4,
    },
  ];

  function animate() {
    if (ctx) {
      const state = spriteAnimations[selectedPlayerState.name];
      // Clear the canvas before starting animating
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      let position = Math.floor(gameFrame / staggerFrames) % state.loc.length;
      let frameX = state.loc[position].x;
      let frameY = state.loc[position].y;
      ctx.drawImage(
        playerImage,
        frameX,
        frameY,
        spriteWidth,
        spriteHeight,
        0,
        0,
        spriteWidth,
        spriteHeight
      );
    }

    gameFrame++;
    /* This method creates an inception loop */
    return requestAnimationFrame(animate);
  }

  onMount(() => {
    canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    if (canvas) {
      ctx = canvas.getContext("2d");
      CANVAS_HEIGHT = canvas.height = 600;
      CANVAS_WIDTH = canvas.width = 600;
    }
    playerImage = new Image();
    playerImage.src = "../../shadow_dog.png";

    animationStates.forEach((state, index) => {
      let loc = [];
      for (let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        loc.push({ x: positionX, y: positionY });
        spriteAnimations[state.name] = { loc: loc };
      }
      loc = [];
    });

    let frame = animate()

		return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
		};
  });
</script>

<!-- ---------------- HTML ---------------- -->

<div class="controls">
  <label for="animations">Choose animation:</label>
  <select name="animations" id="animations" bind:value={selectedPlayerState}>
    {#each animationStates as state, index (state.name)}
      <option value={state}>{state.name}</option>
    {/each}
  </select>
</div>
<canvas id="myCanvas" class="canvas1">
  Fallback content, in case the browser does not support Canvas.
</canvas>

<!-- ---------------- CSS ---------------- -->

<style>
  .canvas1 {
    border: 5px solid black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
  }

  .controls {
    position: absolute;
    z-index: 10;
    top: 50px;
    left: 50%;
    transform: translate(-50%);
  }

  .controls,
  select,
  option {
    font-size: 25px;
  }
</style>
