import { SceneKeys } from '../configuration/scene-keys';
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';

export class UiOverlayScene extends Phaser.Scene {

    private toolbarSprites: Phaser.GameObjects.Sprite[] = [];
    private activeToolbarSprite: Phaser.GameObjects.Sprite | null = null;
    private currentActiveToolbarSpriteCounter: number = 0;

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

        this.toolbarSprites = [
            this.add.sprite(110, toolbarYPosition, 'toolbar', 2),
            this.add.sprite(126, toolbarYPosition, 'toolbar', 2),
            this.add.sprite(142, toolbarYPosition, 'toolbar', 2),
            this.add.sprite(158, toolbarYPosition, 'toolbar', 2),
            this.add.sprite(174, toolbarYPosition, 'toolbar', 2),
            this.add.sprite(190, toolbarYPosition, 'toolbar', 2)
        ];

        this.toolbarSprites[this.currentActiveToolbarSpriteCounter].setFrame(1);

        this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer: any) => {
            console.log('wheel event', pointer);

            this.toolbarSprites.forEach((sprite: Phaser.GameObjects.Sprite) => {
                sprite.setFrame(0);
            });

            if (pointer.deltaY > 0) {
                if (this.currentActiveToolbarSpriteCounter >= this.toolbarSprites.length - 1) {
                    this.currentActiveToolbarSpriteCounter = 0;
                } else {
                    this.currentActiveToolbarSpriteCounter++;
                }
            } else {
                if (this.currentActiveToolbarSpriteCounter <= 0) {
                    this.currentActiveToolbarSpriteCounter = this.toolbarSprites.length - 1;
                } else {
                    this.currentActiveToolbarSpriteCounter--;
                }
            }
            this.toolbarSprites[this.currentActiveToolbarSpriteCounter].setFrame(1);
            this.events.emit('toolbarChanged', { data: 'test' });
        });

    }

    update(_time: number, delta: number): void {
    }
}