export interface State {
  name: string,
  frames: number
}

export interface Frame {
  width?: number,
  height?: number,
  loc: { x: number, y: number }[]
}

export interface LayerI {
  // image: any,
  // speedModifier: number,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  x2?: number
}

export class Layer implements LayerI {
  private _image: CanvasImageSource;
  private _speedModifier: number;
  private _gameSpeed: number;
  private speed: any
  x: number = 0;
  y: number = 0;
  width: number = 2400
  // x2: number = this.width
  height: number = 700
  ctx: CanvasRenderingContext2D;
  
  public get image(): CanvasImageSource {
    return this._image;
  }
  public set image(value: CanvasImageSource) {
    this._image = value;
  }
  public get speedModifier(): number {
    return this._speedModifier;
  }
  public set speedModifier(value: number) {
    this._speedModifier = value;
  }
  public get gameSpeed(): number {
    return this._gameSpeed;
  }
  public set gameSpeed(value: number) {
    this._gameSpeed = value;
  }

  constructor(
    image: CanvasImageSource,
    speedModifier: number,
    gameSpeed: number,
    ctx: CanvasRenderingContext2D,
    options?: LayerI) {
    this._image = image
    this.ctx = ctx
    this._speedModifier = speedModifier
    this._gameSpeed = gameSpeed
    this.speed = this.gameSpeed * this.speedModifier
    Object.assign(this, options)
  }

  update(gameFrame: number) {
    this.speed = this.gameSpeed * this.speedModifier
    // this.x = this.game
    if (this.x <= -this.width) {
      this.x = 0
    }
    this.x = this.x - this.speed
    
    // this.x = ((gameFrame * this.speed) % this.width)
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    this.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
  }

}