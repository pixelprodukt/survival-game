import { ItemSlot } from '../ui/item-slot';
import { EquippableItem } from '../gameObjects/equippable-item';

export interface InventoryItem {
    sprite: Phaser.GameObjects.Sprite;
    slot?: ItemSlot;
    quantity: number;
    equippableItem: EquippableItem;
}