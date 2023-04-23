import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin';
import { CollisionCategories } from './configuration/collision-categories';
import { Hitable } from './hitable';
import { MineableConfig } from './mineable-config';
import { MetaConfig } from './meta-config';
import { ItemDrop } from './item-drop';

export class Mineable extends Hitable {

    private image!: Phaser.Physics.Matter.Image;
    private hitSounds: Phaser.Sound.BaseSound[] = [];
    private plopSound!: Phaser.Sound.BaseSound;
    private particleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
    private lootDropKeys!: string[];

    public isActiveForPointer = false;
    public isSelectedByPointer = false;

    constructor(
        protected readonly scene: Phaser.Scene,
        protected readonly config: MineableConfig,
        x?: number,
        y?: number
    ) {
        super(config.hitpoints);

        // Image
        this.image = this.scene.matter.add.image(x || 0, y || 0, config.imageKey);
        this.image.setName('mineable');
        this.image.setBody({
            type: 'rectangle',
            width: config.body.width,
            height: config.body.height
        }, { isStatic: true });
        this.image.setOrigin(config.origin.x, config.origin.y);
        this.image.depth = y || 0;
        this.lootDropKeys = config.lootDropKeys || [];

        const metaConfig: MetaConfig = {
            key: config.imageKey,
            type: 'mineable',
            parent: this,
            mineable: true,
            hitable: true
        };
        this.image.setData('meta', metaConfig);

        // Collision
        this.image.setCollisionCategory(CollisionCategories.RESOURCE_OBJECT)
        this.image.setCollidesWith([
            CollisionCategories.PLAYER,
            CollisionCategories.PLAYER_PROJECTILE,
            CollisionCategories.PLAYER_PROJECTILE_EXPLOSION
        ]);

        //Sounds
        config.hitSoundKeys.forEach((key: string) => {
            this.hitSounds.push(this.scene.sound.add(key));
        });
        this.plopSound = this.scene.sound.add('plop01');

        // OutlinePipelinePlugin
        const postFxPlugin = this.scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;
        const polygon = new Phaser.Geom.Polygon(config.pointerAreaVertices);

        this.image.setInteractive(polygon, Phaser.Geom.Polygon.Contains)
            .on('pointerover', () => {
                if (this.isActiveForPointer) {
                    postFxPlugin.add(this.image, {
                        thickness: 3,
                        outlineColor: 0xcfc6b8
                    });
                }
                this.isSelectedByPointer = true;
            })
            .on('pointerout', (pointer: any, gameObject: any) => {
                postFxPlugin.remove(this.image);
                this.isSelectedByPointer = false;
            });

        // render polygon
        // WARNING!!! -> the polygon has to be created with a different coordinate system than the position of the object
        // because phaser just wants to drive me mad!!!

        /* const graphics = this.scene.add.graphics({ x: 0, y: 0, lineStyle: { width: 0.25, color: 0xaa00aa } });
        const [firstCorner, ...otherCorners] = polygon.points;

        graphics.beginPath();
        graphics.moveTo(this.image.x + firstCorner.x - (this.image.width / 2), this.image.y + firstCorner.y - (this.image.height / 2));

        otherCorners.forEach(({ x, y }: any) => graphics.lineTo(this.image.x + x - (this.image.width / 2), this.image.y + y - (this.image.height / 2)));

        graphics.lineTo(this.image.x + firstCorner.x - (this.image.width / 2), this.image.y + firstCorner.y - (this.image.height / 2));
        graphics.closePath();
        graphics.strokePath(); */

        // Particle Emitter
        this.particleEmitter = this.scene.add.particles('whiteParticle').createEmitter({
            x: x,
            y: y,
            speed: 50,
            scale: { start: 1, end: 0.5 },
            alpha: { start: 1, end: 0 },
            blendMode: 'NORMAL',
            lifespan: 200,
            gravityY: 0,
        })
            .stop();
    }

    getDamage(value: number): void {
        this.hitpoints -= value;
        this.playRandomHitSound();

        if (this.hitpoints <= 0) {
            this.particleEmitter.explode(50, this.image.x, this.image.y);
            this.dropLoot();
            this.plopSound.play({ volume: 0.5 });
            this.image.destroy();
        } else {
            this.image.setTintFill(0xffffff);
            setTimeout(() => {
                this.image.clearTint();
            }, 30);
    
            this.scene.add.tween({
                targets: this.image,
                props: {
                    scale: 1.2
                },
                ease: 'Back.easeIn',
                duration: 70,
                yoyo: true,
                repeat: 0,
                onComplete: () => {
                    /* if (this.hitpoints <= 0) {
                        this.particleEmitter.explode(50, this.image.x, this.image.y);
                        this.dropLoot();
                        this.plopSound.play({ volume: 0.5 });
                        this.image.destroy();
                    } */
                }
            });
        }
    }

    private dropLoot(): void {
        this.lootDropKeys.forEach((key: string) => {
            /* new ItemDrop(this.scene, key, this.image.x, this.image.y);
            new ItemDrop(this.scene, key, this.image.x, this.image.y);
            new ItemDrop(this.scene, key, this.image.x, this.image.y);
            new ItemDrop(this.scene, key, this.image.x, this.image.y); */
        });
    }

    private playRandomHitSound(): void {
        this.hitSounds[this.getRandomInt(this.hitSounds.length)].play({ volume: 0.5 });
    }

    private getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }
}