import { CollisionCategory } from '../enums/collision-category';
import { getRandomInt, PLAYER_FRAMERATE } from '../configuration/constants';
import { RIFLE_CONFIG } from '../configuration/firearm-configurations';
import { Direction } from '../enums/direction';
import { EquippableItem } from './equippable-item';
import { Firearm } from './firearm';
import { Pickaxe } from './pickaxe';
import { EmptyHands } from './empty-hands';
import { PlayerAnimation } from '../enums/player-animation';

import { InventoryItem } from '../models/inventory-item';

interface Animations {
    idleDownRight: Phaser.Animations.Animation;
    idleDownLeft: Phaser.Animations.Animation;
    idleUpRight: Phaser.Animations.Animation;
    idleUpLeft: Phaser.Animations.Animation;
    walkDownRight: Phaser.Animations.Animation;
    walkDownLeft: Phaser.Animations.Animation;
    walUpRight: Phaser.Animations.Animation;
    walkUpLeft: Phaser.Animations.Animation;
}

export class Player {

    public static readonly SPEED = 1.0;

    private readonly playerSprite!: Phaser.Physics.Matter.Sprite;
    private _direction = Direction.DOWN_RIGHT;
    private animations!: Animations;
    private stepSoundInterval: number = 0;
    private walkSounds!: Phaser.Sound.BaseSound[];

    private readonly pickaxe!: Pickaxe;
    private readonly rifle!: Firearm;

    public equippedItem: EquippableItem | null = null;

    constructor(public scene: Phaser.Scene) {
        const bodies = this.scene.matter.bodies;
        const rect = bodies.rectangle(0, 0, 8, 4);
        const circle = bodies.circle(0, 0, 18, { isSensor: true, label: 'playerSensor' });
        const compoundBody = this.scene.matter.body.create({
            parts: [rect, circle],
            inertia: Infinity,
            frictionAir: 0.2,
            mass: 10
        });

        this.playerSprite = this.scene.matter.add.sprite(0, 0, 'nadia', 3);

        /*this.playerSprite.setPipeline(OutlinePipeline.KEY);
        this.playerSprite.pipeline.set2f(
            "uTextureSize",
            this.playerSprite.texture.getSourceImage().width,
            this.playerSprite.texture.getSourceImage().height
        );*/

        this.playerSprite.setExistingBody(compoundBody);
        this.playerSprite.setName('player');
        this.playerSprite.setOrigin(0.5, 0.9);

        // Collision Setup
        this.playerSprite.setCollisionCategory(CollisionCategory.PLAYER);
        this.playerSprite.setCollidesWith([CollisionCategory.RESOURCE_OBJECT, CollisionCategory.ITEM_DROP]);

        this.initAnimations();
        this.walkSounds = [this.scene.sound.add('step01'), this.scene.sound.add('step02'), this.scene.sound.add('step03')];

        this.pickaxe = new Pickaxe(this.scene);
        this.pickaxe.setVisible(false);
        this.rifle = new Firearm(this.scene, RIFLE_CONFIG);
        this.rifle.setVisible(false);

        // this.equipItem('rifle');
        // this.equippedItem = this.pickaxe;
        // this.equippedItem = this.rifle;

        // this.equippedItem = new EmptyHands(this.scene, this);

        circle.onCollideCallback = (data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
            const gameObject = data.bodyB.gameObject as Phaser.GameObjects.GameObject;
            const metaData = gameObject?.data.get('meta');

            if (metaData?.mineable) {
                metaData.parent.isActiveForPointer = true;
            }
        };

        circle.onCollideEndCallback = (data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
            const gameObject = data.bodyB.gameObject as Phaser.GameObjects.GameObject;
            const metaData = gameObject?.data.get('meta');

            if (metaData?.mineable) {
                metaData.parent.isActiveForPointer = false;
            }
        };
    }

    useEquippedItem(): void {
        if (this.equippedItem) {
            this.equippedItem.use(this);
        }
    }

    equipItem(item: EquippableItem | null): void {
        this.equippedItem && this.equippedItem!.setVisible(false);
        item && item.setVisible(true);
        this.equippedItem = item;
    }

