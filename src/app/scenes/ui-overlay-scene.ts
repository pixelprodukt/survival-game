import { Scene } from '../enums/scene';
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';
import { EquippableItem } from '../gameObjects/equippable-item';
import { Firearm } from '../gameObjects/firearm';
import { RIFLE_CONFIG } from '../configuration/firearm-configurations';
import { Pickaxe } from '../gameObjects/pickaxe';

class ToolbarSlot {
    constructor(
        public readonly sprite: Phaser.GameObjects.Sprite,
        public readonly dropZone: Phaser.GameObjects.Zone,
        public inventoryItem: InventoryItem | null
    ) {
    }

    public hasItem(): boolean {
        return this.inventoryItem !== null;
    }

    public removeItemFromSlot(): void {
        this.inventoryItem = null;
    }
}

interface InventoryItem {
    sprite: Phaser.GameObjects.Sprite;
    slotIndex: number;
    quantity: number;
    equippableItem: EquippableItem;
}

export class UiOverlayScene extends Phaser.Scene {

    private toolbarSlots: ToolbarSlot[] = [];
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

        const itemRifle: InventoryItem = {
            sprite: this.add.sprite(110, toolbarYPosition, 'rifle_icon', 0).setInteractive({ draggable: true }),
            quantity: 1,
            slotIndex: 0,
            equippableItem: new Firearm(this, RIFLE_CONFIG)
        };
        // itemRifle.sprite.setDepth(100);

        const itemPickaxe: InventoryItem = {
            sprite: this.add.sprite(126, toolbarYPosition, 'pickaxe_icon', 0).setInteractive({ draggable: true }),
            quantity: 1,
            slotIndex: 1,
            equippableItem: new Pickaxe(this)
        };
        // itemPickaxe.sprite.setDepth(100);

        this.toolbarSlots = [
            new ToolbarSlot(
                this.add.sprite(110, toolbarYPosition, 'toolbar', 0),
                this.add.zone(110, toolbarYPosition, 16, 16).setRectangleDropZone(16, 16),
                itemRifle
            ),
            new ToolbarSlot(
                this.add.sprite(126, toolbarYPosition, 'toolbar', 0),
                this.add.zone(126, toolbarYPosition, 16, 16).setRectangleDropZone(16, 16),
                itemPickaxe
            ),
            new ToolbarSlot(
                this.add.sprite(142, toolbarYPosition, 'toolbar', 0),
                this.add.zone(142, toolbarYPosition, 16, 16).setRectangleDropZone(16, 16),
                null
            ),
            new ToolbarSlot(
                this.add.sprite(158, toolbarYPosition, 'toolbar', 0),
                this.add.zone(158, toolbarYPosition, 16, 16).setRectangleDropZone(16, 16),
                null
            ),
            new ToolbarSlot(
                this.add.sprite(174, toolbarYPosition, 'toolbar', 0),
                this.add.zone(174, toolbarYPosition, 16, 16).setRectangleDropZone(16, 16),
                null
            ),
            new ToolbarSlot(
                this.add.sprite(190, toolbarYPosition, 'toolbar', 0),
                this.add.zone(190, toolbarYPosition, 16, 16).setRectangleDropZone(16, 16),
                null
            )
        ];

        this.children.bringToTop(itemPickaxe.sprite);
        this.children.bringToTop(itemRifle.sprite);

        for (let i = 0; i < this.toolbarSlots.length; i++) {
            this.toolbarSlots[i].dropZone.setData('slotIndex', i);
        }

