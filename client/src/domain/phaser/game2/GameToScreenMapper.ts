export class GameToScreenMapper {
    private screenPercentageOfGameWidth: number;

    private widthPaddingPercentage = 0.05; // sum of total adding at sides
    heightPadding = 20;
    centerOffsetX = 0;

    constructor(
        private gameWidth: number,
        private windowWidth: number,
        private gameHeight: number,
        windowHeight: number
    ) {
        // Screen Positions
        //window.innerWidth / 2 ... x %

        // gameWidth... 100%
        // windowWidth... x

        //screenpercent: 0.5088888888888888, windowwidth: 916, gamewidth: 1800

        this.screenPercentageOfGameWidth = (1 / gameWidth) * (windowWidth * (1 - this.widthPaddingPercentage)); //for padding

        if (gameHeight * this.screenPercentageOfGameWidth > (windowHeight / 3) * 2) {
            //window.innerHeight / 2 ... x %

            // gameWidth... 100%
            // windowWidth... x

            this.screenPercentageOfGameWidth =
                (1 / gameHeight) * ((windowHeight / 3) * 2 * (1 - this.widthPaddingPercentage)); //for padding
        }
        this.centerOffsetX = (this.windowWidth - this.gameWidth * this.screenPercentageOfGameWidth) / 2;
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
        ); //add 1/3 more padding to right because of scrollbar
    }

    getMappedGameWidth() {
        return this.gameWidth * this.screenPercentageOfGameWidth;
    }

    getCenterOffsetX() {
        return this.centerOffsetX;
    }

    getScreenYOffset() {
        //To render at the bottom of the screen
        return window.innerHeight - this.getMappedGameHeight() - this.heightPadding;
    }
}
