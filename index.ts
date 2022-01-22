const canvasEl: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvasEl.getContext('2d')

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 框架 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

type Point = {
  x: number
  y: number
}

class Transform {
  position: Point
  rotation: number
  constructor(position: Point = { x: 0, y: 0 }, rotation: number = 0) {
    this.position = position
    this.rotation = rotation
  }
}

let ActorId = 1;

class Actor {
  id: number
  transform: Transform
  readonly gamePlay: GamePlay
  readonly player: Player
  constructor({ transform, gamePlay, player }: { transform?: Transform, gamePlay?: GamePlay, player?: Player }) {
    this.transform = transform ?? new Transform()
    this.gamePlay = gamePlay
    this.player = player
    this.id = ActorId++;
  }
  onBeginPlay() {
    //
  }
}

interface Drawable {
  draw: () => void
}

class Pawn extends Actor implements Drawable {
  draw() {
    //
  }
}

type GamePlayConfig = {
  ctx: CanvasRenderingContext2D
  playerClass: typeof Actor
  playerConfig: Transform
  sceneClass: typeof Actor
  onBeginPlay?: () => void
}
class GamePlay {
  ctx: CanvasRenderingContext2D
  scene: Pawn
  player: Pawn
  actorMap: Map<number, any> = new Map()
  onBeginPlay: () => void
  constructor(config: GamePlayConfig) {
    this.ctx = config.ctx
    this.scene = Reflect.construct(config.sceneClass, [{ gamePlay: this }])
    this.actorMap.set(this.scene.id, this.scene)
    this.onBeginPlay = config.onBeginPlay
    this.player = Reflect.construct(config.playerClass, [{ transform: config.playerConfig, gamePlay: this }])
    this.actorMap.set(this.player.id, this.player)
  }
  start() {
    this.onBeginPlay?.()
    for (const actor of this.actorMap.values()) {
      actor.onBeginPlay?.()
    }
    this.tick()
  }
  draw() {
    for (const actor of this.actorMap.values()) {
      actor.draw?.()
    }
  }
  tick() {
    this.ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    for (const actor of this.actorMap.values()) {
      actor.onTick?.()
    }
    this.draw()
    requestAnimationFrame(() => this.tick())
  }
  spawn(actorClass: typeof Actor, transform: Transform) {
    const actor: Actor = Reflect.construct(actorClass, [{ transform, gamePlay: this, player: this.player }])
    this.actorMap.set(actor.id, actor)
    actor.onBeginPlay()
  }
}

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 框架 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

// 业务 ↓

class Player extends Pawn {
  readonly width = 20
  readonly height = 20
  color = '#666'
  active: boolean = false
  draw() {
    const ctx = this.gamePlay.ctx
    ctx.save()
    ctx.fillStyle = this.color
    ctx.fillRect(this.transform.position.x - this.width / 2, this.transform.position.y - this.height / 2, this.width, this.height)
    ctx.restore()
  }
  onBeginPlay() {
    window.addEventListener('mousedown', () => {
      this.active = true
    })
    window.addEventListener('mouseup', () => {
      this.active = false
    })
  }
  onTick() {
    if (this.active) {
      this.transform.position.x += 0.2
    }
  }
}

class Scene extends Pawn {
  draw(): void {
    this.gamePlay.ctx.fillStyle = '#f7f7f7'
    this.gamePlay.ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)
  }
}

class Enemy extends Pawn {
  readonly radius = 8
  draw(): void {
    console.log('?')
    ctx.save()
    this.gamePlay.ctx.fillStyle = '#28bea0'
    ctx.beginPath()
    this.gamePlay.ctx.arc(this.transform.position.x, this.transform.position.y, this.radius, 0, 2 * Math.PI, true)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
  onTick(): void {
    this.transform.position.x += 0.1
  }
}

const game = new GamePlay({
  ctx,
  playerClass: Player,
  playerConfig: new Transform({ x: canvasEl.width / 2, y: canvasEl.height / 2 }),
  sceneClass: Scene
})
game.onBeginPlay = () => {
  game.spawn(Enemy, new Transform({ x: 100, y: 100 }))
}

game.start();