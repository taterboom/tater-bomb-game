// import glm from 'gl-matrix';
// console.log(glm);
// window.glm = glm;

import { glMatrix, vec2 } from "gl-matrix"
import keycode from "keycode"
import GamePlay, { Pawn, Transform } from "./GamePlay"
const canvasEl: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement

class Player extends Pawn {
  readonly width = 20
  readonly height = 20
  color = "#666"
  actions: Set<string> = new Set()
  render() {
    const ctx = this.gamePlay.ctx
    ctx.save()
    ctx.translate(this.transform.position[0], this.transform.position[1])
    ctx.rotate(glMatrix.toRadian(this.transform.rotation))
    ctx.fillStyle = this.color
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height)
    ctx.fillStyle = "#a24481"
    ctx.fillRect(0, -1, this.width, 3)
    ctx.restore()
  }
  onBeginPlay() {
    window.addEventListener("keydown", (e) => {
      const k = keycode(e)
      console.log(k)
      if (["w", "a", "s", "d"].includes(k)) {
        this.actions.add(keycode(e))
      }
    })
    window.addEventListener("keyup", (e) => {
      const k = keycode(e)
      if (["w", "a", "s", "d"].includes(k)) {
        this.actions.delete(keycode(e))
      }
    })
  }
  onTick() {
    let moving = false
    for (const action of this.actions.values()) {
      moving = true
      if (action === "w") this.transform.rotation = 270
      if (action === "a") this.transform.rotation = 180
      if (action === "s") this.transform.rotation = 90
      if (action === "d") this.transform.rotation = 0
    }
    if (moving) {
      this.transform.position = vec2.scaleAndAdd(
        vec2.create(),
        this.transform.position,
        this.transform.getFowardVec(),
        2
      )
    }
  }
}

class Scene extends Pawn {
  render(): void {
    this.gamePlay.ctx.fillStyle = "#f7f7f7"
    this.gamePlay.ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)
  }
}

enum EnemyType {
  TopLeft,
  Top,
  TopRight,
  Right,
  BottomRight,
  Bottom,
  BottomLeft,
  Left,
}
const a: EnemyType = EnemyType.Bottom
class Enemy extends Pawn {
  static Type = EnemyType
  static TransformMap = {
    [EnemyType.TopLeft]: () => new Transform([0, 0], 45),
    [EnemyType.Top]: (width, height) => new Transform([width / 2, 0], 90),
    [EnemyType.TopRight]: (width, height) => new Transform([width, 0], 135),
    [EnemyType.Right]: (width, height) => new Transform([width, height / 2], 180),
    [EnemyType.BottomRight]: (width, height) => new Transform([width, height], 225),
    [EnemyType.Bottom]: (width, height) => new Transform([width / 2, height], 270),
    [EnemyType.BottomLeft]: (width, height) => new Transform([0, height], 315),
    [EnemyType.Left]: (width, height) => new Transform([0, height / 2], 0),
  }
  readonly radius = 8
  type: EnemyType = EnemyType.Top
  render(): void {
    const ctx = this.gamePlay.ctx
    ctx.save()
    this.gamePlay.ctx.fillStyle = "#28bea0"
    ctx.beginPath()
    this.gamePlay.ctx.arc(
      this.transform.position[0],
      this.transform.position[1],
      this.radius,
      0,
      2 * Math.PI,
      true
    )
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
  onTick(): void {
    this.transform.position = vec2.add(
      vec2.create(),
      this.transform.position,
      this.transform.getFowardVec()
    )
  }
  setType(type: EnemyType) {
    this.type = type
    this.transform = Enemy.TransformMap[this.type](
      this.gamePlay.canvasEl.width,
      this.gamePlay.canvasEl.height
    )
  }
}

const game = new GamePlay({
  canvasEl,
  playerClass: Player,
  playerConfig: new Transform([canvasEl.width / 2, canvasEl.height / 2], -90),
  sceneClass: Scene,
})
game.onBeginPlay = () => {
  ;[
    EnemyType.TopLeft,
    EnemyType.Top,
    EnemyType.TopRight,
    EnemyType.Right,
    EnemyType.BottomRight,
    EnemyType.Bottom,
    EnemyType.BottomLeft,
    EnemyType.Left,
  ].forEach((type) => {
    const e = game.spawn(Enemy)
    e.setType(type)
  })
}

game.onTick = () => {
  // console.log("?")
}

game.start()
