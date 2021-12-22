export class GameToScreenMapper {
    private screenPercentOfGame: number;
    // public screenSpeed: number;

    constructor(gameWidth: number, windowWidth: number) {
        // Game Positions
        // chaser pos = 0
        // playerpos = 500 ... 100%
        //
        // Screen Positions
        //window.innerWidth / 2 ... x %

        // gameWidth... 100%
        // windowWidth... x

        //screenpercent: 0.5088888888888888, windowwidth: 916, gamewidth: 1800

        this.screenPercentOfGame = (1 / gameWidth) * windowWidth;

        // eslint-disable-next-line no-console
        console.log(`screenpercent: ${this.screenPercentOfGame}, windowwidth: ${windowWidth}, gamewidth: ${gameWidth}`);
        // this.screenSpeed = this.mapGameMeasurementToScreen(gameSpeed);
    }

    mapGameMeasurementToScreen(value: number) {
        return value * this.screenPercentOfGame;
    }

    // mapScreenMeasurementToGame(value: number) {
    //     return value / this.screenPercentOfGame;
    // }
}
