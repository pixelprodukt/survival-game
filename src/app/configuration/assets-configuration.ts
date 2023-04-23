export interface Assets {
    tilemaps: AssetResource[];
    images: AssetResource[];
    spritesheets: SpritesheetResource[];
    sounds: AssetResource[];
}

export interface AssetResource {
    key: string;
    path: string;
}

export interface SpritesheetResource extends AssetResource {
    config: SpritesheetConfig;
}

export interface SpritesheetConfig {
    frameWidth: number;
    frameHeight: number;
}

export const AssetConfiguration: Assets = {
    tilemaps: [],
    images: [
        {
            key: 'tree01',
            path: 'assets/spritesheets/tree01.png'
        },
        {
            key: 'stone01',
            path: 'assets/spritesheets/stone01.png'
        },
        {
            key: 'whiteParticle',
            path: 'assets/spritesheets/white_particle.png'
        },
        {
            key: 'wood_drop',
            path: 'assets/spritesheets/drops/wood_drop.png'
        },
        {
            key: 'stone_drop',
            path: 'assets/spritesheets/drops/stone_drop.png'
        }
    ],
    spritesheets: [
        {
            key: 'nadia',
            path: 'assets/spritesheets/player_girl.png',
            config: { frameWidth: 16, frameHeight: 16 }
        },
        {
            key: 'rifle',
            path: 'assets/spritesheets/weapon_rifle.png',
            config: { frameWidth: 16, frameHeight: 16 }
        },
        {
            key: 'rifleExplosion',
            path: 'assets/spritesheets/rifle_explosion.png',
            config: { frameWidth: 16, frameHeight: 16 }
        },
        {
            key: 'rocketlauncher',
            path: 'assets/spritesheets/weapon_rocketlauncher.png',
            config: { frameWidth: 16, frameHeight: 16 }
        },
        {
            key: 'rocketlauncherExplosion',
            path: 'assets/spritesheets/rocketlauncher_explosion.png',
            config: { frameWidth: 32, frameHeight: 32 }
        },
        {
            key: 'pickaxe',
            path: 'assets/spritesheets/weapon_pickaxe.png',
            config: { frameWidth: 16, frameHeight: 16 }
        },
        {
            key: 'explosion',
            path: 'assets/spritesheets/explosion01.png',
            config: { frameWidth: 64, frameHeight: 64 }
        }
    ],
    sounds: [
        {
            key: 'step01',
            path: 'assets/sounds/step_01.wav'
        },
        {
            key: 'step02',
            path: 'assets/sounds/step_02.wav'
        },
        {
            key: 'step03',
            path: 'assets/sounds/step_03.wav'
        },
        {
            key: 'swing01',
            path: 'assets/sounds/swing_01.wav'
        },
        {
            key: 'rifleShot01',
            path: 'assets/sounds/rifle_shot_01.wav'
        },
        {
            key: 'rocketlauncherShot01',
            path: 'assets/sounds/rocketlauncher_shot_01.wav'
        },
        {
            key: 'woodchop01',
            path: 'assets/sounds/woodchop01.wav'
        },
        {
            key: 'woodchop02',
            path: 'assets/sounds/woodchop02.wav'
        },
        {
            key: 'woodchop03',
            path: 'assets/sounds/woodchop03.wav'
        },
        {
            key: 'woodchop04',
            path: 'assets/sounds/woodchop04.wav'
        },
        {
            key: 'woodchop05',
            path: 'assets/sounds/woodchop05.wav'
        },
        {
            key: 'woodchop06',
            path: 'assets/sounds/woodchop06.wav'
        },
        {
            key: 'pickaxe_stone01',
            path: 'assets/sounds/pickaxe_stone01.wav'
        },
        {
            key: 'pickaxe_stone02',
            path: 'assets/sounds/pickaxe_stone02.wav'
        },
        {
            key: 'pickaxe_stone03',
            path: 'assets/sounds/pickaxe_stone03.wav'
        },
        {
            key: 'pickaxe_stone04',
            path: 'assets/sounds/pickaxe_stone04.wav'
        },
        {
            key: 'pickaxe_stone05',
            path: 'assets/sounds/pickaxe_stone05.wav'
        },
        {
            key: 'pickaxe_stone06',
            path: 'assets/sounds/pickaxe_stone06.wav'
        },
        {
            key: 'plop01',
            path: 'assets/sounds/plop01.wav'
        },
        {
            key: 'pull_plop01',
            path: 'assets/sounds/pull_plop01.wav'
        }
    ]
};