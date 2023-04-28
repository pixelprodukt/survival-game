import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin';
import { CollisionCategories } from './configuration/collision-categories';
import {getRandomInt} from "./configuration/constants";

export class Tree {

    private hitpoints = 30;
    private image!: Phaser.Physics.Matter.Image;
    private hitSounds!: Phaser.Sound.BaseSound[];
    private plopSound!: Phaser.Sound.BaseSound;
    private particleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

    public isActiveForPointer = false;
    public isSelectedByPointer = false;

    constructor(
        public readonly scene: Phaser.Scene,
        x: number,
        y: number
    ) {
        this.image = this.scene.matter.add.image(x, y, 'tree01');
        this.image.setName('tree');
        this.image.setBody({
            type: 'rectangle',
            width: 10,
            height: 6
        }, { isStatic: true });
        this.image.setOrigin(0.5, 0.85);
        this.image.depth = y;
        this.image.setData('tree', this);

        //Sounds
        this.hitSounds = [
            this.scene.sound.add('woodchop01'), 
            this.scene.sound.add('woodchop02'), 
            this.scene.sound.add('woodchop03'),
            this.scene.sound.add('woodchop04'),
            this.scene.sound.add('woodchop05'),
            this.scene.sound.add('woodchop06'),
        ];

        this.plopSound = this.scene.sound.add('plop01');

        // Collision Setup
        this.image.setCollisionCategory(CollisionCategories.RESOURCE_OBJECT)
        this.image.setCollidesWith([CollisionCategories.PLAYER, CollisionCategories.PLAYER_PROJECTILE, CollisionCategories.PLAYER_PROJECTILE_EXPLOSION]);

        // OutlinePipelinePlugin
        const postFxPlugin = this.scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;

        const polygon = new Phaser.Geom.Polygon([
            5, 29,
            5, 24,
            0, 21,
            7, 3,
            9, 3,
            16, 21,
            11, 24,
            11, 29
        ]);

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

        this.particleEmitter = this.scene.add.particles('whiteParticle').createEmitter({
            x: 400,
            y: 300,
            speed: 50,
            scale: { start: 1, end: 0.5 },
            alpha: {start: 1, end: 0 },
            blendMode: 'NORMAL',
            lifespan: 200,
            gravityY: 0,
        });

        // render polygon
        // WARNING!!! -> the polygon has to be created with a different coordinate system than the position of the object
        // because phaser just wants to drive me mad!!!

        /* const graphics = this.scene.add.graphics({ x: 0, y: 0, lineStyle: { width: 0.25, color: 0xaa00aa } });
        const [firstCorner, ...otherCorners] = polygon.points;

        graphics.beginPath();
        graphics.moveTo(firstCorner.x - (tree.width / 2), firstCorner.y - (tree.height / 2));

        otherCorners.forEach(({ x, y }: any) => graphics.lineTo(x - (tree.width / 2), y - (tree.height / 2)));

        graphics.lineTo(firstCorner.x - (tree.width / 2), firstCorner.y - (tree.height / 2));
        graphics.closePath();
        graphics.strokePath(); */
    }

    getDamage(damage: number): void {
        this.hitpoints -= damage;

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
                if (this.hitpoints <= 0) {
                    this.particleEmitter.explode(50, this.image.x, this.image.y);
                    this.plopSound.play({ volume: 0.5 });
                    this.image.destroy();
                }
            }
        });

        this.playRandomHitSound();
    }

    private playRandomHitSound(): void {
        this.hitSounds[getRandomInt(this.hitSounds.length)].play();
    }
}