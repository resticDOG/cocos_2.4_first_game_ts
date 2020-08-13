const { ccclass, property } = cc._decorator

@ccclass
export default class Player extends cc.Component {

  @property
  jumpHeight: number = 0

  @property
  jumpDuration: number = 0

  @property
  maxMoveSpeed: number = 0

  @property
  accel: number = 0

  @property(cc.AudioClip)
  jumpAudio = null

  jumpAction: cc.ActionInterval

  /**
   * 向左加速
   */ 
  accLeft: boolean = false

  /**
   * 向右加速
   */
  accRight: boolean = false

  xSpeed: number = 0

  setJumpAction = () => {
    const { moveBy, v2, easeCubicActionOut, easeCubicActionIn, repeatForever, sequence } = cc
    const jumpUp = moveBy(this.jumpDuration, v2(0, this.jumpHeight)).easing(easeCubicActionOut())
    const jumpDown = moveBy(this.jumpDuration, v2(0, -this.jumpHeight)).easing(easeCubicActionIn())
    // 动作完成时的回调
    const callback = cc.callFunc(this.playJumpSound, this)
    return repeatForever(sequence(jumpUp, jumpDown, callback))
  }

  playJumpSound = () => {
    cc.audioEngine.playEffect(this.jumpAudio, false)
  }

  onLoad() {
    this.jumpAction = this.setJumpAction()
    this.node.runAction(this.jumpAction)

    // 监听键盘事件
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)

  }

  onDisable(): boolean {
    // 取消键盘监听
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    return true
  }

  onKeyDown = (event: cc.Event.EventKeyboard) => {
    const { a, d } = cc.macro.KEY
    switch (event.keyCode) {
      case a:
        this.accLeft = true
        break
      case d:
        this.accRight = true
        break
    }
  }

  onKeyUp = (event: cc.Event.EventKeyboard) => {
    const { a, d } = cc.macro.KEY
    switch(event.keyCode) {
      case a:
        this.accLeft = false
        break
      case d:
        this.accRight = false
        break
    }
  }

  stopAllActions = () => {
    this.node.stopAllActions()
  }

  update(dt: number) {
    // 每帧更新速度
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt
    }

    // 限制玩家速度不能超过最大值
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed)
    }

    // 根据当前速度更新主角的位置
    this.node.x += this.xSpeed * dt
  }

  getCenterPos = (): cc.Vec3 => {
    return cc.v3(this.node.x, this.node.y + this.node.height / 2, 0)
  }

  start() {

  }

}
