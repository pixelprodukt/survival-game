import { Vector } from 'matter';
import { Direction } from './direction';
import { Equippable } from './equipable';
import { EquippableItemConfig } from './equippable-item-config';
import { Player } from './player';

export class EquippableItem extends Phaser.GameObjects.Container implements Equippable {

    private facingLeftOffset: Vector = { x: 0, y: 0 };
    private facingRightOffset: Vector = { x: 0, y: 0 };
    private facingLeftOrigin: Vector = {x: 0, y: 0 };
    private facingRightOrigin: Vector = {x: 0, y: 0 };

    protected sprite!: Phaser.GameObjects.Sprite;
    protected useSound!: Phaser.Sound.BaseSound;
    protected canUse: boolean = true;
    protected currentOffset: Vector = {x: 0, y: 0 };

    constructor(
        public readonly scene: Phaser.Scene, 
        protected readonly parent: Player,
        protected readonly config: EquippableItemConfig
        ) {
        super(scene);
        this.setPosition(this.parent.x, this.parent.y);

        this.sprite = this.scene.add.sprite(this.x, this.y, config.spriteKey, 0);
        this.add(this.sprite);

        this.useSound = this.scene.sound.add(config.useSoundKey);

        this.facingLeftOffset = config.facingLeftOffset;
        this.facingRightOffset = config.facingRightOffset;
        this.facingLeftOrigin = config.facingLeftOrigin;
        this.facingRightOrigin = config.facingRightOrigin;

        this.scene.add.existing(this);
    }

    use(): void {}

    update(delta: number): void {
        this.updateDepthAndPosition();
    }

    private updateDepthAndPosition(): void {
        switch (this.parent.direction) {
            case Direction.DOWN_LEFT:
                this.currentOffset = this.facingLeftOffset;
                this.sprite.setOrigin(this.facingLeftOrigin.x, this.facingLeftOrigin.y);
                this.sprite.setFrame(1);
                this.depth = this.parent.sprite.depth + 1;
                break;
            case Direction.DOWN_RIGHT:
                this.currentOffset = this.facingRightOffset;
                this.sprite.setOrigin(this.facingRightOrigin.x, this.facingRightOrigin.y);
                this.sprite.setFrame(0);
                this.depth = this.parent.sprite.depth + 1;
                break;
            case Direction.UP_LEFT:
                this.currentOffset = this.facingLeftOffset;
                this.sprite.setOrigin(this.facingLeftOrigin.x, this.facingLeftOrigin.y);
                this.sprite.setFrame(1);
                this.depth = this.parent.sprite.depth - 1;
                break;
            case Direction.UP_RIGHT:
                this.currentOffset = this.facingRightOffset;
                this.sprite.setOrigin(this.facingRightOrigin.x, this.facingRightOrigin.y);
                this.sprite.setFrame(0);
                this.depth = this.parent.sprite.depth - 1;
                break;
        }
        this.x = this.parent.x + this.currentOffset.x;
        this.y = this.parent.y + this.currentOffset.y;
    }
}