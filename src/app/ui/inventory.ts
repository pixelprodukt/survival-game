import { ItemSlot } from './item-slot';

export class Inventory {

    private readonly COLUMNS: number = 4;
    private readonly ROWS: number = 8;
    private readonly SLOT_SIZE: number = 16;
    private readonly X_POSITION: number = 16;
    private readonly Y_POSITION : number = 16;

    private container!: Phaser.GameObjects.Container;

    private toolbarSlots: ItemSlot[] = [];

    constructor(private readonly scene: Phaser.Scene) {
        this.container = this.scene.add.container(0, 0);
        for (let r = 0; r < this.ROWS; r++) {
            for (let c = 0; c < this.COLUMNS; c++) {
                this.toolbarSlots.push(new ItemSlot(
                    this.scene,
                    this.X_POSITION + (c * this.SLOT_SIZE),
                    this.Y_POSITION + (16 * r)
                ));
            }
        }
        this.toolbarSlots.forEach((slot: ItemSlot) => {
            this.container.add(slot.sprite);
        });
        this.setActiveAndVisible(false);
    }

    public setActiveAndVisible(bool: boolean): void {
        this.toolbarSlots.forEach((slot: ItemSlot) => {
            bool ? slot.setInteractive() : slot.disableInteractive();
            slot.getItem()?.sprite  .setVisible(bool);
        });
        this.container.setVisible(bool);
    }

    get visible(): boolean {
        return this.container.visible;
    }
}