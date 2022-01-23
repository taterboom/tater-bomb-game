import { glMatrix, vec2 } from "gl-matrix"

export class Transform {
  position: vec2
  rotation: number // degree
  constructor(position: vec2 = [0, 0], rotation: number = 0) {
    this.position = position
    this.rotation = rotation
  }
  getFowardVec() {
    return vec2.rotate(vec2.create(), [1, 0], [0, 0], glMatrix.toRadian(this.rotation))
  }
}

let ActorId = 1

export class Actor {
  id: number
  transform: Transform
  readonly gamePlay: GamePlay
  readonly player: Actor
  constructor({
    transform,
    gamePlay,
    player,
  }: {
    transform?: Transform
    gamePlay?: GamePlay
    player?: Actor
  }) {
    this.transform = transform ?? new Transform()
    this.gamePlay = gamePlay
    this.player = player
    this.id = ActorId++
  }
  onBeginPlay() {
    //
  }
}

export interface Renderable {
  render: () => void
}

export class Pawn extends Actor implements Renderable {
  render() {
    //
  }
}

export type GamePlayConfig = {
  canvasEl: HTMLCanvasElement
  playerClass: typeof Actor
  playerConfig: Transform
  sceneClass: typeof Actor
  onBeginPlay?: () => void
  onTick?: () => void
}
export class GamePlay {
  canvasEl: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  scene: Pawn
  player: Pawn
  actorMap: Map<number, any> = new Map()
  onBeginPlay: () => void
  onTick: () => void
  constructor(config: GamePlayConfig) {
    this.canvasEl = config.canvasEl
    this.ctx = this.canvasEl.getContext("2d")
    this.scene = Reflect.construct(config.sceneClass, [{ gamePlay: this }])
    this.actorMap.set(this.scene.id, this.scene)
    this.onBeginPlay = config.onBeginPlay
    this.onTick = config.onTick
    this.player = Reflect.construct(config.playerClass, [
      { transform: config.playerConfig, gamePlay: this },
    ])
    this.actorMap.set(this.player.id, this.player)
  }
  start() {
    this.onBeginPlay?.()
    for (const actor of this.actorMap.values()) {
      actor.onBeginPlay?.()
    }
    this.tick()
  }
  render() {
    for (const actor of this.actorMap.values()) {
      actor.render?.()
    }
  }
  tick() {
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
    for (const actor of this.actorMap.values()) {
      actor.onTick?.()
    }
    this.onTick()
    this.render()
    requestAnimationFrame(() => this.tick())
  }
  spawn<T extends Actor>(actorClass: new (...args: any[]) => T, transform?: Transform) {
    const actor: T = Reflect.construct(actorClass, [
      { transform, gamePlay: this, player: this.player },
    ])
    this.actorMap.set(actor.id, actor)
    actor.onBeginPlay()
    return actor
  }
}

export default GamePlay
