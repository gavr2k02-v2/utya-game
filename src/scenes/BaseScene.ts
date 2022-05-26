import { SceneKeys } from '../common/enums/SceneKeys';

export class BaseScene extends Phaser.Scene {
  protected widthScene: number;
  protected heightScene: number;
  protected startEvent: boolean;

  public create() {
    this.widthScene = this.scale.width;
    this.heightScene = this.scale.height;
  }

  protected startScene(key: SceneKeys, obj?: object) {
    this.scene.start(key, obj);
  }

  protected sceneTransitionRightToLeft(targetScene: SceneKeys) {
    this.scene.transition({
      target: targetScene,
      duration: 1000,
      onUpdate: (progress: any) => {
        const cam = this.cameras.main;
        const target = this.scene.get(targetScene);
        const targetCam = target.cameras.main;
        const defaultWidth = this.cameras.default.width;
        const targetDefaultWidth = target.cameras.default.width;

        cam.setViewport(0, 0, (1 - progress) * defaultWidth, cam.height);
        cam.setScroll(progress * defaultWidth, 0);
        targetCam.setViewport((1 - progress) * defaultWidth, 0, progress * targetDefaultWidth, targetCam.height);
      },
    });
  }

  protected createBackground(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    texture: string,
  ): Phaser.GameObjects.Image {
    const background = scene.add.image(x, y, texture).setOrigin(0);

    background.displayWidth = width;
    background.displayHeight = height;

    return background;
  }
}
