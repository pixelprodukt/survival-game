import { Vector } from 'matter';
import { EquippableItemConfig } from './equippable-item-config';

export interface FirearmConfig extends EquippableItemConfig {
    fireRate?: number;
    muzzleFrames: number[];
    muzzleOffset: Vector;
    projectileConfig: ProjectileConfig;
}

export interface ProjectileConfig {
    speed: number;
    timeToLive: number;
    frameNumber: number;
    distanceToCenter: number;
    explosionConfig: ProjectileExplosionConfig;
}

export interface ProjectileExplosionConfig {
    spritesheetKey: string;
    frames: number[];
    size: number;
    damage: number;
}