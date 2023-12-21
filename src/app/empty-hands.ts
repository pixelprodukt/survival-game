import { EquippableItem } from './equippable-item';
import { Player } from './player';

export class EmptyHands extends EquippableItem {

    constructor(public readonly scene: Phaser.Scene, protected readonly parent: Player) {
        super(scene, parent, {
            spriteKey: 'unequipped',
            useSoundKey: 'swing01',
            useSoundVolume: 0.5,
            facingLeftOffset: { x: 0, y: -6 },
            facingRightOffset: { x: 0, y: -6 },
            facingLeftOrigin: { x: 0.5, y: 0.5 },
            facingRightOrigin: { x: 0.5, y: 0.5 },
        });
    }

    override use(): void {}
}