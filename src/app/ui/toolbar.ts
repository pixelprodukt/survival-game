import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';
import { ItemSlot } from './item-slot';
import { ToolbarEvent } from '../enums/toolbar-event';
import { InventoryItem } from '../models/inventory-item';

export class Toolbar {

    private readonly SLOT_SIZE: number = 16;
    private readonly NUMBER_OF_SLOTS: number = 8;
    private readonly X_POSITION: number = (((CANVAS_WIDTH / SCALE) - (this.NUMBER_OF_SLOTS * this.SLOT_SIZE)) / 2) + (this.SLOT_SIZE / 2);
    private readonly Y_POSITION : number = (CANVAS_HEIGHT / SCALE) - 10;

    private currentActiveToolbarSpriteCounter: number = 0;
    private toolbarSlots: ItemSlot[] = [];

    constructor(private readonly scene: Phaser.Scene) {
        for (let i = 0; i < this.NUMBER_OF_SLOTS; i++) {
            this.toolbarSlots.push(new ItemSlot(
                this.scene,
                this.X_POSITION + (i * this.SLOT_SIZE),
                this.Y_POSITION
            ));
            this.toolbarSlots[i].setData('slotIndex', i);
        }

        // init active slot
        this.toolbarSlots[this.currentActiveToolbarSpriteCounter].sprite.setFrame(1);
    }

    public selectNextSlot(): void {
        this.resetSlotFrames();
        if (this.currentActiveToolbarSpriteCounter >= this.toolbarSlots.length - 1) {
            this.currentActiveToolbarSpriteCounter = 0;
        } else {
            this.currentActiveToolbarSpriteCounter++;
        }
        this.setCurrentFrame();
    }

    public selectPreviousSlot(): void {
        this.resetSlotFrames();
        if (this.currentActiveToolbarSpriteCounter <= 0) {
            this.currentActiveToolbarSpriteCounter = this.toolbarSlots.length - 1;
        } else {
            this.currentActiveToolbarSpriteCounter--;
        }
        this.setCurrentFrame();
    }

    public addItem(item: InventoryItem, index: number): void {
        if (!this.toolbarSlots[index] || this.toolbarSlots[index].hasItem()) {
            console.error('slot doesn\'t exist or already has an item');
            return
        }
        this.toolbarSlots[index].addItem(item);
    }

    public getItem(): InventoryItem | null {
        return this.toolbarSlots[this.currentActiveToolbarSpriteCounter].getItem();
    }

    private setCurrentFrame(): void {
        this.toolbarSlots[this.currentActiveToolbarSpriteCounter].sprite.setFrame(1);
        this.scene.events.emit(ToolbarEvent.ACTIVE_SLOT_CHANGED, this.toolbarSlots[this.currentActiveToolbarSpriteCounter].getItem());
    }

    private resetSlotFrames(): void {
        this.toolbarSlots.forEach((slot: ItemSlot) => {
            slot.sprite.setFrame(0);
        });
    }
}