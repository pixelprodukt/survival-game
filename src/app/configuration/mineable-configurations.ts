import { MineableConfig } from '../mineable-config';

export const TREE_CONFIG: MineableConfig = {
    hitpoints: 30,
    imageKey: 'tree01',
    origin: { x: 0.5, y: 0.85 },
    body: { width: 10, height: 6 },
    hitSoundKeys: ['woodchop01', 'woodchop02', 'woodchop03', 'woodchop04', 'woodchop05', 'woodchop06'],
    pointerAreaVertices: [
        5, 29,
        5, 24,
        0, 21,
        7, 3,
        9, 3,
        16, 21,
        11, 24,
        11, 29
    ],
    lootDropKeys: ['wood_drop']
};

export const STONE_CONFIG: MineableConfig = {
    hitpoints: 50,
    imageKey: 'stone01',
    origin: { x: 0.5, y: 0.6 },
    body: { width: 14, height: 10 },
    hitSoundKeys: ['pickaxe_stone01', 'pickaxe_stone02', 'pickaxe_stone03', 'pickaxe_stone04', 'pickaxe_stone05', 'pickaxe_stone06'],
    pointerAreaVertices: [
        1, 6,
        4, 2,
        7, 0,
        11, 0,
        15, 3,
        16, 9,
        17, 14,
        10, 16,
        8, 13,
        5, 13,
        1, 11
    ],
    lootDropKeys: ['stone_drop']
};