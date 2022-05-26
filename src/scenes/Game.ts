import { Item } from '../classes/sprite/Item';
import { BackgroundKeys } from '../common/enums/BackgroundKeys';
import { SceneKeys } from '../common/enums/SceneKeys';
import { SpritesKeys } from '../common/enums/SpritesKeys';
import { Message } from '../common/types/Message';
import { BaseScene } from './BaseScene';
import { ScoreManager } from '../classes/score/ScoreManager';
import { BetButtonType, ButtonBet } from '../classes/buttons/BetButtons';
import { api } from '../services';
import ButtonStart from '../classes/buttons/ButtonStart';
import ButtonGet from '../classes/buttons/ButtonGet';
import ButtonStop from '../classes/buttons/ButtonStop';
import { MessageTypes } from '../common/enums/MessageTypes';
import { delay } from '../common/utils';

export class Game extends BaseScene {
  private _items: Item[] = [];
  private _gameItems: Item[] = [];
  private _betButtons: any[] = [];
  private _buttonStart: ButtonStart;
  private _buttonGet: ButtonGet;
  private _buttonStop: ButtonStop;
  private _manager: ScoreManager;

  private _score: number;
  private _data: Message;

  constructor() {
    super(SceneKeys.GAME);
  }

  public create() {
    super.create();
    this.setBackgroundDefault();
    this.createButtons();

    api.setHandler(this.handleMessage.bind(this));
  }

  private handleMessage(message: Message) {
    if (!message.type) {
      return;
    }

    this._data = message;

    this.setBackgroundDefault();

    this._buttonStart.disable();
    this._buttonGet.undisable();
    this._buttonStop.undisable();

    this._betButtons.forEach((item) => item.disable());

    this.removeItems();

    this.spawnFirstSymbols();
  }

  private createButtons() {
    const buttonBetWidth = 90;
    const buttonBetHeight = 130;

    this._betButtons.push(
      new ButtonBet(this, buttonBetWidth, buttonBetHeight, BetButtonType.IMAGE, this.widthScene / 14),
    );

    this._betButtons.push(
      new ButtonBet(
        this,
        buttonBetWidth + buttonBetWidth / 2,
        buttonBetHeight,
        BetButtonType.PLUS,
        this.widthScene / 22,
        () => this._manager.setBet(api.bet + 1),
      ),
    );

    this._betButtons.push(
      new ButtonBet(
        this,
        buttonBetWidth - buttonBetWidth / 2,
        buttonBetHeight,
        BetButtonType.MINUS,
        this.widthScene / 22,
        () => this._manager.setBet(api.bet - 1),
      ),
    );

    this._manager = new ScoreManager(this);

    this._buttonStart = new ButtonStart(this, this.widthScene / 1.32, this.heightScene - 80, () =>
      this.handleButtonStartClick(),
    );

    this._buttonGet = new ButtonGet(
      this,
      this.widthScene / 2,
      this.heightScene - 80,
      this.handleButtonGetClick.bind(this),
    );
    this._buttonStop = new ButtonStop(
      this,
      this.widthScene / 4.1,
      this.heightScene - 80,
      this.handleButtonStopClick.bind(this),
    );
  }

  private handleButtonStartClick() {
    this._score = 0;
    this._manager.setScore(this._score);
    this._manager.setUtyaScore(0);
    api.spin();
  }

  private handleButtonStopClick(showUtya = true) {
    this._betButtons.forEach((item) => item.undisable());
    this._buttonGet.disable();
    this._buttonStop.disable();
    this._buttonStart.undisable();

    showUtya && this.spawnGameCards();
    this.setBackgroundByGameType();

    this._manager.setBalance(this._data.balance);
    api.updateBalance(this._data.balance);
  }

  private handleButtonGetClick() {
    const score = this.getScore();
    const texture = this.getTextureByScore(score);
    this.spawnCardByData(texture);

    this._score += score;
    this._manager.setScore(this._score);

    if (this._score === 21) {
      this.handleButtonStopClick();
    }

    if (this._score > 21) {
      this._items.forEach((item) => item.setTint(0x9999999));
      this.handleButtonStopClick(false);
    }
  }

  private async spawnFirstSymbols() {
    const fs = Math.floor(Math.random() * 2) ? 10 : 11;
    const ftexture = this.getTextureByScore(fs);
    this.spawnCardByData(ftexture);

    await delay(200);

    const ss = Math.floor(Math.random() * 2) ? 6 : 3;
    const stexture = this.getTextureByScore(ss);
    this.spawnCardByData(stexture);
    this._score = ss + fs;
    this._manager.setScore(this._score);
  }

  private removeItems() {
    this._items.forEach((item) => item.remove());
    this._gameItems.forEach((item) => item.remove());
    this._items = [];
    this._gameItems = [];
  }

  private setBackgroundByGameType() {
    if (this._data.type === MessageTypes.DRAW) {
      return this.setBackgroundDefault();
    }

    this._data.type === MessageTypes.LOSE ? this.setBackgroundLose() : this.setBackgroundWin();
  }

  private spawnCardByData(texture: SpritesKeys) {
    const size = this.widthScene / 10;
    const startPosWidth = this.widthScene / 3;
    const startPosHeight = this.heightScene / 2 - this.heightScene / 4 - size;

    this._items.push(new Item(this, startPosWidth, startPosHeight + (this._items.length + 1) * size, texture, size));
  }

  private spawnGameCards() {
    const fns = {
      [MessageTypes.DRAW]: this.spawnGameDrawCards.bind(this),
      [MessageTypes.WIN]: this.spawnGameWinCards.bind(this),
      [MessageTypes.LOSE]: this.spawnGameLoseCards.bind(this),
    };

    return fns[this._data.type]();
  }

