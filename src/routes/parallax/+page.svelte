<script lang="ts">
  import { onMount } from "svelte";
  import { Layer } from "../../lib/types";

  let canvas: HTMLCanvasElement | null;
  let ctx: CanvasRenderingContext2D | null;
  let CANVAS_HEIGHT: number;
  let CANVAS_WIDTH: number;
  let gameSpeed: number;
  let gameFrame: number;
  let backgroundLayer1: HTMLImageElement;
  let backgroundLayer2: HTMLImageElement;
  let backgroundLayer3: HTMLImageElement;
  let backgroundLayer4: HTMLImageElement;
  let backgroundLayer5: HTMLImageElement;

  let layer1: Layer | undefined;
  let layer2: Layer | undefined;
  let layer3: Layer | undefined;
  let layer4: Layer | undefined;
  let layer5: Layer | undefined;
  let gameObjects: Layer[] = [];

  gameSpeed = 5;
  gameFrame = 0

  $: {
    gameObjects.forEach((layer) => {
      layer.gameSpeed = gameSpeed
    })
    gameObjects = [...gameObjects]
    
  }

  let x = 0;
  let x2 = 2400;

  onMount(() => {
    canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

    if (canvas) {
      ctx = canvas.getContext("2d");
      CANVAS_HEIGHT = canvas.height = 700;
      CANVAS_WIDTH = canvas.width = 800;

      backgroundLayer1 = new Image();
      backgroundLayer1.src = "../../backgroundLayers/layer-1.png";
      backgroundLayer2 = new Image();
      backgroundLayer2.src = "../../backgroundLayers/layer-2.png";
      backgroundLayer3 = new Image();
      backgroundLayer3.src = "../../backgroundLayers/layer-3.png";
      backgroundLayer4 = new Image();
      backgroundLayer4.src = "../../backgroundLayers/layer-4.png";
      backgroundLayer5 = new Image();
      backgroundLayer5.src = "../../backgroundLayers/layer-5.png";

      if (ctx) {
        layer1 = new Layer(backgroundLayer1, 0.2, gameSpeed, ctx);
        layer2 = new Layer(backgroundLayer2, 0.4, gameSpeed, ctx);
        layer3 = new Layer(backgroundLayer3, 0.6, gameSpeed, ctx);
        layer4 = new Layer(backgroundLayer4, 0.8, gameSpeed, ctx);
        layer5 = new Layer(backgroundLayer5, 1, gameSpeed, ctx);
        gameObjects.push(layer1, layer2, layer3, layer4, layer5);
      }
    }

    function animate() {
      if (ctx) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gameObjects.forEach((layer) => {
          layer.update(gameFrame);
          layer.draw();
        });
        // gameFrame--
        return requestAnimationFrame(animate);
      }
    }
    let frame = animate();

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  });
</script>

<!-- ---------------- HTML ---------------- -->

<div class="container">
  <canvas id="myCanvas" class="canvas1" ></canvas>
  <p>Game speed: <span id="showGameSpeed">{gameSpeed}</span></p>
  <label>
    <input type="number" bind:value={gameSpeed} min="0" max="20" />
    <input type="range" bind:value={gameSpeed} min="0" max="20" />
  </label>
</div>

<!-- ---------------- HTML ---------------- -->

<style>
  .container {
    width: 100%;
    height: 100vh;
    background: black;
    font-size: 25px;
  }
  .canvas1 {
    width: 800px;
    height: 700px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  /* #slider {
    width: 100%;
  } */

  p {
    color: white;
  }
</style>


<!-- js-2d-gamedev-course -->
