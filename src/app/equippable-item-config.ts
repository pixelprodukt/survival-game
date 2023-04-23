import { Vector } from 'matter';

export interface EquippableItemConfig {
    spriteKey: string;
    useSoundKey: string;
    useSoundVolume: number;
    facingLeftOffset: Vector;
    facingRightOffset: Vector;
    facingLeftOrigin: Vector;
    facingRightOrigin: Vector;
}