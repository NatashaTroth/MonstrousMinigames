export class GameToScreenMapper {
    private screenPercentOfGameWidth: number;
    private screenPercentOfGameHeight: number;

    constructor(private gameWidth: number, windowWidth: number, private gameHeight: number, windowHeight: number) {
        // Screen Positions
        //window.innerWidth / 2 ... x %

        // gameWidth... 100%
        // windowWidth... x

        //screenpercent: 0.5088888888888888, windowwidth: 916, gamewidth: 1800

        this.screenPercentOfGameWidth = (1 / gameWidth) * windowWidth;
        this.screenPercentOfGameHeight = (1 / gameHeight) * windowHeight;
    }

    mapGameMeasurementToScreen(value: number) {
        return value * this.screenPercentOfGameWidth;
    }

    getMappedGameHeight() {
        return this.mapGameMeasurementToScreen(this.gameHeight); //* this.screenPercentOfGameHeight;
    }
    mapGameMeasurementToScreenHeight(value: number) {
        return value * this.screenPercentOfGameHeight;
    }
}
