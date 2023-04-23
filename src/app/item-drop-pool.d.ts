import { ItemDropPool } from './item-drop-pool'

declare namespace Phaser.GameObjects
{
	interface GameObjectFactory
	{
		itemDropPool(): ItemDropPool
	}
}