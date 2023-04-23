import { FirearmConfig } from '../firearm-config';

export const RIFLE_CONFIG: FirearmConfig = {
    fireRate: 300,
    spriteKey: 'rifle',
    muzzleFrames: [4, 5, 6, 7],
    muzzleOffset: { x: -0.3, y: 0.5 },
    useSoundKey: 'rifleShot01',
    useSoundVolume: 0.6,
    facingLeftOffset: { x: 2, y: -7 },
    facingRightOffset: { x: -2, y: -7 },
    facingLeftOrigin: { x: 0.2, y: 0.5 },
    facingRightOrigin: { x: 0.2, y: 0.5 },
    projectileConfig: {
        speed: 2,
        timeToLive: 300,
        frameNumber: 3,
        distanceToCenter: 12,
        explosionConfig: {
            spritesheetKey: 'rifleExplosion',
            frames: [0, 1, 2, 3, 4],
            size: 10,
            damage: 10
        }
    }
};

export const ROCKETLAUNCHER_CONFIG: FirearmConfig = {
    fireRate: 900,
    spriteKey: 'rocketlauncher',
    muzzleFrames: [4, 5, 6, 7],
    muzzleOffset: { x: -0.4, y: 0.5 },
    useSoundKey: 'rocketlauncherShot01',
    useSoundVolume: 0.6,
    facingLeftOffset: { x: 2, y: -7 },
    facingRightOffset: { x: -2, y: -7 },
    facingLeftOrigin: { x: 0.2, y: 0.5 },
    facingRightOrigin: { x: 0.2, y: 0.5 },
    projectileConfig: {
        speed: 1,
        timeToLive: 1000,
        frameNumber: 3,
        distanceToCenter: 12,
        explosionConfig: {
            spritesheetKey: 'rocketlauncherExplosion',
            frames: [0, 1, 2, 3, 4],
            size: 14,
            damage: 10
        }
    }
};