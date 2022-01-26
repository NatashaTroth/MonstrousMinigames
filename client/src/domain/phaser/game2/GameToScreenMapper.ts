/* eslint-disable no-console */
import { backgroundImageDimensions } from '../../game2/screen/components/GameAssets';

export class GameToScreenMapper {
    private screenPercentageOfGameWidth = 1;

    private widthPaddingPercentage = 0.05; // sum of total adding at sides
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

        //screenpercent: 0.5088888888888888, windowwidth: 916, gamewidth: 1800

        // this.screenPercentageOfGameWidth = (1 / gameWidth) * (windowWidth * (1 - this.widthPaddingPercentage)); //for padding

        // if (gameHeight * this.screenPercentageOfGameWidth > (windowHeight / 3) * 2) {
        //     //window.innerHeight / 2 ... x %

        //     // gameWidth... 100%
        //     // windowWidth... x

        //     this.screenPercentageOfGameWidth =
        //         (1 / gameHeight) * ((windowHeight / 3) * 2 * (1 - this.widthPaddingPercentage)); //for padding
        // }
        // this.centerOffsetX = (this.windowWidth - this.gameWidth * this.screenPercentageOfGameWidth) / 2;

        this.calcBackgroundImageSizes();

        // if (this.backgroundWidthEqualsWindowWidth) {
        // gameWidth... 100%
        // windowWidth... x

        this.mappedGameWidth = this.backgroundImageWidth;

        // console.log(this.backgroundImageWidth);
        // console.log(this.mappedGameWidth);
        // console.log(this.windowWidth);

        this.screenPercentageOfGameWidth = (1 / gameWidth) * (this.backgroundImageWidth - this.paddingX * 2);
        // console.log(gameWidth * this.screenPercentageOfGameWidth);
        this.mappedGameHeight = gameHeight * this.screenPercentageOfGameWidth;
        // } else {
        //     this.mappedGameHeight = this.windowHeight;
        //     this.screenPercentageOfGameWidth = (1 / gameHeight) * this.windowHeight;
        //     this.mappedGameWidth = gameWidth * this.screenPercentageOfGameWidth;
        // }

        this.yObjectOffsetFromTopBackground = this.backgroundImageHeight - this.mappedGameHeight; // top position sheep at bottom of the background image
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
        // return window.innerHeight - this.getMappedGameHeight() - this.heightPadding;

        // return this.centerOffsetX;
    }

    getScreenYOffset() {
        // center background y axis
        if (!this.backgroundWidthEqualsWindowWidth) return 0;
        return (this.windowHeight - this.backgroundImageHeight) / 2;

        //To render at the bottom of the screen
        // return window.innerHeight - this.getMappedGameHeight() - this.heightPadding;
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
        return this.getScreenYOffset() + this.yObjectOffsetFromTopBackground - this.mappedPaddingX;
    }

    mapGameXMeasurementToScreen(value: number) {
        return (
            value * this.screenPercentageOfGameWidth + this.getObjectXOffset()
            // +
            // (this.windowWidth * this.widthPaddingPercentage) / 3 +
            // this.centerOffsetX
        ); //add 1/3 more padding to right because of scrollbar
    }

    mapGameYMeasurementToScreen(value: number) {
        return value * this.screenPercentageOfGameWidth + this.getObjectYOffset();
    }

    getMappedGameHeight() {
        return this.mappedGameHeight;
        // return this.mapGameXMeasurementToScreen(this.gameHeight);
        // return (
        //     this.gameHeight * this.screenPercentageOfGameWidth + (this.windowWidth * this.widthPaddingPercentage) / 3
        // );
    }

    getMappedGameWidth() {
        return this.mappedGameWidth;
        // return this.gameWidth * this.screenPercentageOfGameWidth;
    }
}
