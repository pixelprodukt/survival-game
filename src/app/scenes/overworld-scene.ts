import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALE } from '../configuration/constants';
import { STONE_CONFIG, TREE_CONFIG } from '../configuration/mineable-configurations';
import { Scene } from '../enums/scene';
import { Player } from '../gameObjects/player';
import { ItemDropPool } from '../pools/item-drop-pool';
import { MineablePool } from '../pools/mineable-pool';
import { ProjectilePool } from '../pools/projectile-pool';
import { FleshblobPool } from '../pools/fleshblob-pool';
import { Fleshblob } from '../gameObjects/fleshblob';

const KeyCode: typeof Phaser.Input.Keyboard.KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export class OverworldScene extends Phaser.Scene {

    private keyW!: Phaser.Input.Keyboard.Key;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keySpace!: Phaser.Input.Keyboard.Key;
    private keyP!: Phaser.Input.Keyboard.Key;
    private keyOne!: Phaser.Input.Keyboard.Key;
    private keyTwo!: Phaser.Input.Keyboard.Key;

    private placementMode = false;

    private player!: Player;
    private mineablePool!: MineablePool;

    public projectilePool!: ProjectilePool;
    public itemDropPool!: ItemDropPool;
    public fleshblobPool!: FleshblobPool;

    public blob!: Fleshblob;

    constructor() {
        super(Scene.TEST);
    }

    init(): void {
    }

    preload(): void {
    }

    create(): void {
        // Pools
        const itemDropPoolInstance = new ItemDropPool(this);
        this.itemDropPool = this.add.existing(itemDropPoolInstance);

        const projectilePoolInstance = new ProjectilePool(this);
        this.projectilePool = this.add.existing(projectilePoolInstance);

        const mineablePoolInstance = new MineablePool(this);
        this.mineablePool = this.add.existing(mineablePoolInstance);

        const fleshblobPoolInstance = new FleshblobPool(this);
        this.fleshblobPool = this.add.existing(fleshblobPoolInstance);

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
        this.mineablePool.spawn(120, 40, TREE_CONFIG);
        this.mineablePool.spawn(20, 60, TREE_CONFIG);
        this.mineablePool.spawn(60, 30, TREE_CONFIG);
        this.mineablePool.spawn(80, 20, TREE_CONFIG);
        this.mineablePool.spawn(10, 50, TREE_CONFIG);

        this.mineablePool.spawn(-30, -30, STONE_CONFIG);
        this.mineablePool.spawn(20, -40, STONE_CONFIG);
        this.mineablePool.spawn(-48, -20, STONE_CONFIG);

        // Test Fleshblobs
        this.blob = this.fleshblobPool.spawn(50, -20);

        /*this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: any) => {
            console.log('distance', Phaser.Math.Distance.Between(this.player.x, this.player.y, this.blob.x, this.blob.y));
            if (this.placementMode) {
                // this.mineablePool.spawn(pointer.worldX, pointer.worldY, TREE_CONFIG);
                this.fleshblobPool.spawn(pointer.worldX, pointer.worldY);
            }
        });*/

        /*this.input.on('pointermove', (pointer: any, gameObject: Phaser.GameObjects.GameObject) => {
            const bodies = this.matter.intersectPoint(pointer.worldX, pointer.worldY);
            if (bodies.length) {
                // console.log(bodies);
            }
        });*/

        this.scene.get(Scene.UI_OVERLAY).events.on('toolbarChanged', (data: any) => {
            console.log('data', data);
        });
    }

    update(_time: number, delta: number): void {

        /*if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.blob.x, this.blob.y) < 100) {
            console.log('blob ai triggered');
        }*/

        this.handlePlayerControls();

        this.player.update(_time, delta);

        if (Phaser.Input.Keyboard.JustDown(this.keyP)) {
            if (this.matter.world.drawDebug) {
                this.matter.world.drawDebug = false;
                this.placementMode = false;
                this.matter.world.debugGraphic.clear();
            } else {
                this.matter.world.drawDebug = true;
                this.placementMode = true;
            }
        }
    }

    private initKeys(): void {
        this.keyW = this.addKey(KeyCode.W);
        this.keyA = this.addKey(KeyCode.A);
        this.keyS = this.addKey(KeyCode.S);
        this.keyD = this.addKey(KeyCode.D);
        this.keySpace = this.addKey(KeyCode.SPACE);
        this.keyP = this.addKey(KeyCode.P);
        this.keyOne = this.addKey(KeyCode.ONE);
        this.keyTwo = this.addKey(KeyCode.TWO);
    }

    private addKey(keyCode: number): Phaser.Input.Keyboard.Key {
        return this.input.keyboard.addKey(keyCode);
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