  private async spawnGameDrawCards() {
    let gameScore = 0;

    while (gameScore !== this._score) {
      const num = Math.floor(Math.random() * 2);
      if (num) {
        if (gameScore + 11 <= this._score) {
          gameScore += 11;
          const texture = this.getTextureByScore(11);
          this.spawnGameCard(texture);
          continue;
        }

        if (gameScore + 10 <= this._score) {
          gameScore += 10;
          const texture = this.getTextureByScore(10);
          this.spawnGameCard(texture);
          continue;
        }
      }
      const score = this.getWinScore(this._score, gameScore);
      const texture = this.getTextureByScore(score);
      this.spawnGameCard(texture);
      gameScore += score;
      await delay(300);
    }

    this._manager.setUtyaScore(gameScore);
  }

  private async spawnGameWinCards() {
    let gameScore = 0;
    const num = Math.floor(Math.random() * 2);

    if (num) {
      if (gameScore + 11 < this._score) {
        gameScore += 11;
        const texture = this.getTextureByScore(11);
        this.spawnGameCard(texture);
      }
    } else {
      if (gameScore + 10 < this._score) {
        gameScore += 10;
        const texture = this.getTextureByScore(10);
        this.spawnGameCard(texture);
      }
    }

    while (gameScore < 21) {
      const score = this.getWinScore(100, gameScore);
      const texture = this.getTextureByScore(score);
      this.spawnGameCard(texture);
      gameScore += score;
      await delay(300);
    }

    this._manager.setUtyaScore(gameScore);
  }

  private async spawnGameLoseCards() {
    let gameScore = 0;
    const limit = 21;

    while (gameScore < limit && gameScore < this._score) {
      const num = Math.floor(Math.random() * 2);
      if (num) {
        if (gameScore + 11 <= 21) {
          gameScore += 11;
          const texture = this.getTextureByScore(11);
          this.spawnGameCard(texture);
          continue;
        }

        if (gameScore + 10 <= 21) {
          gameScore += 10;
          const texture = this.getTextureByScore(10);
          this.spawnGameCard(texture);
          continue;
        }
      }

      const score = this.getWinScore(limit, gameScore);
      const texture = this.getTextureByScore(score);
      this.spawnGameCard(texture);
      gameScore += score;
      await delay(300);
    }

    this._manager.setUtyaScore(gameScore);
  }

  private spawnGameCard(texture: SpritesKeys) {
    const size = this.widthScene / 10;
    const startPosWidth = this.widthScene / 1.5;
    const startPosHeight = this.heightScene / 2 - this.heightScene / 4 - size;

    this._gameItems.push(
      new Item(this, startPosWidth, startPosHeight + (this._gameItems.length + 1) * size, texture, size),
    );
  }

  private setBackgroundDefault() {
    this.createBackground(this, 0, 0, this.widthScene, this.heightScene, BackgroundKeys.BACKGROND);
  }

  private setBackgroundLose() {
    this.createBackground(this, 0, 0, this.widthScene, this.heightScene, BackgroundKeys.BACKGROND_LOSE);
  }

  private setBackgroundWin() {
    this.createBackground(this, 0, 0, this.widthScene, this.heightScene, BackgroundKeys.BACKGROND_WIN);
  }

  private getScore() {
    const fns = {
      [MessageTypes.WIN]: this.getWinScore.bind(this),
      [MessageTypes.DRAW]: this.getWinScore.bind(this),
      [MessageTypes.LOSE]: this.getLoseScore.bind(this),
    };

    return fns[this._data.type]();
  }

  private getLoseScore() {
    const num = Math.floor(Math.random() * 3);
    const scores: Record<number, number> = {
      0: 11,
      1: 6,
      2: 3,
    };

    return scores[num];
  }

  private getWinScore(limit = 21, score = this._score) {
    const num = Math.floor(Math.random() * 2);

    if (num && score + 6 <= limit) {
      return 6;
    }

    if (score + 3 <= limit) {
      return 3;
    }

    return 1;
  }

  private getTextureByScore(score: number) {
    const fns: Record<number, () => SpritesKeys> = {
      1: this.getTextureBy1.bind(this),
      3: this.getTextureBy3.bind(this),
      6: this.getTextureBy6.bind(this),
      10: this.getTextureBy10.bind(this),
      11: this.getTextureBy11.bind(this),
    };

    return fns[score]();
  }

  private getTextureBy6() {
    const textures: Record<number, SpritesKeys> = {
      0: SpritesKeys.CARD_6_BLACK,
      1: SpritesKeys.CARD_6_BLUE,
      2: SpritesKeys.CARD_6_GREEN,
      3: SpritesKeys.CARD_6_RED,
    };
    const num = Math.floor(Math.random() * 4);
    return textures[num];
  }

  private getTextureBy3() {
    const textures: Record<number, SpritesKeys> = {
      0: SpritesKeys.CARD_3_BLACK,
      1: SpritesKeys.CARD_3_BLUE,
      2: SpritesKeys.CARD_3_GREEN,
      3: SpritesKeys.CARD_3_RED,
    };
    const num = Math.floor(Math.random() * 4);
    return textures[num];
  }

  private getTextureBy1() {
    const textures: Record<number, SpritesKeys> = {
      0: SpritesKeys.CARD_1_BLACK,
      1: SpritesKeys.CARD_1_BLUE,
      2: SpritesKeys.CARD_1_GREEN,
      3: SpritesKeys.CARD_1_RED,
    };
    const num = Math.floor(Math.random() * 4);
    return textures[num];
  }

  private getTextureBy10() {
    return SpritesKeys.CARD_10;
  }

  private getTextureBy11() {
    return SpritesKeys.CARD_11;
  }
}