        // rifle
        itemRifle.sprite.on('dragstart', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this.children.bringToTop(itemRifle.sprite);
            this.toolbarSlots[itemRifle.slotIndex].removeItemFromSlot();
        });

        itemRifle.sprite.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            itemRifle.sprite.x = dragX;
            itemRifle.sprite.y = dragY;
        });

        itemRifle.sprite.on('drop', (pointer: Phaser.Input.Pointer, zone: Phaser.GameObjects.Zone) => {
            console.log('zone', zone);
            if (this.toolbarSlots[zone.getData('slotIndex')].hasItem()) {
                itemRifle.sprite.x = itemRifle.sprite.input.dragStartX;
                itemRifle.sprite.y = itemRifle.sprite.input.dragStartY;
                this.toolbarSlots[itemRifle.slotIndex].inventoryItem = itemRifle;
            } else {
                itemRifle.sprite.x = zone.x;
                itemRifle.sprite.y = zone.y;
                itemRifle.slotIndex = zone.getData('slotIndex');
                this.toolbarSlots[itemRifle.slotIndex].inventoryItem = itemRifle;
            }
            console.log('toolbarSlot', this.toolbarSlots[itemRifle.slotIndex]);
            console.log('itemRifle', itemRifle);
        });

        itemRifle.sprite.on('dragend', (pointer: Phaser.Input.Pointer, endpointX: number, endpointY: number, dropped: boolean) => {
            if (!dropped) {
                itemRifle.sprite.x = itemRifle.sprite.input.dragStartX;
                itemRifle.sprite.y = itemRifle.sprite.input.dragStartY;
                this.toolbarSlots[itemRifle.slotIndex].inventoryItem = itemRifle;
            }
        });

        // pickaxe
        itemPickaxe.sprite.on('dragstart', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            this.children.bringToTop(itemPickaxe.sprite);
            this.toolbarSlots[itemPickaxe.slotIndex].removeItemFromSlot();
        });

        itemPickaxe.sprite.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            itemPickaxe.sprite.x = dragX;
            itemPickaxe.sprite.y = dragY;
        });

        itemPickaxe.sprite.on('drop', (pointer: Phaser.Input.Pointer, zone: Phaser.GameObjects.Zone) => {
            console.log('zone', zone);
            if (this.toolbarSlots[zone.getData('slotIndex')].hasItem()) {
                itemPickaxe.sprite.x = itemPickaxe.sprite.input.dragStartX;
                itemPickaxe.sprite.y = itemPickaxe.sprite.input.dragStartY;
                this.toolbarSlots[itemPickaxe.slotIndex].inventoryItem = itemPickaxe;
            } else {
                itemPickaxe.sprite.x = zone.x;
                itemPickaxe.sprite.y = zone.y;
                itemPickaxe.slotIndex = zone.getData('slotIndex');
                this.toolbarSlots[itemPickaxe.slotIndex].inventoryItem = itemPickaxe;
            }
            console.log('toolbarSlot', this.toolbarSlots[itemPickaxe.slotIndex]);
            console.log('itemPickaxe', itemPickaxe);
        });

        itemPickaxe.sprite.on('dragend', (pointer: Phaser.Input.Pointer, endpointX: number, endpointY: number, dropped: boolean) => {
            if (!dropped) {
                itemPickaxe.sprite.x = itemPickaxe.sprite.input.dragStartX;
                itemPickaxe.sprite.y = itemPickaxe.sprite.input.dragStartY;
                this.toolbarSlots[itemPickaxe.slotIndex].inventoryItem = itemPickaxe;
            }
        });

        // drag and drop inventory
        // https://www.youtube.com/watch?v=l3zSRRB_SZ8
        // https://github.com/awweather/inventory-tutorial/tree/master
        // https://www.youtube.com/@devbydusk

        // https://labs.phaser.io/view.html?src=src/input\zones\drop%20zone.js
        // https://labs.phaser.io/view.html?src=src/input\zones\circular%20drop%20zone.js
        // https://labs.phaser.io/view.html?src=src/input\dragging\snap%20to%20grid%20on%20drag.js


        /*this.input.on('dragstart', (pointer: any, gameObject: Phaser.GameObjects.GameObject, a: any, b: any) => {
            this.children.bringToTop(gameObject);
            console.log('a', a);
            console.log('b', b);
        });

        this.input.on('drag', (pointer: any, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
            const sprite = gameObject as Phaser.GameObjects.Sprite;
            sprite.x = dragX;
            sprite.y = dragY;
        });

        this.input.on('drop', (pointer: any, gameObject: Phaser.GameObjects.GameObject, dropZone: Phaser.GameObjects.Zone) => {
            const sprite = gameObject as Phaser.GameObjects.Sprite;
            sprite.x = dropZone.x;
            sprite.y = dropZone.y;
        });

        this.input.on('dragend', (pointer: any, gameObject: Phaser.GameObjects.GameObject, dropped: boolean) => {
            if (!dropped) {
                const sprite = gameObject as Phaser.GameObjects.Sprite;
                sprite.x = gameObject.input.dragStartX;
                sprite.y = gameObject.input.dragStartY;
            }
        });*/

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

            this.events.emit('toolbarChanged', { data: this.toolbarSlots[this.currentActiveToolbarSpriteCounter].inventoryItem });
        });

    }

    update(_time: number, delta: number): void {
    }
}