    update(_time: number, delta: number): void {

        const mouseX = this.scene.input.mousePointer.x + this.scene.cameras.main.scrollX;
        const mouseY = this.scene.input.mousePointer.y + this.scene.cameras.main.scrollY;
        const playerX = this.playerSprite.x;
        const playerY = this.playerSprite.y - 24;

        if (mouseX < playerX && mouseY < playerY) {
            this._direction = Direction.UP_LEFT;
        }
        if (mouseX < playerX && mouseY > playerY) {
            this._direction = Direction.DOWN_LEFT;
        }
        if (mouseX > playerX && mouseY < playerY) {
            this._direction = Direction.UP_RIGHT;
        }
        if (mouseX > playerX && mouseY > playerY) {
            this._direction = Direction.DOWN_RIGHT;
        }

        if (!this.isMoving) {
            switch (this._direction) {
                case Direction.DOWN_LEFT:
                    this.sprite.play(PlayerAnimation.IDLE_DOWN_LEFT, true);
                    break;
                case Direction.DOWN_RIGHT:
                    this.sprite.play(PlayerAnimation.IDLE_DOWN_RIGHT, true);
                    break;
                case Direction.UP_LEFT:
                    this.sprite.play(PlayerAnimation.IDLE_UP_LEFT, true);
                    break;
                case Direction.UP_RIGHT:
                    this.sprite.play(PlayerAnimation.IDLE_UP_RIGHT, true);
                    break;
            }
        } else {
            switch (this._direction) {
                case Direction.DOWN_LEFT:
                    this.sprite.play({
                        key: PlayerAnimation.WALK_DOWN_LEFT,
                        startFrame: this.playerSprite.anims.currentFrame.index - 1
                    }, true);
                    break;
                case Direction.DOWN_RIGHT:
                    this.sprite.play({
                        key: PlayerAnimation.WALK_DOWN_RIGHT,
                        startFrame: this.playerSprite.anims.currentFrame.index - 1
                    }, true);
                    break;
                case Direction.UP_LEFT:
                    this.sprite.play({
                        key: PlayerAnimation.WALK_UP_LEFT,
                        startFrame: this.playerSprite.anims.currentFrame.index - 1
                    }, true);
                    break;
                case Direction.UP_RIGHT:
                    this.sprite.play({
                        key: PlayerAnimation.WALK_UP_RIGHT,
                        startFrame: this.playerSprite.anims.currentFrame.index - 1
                    }, true);
                    break;
            }
            this.playRandomWalkSound(delta);
        }

        if (this.equippedItem) {
            this.equippedItem.update(this, delta);
        }
        this.sprite.depth = this.sprite.y;
    }

    setPosition(x: number, y: number): void {
        this.playerSprite.setPosition(x, y);
    }

    setVelocity(x: number, y: number): void {
        this.playerSprite.setVelocity(x, y);
    }

    private initAnimations(): void {
        this.animations = {
            idleDownRight: this.scene.anims.create({
                key: PlayerAnimation.IDLE_DOWN_RIGHT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [0] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            idleDownLeft: this.scene.anims.create({
                key: PlayerAnimation.IDLE_DOWN_LEFT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [5] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            idleUpRight: this.scene.anims.create({
                key: PlayerAnimation.IDLE_UP_RIGHT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [10] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            idleUpLeft: this.scene.anims.create({
                key: PlayerAnimation.IDLE_UP_LEFT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [15] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            walkDownRight: this.scene.anims.create({
                key: PlayerAnimation.WALK_DOWN_RIGHT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [1, 2, 3, 4] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            walkDownLeft: this.scene.anims.create({
                key: PlayerAnimation.WALK_DOWN_LEFT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [6, 7, 8, 9] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            walUpRight: this.scene.anims.create({
                key: PlayerAnimation.WALK_UP_RIGHT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [11, 12, 13, 14] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            walkUpLeft: this.scene.anims.create({
                key: PlayerAnimation.WALK_UP_LEFT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [16, 17, 18, 19] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation
        };
    }

    private playRandomWalkSound(delta: number): void {
        if (this.stepSoundInterval == 0) {
            this.walkSounds[getRandomInt(this.walkSounds.length)].play();
        }
        if (this.stepSoundInterval < 350) {
            this.stepSoundInterval += delta;
        } else {
            this.stepSoundInterval = 0;
        }
    }

    get sprite(): Phaser.Physics.Matter.Sprite {
        return this.playerSprite;
    }

    get isMoving(): boolean {
        return this.playerSprite.body.velocity.x !== 0 || this.playerSprite.body.velocity.y !== 0;
    }

    get direction(): Direction {
        return this._direction;
    }

    get isFacingLeft(): boolean {
        return this._direction === Direction.DOWN_LEFT || this._direction === Direction.UP_LEFT;
    }

    get isFacingRight(): boolean {
        return this._direction === Direction.DOWN_RIGHT || this._direction === Direction.UP_RIGHT;
    }

    get x(): number {
        return this.playerSprite.x;
    }

    get y(): number {
        return this.playerSprite.y;
    }
}