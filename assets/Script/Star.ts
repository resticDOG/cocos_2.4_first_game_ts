import Game from './Game'
import Player from './Player'

const { ccclass, property } = cc._decorator;

@ccclass
export default class Star extends cc.Component {

  @property
  pickRadius: number = 0

  game: Game = null

  onLoad() {

  }

  getPlayerDistance = (): number => {
    const playerPos = this.game.player.getCenterPos()
    return this.node.position.sub(playerPos).mag()
  }

  onPicked = () => {
    // 当星星被收集时, 调用Game脚本中的接口, 生成一个新的星星
    this.game.spawnNewStar()
    // 得分
    this.game.gainScore()
    this.node.destroy()
  }

  update(dt: number) {
    const { timer, startDuration } = this.game
    // 每帧判断和主角之间的距离是否小于收集距离
    if (this.getPlayerDistance() < this.pickRadius) {
      this.onPicked()
      return 
    }
    const opacityRatio = 1 - timer / startDuration
    const minOpacity = 50
    this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity))
  }

  start() {

  }
}
