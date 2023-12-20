import { OverworldScene } from "../scenes/overworld-scene";

export const CANVAS_WIDTH = 1152;
export const CANVAS_HEIGHT = 864;
export const SCALE = 4;
export const TILE_SIZE = 16;
export const FONT = '7px Sneak Attack';

export const PLAYER_FRAMERATE = 6;

export function getOverworldScene(scene: Phaser.Scene): OverworldScene {
    return scene as OverworldScene;
}

export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function addKey(keyCode: number): Phaser.Input.Keyboard.Key {
    // @ts-ignore
    return this.input.keyboard.addKey(keyCode);
}