import { CatchFoodGame } from '../../../src/gameplay';
import { users } from '../mockUsers';
import { startGame } from './startGame';

const TRACKLENGTH = 500
const NUMBER_OF_OBSTACLES = 4
let catchFoodGame: CatchFoodGame

describe('Timer tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES)
        jest.useFakeTimers()
        // finishGame(catchFoodGame);
        // catchFoodGame.resetGame(users, NEW_TRACKLENGTH, NEW_NUMBER_OF_OBSTACLES);
    })

    afterEach(() => {
        jest.runAllTimers()
    })

    it('sets the timeOutLimit to 5 minutes', () => {
        startGame(catchFoodGame)
        expect(catchFoodGame.timeOutLimit).toBe(5 * 60 * 1000)
    })

    it('sets the timeOutLimit to 5 minutes', () => {
        startGame(catchFoodGame)
        expect(setTimeout).toHaveBeenCalledTimes(2)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300000)
    })

    it('stops game when time out', () => {
        startGame(catchFoodGame)
        const stopGameSpy = jest.spyOn(CatchFoodGame.prototype as any, 'stopGame')
        jest.runAllTimers()
        expect(stopGameSpy).toHaveBeenCalledTimes(1)
        expect(stopGameSpy).toHaveBeenCalledWith(true)
    })
})

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
