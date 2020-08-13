import Player from './Player'
import Star from './Star'

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

  @property(cc.Prefab)
  starPrefab: cc.Prefab = null

  // 星星产生后消失时间的随机范围
  @property
  maxStarDuration: number = 0

  @property
  minStarDuration: number = 0

  @property(cc.Node)
  ground: cc.Node = null

  @property(cc.Label)
  scoreDisplay: cc.Label = null

  @property({
    type: Player
  })
  player: Player = null

  @property(cc.AudioClip)
  scoreAudio = null

  // 私有属性

  groundY = 0

  score = 0

  timer = 0
  
  startDuration = 0

  start() {

  }

  onLoad() {
    // 地面节点y坐标
    this.groundY = this.ground.y + this.ground.height / 2
    this.spawnNewStar()
  }

  spawnNewStar = () => {
    // 使用给定模板在场景中生成一个新节点
    const star = cc.instantiate(this.starPrefab)
    // 将新节点添加到 Canvas节点下
    this.node.addChild(star)
    // 设置随机位置
    star.setPosition(this.getNewStarPosition())
    // 生成的星星组件上暂存Game对象的引用
    star.getComponent(Star).game = this

    // 重置计时器
    this.startDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration)
    this.timer = 0
  }

  getNewStarPosition = (): cc.Vec3 => {
    let randX = 0
    const randY = this.groundY + Math.random() * this.player.getComponent(Player).jumpHeight + 50
    // 根据屏幕宽度随机得到一个星星x坐标
    const maxX = this.node.width / 2
    randX = (Math.random() - 0.5) * 2 * maxX
    return cc.v3(randX, randY, 0)
  }

  gainScore = () => {
    this.score += 1
    // 更新Label组件的文字
    this.scoreDisplay.string = `Score: ${this.score}`
    // 播放音效
    cc.audioEngine.playEffect(this.scoreAudio, false)
  }

  gameOver = () => {
    this.player.stopAllActions();
    cc.director.loadScene('game')
  }

  update(dt: number) {
    if (this.timer > this.startDuration) {
      this.gameOver()
      return
    }
    this.timer += dt
  }

}
