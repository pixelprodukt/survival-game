import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin';
import { CollisionCategories } from './configuration/collision-categories';
import { Hitable } from './hitable';
import { MineableConfig } from './mineable-config';
import { MetaConfig } from './meta-config';
import { getOverworldScene, getRandomInt } from "./configuration/constants";

export class Mineable extends Phaser.Physics.Matter.Image implements Hitable {

    private hitpoints!: number;
    private hitSounds: Phaser.Sound.BaseSound[] = [];
    private plopSound!: Phaser.Sound.BaseSound;
    private particleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
    private lootDropKeys!: string[];
    private config!: MineableConfig;
    private despawnCallback!: Function;

    public isActiveForPointer = false;
    public isSelectedByPointer = false;

    constructor(
        public scene: Phaser.Scene,
        public x: number,
        public y: number,
        public imageKey: string
    ) {
        super(scene.matter.world, x, y, imageKey);
    }

    init(x: number, y: number, config: MineableConfig, despawnCallback: Function): void {
        this.config = config;
        this.hitpoints = config.hitpoints;
        this.despawnCallback = despawnCallback;

        // Image
        // this.setName('mineable');
        this.setBody({
            type: 'rectangle',
            width: this.config.body.width,
            height: this.config.body.height
        }, { isStatic: true });
        this.setOrigin(this.config.origin.x, this.config.origin.y);
        this.depth = this.y || 0;
        this.lootDropKeys = this.config.lootDropKeys || [];

        const metaConfig: MetaConfig = {
            key: this.config.imageKey,
            type: 'mineable',
            parent: this,
            mineable: true,
            hitable: true
        };
        this.setData('meta', metaConfig);

        // Collision
        this.setCollisionCategory(CollisionCategories.RESOURCE_OBJECT)
        this.setCollidesWith([
            CollisionCategories.PLAYER,
            CollisionCategories.PLAYER_PROJECTILE,
            CollisionCategories.PLAYER_PROJECTILE_EXPLOSION
        ]);

        //Sounds
        this.config.hitSoundKeys.forEach((key: string) => {
            this.hitSounds.push(this.scene.sound.add(key));
        });
        this.plopSound = this.scene.sound.add('plop01');

        // OutlinePipelinePlugin
        const postFxPlugin = this.scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;
        const polygon = new Phaser.Geom.Polygon(this.config.pointerAreaVertices);

        this.setInteractive(polygon, Phaser.Geom.Polygon.Contains)
            .on('pointerover', () => {
                if (this.isActiveForPointer) {
                    postFxPlugin.add(this, {
                        thickness: 3,
                        outlineColor: 0xcfc6b8
                    });
                }
                this.isSelectedByPointer = true;
            })
            .on('pointerout', (pointer: any, gameObject: any) => {
                postFxPlugin.remove(this);
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
            x: this.x,
            y: this.y,
            speed: 50,
            scale: { start: 1, end: 0.5 },
            alpha: { start: 1, end: 0 },
            blendMode: 'NORMAL',
            lifespan: 200,
            gravityY: 0,
        }).stop();

        //this.particleEmitter.deathCallback = this.particleEmitter.remove;
    }

    reset(): void {
        this.hitpoints = 1;
        // this.particleEmitter.remove();
        this.removeAllListeners();
        this.removeInteractive();
        this.world.remove(this.body);
    }

    getDamage(value: number): void {
        this.hitpoints -= value;
        this.playRandomHitSound();

        if (this.hitpoints <= 0) {
            this.particleEmitter.explode(50, this.x, this.y);
            this.dropLoot();
            this.plopSound.play({ volume: 0.5 });
            this.despawnCallback(this);
        } else {
            this.setTintFill(0xffffff);
            setTimeout(() => {
                this.clearTint();
            }, 30);

            this.scene.add.tween({
                targets: this,
                props: {
                    scale: 1.2
                },
                ease: 'Back.easeIn',
                duration: 70,
                yoyo: true,
                repeat: 0
            });
        }
    }

    private dropLoot(): void {
        this.lootDropKeys.forEach((key: string) => {
            this.spawnDrop(this.x, this.y, key);
            this.spawnDrop(this.x, this.y, key);
            this.spawnDrop(this.x, this.y, key);
            this.spawnDrop(this.x, this.y, key);
        });
    }

    private spawnDrop(x: number, y: number, key: string): void {
        getOverworldScene(this.scene).itemDropPool.spawn(this.x, this.y, key);
    }
    private playRandomHitSound(): void {
        this.hitSounds[getRandomInt(this.hitSounds.length)].play({ volume: 0.5 });
    }
}