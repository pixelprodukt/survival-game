import { ASSET_CONFIGURATION } from '../configuration/asset-configuration';
import { CANVAS_HEIGHT, CANVAS_WIDTH, FONT, SCALE } from '../configuration/constants';
import { Scene } from '../enums/scene';
import { AssetResource, SpritesheetResource } from '../models/asset-configuration';

export class BootScene extends Phaser.Scene {

    constructor() {
        super(Scene.BOOT);
    }

    preload(): void {
        this.cameras.main.setOrigin(0, 0);
        this.cameras.main.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.cameras.main.setZoom(SCALE);
        this.cameras.main.setOrigin(0, 0);
        this.cameras.main.setPosition(0, 0);
        this.cameras.main.setBounds(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(20, (height / SCALE) / 2 - 5, CANVAS_WIDTH / SCALE - 40, 10);

        const progressBarCompleteWidth = (CANVAS_WIDTH / SCALE) - 40;

        const fontStyle = {
            font: FONT,
            color: '#ffffff',
            resolution: 14
        };

        const loadingText = this.make.text({
            x: (width / SCALE) / 2,
            y: (height / SCALE) / 2 - 12,
            text: 'Loading...',
            style: fontStyle
        });

        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: (width / SCALE) / 2,
            y: (height / SCALE) / 2 + 2,
            text: '0%',
            style: fontStyle
        });

        percentText.setOrigin(0.5, 0.65);

        const assetText = this.make.text({
            x: (width / SCALE) / 2,
            y: (height / SCALE) / 2 + 12,
            text: '',
            style: fontStyle
        });

        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value: number) => {
            percentText.setText(value * 100 + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(20, (height / SCALE) / 2 - 5, progressBarCompleteWidth * value, 10);
        });

        this.load.on('fileprogress', (file: any) => {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();

            this.scene.run(Scene.TEST);
            this.scene.run(Scene.UI_OVERLAY);
        });

        ASSET_CONFIGURATION.images.forEach((resource: AssetResource) => {
            this.load.image(resource.key, resource.path);
        });

        ASSET_CONFIGURATION.spritesheets.forEach((resource: SpritesheetResource) => {
            this.load.spritesheet(resource.key, resource.path, { ...resource.config });
        });

        ASSET_CONFIGURATION.sounds.forEach((resource: AssetResource) => {
            this.load.audio(resource.key, resource.path);
        });
    }

    create(): void { }
}