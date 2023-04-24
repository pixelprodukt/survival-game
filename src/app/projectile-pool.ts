import { ProjectileConfig } from './firearm-config';
import { Projectile } from './projectile'

export class ProjectilePool extends Phaser.GameObjects.Group {

    constructor(scene: Phaser.Scene, config: Phaser.Types.GameObjects.Group.GroupConfig = {}) {
        const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
            classType: Projectile,
            maxSize: -1
        }

        super(scene, Object.assign(defaults, config));
    }

    spawn(x = 0, y = 0, key: string = 'rifle', angle: number, config: ProjectileConfig): Projectile {

        const spawnExisting = this.countActive(false) > 0;
        const projectile = super.get(x, y, key); 

        projectile.init(x, y, angle, config);

        if (spawnExisting) {
            projectile.setActive(true);
            projectile.setVisible(true);
        }
        
        return projectile;
    }

    despawn(projectile: Projectile): void {
        projectile.unset();

        projectile.setActive(false);
        projectile.setVisible(false);
    }
}