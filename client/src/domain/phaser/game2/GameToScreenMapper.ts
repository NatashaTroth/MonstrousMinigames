/* eslint-disable no-console */
import { backgroundImageDimensions } from '../../game2/screen/components/GameAssets';

export class GameToScreenMapper {
    private screenPercentageOfGameWidth = 1;

    heightPadding = 20;
    centerOffsetX = 0;
    backgroundImageWidth = 0;
    backgroundImageHeight = 0;
    backgroundWidthEqualsWindowWidth = true;
    mappedGameWidth = 0;
    mappedGameHeight = 0;
    yObjectOffsetFromTopBackground = 0;
    paddingX = 30; // to stop the sheep from going off the side
    mappedPaddingX = 0;

    constructor(
        private gameWidth: number,
        private windowWidth: number,
        private gameHeight: number,
        private windowHeight: number
    ) {
        // Screen Positions
        //window.innerWidth / 2 ... x %

        // gameWidth... 100%
        // windowWidth... x

        this.calcBackgroundImageSizes();
        this.mappedGameWidth = this.backgroundImageWidth;
        this.screenPercentageOfGameWidth = (1 / gameWidth) * (this.backgroundImageWidth - this.paddingX * 2); //TODO:
        this.mappedGameHeight = gameHeight * this.screenPercentageOfGameWidth;

        this.yObjectOffsetFromTopBackground = this.backgroundImageHeight - this.mappedGameHeight - this.paddingX * 1.5; // top position sheep at bottom of the background image

        this.mappedPaddingX = this.paddingX * this.screenPercentageOfGameWidth;
    }

    // ********** Background Image *************

    private calcBackgroundImageSizes() {
        // backgroundImageDimensions.width ... 1   // (100%)
        // window width ... x    // = backgroundMultiplier

        // backgroundImageDimensions.height * x

        // first see if width is full
        this.backgroundImageWidth = this.windowWidth;
        let backgroundMultiplier = (1 / backgroundImageDimensions.width) * this.windowWidth;
        this.backgroundImageHeight = backgroundMultiplier * backgroundImageDimensions.height;

        if (this.backgroundImageHeight > this.windowHeight) {
            // have to change to go by height
            this.backgroundWidthEqualsWindowWidth = false;
            this.backgroundImageHeight = this.windowHeight;
            backgroundMultiplier = (1 / backgroundImageDimensions.height) * this.windowHeight;
            this.backgroundImageWidth = backgroundMultiplier * backgroundImageDimensions.width;
        }
    }

    getScreenXOffset() {
        // center background x axis
        if (this.backgroundWidthEqualsWindowWidth) return 0;
        return (this.windowWidth - this.backgroundImageWidth) / 2;
    }

    getScreenYOffset() {
        // center background y axis
        if (!this.backgroundWidthEqualsWindowWidth) return 0;
        return (this.windowHeight - this.backgroundImageHeight) / 2;
    }

    getSheepBackgroundImageWidth() {
        return this.backgroundImageWidth;
    }

    getSheepBackgroundImageHeight() {
        return this.backgroundImageHeight;
    }

    // ********** Other *************

    getObjectXOffset() {
        return this.getScreenXOffset() + this.paddingX;
    }

    getObjectYOffset() {
        return this.getScreenYOffset() + this.yObjectOffsetFromTopBackground; //- this.paddingX;
    }

    mapGameXMeasurementToScreen(value: number) {
        return value * this.screenPercentageOfGameWidth + this.getObjectXOffset(); //add 1/3 more padding to right because of scrollbar
    }

    mapGameYMeasurementToScreen(value: number) {
        return value * this.screenPercentageOfGameWidth + this.getObjectYOffset();
    }

    getMappedGameHeight() {
        return this.mappedGameHeight;
    }

    getMappedGameWidth() {
        return this.mappedGameWidth;
    }
}
