import { EquippableItem } from './equippable-item';
import { MetaConfig } from './meta-config';
import { Mineable } from './mineable';
import { Player } from './player';
import { Tree } from './tree';

export class Pickaxe extends EquippableItem {

    private collisionBody: MatterJS.BodyType | null = null;

    constructor(public readonly scene: Phaser.Scene, protected readonly parent: Player) {
        super(scene, parent, {
            spriteKey: 'pickaxe',
            useSoundKey: 'swing01',
            useSoundVolume: 0.5,
            facingLeftOffset: { x: -1, y: -5 },
            facingRightOffset: { x: 1, y: -5 },
            facingLeftOrigin: { x: 0.3, y: 0.7 },
            facingRightOrigin: { x: 0.7, y: 0.7 },
        });
    }

    override use(): void {

        if (this.canUse) {
            this.canUse = false;

            const timeline = this.scene.tweens.createTimeline({
                onComplete: (timeline: Phaser.Tweens.Timeline) => {
                    this.canUse = true;
                    timeline.destroy();
                    this.scene.matter.world.remove(this.collisionBody!);
                    this.collisionBody = null;
                }
            });

            if (this.parent.isFacingLeft) {
                /* timeline.add({
                    targets: this.sprite,
                    x: '+=4',
                    y: '-=2',
                    angle: 25,
                    ease: 'Power1',
                    duration: 100,
                    yoyo: true,
                    onComplete: () => { this.useSound.play(); }
                }); */
                timeline.add({
                    targets: this.sprite,
                    x: '-=4',
                    y: '+=2',
                    angle: -120,
                    ease: 'Sine.easeIn',
                    duration: 180,
                    yoyo: true,
                    onStart: () => {
                        this.useSound.play({ volume: 0.4 });
                    },
                    onYoyo: (tween: any) => {
                        if (!this.collisionBody) {
                            this.collisionBody = this.scene.matter.add.circle(this.x, this.y + 2, 12, { isSensor: true });
                            this.collisionBody.onCollideCallback = (data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
                                const gameObject = data.bodyA.gameObject as Phaser.GameObjects.GameObject;
                                const meta: MetaConfig = gameObject?.getData('meta');
                                if (meta?.mineable) {
                                    const mineable = meta.parent as Mineable;
                                    if (mineable.isSelectedByPointer) {
                                        mineable.getDamage(10);
                                    }
                                }
                            };
                        }
                    },
                    onUpdate: (tween: any) => {
                        // console.log('on update', tween);

                    }
                });
            }

            if (this.parent.isFacingRight) {
                /* timeline.add({
                    targets: this.sprite,
                    x: '-=4',
                    y: '-=2',
                    angle: -25,
                    ease: 'Power1',
                    duration: 100,
                    yoyo: true,
                    onComplete: () => { this.useSound.play(); }
                }); */
                timeline.add({
                    targets: this.sprite,
                    x: '+=4',
                    y: '+=2',
                    angle: 120,
                    ease: 'Sine.easeIn',
                    duration: 180,
                    yoyo: true,
                    onStart: () => {
                        this.useSound.play({ volume: 0.4 });
                    },
                    onYoyo: (tween: any) => {
                        if (!this.collisionBody) {
                            this.collisionBody = this.scene.matter.add.circle(this.x, this.y + 2, 12, { isSensor: true });
                            this.collisionBody.onCollideCallback = (data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
                                const gameObject = data.bodyA.gameObject as Phaser.GameObjects.GameObject;
                                const meta: MetaConfig = gameObject?.getData('meta');
                                if (meta?.mineable) {
                                    const mineable = meta.parent as Mineable;
                                    if (mineable.isSelectedByPointer) {
                                        mineable.getDamage(10);
                                    }
                                }
                            };
                        }
                    }
                });
            }

            timeline.play();
        }
    }
}