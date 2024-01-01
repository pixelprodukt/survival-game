import { Scene } from '../enums/scene';
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';
import { Firearm } from '../gameObjects/firearm';
import { RIFLE_CONFIG } from '../configuration/firearm-configurations';
import { Pickaxe } from '../gameObjects/pickaxe';
import { ItemSlot } from '../ui/item-slot';
import { InventoryItem } from '../models/inventory-item';
import { ToolbarEvent } from '../enums/toolbar-event';
import { Toolbar } from '../ui/toolbar';
import { Inventory } from '../ui/inventory';

export class UiOverlayScene extends Phaser.Scene {

    private items: InventoryItem[] = [];

    constructor() {
        super(Scene.UI_OVERLAY);
    }

    preload(): void {
    }

    create(): void {
        this.cameras.main.setOrigin(0, 0);
        this.cameras.main.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.cameras.main.setZoom(SCALE);

        const toolbar = new Toolbar(this);
        const inventory = new Inventory(this);

        this.items.push({
            sprite: this.add.sprite(0, 0, 'rifle_icon', 0).setInteractive({ draggable: true }),
            quantity: 1,
            equippableItem: new Firearm(this.scene.get(Scene.TEST), RIFLE_CONFIG)
        });
        this.items.push({
            sprite: this.add.sprite(0, 0, 'pickaxe_icon', 0).setInteractive({ draggable: true }),
            quantity: 1,
            equippableItem: new Pickaxe(this.scene.get(Scene.TEST))
        });

        this.children.bringToTop(this.items[0].sprite);
        this.children.bringToTop(this.items[1].sprite);

        toolbar.addItem(this.items[0], 0);
        toolbar.addItem(this.items[1], 1);

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
                this.events.emit(ToolbarEvent.ACTIVE_SLOT_CHANGED, toolbar.getItem());
            });

            item.sprite.on('dragend', (pointer: Phaser.Input.Pointer, endpointX: number, endpointY: number, dropped: boolean) => {
                if (!dropped) {
                    item.slot?.addItem(item);
                }
            });
        });

        this.events.emit(ToolbarEvent.ACTIVE_SLOT_CHANGED, toolbar.getItem());

        this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer: any) => {
            if (pointer.deltaY > 0) {
                toolbar.selectNextSlot();
            } else {
                toolbar.selectPreviousSlot();
            }
            this.events.emit(ToolbarEvent.ACTIVE_SLOT_CHANGED, toolbar.getItem());
        });

        this.input.keyboard.on('keydown-TAB', () => {
            console.log('tab down');

            inventory.visible ? inventory.setActiveAndVisible(false) : inventory.setActiveAndVisible(true);
        });
    }

    update(_time: number, delta: number): void {
    }
}