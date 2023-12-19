import {SceneKeys} from "../configuration/scene-keys";
import {CANVAS_HEIGHT, CANVAS_WIDTH, SCALE} from "../configuration/constants";

export class UiOverlayScene extends Phaser.Scene {

    constructor() {
        super(SceneKeys.UI_OVERLAY);
    }

    preload(): void {}

    create(): void {
        this.cameras.main.setOrigin(0, 0);
        this.cameras.main.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.cameras.main.setZoom(SCALE);

        const toolbarYPosition = (CANVAS_HEIGHT / SCALE) - 10;

        this.add.image(0 + 16, toolbarYPosition, 'toolbar_icon', 0).setOrigin(0.5, 0.5);
        this.add.image(16 + 16, toolbarYPosition, 'toolbar_icon', 0).setOrigin(0.5, 0.5);
        this.add.image(32 + 16, toolbarYPosition, 'toolbar_icon', 0).setOrigin(0.5, 0.5);
    }

    update(_time: number, delta: number): void {}
}