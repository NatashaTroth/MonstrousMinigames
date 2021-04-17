import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEventTypes, GameHasFinished, GameState } from '../../../src/gameplay/interfaces';
import { startGameAndAdvanceCountdown } from './startGame';

let catchFoodGame: CatchFoodGame;
let gameEventEmitter: CatchFoodGameEventEmitter;

describe('Timer tests', () => {
    beforeEach(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
        // finishGame(catchFoodGame);
        // catchFoodGame.resetGame(users, NEW_TRACKLENGTH, NEW_NUMBER_OF_OBSTACLES);
    });

    afterEach(() => {
        jest.runAllTimers();
    });

    it('sets the timeOutLimit to 5 minutes', () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        expect(catchFoodGame.timeOutLimit).toBe(5 * 60 * 1000);
    });

    it('sets the timeOutLimit to 5 minutes', () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300000);
    });

    it('stops game when time out', () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const stopGameSpy = jest.spyOn(CatchFoodGame.prototype as any, 'stopGame');
        jest.runAllTimers();
        expect(stopGameSpy).toHaveBeenCalledTimes(1);
        expect(stopGameSpy).toHaveBeenCalledWith(true);
    });

    it('should emit correct playerRanks when the game has timed out', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        let eventData: GameHasFinished = {
            roomId: '',
            gameState: GameState.Started,
            trackLength: 0,
            numberOfObstacles: 0,
            playerRanks: [],
        };

        gameEventEmitter.on(GameEventTypes.GameHasTimedOut, (data: GameHasFinished) => {
            eventData = data;
        });
        startGameAndAdvanceCountdown(catchFoodGame);

        Date.now = jest.fn(() => dateNow + catchFoodGame.timeOutLimit);

        // Time out game
        jest.runAllTimers();

        expect(eventData.playerRanks[0].totalTimeInMs).toBe(catchFoodGame.timeOutLimit);

    });
});

// // timerGame.js
// // ;('use strict')

// // function timerGame(callback) {
// //     console.log('Ready....go!')
// //     setTimeout(() => {
// //         console.log('Times up -- stop!')
// //         callback && callback()
// //     }, 1000)
// // }

// // module.exports = timerGame
// // // __tests__/timerGame-test.js
// // ;('use strict')

// // jest.useFakeTimers()

// // test('waits 1 second before ending the game', () => {
// //     // const timerGame = timerGame;
// //     timerGame()

// //     expect(setTimeout.mock.calls.length).toBe(1)
// //     expect(setTimeout.mock.calls[0][1]).toBe(1000)
// // })

// timerGame.js

// function timerGame(callback: any) {
//     console.log('Ready....go!')
//     setTimeout(() => {
//         console.log("Time's up -- stop!")
//         callback && callback()
//     }, 1000)
// }

// jest.useFakeTimers()

// test('waits 1 second before ending the game', () => {
//     timerGame(() => {})

//     expect(setTimeout).toHaveBeenCalledTimes(1)
//     expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
// })
