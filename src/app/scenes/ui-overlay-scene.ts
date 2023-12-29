import { Scene } from '../enums/scene';
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';
import { Firearm } from '../gameObjects/firearm';
import { RIFLE_CONFIG } from '../configuration/firearm-configurations';
import { Pickaxe } from '../gameObjects/pickaxe';
import { ItemSlot } from '../ui/item-slot';
import { InventoryItem } from '../models/inventory-item';

export class UiOverlayScene extends Phaser.Scene {

    private toolbarSlots: ItemSlot[] = [];
    private numberOfToolbarSlots = 8;
    private items: InventoryItem[] = [];
    private currentActiveToolbarSpriteCounter: number = 1;

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

        this.items.push({
            sprite: this.add.sprite(110, toolbarYPosition, 'rifle_icon', 0).setInteractive({ draggable: true }),
            quantity: 1,
            equippableItem: new Firearm(this.scene.get(Scene.TEST), RIFLE_CONFIG)
        });
        this.items.push({
            sprite: this.add.sprite(126, toolbarYPosition, 'pickaxe_icon', 0).setInteractive({ draggable: true }),
            quantity: 1,
            equippableItem: new Pickaxe(this.scene.get(Scene.TEST))
        });

        for (let i = 0; i < this.numberOfToolbarSlots; i++) {
            this.toolbarSlots.push(new ItemSlot(
                this,
                110 + (i * 16),
                toolbarYPosition,
                this.add.sprite(110 + (i * 16), toolbarYPosition, 'toolbar', 0)
            ));
            this.toolbarSlots[i].setData('slotIndex', i);
        }

        this.children.bringToTop(this.items[0].sprite);
        this.children.bringToTop(this.items[1].sprite);

        this.toolbarSlots[0].addItem(this.items[0]);
        this.toolbarSlots[1].addItem(this.items[1]);

        this.items.forEach((item: InventoryItem) => {
            item.equippableItem.setVisible(false);

            item.sprite.on('dragstart', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                this.children.bringToTop(item.sprite);
                item.slot!.removeItem();
            });

            item.sprite.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                item.sprite.x = dragX;
                item.sprite.y = dragY;
            });

            item.sprite.on('drop', (pointer: Phaser.Input.Pointer, zone: Phaser.GameObjects.Zone) => {
                const slot = zone as ItemSlot;
                if (slot.hasItem()) {
                    item.sprite.x = item.slot!.x;
                    item.sprite.y = item.slot!.y;
                    item.slot?.addItem(item);
                } else {
                    slot.addItem(item);
                }
                this.events.emit('toolbarChanged', this.toolbarSlots[this.currentActiveToolbarSpriteCounter].getItem());
            });

            item.sprite.on('dragend', (pointer: Phaser.Input.Pointer, endpointX: number, endpointY: number, dropped: boolean) => {
                if (!dropped) {
                    item.slot?.addItem(item);
                }
            });
        });

        this.toolbarSlots[this.currentActiveToolbarSpriteCounter].sprite.setFrame(1);
        this.events.emit('toolbarChanged', this.toolbarSlots[this.currentActiveToolbarSpriteCounter].getItem());

        this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer: any) => {
            this.toolbarSlots.forEach((slot: ItemSlot) => {
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

            this.events.emit('toolbarChanged', this.toolbarSlots[this.currentActiveToolbarSpriteCounter].getItem());
        });

    }

    update(_time: number, delta: number): void {
    }
}