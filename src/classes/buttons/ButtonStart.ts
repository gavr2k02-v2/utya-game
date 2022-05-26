import { Scene } from 'phaser';
import { TextureKeys } from '../../common/enums/TextureKeys';
import ButtonBase from './ButtonBase';

export default class ButtonStart extends ButtonBase {
  public isDown: boolean;
  private _handleClick: () => void;
  private _disabled: boolean;

  constructor(scene: Scene, x: number, y: number, handleClick: () => void) {
    const configButtonBase = {
      scene,
      x,
      y,
      texture: TextureKeys.BUTTON_START_PRESED,
    };
    super(configButtonBase);

    const size = this.scene.scale.width / 4;
    this.setDisplaySize(size, size / 2);

    this.isDown = false;
    this._handleClick = handleClick;

    this.on('pointerdown', this.pointerDownHandler.bind(this));
    this.on('pointerup', this.pointerUpHandler.bind(this));
  }

  public disable() {
    this.setTint(0x999999);
    this._disabled = true;
  }

  public undisable() {
    this.clearTint();
    this._disabled = false;
  }

  public get disabled() {
    return this._disabled;
  }

  private pointerDownHandler() {
    if (this._disabled) {
      return;
    }

    this.setTexture(TextureKeys.BUTTON_START);
    this.isDown = true;
    this._handleClick();
  }

  private pointerUpHandler() {
    this.setTexture(TextureKeys.BUTTON_START_PRESED);
    this.isDown = false;
  }
}
