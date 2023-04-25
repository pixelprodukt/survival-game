import { PLAYER_FRAMERATE } from './configuration/constants';
import { Direction } from './direction';
import { EquippableItem } from './equippable-item';
import { Pickaxe } from './pickaxe';
import { Firearm } from './firearm';
import { Tree } from './tree';
import { RIFLE_CONFIG, ROCKETLAUNCHER_CONFIG } from './configuration/firearm-configurations';
import { CollisionCategories } from './configuration/collision-categories';

enum PlayerAnimationKeys {
    WALK_DOWN_LEFT = 'playerWalkDownLeft',
    WALK_DOWN_RIGHT = 'playerWalkDownRight',
    WALK_UP_LEFT = 'playerWalkUpLeft',
    WALK_UP_RIGHT = 'playerWalkUpRight',
    IDLE_DOWN_LEFT = 'playerIdleDownLeft',
    IDLE_DOWN_RIGHT = 'playerIdleDownRight',
    IDLE_UP_LEFT = 'playerIdleUpLeft',
    IDLE_UP_RIGHT = 'playerIdleUpRight'
};

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

    public static readonly SPEED = 0.5;

    private playerSprite!: Phaser.Physics.Matter.Sprite;
    private _direction = Direction.DOWN_RIGHT;
    private animations!: Animations;
    private stepSoundInterval: number = 0;
    private walkSounds!: Phaser.Sound.BaseSound[];

    private pickaxe!: Pickaxe;
    private rifle!: Firearm;

    public equippedItem!: EquippableItem;

    constructor(public scene: Phaser.Scene) {
        const bodies = this.scene.matter.bodies;
        const rect = bodies.rectangle(0, 0, 8, 4);
        const circle = bodies.circle(0, 0, 18, { isSensor: true, label: 'playerSensor' });
        const compoundBody = this.scene.matter.body.create({ parts: [rect, circle], inertia: Infinity, frictionAir: 0.2, mass: 10 });

        this.playerSprite = this.scene.matter.add.sprite(0, 0, 'nadia', 3);
        
        this.playerSprite.setExistingBody(compoundBody);
        this.playerSprite.setName('player');
        this.playerSprite.setOrigin(0.5, 0.9);

        // Collision Setup
        this.playerSprite.setCollisionCategory(CollisionCategories.PLAYER)
        this.playerSprite.setCollidesWith([CollisionCategories.RESOURCE_OBJECT, CollisionCategories.ITEM_DROP]);

        this.initAnimations();
        this.walkSounds = [this.scene.sound.add('step01'), this.scene.sound.add('step02'), this.scene.sound.add('step03')];

        this.pickaxe = new Pickaxe(this.scene, this);
        // this.pickaxe.setVisible(false);
        this.rifle = new Firearm(this.scene, this, RIFLE_CONFIG);
        this.rifle.setVisible(false);

        this.equippedItem = this.pickaxe;
        // this.equippedItem = this.rifle;

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
        }
    }

    useEquippedItem(): void {
        this.equippedItem.use();
    }

    equipItem(name: string): void {
        if (name === 'rifle') {
            this.pickaxe.setVisible(false);
            this.rifle.setVisible(true);
            this.equippedItem = this.rifle;
        }
        if (name === 'pickaxe') {
            this.rifle.setVisible(false);
            this.pickaxe.setVisible(true);
            this.equippedItem = this.pickaxe;
        }
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
                    this.sprite.play(PlayerAnimationKeys.IDLE_DOWN_LEFT, true);
                    break;
                case Direction.DOWN_RIGHT:
                    this.sprite.play(PlayerAnimationKeys.IDLE_DOWN_RIGHT, true);
                    break;
                case Direction.UP_LEFT:
                    this.sprite.play(PlayerAnimationKeys.IDLE_UP_LEFT, true);
                    break;
                case Direction.UP_RIGHT:
                    this.sprite.play(PlayerAnimationKeys.IDLE_UP_RIGHT, true);
                    break;
            }
        } else {
            switch (this._direction) {
                case Direction.DOWN_LEFT:
                    this.sprite.play({ key: PlayerAnimationKeys.WALK_DOWN_LEFT, startFrame: this.playerSprite.anims.currentFrame.index - 1 }, true);
                    break;
                case Direction.DOWN_RIGHT:
                    this.sprite.play({ key: PlayerAnimationKeys.WALK_DOWN_RIGHT, startFrame: this.playerSprite.anims.currentFrame.index - 1 }, true);
                    break;
                case Direction.UP_LEFT:
                    this.sprite.play({ key: PlayerAnimationKeys.WALK_UP_LEFT, startFrame: this.playerSprite.anims.currentFrame.index - 1 }, true);
                    break;
                case Direction.UP_RIGHT:
                    this.sprite.play({ key: PlayerAnimationKeys.WALK_UP_RIGHT, startFrame: this.playerSprite.anims.currentFrame.index - 1 }, true);
                    break;
            }
            this.playRandomWalkSound(delta);
        }

        this.equippedItem.update(delta);
        this.sprite.depth = this.sprite.y
    }

    setPosition(x: number, y: number): void {
        this.playerSprite.setPosition(x, y);
    }

    setVelocityX(value: number): void {
        this.playerSprite.setVelocityX(value);
    }

    setVelocityY(value: number): void {
        this.playerSprite.setVelocityY(value);
    }

    setVelocity(x: number, y: number): void {
        this.playerSprite.setVelocity(x, y);
    }

    private initAnimations(): void {
        this.animations = {
            idleDownRight: this.scene.anims.create({
                key: PlayerAnimationKeys.IDLE_DOWN_RIGHT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [0] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            idleDownLeft: this.scene.anims.create({
                key: PlayerAnimationKeys.IDLE_DOWN_LEFT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [5] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            idleUpRight: this.scene.anims.create({
                key: PlayerAnimationKeys.IDLE_UP_RIGHT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [10] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            idleUpLeft: this.scene.anims.create({
                key: PlayerAnimationKeys.IDLE_UP_LEFT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [15] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            walkDownRight: this.scene.anims.create({
                key: PlayerAnimationKeys.WALK_DOWN_RIGHT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [1, 2, 3, 4] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            walkDownLeft: this.scene.anims.create({
                key: PlayerAnimationKeys.WALK_DOWN_LEFT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [6, 7, 8, 9] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            walUpRight: this.scene.anims.create({
                key: PlayerAnimationKeys.WALK_UP_RIGHT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [11, 12, 13, 14] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation,
            walkUpLeft: this.scene.anims.create({
                key: PlayerAnimationKeys.WALK_UP_LEFT,
                frames: this.scene.anims.generateFrameNumbers('nadia', { frames: [16, 17, 18, 19] }),
                frameRate: PLAYER_FRAMERATE,
                repeat: -1
            }) as Phaser.Animations.Animation
        };
    }

    private playRandomWalkSound(delta: number): void {
        if (this.stepSoundInterval == 0) {
            this.walkSounds[this.getRandomInt(this.walkSounds.length)].play();
        }
        if (this.stepSoundInterval < 350) {
            this.stepSoundInterval += delta
        } else {
            this.stepSoundInterval = 0;
        }
    }

    private getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
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