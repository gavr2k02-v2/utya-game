import './style.scss';

import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import { Game } from './scenes/Game';
//@ts-ignore
import PerspectiveImagePlugin from 'phaser3-rex-plugins/plugins/perspectiveimage-plugin.js';
// eslint-disable-next-line

const main = async () => {
  loadConfigScene();
  const defaultEvent = new Promise((resolve) => setTimeout(resolve, 3000));
  await Promise.race([event, defaultEvent]);

  deleteLoadConfigScene();
  initGame();
};

const loadConfigScene = () => {
  const loadConfigScene = document.createElement('div');
  loadConfigScene.classList.add('loadConfigScene');

  const loadText = document.createElement('p');
  loadText.textContent = 'LOADING CONTENT';

  loadConfigScene.append(loadText);
  document.body.append(loadConfigScene);
};

const deleteLoadConfigScene = () => {
  const loadConfigScene = document.querySelector('.loadConfigScene') as HTMLElement;
  loadConfigScene.remove();
};

const initGame = () => {
  const sponsorImageHeight = (document.querySelector('.sponsorImage') as HTMLElement)?.offsetHeight || 0;
  const DEFAULT_HEIGHT = 1280;
  const DEFAULT_WIDTH = (window.innerWidth / (window.innerHeight - sponsorImageHeight)) * DEFAULT_HEIGHT;

  new Phaser.Game({
    parent: 'game',
    title: 'team-invaders',
    version: '1.0',
    scale: {
      mode: Phaser.Scale.ScaleModes.FIT,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
    input: {
      keyboard: true,
      mouse: true,
      touch: true,
      gamepad: false,
      activePointers: 3,
    },
    physics: {
      default: 'arcade',
    },
    plugins: {
      global: [
        {
          key: 'rexPerspectiveImagePlugin',
          plugin: PerspectiveImagePlugin,
          start: true,
        },
      ],
    },

    scene: [Preloader, Game],
  });
};

main();
