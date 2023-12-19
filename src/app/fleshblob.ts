import {CollisionCategories} from "./configuration/collision-categories";
import {MetaConfig} from "./meta-config";
import {Hitable} from "./hitable";

export enum FleshblobAnimationKeys {
    DOWN_LEFT = 'fleshblobDownLeft',
    DOWN_RIGHT = 'fleshblobDownRight',
    UP_LEFT = 'fleshblobUpLeft',
    UP_RIGHT = 'fleshblobUpRight',
    DEATH_DOWN_LEFT = 'fleshblobDeathDownLeft',
    DEATH_DOWN_RIGHT = 'fleshblobDeathDownRight',
    DEATH_UP_LEFT = 'fleshblobDeathUpLeft',
    DEATH_UP_RIGHT = 'fleshblobDeathUpRight'
}

export class Fleshblob extends Phaser.Physics.Matter.Sprite implements Hitable{

    private despawnCallback!: Function;
    private hitpoints = 50;

    constructor(
        public scene: Phaser.Scene,
        public x: number,
        public y: number,
        private dropKey: string
    ) {
        super(scene.matter.world, x, y, dropKey);
    }

    init(despawnCallback: Function): void {
        this.despawnCallback = despawnCallback;
        this.setOrigin(0.5, 0.5);
        this.depth = this.y + 6 || 0;

        this.setBody({
            type: 'rectangle',
            width: this.width / 2,
            height: this.height / 2 + 4
        }, { frictionAir: 0 });

        const metaConfig: MetaConfig = {
            key: 'fleshblob',
            type: 'enemy',
            parent: this,
            mineable: false,
            hitable: true
        };
        this.setData('meta', metaConfig);

        // Collision
        this.setCollisionCategory(CollisionCategories.HITABLE)
        this.setCollidesWith([
            // CollisionCategories.PLAYER,
            CollisionCategories.PLAYER_PROJECTILE,
            CollisionCategories.PLAYER_PROJECTILE_EXPLOSION
        ]);

        this.play(FleshblobAnimationKeys.UP_LEFT);
    }

    reset(): void {
        this.hitpoints = 50;
        this.world.remove(this.body);
    }

    update(_time: number, delta: number): void {
        this.depth = this.y + 6;
    }

    getDamage(value: number) {
        this.hitpoints -= value;

        if (this.hitpoints <= 0) {
            this.play(FleshblobAnimationKeys.DEATH_DOWN_RIGHT);
            this.setCollidesWith([]);

            setTimeout(() => {
                this.despawnCallback(this);
            }, 5000);
        }
    }
}