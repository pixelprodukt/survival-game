import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin';
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';
import { STONE_CONFIG, TREE_CONFIG } from '../configuration/mineable-configurations';
import { SceneKeys } from '../configuration/scene-keys';
import { MetaConfig } from '../meta-config';
import { Mineable } from '../mineable';
import { Player } from '../player';
import { ItemDropPool } from '../pools/item-drop-pool';
import { MineablePool } from '../pools/mineable-pool';
import { ProjectilePool } from '../pools/projectile-pool';

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
    private itemDropPool!: ItemDropPool;
    private mineablePool!: MineablePool;

    public projectilePool!: ProjectilePool;

    private placementMode = false;

    constructor() {
        super(SceneKeys.TEST);
    }

    preload(): void { }

    create(): void {
        // Pools
        const itemDropPoolInstance = new ItemDropPool(this);
        this.itemDropPool = this.add.existing(itemDropPoolInstance);

        const projectilePoolInstance = new ProjectilePool(this);
        this.projectilePool = this.add.existing(projectilePoolInstance);

        const mineablePoolInstance = new MineablePool(this);
        this.mineablePool = this.add.existing(mineablePoolInstance);

        // init
        this.initKeys();
        this.matter.world.disableGravity();
        this.matter.world.drawDebug = false;

        this.player = new Player(this);
        this.player.setPosition(0, 0);

        this.cameras.main.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setLerp(0.05, 0.05);
        this.cameras.main.setZoom(SCALE);

        

        // Test Minables
        this.mineablePool.spawn(120, 40, TREE_CONFIG, this.itemDropPool);
        this.mineablePool.spawn(20, 60, TREE_CONFIG, this.itemDropPool);
        this.mineablePool.spawn(60, 30, TREE_CONFIG, this.itemDropPool);
        this.mineablePool.spawn(80, 20, TREE_CONFIG, this.itemDropPool);
        this.mineablePool.spawn(10, 50, TREE_CONFIG, this.itemDropPool);

        this.mineablePool.spawn(-30, -30, STONE_CONFIG, this.itemDropPool);
        this.mineablePool.spawn(20, -40, STONE_CONFIG, this.itemDropPool);
        this.mineablePool.spawn(-48, -20, STONE_CONFIG, this.itemDropPool);



        this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: any) => {
            if (this.placementMode) {
                this.mineablePool.spawn(pointer.worldX, pointer.worldY, TREE_CONFIG, this.itemDropPool);
            }
            /* this.itemDropPool.spawn(pointer.worldX, pointer.worldY, 'wood_drop');
            this.itemDropPool.spawn(pointer.worldX, pointer.worldY, 'wood_drop');
            this.itemDropPool.spawn(pointer.worldX, pointer.worldY, 'wood_drop');
            this.itemDropPool.spawn(pointer.worldX, pointer.worldY, 'wood_drop');
            this.itemDropPool.spawn(pointer.worldX, pointer.worldY, 'wood_drop'); */
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

        this.handlePlayerControls();

        this.player.update(_time, delta);

        if (Phaser.Input.Keyboard.JustDown(this.keyP)) {
            if (this.matter.world.drawDebug) {
                this.matter.world.drawDebug = false;
                this.placementMode = false;
                this.matter.world.debugGraphic.clear();
            }
            else {
                this.matter.world.drawDebug = true;
                this.placementMode = true;
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
}