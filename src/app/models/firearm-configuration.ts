import { Vector } from 'matter';
import { EquippableItemConfiguration } from './equippable-item-configuration';

export interface FirearmConfiguration extends EquippableItemConfiguration {
    fireRate?: number;
    muzzleFrames: number[];
    muzzleOffset: Vector;
    projectileConfig: ProjectileConfiguration;
}

export interface ProjectileConfiguration {
    speed: number;
    timeToLive: number;
    frameNumber: number;
    distanceToCenter: number;
    explosionConfig: ProjectileExplosionConfiguration;
}

export interface ProjectileExplosionConfiguration {
    spritesheetKey: string;
    frames: number[];
    size: number;
    damage: number;
}