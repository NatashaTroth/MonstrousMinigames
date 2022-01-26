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
    }

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

    // private calcBackgroundImageSizes() {
    //     // backgroundImageDimensions.width ... 1   // (100%)
    //     // window width ... x    // = backgroundMultiplier

    //     // backgroundImageDimensions.height * x

    //     if (this.windowWidth > this.windowHeight) {
    //         // console.log('here1');
    //         this.backgroundImageWidth = this.windowWidth;
    //         // this.screenPercentageOfGameWidth = (1 / backgroundImageDimensions.width) * this.windowWidth;
    //         const backgroundMultiplier = (1 / backgroundImageDimensions.width) * this.windowWidth;
    //         // console.log(this.backgroundImageHeight);
    //         this.backgroundImageHeight = backgroundMultiplier * backgroundImageDimensions.height;
    //     } else {
    //         // console.log('here2');
    //         this.backgroundImageHeight = this.windowHeight;
    //         // this.screenPercentageOfGameWidth = (1 / backgroundImageDimensions.height) * this.windowHeight;
    //         const backgroundMultiplier = (1 / backgroundImageDimensions.height) * this.windowHeight;
    //         this.backgroundImageWidth = backgroundMultiplier * backgroundImageDimensions.width;
    //     }
    // }

    getSheepBackgroundImageWidth() {
        return this.backgroundImageWidth;
    }

    getSheepBackgroundImageHeight() {
        return this.backgroundImageHeight;
    }

    mapGameXMeasurementToScreen(value: number) {
        return (
            value * this.screenPercentageOfGameWidth +
            (this.windowWidth * this.widthPaddingPercentage) / 3 +
            this.centerOffsetX
        ); //add 1/3 more padding to right because of scrollbar
    }

    mapGameYMeasurementToScreen(value: number) {
        return value * this.screenPercentageOfGameWidth + this.getScreenYOffset();
    }

    getMappedGameHeight() {
        // return this.mapGameXMeasurementToScreen(this.gameHeight);
        return (
            this.gameHeight * this.screenPercentageOfGameWidth + (this.windowWidth * this.widthPaddingPercentage) / 3
        );
    }

    // getMappedBackgroundHeight() {
    //     // return this.mapGameXMeasurementToScreen(this.gameHeight);
    //     return (
    //         ((this.gameHeight * this.screenPercentageOfGameWidth) / 2) * 3 //+ (this.windowWidth * this.widthPaddingPercentage) / 3
    //     );
    // }

    getMappedGameWidth() {
        return this.gameWidth * this.screenPercentageOfGameWidth;
    }
}
