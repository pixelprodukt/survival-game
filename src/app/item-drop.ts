import { MetaConfig } from './meta-config';

export class ItemDrop extends Phaser.Physics.Matter.Image {

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        dropKey: string,
    ) {
        super(scene.matter.world, x, y, dropKey);

        this.setBody({
            type: 'rectangle',
            width: this.width / 2,
            height: this.height / 2
        }, { isStatic: true });
        this.setOrigin(0.5, 0.6)
        this.depth = y;

        const metaConfig: MetaConfig = {
            key: dropKey,
            type: 'item_drop',
            parent: this,
            mineable: false,
            hitable: false
        };
        this.setData('meta', metaConfig);

        // This is too heavy on performance
        // OutlinePipelinePlugin
        /* const postFxPlugin = this.scene.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;
        postFxPlugin.add(this, {
            thickness: 3,
            outlineColor: 0xcfc6b8
        }); */

        const follower = { t: 0, vec: new Phaser.Math.Vector2() };

        const negOrPos = Math.ceil((Math.random() - 0.5) * 2) < 1 ? -1 : 1;
        const xValue = this.getRandomInt(20) * negOrPos;
        
        const startPoint = new Phaser.Math.Vector2(x, y);
        const controlPoint1 = new Phaser.Math.Vector2(x, y - 30);
        const controlPoint2 = new Phaser.Math.Vector2(x + xValue, y - 30);
        const endPoint = new Phaser.Math.Vector2(x + xValue, y + this.getRandomInt(15));

        const curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);

        this.scene.tweens.add({
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
                this.scene.tweens.add({
                    targets: this,
                    props: { y: '-= 4'},
                    duration: 1000,
                    ease: 'Quad.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
            }

        });
    }

    private getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }
}