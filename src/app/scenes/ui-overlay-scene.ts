import { Scene } from '../enums/scene';
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';

interface ToolbarSlot {
    sprite: Phaser.GameObjects.Sprite;
    equippableInventoryItem: InventoryItem | null;
}

interface InventoryItem {
    sprite: Phaser.GameObjects.Sprite;
    quantity: number;
    isEquippable: boolean;
    equippableItemKey: string;
}

export class UiOverlayScene extends Phaser.Scene {

    private toolbarSlots: ToolbarSlot[] = [];
    private activeToolbarSprite: Phaser.GameObjects.Sprite | null = null;
    private currentActiveToolbarSpriteCounter: number = 0;

    constructor() {
        super(Scene.UI_OVERLAY);
    }

    preload(): void {
    }

    create(): void {
        this.cameras.main.setOrigin(0, 0);
        this.cameras.main.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.cameras.main.setZoom(SCALE);

        const toolbarYPosition = (CANVAS_HEIGHT / SCALE) - 10;

        this.toolbarSlots = [
            {
                sprite: this.add.sprite(110, toolbarYPosition, 'toolbar', 1),
                equippableInventoryItem: {
                    sprite: this.add.sprite(110, toolbarYPosition, 'rifle_icon', 0),
                    isEquippable: true,
                    quantity: 1,
                    equippableItemKey: 'rifle'
                }
            },
            {
                sprite: this.add.sprite(126, toolbarYPosition, 'toolbar', 0),
                equippableInventoryItem: {
                    sprite: this.add.sprite(126, toolbarYPosition, 'pickaxe_icon', 0),
                    isEquippable: true,
                    quantity: 1,
                    equippableItemKey: 'pickaxe'
                }
            },
            {
                sprite: this.add.sprite(142, toolbarYPosition, 'toolbar', 0),
                equippableInventoryItem: null
            },
            {
                sprite: this.add.sprite(158, toolbarYPosition, 'toolbar', 0),
                equippableInventoryItem: null
            },
            {
                sprite: this.add.sprite(174, toolbarYPosition, 'toolbar', 0),
                equippableInventoryItem: null
            },
            {
                sprite: this.add.sprite(190, toolbarYPosition, 'toolbar', 0),
                equippableInventoryItem: null
            }
        ];

        this.toolbarSlots[this.currentActiveToolbarSpriteCounter].sprite.setFrame(1);

        this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer: any) => {
            console.log('wheel event', pointer);

            this.toolbarSlots.forEach((slot: ToolbarSlot) => {
                slot.sprite.setFrame(0);
            });

            if (pointer.deltaY > 0) {
                if (this.currentActiveToolbarSpriteCounter >= this.toolbarSlots.length - 1) {
                    this.currentActiveToolbarSpriteCounter = 0;
                } else {
                    this.currentActiveToolbarSpriteCounter++;
                }
            } else {
                if (this.currentActiveToolbarSpriteCounter <= 0) {
                    this.currentActiveToolbarSpriteCounter = this.toolbarSlots.length - 1;
                } else {
                    this.currentActiveToolbarSpriteCounter--;
                }
            }
            this.toolbarSlots[this.currentActiveToolbarSpriteCounter].sprite.setFrame(1);
            this.events.emit('toolbarChanged', { data: this.toolbarSlots[this.currentActiveToolbarSpriteCounter].equippableInventoryItem });
        });

    }

    update(_time: number, delta: number): void {
    }
}