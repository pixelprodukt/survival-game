import { CollisionCategories } from './configuration/collision-categories';
import { MetaConfig } from './meta-config';

export class ItemDrop extends Phaser.Physics.Matter.Image {

    private timeUntillActiveAfterSpawn = 1500;
    private activeForCollecting = false;
    private plopSound!: Phaser.Sound.BaseSound;
    private popOutTween!: Phaser.Tweens.Tween;
    private hoverTween!: Phaser.Tweens.Tween;

    constructor(
        public scene: Phaser.Scene,
        public x: number,
        public y: number,
        private dropKey: string,
    ) {
        super(scene.matter.world, x, y, dropKey);
    }

    init(key: string, despawnCallback: Function): void {        
        this.setTexture(key);
        this.plopSound = this.scene.sound.add('plop01');

        this.setBody({
            type: 'rectangle',
            width: this.width / 2,
            height: this.height / 2
        }, { isStatic: true, isSensor: true });
        this.setOrigin(0.5, 0.6)
        this.depth = this.y;

        const metaConfig: MetaConfig = {
            key: this.dropKey,
            type: 'item_drop',
            parent: this,
            mineable: false,
            hitable: false
        };
        this.setData('meta', metaConfig);

        const follower = { t: 0, vec: new Phaser.Math.Vector2() };

        const negOrPos = Math.ceil((Math.random() - 0.5) * 2) < 1 ? -1 : 1;
        const xValue = this.getRandomInt(20) * negOrPos;
        
        const startPoint = new Phaser.Math.Vector2(this.x, this.y);
        const controlPoint1 = new Phaser.Math.Vector2(this.x, this.y - 30);
        const controlPoint2 = new Phaser.Math.Vector2(this.x + xValue, this.y - 30);
        const endPoint = new Phaser.Math.Vector2(this.x + xValue, this.y + this.getRandomInt(15));

        const curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);

        this.popOutTween = this.scene.tweens.add({
            targets: follower,
            t: 1,
            duration: 400,
            yoyo: false,
            repeat: 0,
            onUpdate: () => {
                curve.getPoint(follower.t, follower.vec);
                this.setPosition(follower.vec.x, follower.vec.y);
                this.depth = 1000;
            },
            onComplete: () => {
                this.depth = this.y;
                this.hoverTween = this.scene.tweens.add({
                    targets: this,
                    props: { y: '-= 4'},
                    duration: 1000,
                    ease: 'Quad.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        setTimeout(() => {
            this.activeForCollecting = true;
        }, this.timeUntillActiveAfterSpawn);

        // Collision Setup
        this.setCollisionCategory(CollisionCategories.ITEM_DROP);
        this.setCollidesWith([CollisionCategories.PLAYER]);

        this.setOnCollideActive((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
            if (this.activeForCollecting) {
                this.plopSound.play({ volume: 0.5 });
                despawnCallback(this);
            }
        });
    }

    reset(): void {
        this.x = 0;
        this.y = 0;
        this.activeForCollecting = false;
        this.world.remove(this.body);
        this.popOutTween.remove();
        this.hoverTween.remove();
    }

    private getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }
}