import { ItemDrop } from './item-drop'

export class ItemDropPool extends Phaser.GameObjects.Group {

    constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {})
	{
		const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
			classType: ItemDrop,
			maxSize: -1
		}

		super(scene, Object.assign(defaults, config))
	}

    spawn(x = 0, y = 0, key: string = 'wood_drop'): void {

		const spawnExisting = this.countActive(false) > 0;
		const drop = super.get(x, y, key);

		if (!drop) {            
			return;
		}

		if (spawnExisting) {
			drop.setActive(true);
			drop.setVisible(true);
			drop.world.add(drop.body);
		}

		return drop;
	}

	despawn(drop: ItemDrop): void {
		drop.setActive(false);
		drop.setVisible(false);
		drop.removeInteractive();
		drop.world.remove(drop.body);
	}
}