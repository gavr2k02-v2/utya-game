import { SpritesKeys } from '../../common/enums/SpritesKeys';

export class Item extends Phaser.Physics.Arcade.Sprite {
  private _lastPos: number;
  private _removed: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, key: SpritesKeys, size: number) {
    super(scene, x, 0, key);
    this.init(size, y);
    this.body.velocity.y += this.scene.scale.height;
  }

  private init(szie: number, y: number) {
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setCollideWorldBounds(false);
    this.setDepth(1);
    this.setOrigin(0.5);
    this.setDisplaySize(szie, szie * 2);
    this._lastPos = y;
  }

  public remove() {
    this._removed = true;
    this.body.velocity.y += this.scene.scale.height;
  }

  public preUpdate(): void {
    if (!this._removed && this._lastPos && this._lastPos <= this.y) {
      this.setVelocity(0, 0);
    }

    if (this._removed && this.y >= this.scene.scale.height) {
      this.destroy();
    }
  }
}
