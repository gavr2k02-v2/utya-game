import Phaser from 'phaser';
import { STYLE_TEXT } from '../common/constants';
import { BackgroundKeys } from '../common/enums/BackgroundKeys';
import { SceneKeys } from '../common/enums/SceneKeys';
import { SpritesKeys } from '../common/enums/SpritesKeys';
import { TextureKeys } from '../common/enums/TextureKeys';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.PRELOADER);
  }

  public preload() {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'LOADING CONTENT', {
        ...STYLE_TEXT,
        fontFamily: `roboto, sans-serif`,
      })
      .setOrigin(0.5);

    this.uploadImages();
  }

  public create(): void {
    this.scene.start(SceneKeys.GAME);
  }

  private uploadImages() {
    this.load.image(BackgroundKeys.BACKGROND, 'images/background/game.png');
    this.load.image(BackgroundKeys.BACKGROND_WIN, 'images/background/game_win.png');
    this.load.image(BackgroundKeys.BACKGROND_LOSE, 'images/background/game_lose.png');

    this.load.image(TextureKeys.BUTTON_START, 'images/textures/start_button.png');
    this.load.image(TextureKeys.BUTTON_START_PRESED, 'images/textures/start_presed.png');

    this.load.image(TextureKeys.BUTTON_GET, 'images/textures/get_button.png');
    this.load.image(TextureKeys.BUTTON_GET_PRESED, 'images/textures/get_pressed.png');

    this.load.image(TextureKeys.BUTTON_STOP, 'images/textures/button_stop.png');
    this.load.image(TextureKeys.BUTTON_STOP_PRESED, 'images/textures/stop_pressed.png');

    this.load.image(TextureKeys.BET_IMAGE, 'images/textures/bet_image.png');
    this.load.image(TextureKeys.BET_PLUS, 'images/textures/bet_plus.png');
    this.load.image(TextureKeys.BET_MINUS, 'images/textures/bet_minus.png');

    this.load.image(SpritesKeys.CARD_1_BLACK, 'images/sprites/black_1_card.png');
    this.load.image(SpritesKeys.CARD_1_BLUE, 'images/sprites/blue_1_card.png');
    this.load.image(SpritesKeys.CARD_1_GREEN, 'images/sprites/green_1_card.png');
    this.load.image(SpritesKeys.CARD_1_RED, 'images/sprites/red_1_card.png');

    this.load.image(SpritesKeys.CARD_3_BLACK, 'images/sprites/black_3_card.png');
    this.load.image(SpritesKeys.CARD_3_BLUE, 'images/sprites/blue_3_card.png');
    this.load.image(SpritesKeys.CARD_3_GREEN, 'images/sprites/green_3_card.png');
    this.load.image(SpritesKeys.CARD_3_RED, 'images/sprites/red_3_card.png');

    this.load.image(SpritesKeys.CARD_6_BLACK, 'images/sprites/black_6_card.png');
    this.load.image(SpritesKeys.CARD_6_BLUE, 'images/sprites/blue_6_card.png');
    this.load.image(SpritesKeys.CARD_6_GREEN, 'images/sprites/green_6_card.png');
    this.load.image(SpritesKeys.CARD_6_RED, 'images/sprites/red_6_card.png');

    this.load.image(SpritesKeys.CARD_10, 'images/sprites/10_card.png');
    this.load.image(SpritesKeys.CARD_11, 'images/sprites/11_card.png');
  }
}
