import { Vector } from 'matter';

export interface MineableConfig {
    hitpoints: number;
    imageKey: string;
    origin: Vector;
    body: { width: number, height: number };
    hitSoundKeys: string[];
    pointerAreaVertices: number[];
    lootDropKeys?: string[]
}