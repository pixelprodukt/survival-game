import { Vector } from 'matter';
import { ProjectileConfig } from './firearm-config';
import { CollisionCategories } from './configuration/collision-categories';
import { Tree } from './tree';
import { Mineable } from './mineable';
import { Hitable } from './hitable';
import { MetaConfig } from './meta-config';

export class Projectile {

    private speed!: number;
    private timeToLive: number;
    private sprite!: Phaser.Physics.Matter.Sprite;
    private velocity!: Phaser.Math.Vector2;
    private _markForDestroy: boolean = false;
    private timeLived = 0;

    constructor(
        private readonly scene: Phaser.Scene,
        private readonly weaponSpritesheetKey: string,
        private readonly spawn: Vector,
        private readonly angle: number,
        private readonly config: ProjectileConfig
    ) {

        this.speed = config.speed || 2;
        this.timeToLive = config.timeToLive || 300;

        this.scene.anims.create({
            key: weaponSpritesheetKey + 'ExplosionAnim',
            frames: this.scene.anims.generateFrameNumbers(config.explosionConfig.spritesheetKey, { frames: config.explosionConfig.frames }),
            frameRate: 12,
            repeat: 0,
            hideOnComplete: true
        }) as Phaser.Animations.Animation;

        const radians = this.degreesToRadians(angle);
        const distanceToCenter = config.distanceToCenter;

        const spawnAroundWeaponX = (Math.cos(radians) * distanceToCenter) + spawn.x;
        const spawnAroundWeaponY = (Math.sin(radians) * distanceToCenter) + spawn.y;

        const spawnPointAroundWeapon = new Phaser.Math.Vector2(spawnAroundWeaponX, spawnAroundWeaponY);

        const bodies = this.scene.matter.bodies;
        const rect = bodies.rectangle(spawnPointAroundWeapon.x, spawnPointAroundWeapon.y, 4, 4, { isSensor: true });

        this.sprite = this.scene.matter.add.sprite(spawnPointAroundWeapon.x, spawnPointAroundWeapon.y, this.weaponSpritesheetKey, 2);
        this.sprite.setExistingBody(rect);
        this.sprite.setName('projectile');
        this.sprite.angle = angle;

        // Collision Setup
        this.sprite.setCollisionCategory(CollisionCategories.PLAYER_PROJECTILE)
        this.sprite.setCollidesWith([CollisionCategories.RESOURCE_OBJECT, CollisionCategories.HITABLE]);

        this.sprite.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
            
            const gameObject = data.bodyA.gameObject as Phaser.GameObjects.GameObject;
            const meta: MetaConfig = gameObject.getData('meta');

            // console.log(meta);

            if (meta.hitable) {
                const bodies = this.scene.matter.bodies;
                const circle = bodies.circle(data.bodyB.position.x, data.bodyB.position.y, config.explosionConfig.size, { isSensor: true });
                const explosion = this.scene.matter.add.sprite(data.bodyB.position.x, data.bodyB.position.y, config.explosionConfig.spritesheetKey, 0);
                explosion.setExistingBody(circle);
                explosion.depth = data.bodyB.position.y + 2;

                // Collision Setup
                explosion.setCollisionCategory(CollisionCategories.PLAYER_PROJECTILE_EXPLOSION)
                explosion.setCollidesWith([CollisionCategories.HITABLE]);

                explosion.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
                    const gameObject = data.bodyA.gameObject as Phaser.GameObjects.GameObject;
                    const meta: MetaConfig = gameObject.getData('meta');
                    const hitable = meta.parent as Hitable;
                    console.log(meta);
                    hitable.getDamage(config.explosionConfig.damage);
                });

                explosion.play(weaponSpritesheetKey + 'ExplosionAnim').once('animationcomplete', () => {
                    explosion.destroy();
                });

                const bulletGameObject = data.bodyB.gameObject as Phaser.GameObjects.GameObject;
                this._markForDestroy = true;
            }
        });

        const worldXY = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main) as Phaser.Math.Vector2;
        const vector = new Phaser.Math.Vector2(worldXY.x, worldXY.y).subtract(new Phaser.Math.Vector2(spawn.x, spawn.y)).normalize();
        this.velocity = new Phaser.Math.Vector2(vector).scale(this.speed);
    }

    update(delta: number): void {
        this.timeLived += delta;
        this.sprite.setVelocity(this.velocity.x, this.velocity.y);
        if (this.timeLived >= this.timeToLive) {
            this.scene.add.sprite(this.sprite.x, this.sprite.y, this.config.explosionConfig.spritesheetKey, 0)
                .play(this.weaponSpritesheetKey + 'ExplosionAnim')
                .depth = this.sprite.y + 2;
            this._markForDestroy = true;
        }
    }

    destroy(): void {
        this.sprite.destroy();
    }

    private degreesToRadians(degrees: number): number {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }

    get markForDestroy(): boolean {
        return this._markForDestroy;
    }
}