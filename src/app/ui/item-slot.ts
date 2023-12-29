import { InventoryItem } from '../models/inventory-item';

export class ItemSlot extends Phaser.GameObjects.Zone {

    private inventoryItem: InventoryItem | null = null;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        public readonly sprite: Phaser.GameObjects.Sprite
    ) {
        super(scene, x, y, 16, 16);
        this.setRectangleDropZone(16, 16);
        this.scene.add.existing(this);
    }

    public hasItem(): boolean {
        return this.inventoryItem !== null;
    }

    public addItem(item: InventoryItem): void {
        this.inventoryItem = item;
        this.inventoryItem.slot = this;
        this.inventoryItem.sprite.x = this.x;
        this.inventoryItem.sprite.y = this.y;
    }

    public removeItem(): void {
        this.inventoryItem = null;
    }

    public getItem(): InventoryItem | null {
        return this.inventoryItem;
    }
}