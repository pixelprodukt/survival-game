import { Vector } from 'matter';

export interface EquippableItemConfiguration {
    spriteKey: string;
    useSoundKey: string;
    useSoundVolume: number;
    facingLeftOffset: Vector;
    facingRightOffset: Vector;
    facingLeftOrigin: Vector;
    facingRightOrigin: Vector;
}