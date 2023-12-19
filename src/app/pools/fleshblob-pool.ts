import {Fleshblob, FleshblobAnimationKeys} from "../fleshblob";

export class FleshblobPool extends Phaser.GameObjects.Group {

    constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {}) {
        const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
            classType: Fleshblob,
            maxSize: -1
        }
        super(scene, Object.assign(defaults, config));
        this.initAnimations();
    }

    spawn(x = 0, y = 0): void {
        const spawnExisting = this.countActive(false) > 0;
        const fleshblob = super.get(x, y, 'fleshblob') as Fleshblob;

        fleshblob.init(this.despawn);

        if (spawnExisting) {
            fleshblob.setActive(true);
            fleshblob.setVisible(true);
        }
    }

    despawn(fleshblob: Fleshblob): void {
        fleshblob.reset();
        fleshblob.setActive(false);
        fleshblob.setVisible(false);
    }

    private initAnimations(): void {

        // Idle / Move
        this.scene.anims.create({
            key: FleshblobAnimationKeys.DOWN_RIGHT,
            frames: this.scene.anims.generateFrameNumbers('fleshblob', { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1
        });
        this.scene.anims.create({
            key: FleshblobAnimationKeys.DOWN_LEFT,
            frames: this.scene.anims.generateFrameNumbers('fleshblob', { frames: [5, 6] }),
            frameRate: 2,
            repeat: -1
        });
        this.scene.anims.create({
            key: FleshblobAnimationKeys.UP_RIGHT,
            frames: this.scene.anims.generateFrameNumbers('fleshblob', { frames: [10, 11] }),
            frameRate: 2,
            repeat: -1
        });
        this.scene.anims.create({
            key: FleshblobAnimationKeys.UP_LEFT,
            frames: this.scene.anims.generateFrameNumbers('fleshblob', { frames: [15, 16] }),
            frameRate: 2,
            repeat: -1
        });

        // Death
        this.scene.anims.create({
            key: FleshblobAnimationKeys.DEATH_DOWN_RIGHT,
            frames: this.scene.anims.generateFrameNumbers('fleshblob', { frames: [2, 3, 4] }),
            frameRate: 4,
            repeat: 0
        });
        this.scene.anims.create({
            key: FleshblobAnimationKeys.DEATH_DOWN_LEFT,
            frames: this.scene.anims.generateFrameNumbers('fleshblob', { frames: [7, 8, 9] }),
            frameRate: 4,
            repeat: 0
        });
        this.scene.anims.create({
            key: FleshblobAnimationKeys.DEATH_UP_RIGHT,
            frames: this.scene.anims.generateFrameNumbers('fleshblob', { frames: [12, 13, 14] }),
            frameRate: 4,
            repeat: 0
        });
        this.scene.anims.create({
            key: FleshblobAnimationKeys.DEATH_UP_LEFT,
            frames: this.scene.anims.generateFrameNumbers('fleshblob', { frames: [17, 18, 19] }),
            frameRate: 4,
            repeat: 0
        });
    }
}