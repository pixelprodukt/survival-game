export enum CollisionCategory {
    PLAYER_PROJECTILE = 0b0001,
    HITABLE = 0b0010,
    RESOURCE_OBJECT = 0b0100,
    PLAYER_PROJECTILE_EXPLOSION = 0b1000,
    ITEM_DROP = 0b10000,
    PLAYER = 0b100000,
    EIGHT = 0b1000000,
    NINE = 0b10000000,
    TEN = 0b100000000,
};