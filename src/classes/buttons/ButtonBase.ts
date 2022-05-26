import { TextureKeys } from '../../common/enums/TextureKeys';

export interface IConfigBaseButton {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: TextureKeys;
  size?: number;
}

export default class ButtonBase extends Phaser.GameObjects.Image {
  constructor(config: IConfigBaseButton) {
    super(config.scene, config.x, config.y, config.texture);
    this.scene.add.existing(this);
    this.setDepth(1);
    const size = config.size || this.scene.scale.width / 6;
    this.setDisplaySize(size, size);
    this.setInteractive();
  }
}
