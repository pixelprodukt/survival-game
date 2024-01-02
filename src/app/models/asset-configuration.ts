export interface AssetConfiguration {
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