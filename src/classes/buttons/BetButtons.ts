import { Scene } from 'phaser';
import { TextureKeys } from '../../common/enums/TextureKeys';
import ButtonBase from './ButtonBase';

export enum BetButtonType {
  PLUS = 'plus',
  MINUS = 'minus',
  IMAGE = 'image',
}

export class ButtonBet extends ButtonBase {
  private _hanldeClick: () => void;
  private _disable: boolean;

  constructor(scene: Scene, x: number, y: number, type: BetButtonType, size: number, handleClick?: () => void) {
    const configButtonBase = {
      scene,
      x,
      y,
      texture: getTextureByType(type),
      size,
    };
    super(configButtonBase);

    this.setDisplaySize(size, size / 2);

    if (type === BetButtonType.IMAGE) {
      return;
    }

    this._hanldeClick = handleClick as () => void;
    this.on('pointerdown', this.pointerDownHandler.bind(this));
  }

  public disable() {
    this.setTint(0x999999);
    this.setDisable(true);
  }

  public undisable() {
    this.clearTint();
    this.setDisable(false);
  }

  public setDisable(value: boolean) {
    this._disable = value;
  }

  private pointerDownHandler() {
    if (this._disable) {
      return;
    }

    this._hanldeClick();
  }
}

function getTextureByType(type: BetButtonType): TextureKeys {
  const textures = {
    [BetButtonType.PLUS]: TextureKeys.BET_PLUS,
    [BetButtonType.MINUS]: TextureKeys.BET_MINUS,
    [BetButtonType.IMAGE]: TextureKeys.BET_IMAGE,
  };

  return textures[type];
}
