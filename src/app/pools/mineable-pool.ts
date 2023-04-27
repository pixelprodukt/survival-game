import { Mineable } from '../mineable';
import { MineableConfig } from '../mineable-config';
import { ItemDropPool } from './item-drop-pool';

export class MineablePool extends Phaser.GameObjects.Group {

    constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {}) {
        const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
            classType: Mineable,
            maxSize: -1
        }
        super(scene, Object.assign(defaults, config));
    }

    spawn(x = 0, y = 0, config: MineableConfig, itemDropPool: ItemDropPool): void {
        const spawnExisting = this.countActive(false) > 0;
        const mineable = super.get(x, y, config.imageKey); 

        mineable.init(x, y, config, itemDropPool, this.despawn);

        if (spawnExisting) {
            mineable.setActive(true);
            mineable.setVisible(true);
        }
        
        return mineable;
    }

    despawn(mineable: Mineable): void {
        mineable.reset();
        mineable.setActive(false);
        mineable.setVisible(false);
    }
}