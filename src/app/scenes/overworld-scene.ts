import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin';
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';
import { STONE_CONFIG, TREE_CONFIG } from '../configuration/mineable-configurations';
import { SceneKeys } from '../configuration/scene-keys';
import { ItemDrop } from '../item-drop';
import { MetaConfig } from '../meta-config';
import { Mineable } from '../mineable';
import { Player } from '../player';
import { Tree } from '../tree';
import { ItemDropPool } from '../item-drop-pool';

export class OverworldScene extends Phaser.Scene {

    private keyW!: Phaser.Input.Keyboard.Key;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keySpace!: Phaser.Input.Keyboard.Key;
    private keyP!: Phaser.Input.Keyboard.Key;
    private keyOne!: Phaser.Input.Keyboard.Key;
    private keyTwo!: Phaser.Input.Keyboard.Key;

    private player!: Player;

    group!: ItemDropPool;

    constructor() {
        super(SceneKeys.TEST);
    }

    preload(): void { }

    create(): void {
        this.initKeys();
        this.matter.world.disableGravity();
        this.matter.world.drawDebug = false;

        this.player = new Player(this);
        this.player.setPosition(0, 0);

        this.cameras.main.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setLerp(0.05, 0.05);
        this.cameras.main.setZoom(SCALE);

        // @ts-ignore
        this.group = this.add.itemDropPool();

        // console.log((2 >>> 0).toString(2));


        
        new Mineable(this, TREE_CONFIG, 120, 40);
        new Mineable(this, TREE_CONFIG, 20, 60);
        new Mineable(this, TREE_CONFIG, 60, 30);
        new Mineable(this, TREE_CONFIG, 80, 20);
        new Mineable(this, TREE_CONFIG, 10, 50);

        new Mineable(this, STONE_CONFIG, -30, -30);
        new Mineable(this, STONE_CONFIG, 20, -40);
        new Mineable(this, STONE_CONFIG, -48, -20);


        /* this.group = this.add.group({
            defaultKey: 'wood_drop',
            maxSize: 1000
        }); */

        this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: any) => {
            // new ItemDrop(this, 'wood_drop', pointer.worldX, pointer.worldY);
            // this.createItemDrop('wood_drop', pointer.worldX, pointer.worldY);
            // this.group.get(pointer.worldX, pointer.worldY);
            this.group.spawn(pointer.worldX, pointer.worldY, 'wood_drop');
            this.group.spawn(pointer.worldX, pointer.worldY, 'wood_drop');
            this.group.spawn(pointer.worldX, pointer.worldY, 'wood_drop');
            this.group.spawn(pointer.worldX, pointer.worldY, 'wood_drop');
            this.group.spawn(pointer.worldX, pointer.worldY, 'wood_drop');
        });

        // this.matter.add.mouseSpring();

        this.input.on('pointermove', (pointer: any, gameObject: Phaser.GameObjects.GameObject) => {
            const bodies = this.matter.intersectPoint(pointer.worldX, pointer.worldY);
            if (bodies.length) {
                // console.log(bodies);
            }
        });
    }

    update(_time: number, delta: number): void {
        /* this.player.setVelocityX(0);
        this.player.setVelocityY(0); */

        // this.player.setVelocity(0, 0);

        this.handlePlayerControls();

        this.player.update(_time, delta);

        if (Phaser.Input.Keyboard.JustDown(this.keyP)) {
            if (this.matter.world.drawDebug) {
                this.matter.world.drawDebug = false;
                this.matter.world.debugGraphic.clear();
            }
            else {
                this.matter.world.drawDebug = true;
            }
        }
    }

    private initKeys(): void {
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.keyOne = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.keyTwo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    }

    private handlePlayerControls(): void {
        if (this.input.activePointer.isDown) {
            this.player.useEquippedItem();
        }

        let x = 0;
        let y = 0;

        if (this.keyW.isDown) {
            y = -1;
        }
        if (this.keyA.isDown) {
            x = -1;
        }
        if (this.keyS.isDown) {
            y = 1;
        }
        if (this.keyD.isDown) {
            x = 1;
        }

        const norVec = new Phaser.Math.Vector2(x, y).normalize();
        this.player.setVelocity(norVec.x * Player.SPEED, norVec.y * Player.SPEED);

        if (this.keyOne.isDown) {
            this.player.equipItem('rifle');
        }
        if (this.keyTwo.isDown) {
            this.player.equipItem('pickaxe');
        }
    }

    private createItemDrop(dropKey: string, x: number, y: number): void {
        const image = this.matter.add.image(x, y, dropKey);
        image.setBody({
            type: 'rectangle',
            width: image.width / 2,
            height: image.height / 2
        }, { isStatic: true });
        image.setOrigin(0.5, 0.6)
        image.depth = y;

        const metaConfig: MetaConfig = {
            key: dropKey,
            type: 'item_drop',
            parent: this,
            mineable: false,
            hitable: false
        };
        image.setData('meta', metaConfig);

        // OutlinePipelinePlugin
        const postFxPlugin = this.plugins.get('rexOutlinePipeline') as OutlinePipelinePlugin;
        postFxPlugin.add(image, {
            thickness: 3,
            outlineColor: 0xcfc6b8
        });

        const follower = { t: 0, vec: new Phaser.Math.Vector2() };

        const negOrPos = Math.ceil((Math.random() - 0.5) * 2) < 1 ? -1 : 1;
        const xValue = this.getRandomInt(20) * negOrPos;
        
        const startPoint = new Phaser.Math.Vector2(x, y);
        const controlPoint1 = new Phaser.Math.Vector2(x, y - 30);
        const controlPoint2 = new Phaser.Math.Vector2(x + xValue, y - 30);
        const endPoint = new Phaser.Math.Vector2(x + xValue, y + this.getRandomInt(15));

        const curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);

        this.tweens.add({
            targets: follower,
            t: 1,
            duration: 400,
            yoyo: false,
            repeat: 0,
            onUpdate: () => {
                curve.getPoint(follower.t, follower.vec);
                image.setPosition(follower.vec.x, follower.vec.y);
                image.depth = 1000;
            },
            onComplete: () => {
                image.depth = image.y;
            }

        });
    }

    private getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }
}