import { getOverworldScene } from "./configuration/constants";
import { EquippableItem } from './equippable-item';
import { FirearmConfig } from './firearm-config';
import { Player } from './player';
import { ProjectilePool } from './pools/projectile-pool';
import { Projectile } from './projectile';

export class Firearm extends EquippableItem {

    private mouseTarget: number = 180;
    private muzzleSprite!: Phaser.GameObjects.Sprite;
    private activeBullets: Projectile[] = [];
    private readonly spriteKey: string;
    private readonly fireRate: number;

    private projectilePool!: ProjectilePool;

    constructor(public readonly scene: Phaser.Scene, protected readonly parent: Player, protected readonly config: FirearmConfig) {
        super(scene, parent, config);

        this.projectilePool = getOverworldScene(scene).projectilePool;

        this.fireRate = config.fireRate || 300; // default
        this.spriteKey = config.spriteKey;

        this.scene.input.on('pointermove', (pointer: any) => {
            this.mouseTarget = this.radiansToDegrees(
                Math.atan2(
                    pointer.worldY - this.y,
                    pointer.worldX - this.x
                )
            );
        });

        this.muzzleSprite = this.scene.add.sprite(0, 0, this.spriteKey, 3);
        this.muzzleSprite.setOrigin(config.muzzleOffset.x, config.muzzleOffset.y);

        this.scene.anims.create({
            key: this.spriteKey + 'MuzzleAnim',
            frames: this.scene.anims.generateFrameNumbers(this.spriteKey, { frames: config.muzzleFrames }),
            frameRate: 24,
            repeat: 0,
            showOnStart: true,
            hideOnComplete: true
        }) as Phaser.Animations.Animation;
    }

    override use(): void {
        if (this.canUse) {
            this.canUse = false;
            this.muzzleSprite.play(this.spriteKey + 'MuzzleAnim').depth = this.parent.y + 1;
            this.spawnProjectile(this.x, this.y);
            this.useSound.play({ volume: 0.6 });
            setTimeout(() => { this.canUse = true; }, this.fireRate);
        }
    }

    override update(delta: number): void {
        super.update(delta);
        this.sprite.angle = this.mouseTarget;
        this.muzzleSprite.x = this.x;
        this.muzzleSprite.y = this.y;
        this.muzzleSprite.angle = this.sprite.angle;

        // TODO: Refactor! This will probably eat performance en mass
        // Actually it seems ok. But mark for later refactor maybe
        this.activeBullets.forEach((bullet: Projectile) => {
            bullet.update(delta);
        });

        const copy = [...this.activeBullets];
        copy.forEach((bullet: Projectile) => {
            if (bullet.markForDestroy) {
                const index = this.activeBullets.indexOf(bullet);
                this.activeBullets.splice(index, 1);
                this.projectilePool.despawn(bullet);
            }
        });
    }

    private spawnProjectile(x: number, y: number): void {
        const radians = this.degreesToRadians(this.sprite.angle);
        const distanceToCenter = this.config.projectileConfig.distanceToCenter;
        const spawnAroundWeaponX = (Math.cos(radians) * distanceToCenter) + x;
        const spawnAroundWeaponY = (Math.sin(radians) * distanceToCenter) + y;

        this.activeBullets.push(
            this.projectilePool.spawn(
                spawnAroundWeaponX,
                spawnAroundWeaponY,
                this.config.spriteKey,
                this.sprite.angle,
                this.config.projectileConfig
            )
        );
    }

    private degreesToRadians(degrees: number): number {
        const pi = Math.PI;
        return degrees * (pi / 180);
    }

    private radiansToDegrees(radians: number): number {
        const pi = Math.PI;
        return radians * (180 / pi);
    }
}