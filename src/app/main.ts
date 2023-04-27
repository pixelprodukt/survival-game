import { Game, Types } from 'phaser';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './configuration/constants';
import { BootScene } from './scenes/boot-scene';
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice';
import { OverworldScene } from './scenes/overworld-scene';
import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js';
import { ItemDropPool } from './pools/item-drop-pool';

Phaser.GameObjects.GameObjectFactory.register('itemDropPool', function () {
	// @ts-ignore
	return this.updateList.add(new ItemDropPool(this.scene));
});

let debug: Phaser.Types.Physics.Matter.MatterDebugConfig;

const debugConfig = {
    showAxes: false,
    showAngleIndicator: true,
    angleColor: 0xe81153,

    showBroadphase: false,
    broadphaseColor: 0xffb400,

    showBounds: false,
    boundsColor: 0xffffff,

    showVelocity: true,
    velocityColor: 0x00aeef,

    showCollisions: true,
    collisionColor: 0xf5950c,

    separationColor: 0xffa500,

    showBody: true,
    showStaticBody: true,
    showInternalEdges: true,

    renderFill: false,
    renderLine: true,

    fillColor: 0x106909,
    fillOpacity: 1,
    lineColor: 0x28de19,
    lineOpacity: 1,
    lineThickness: 0.25,

    staticFillColor: 0x0d177b,
    staticLineColor: 0x1327e4,

    showSleeping: true,
    staticBodySleepOpacity: 1,
    sleepFillColor: 0x464646,
    sleepLineColor: 0x999a99,

    showSensors: true,
    sensorFillColor: 0x0d177b,
    sensorLineColor: 0x1327e4,

    showPositions: true,
    positionSize: 2,
    positionColor: 0xe042da,

    showJoint: true,
    jointColor: 0xe0e042,
    jointLineOpacity: 1,
    jointLineThickness: 1,

    pinSize: 1,
    pinColor: 0x42e0e0,

    springColor: 0xe042e0,

    anchorColor: 0xefefef,
    anchorSize: 1,

    showConvexHulls: true,
    hullColor: 0xd703d0
};

const debugConfigToUse = true ? debugConfig : false;

const configObject: Types.Core.GameConfig = {
    title: 'Survival game',
    type: Phaser.WEBGL,
    parent: 'gameContainer',
    backgroundColor: '#888564',
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'gameContainer',
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT
    },
    physics: {
        default: "matter",
        matter: {
            debug: debugConfigToUse,
            gravity: {
                x: 0,
                y: 0
            },
        }
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    plugins: {
        global: [
            NineSlicePlugin.DefaultCfg,
            {
                key: 'rexOutlinePipeline',
                plugin: OutlinePipelinePlugin,
                start: true
            }
        ],
    },
    scene: [BootScene, OverworldScene]
};

const game = new Game(configObject);

window.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
        event.stopPropagation();
        event.preventDefault();
    }
});

