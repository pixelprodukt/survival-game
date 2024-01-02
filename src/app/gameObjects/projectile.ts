import { ProjectileConfiguration } from '../models/firearm-configuration';
import { CollisionCategory } from '../enums/collision-category';
import { Hitable } from '../models/hitable';
import { MetaConfiguration } from '../models/meta-configuration';

export class Projectile extends Phaser.Physics.Matter.Sprite {

    private speed!: number;
    private timeToLive!: number;
    private velocity!: Phaser.Math.Vector2;
    private _markForDestroy: boolean = false;
    private timeLived = 0;

    config!: ProjectileConfiguration;

    constructor(
        public readonly scene: Phaser.Scene,
        public x: number,
        public y: number,
        private readonly weaponSpritesheetKey: string
    ) {
        super(scene.matter.world, x, y, weaponSpritesheetKey, 2);
    }

    init(x: number, y: number, angle: number, config: ProjectileConfiguration): void {
        this.setTexture(this.weaponSpritesheetKey, 2);
        this.config = config;
        this.speed = config.speed;
        this.timeToLive = config.timeToLive;
        const bodies = this.scene.matter.bodies;
        const rect = bodies.rectangle(x, y, 4, 4, { isSensor: true, frictionAir: 0 });

        this.setExistingBody(rect);
        this.setName('projectile');
        this.angle = angle;

        // Collision Setup
        this.setCollisionCategory(CollisionCategory.PLAYER_PROJECTILE);
        this.setCollidesWith([CollisionCategory.RESOURCE_OBJECT, CollisionCategory.HITABLE]);

        const worldXY = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main) as Phaser.Math.Vector2;
        const vector = new Phaser.Math.Vector2(worldXY.x, worldXY.y).subtract(new Phaser.Math.Vector2(x, y)).normalize();
        this.velocity = new Phaser.Math.Vector2(vector).scale(this.speed);
        this.setVelocity(this.velocity.x, this.velocity.y);

        this.scene.anims.create({
            key: this.weaponSpritesheetKey + 'ExplosionAnim',
            frames: this.scene.anims.generateFrameNumbers(config.explosionConfig.spritesheetKey, { frames: config.explosionConfig.frames }),
            frameRate: 12,
            repeat: 0,
            hideOnComplete: true
        }) as Phaser.Animations.Animation;

        // Setup on Collide
        this.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {

            const gameObject = data.bodyA.gameObject as Phaser.GameObjects.GameObject;
            const meta: MetaConfiguration = gameObject.getData('meta');

            if (meta?.hitable) {
                this.spawnExplosion(data.bodyB.position.x, data.bodyB.position.y);
                this._markForDestroy = true;
            }
        });
    }

    reset(): void {    
        // this.speed = 2;
        // this.timeToLive = 0;
        this._markForDestroy = false;
        this.timeLived = 0;
        this.angle = 0;
        // this.velocity = new Phaser.Math.Vector2();
        this.setVelocity(0, 0);
        this.world.remove(this.body);
    }

    update(delta: number): void {
        this.timeLived += delta;
        if (this.timeLived >= this.timeToLive) {
            this.spawnExplosion(this.x, this.y);
            this._markForDestroy = true;
        }
    }

    private spawnExplosion(x: number, y: number): void {
        const bodies = this.scene.matter.bodies;
                const circle = bodies.circle(x, y, this.config.explosionConfig.size, { isSensor: true });
                const explosion = this.scene.matter.add.sprite(x, y, this.config.explosionConfig.spritesheetKey, 0);
                explosion.setExistingBody(circle);
                explosion.depth = y + 2;

                // Collision Setup
                explosion.setCollisionCategory(CollisionCategory.PLAYER_PROJECTILE_EXPLOSION)
                explosion.setCollidesWith([CollisionCategory.HITABLE]);

                explosion.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
                    const gameObject = data.bodyA.gameObject as Phaser.GameObjects.GameObject;
                    const meta: MetaConfiguration = gameObject.getData('meta');
                    const hitable = meta.parent as Hitable;
                    hitable.getDamage(this.config.explosionConfig.damage);
                });

                explosion.play(this.weaponSpritesheetKey + 'ExplosionAnim').once('animationcomplete', () => {
                    explosion.destroy();
                });
    }

    get markForDestroy(): boolean {
        return this._markForDestroy;
    }
}