export class GameToScreenMapper {
    private screenPercentOfGame: number;

    constructor(gamePlayersInitialPositionX: number, windowWidth: number) {
        /**************
        * Game Positions
            chaser pos = 0
            playerpos = 500 ... 100%

        * Screen Positions
            window.innerWidth / 2 ... x %
 **************/

        const centerOfScreen = windowWidth / 2;

        this.screenPercentOfGame = (1 / gamePlayersInitialPositionX) * centerOfScreen;
    }

    mapGameMeasurementToScreen(value: number) {
        return value * this.screenPercentOfGame;
    }
}
