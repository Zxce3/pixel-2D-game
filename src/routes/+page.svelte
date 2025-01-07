<script lang="ts">
    import { onMount } from "svelte";
    import { Layer, type Frame, type State } from "$lib/types";

    let canvas: HTMLCanvasElement | null;
    let ctx: CanvasRenderingContext2D | null;
    let CANVAS_HEIGHT = 900;
    let CANVAS_WIDTH = 1000;

    let gameFrame = 0;

    let playerImage: HTMLImageElement;
    const SPRITE = {
      WIDTH: 287.5,
      HEIGHT: 261.5,
      SCALE: 0.5,
      GROUND_Y: 450
    };

    let player = {
      x: 200,
      y: SPRITE.GROUND_Y,
      velocityX: 0,
      velocityY: 0,
      speed: 8,
      jumpForce: -20,
      isJumping: false,
      direction: 1
    };

    const PHYSICS = {
      gravity: 1.2,
      friction: 0.8,
      maxSpeed: 12
    };

    const animationStates: State[] = [
      { name: "idle", frames: 7 },
      { name: "jump", frames: 7 },
      { name: "run", frames: 9 },
      { name: "run", frames: 9 },
      { name: "fall", frames: 7 },
      { name: "fall", frames: 7 }
    ];
    
    let currentState = "idle";
    const spriteAnimations: { [key: string]: Frame } = {};

    let backgroundLayers: Layer[] = [];
    let backgroundImages: HTMLImageElement[] = [];

    function initBackgroundLayers() {
      if (!ctx) return;
      
      const layerSpeeds = [0.2, 0.4, 0.6, 0.8, 1];
      
      for (let i = 1; i <= 5; i++) {
        const img = new Image();
        img.src = `../../backgroundLayers/layer-${i}.png`;
        backgroundImages.push(img);
        
        const layer = new Layer(img, layerSpeeds[i-1], 0, ctx);
        backgroundLayers.push(layer);
      }
    }

    function updatePlayer() {
      player.velocityY += PHYSICS.gravity;
      
      if (keys['ArrowLeft']) {
        player.velocityX = Math.max(player.velocityX - 1, -player.speed);
        player.direction = -1;
      } else if (keys['ArrowRight']) {
        player.velocityX = Math.min(player.velocityX + 1, player.speed);
        player.direction = 1;
      } else {
        player.velocityX *= PHYSICS.friction;
      }

      player.x += player.velocityX;
      player.y += player.velocityY;

      // Ground collision
      if (player.y > SPRITE.GROUND_Y) {
        player.y = SPRITE.GROUND_Y;
        player.velocityY = 0;
        player.isJumping = false;
      }

      // Prevent player from moving out of view
      if (player.x < 0) {
        player.x = 0;
        player.velocityX = 0;
      }
      if (player.x > CANVAS_WIDTH - SPRITE.WIDTH * SPRITE.SCALE) {
        player.x = CANVAS_WIDTH - SPRITE.WIDTH * SPRITE.SCALE;
        player.velocityX = 0;
      }

      // Update animation state
      if (player.isJumping) {
        currentState = player.velocityY < 0 ? "jump" : "fall";
      } else if (Math.abs(player.velocityX) > 0.5) {
        currentState = "run";
      } else {
        currentState = "idle";
      }

      updateBackgroundLayers();
    }

    function updateBackgroundLayers() {
      backgroundLayers.forEach((layer) => {
        const layerSpeed = (player.velocityX * layer.speedModifier);
        layer.x -= layerSpeed;

        // Wrap background to create infinite scrolling effect
        if (layer.x <= -CANVAS_WIDTH) {
          layer.x = 0;
        } else if (layer.x >= CANVAS_WIDTH) {
          layer.x = 0;
        }
      });
    }

    function drawPlayer() {
      if (!ctx || !playerImage) return;

      const state = spriteAnimations[currentState];
      const position = Math.floor(gameFrame / (currentState === "run" ? 3 : 5)) % state.loc.length;
      const frameX = state.loc[position].x;
      const frameY = state.loc[position].y;

      ctx.save();
      if (player.direction === -1) {
        ctx.scale(-1, 1);
        ctx.drawImage(
          playerImage,
          frameX, frameY,
          575, 523,
          -player.x - SPRITE.WIDTH * SPRITE.SCALE, player.y,
          SPRITE.WIDTH * SPRITE.SCALE,
          SPRITE.HEIGHT * SPRITE.SCALE
        );
      } else {
        ctx.drawImage(
          playerImage,
          frameX, frameY,
          575, 523,
          player.x, player.y,
          SPRITE.WIDTH * SPRITE.SCALE,
          SPRITE.HEIGHT * SPRITE.SCALE
        );
      }
      ctx.restore();
    }

    function animate() {
      if (!ctx) return;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      backgroundLayers.forEach((layer) => {
        layer.draw();
        ctx.drawImage(layer.image, layer.x, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(layer.image, layer.x + CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      });

      updatePlayer();
      drawPlayer();

      gameFrame++;
      return requestAnimationFrame(animate);
    }

    const keys: { [key: string]: boolean } = {};

    function handleKeyDown(event: KeyboardEvent) {
      keys[event.code] = true;

      if (event.code === 'Space' && !player.isJumping && player.y === SPRITE.GROUND_Y) {
        player.velocityY = player.jumpForce;
        player.isJumping = true;
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      keys[event.code] = false;
    }

    onMount(() => {
      canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
      if (!canvas) return;

      ctx = canvas.getContext("2d");
      canvas.height = CANVAS_HEIGHT;
      canvas.width = CANVAS_WIDTH;

      playerImage = new Image();
      playerImage.src = "../../shadow_dog.png";

      animationStates.forEach((state, index) => {
        let frames = [];
        for (let j = 0; j < state.frames; j++) {
          frames.push({
            x: j * 575,
            y: index * 523
          });
        }
        spriteAnimations[state.name] = { loc: frames };
      });

      initBackgroundLayers();

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      let frame = animate();

      return () => {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    });
</script>

<div class="container">
  <canvas id="myCanvas" class="canvas1"></canvas>
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('backgroundLayers/layer-1.png');
  }

  .canvas1 {
    width: 100%;
    height: 700px;
    /* border: 2px solid white; */
  }
</style>
