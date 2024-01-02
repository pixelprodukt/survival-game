import { Player } from '../gameObjects/player';

export interface Equippable {
    use(parent: Player): void;
}