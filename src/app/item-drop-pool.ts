import { ItemDrop } from './item-drop'

Phaser.GameObjects.GameObjectFactory.register('itemDropPool', function () {
    // @ts-ignore
    console.log(this.scene);
    
	// @ts-ignore
	return this.updateList.add(new ItemDropPool(this.scene));
});

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
console.log(spawnExisting);
console.log(drop);

		if (!drop) {
            console.log('nothing');
            
			return;
		}

		if (spawnExisting) {
            console.log('not existing');
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