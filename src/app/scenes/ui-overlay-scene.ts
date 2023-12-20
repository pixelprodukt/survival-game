import { SceneKeys } from '../configuration/scene-keys';
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin';

export class UiOverlayScene extends Phaser.Scene {

    constructor() {
        super(SceneKeys.UI_OVERLAY);
    }

    preload(): void {
    }

    create(): void {
        this.cameras.main.setOrigin(0, 0);
        this.cameras.main.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.cameras.main.setZoom(SCALE);

        const toolbarYPosition = (CANVAS_HEIGHT / SCALE) - 10;

        const slotOne = this.add.image(0 + 16, toolbarYPosition, 'toolbar_icon', 0).setOrigin(0.5, 0.5);
        this.add.image(16 + 16, toolbarYPosition, 'toolbar_icon', 0).setOrigin(0.5, 0.5);
        this.add.image(32 + 16, toolbarYPosition, 'toolbar_icon', 0).setOrigin(0.5, 0.5);

        this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer: any) => {
            console.log('wheel event', pointer);
        });

        // OutlinePipelinePlugin
        const postFxPlugin = this.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;

        /*postFxPlugin.add(slotOne, {
            thickness: 3,
            outlineColor: 0x477cd1
        });*/
    }

    update(_time: number, delta: number): void {
    }
}