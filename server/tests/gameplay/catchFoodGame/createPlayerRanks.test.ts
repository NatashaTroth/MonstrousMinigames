import { CatchFoodGame } from '../../../src/gameplay';
import { startGameAndAdvanceCountdown } from './startGame';

const TRACKLENGTH = 500

let catchFoodGame: CatchFoodGame

describe('Game logic tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame()
        jest.useFakeTimers()
    })



    it('playerHasReachedObstacle is called and returns false', async () => {
      //TODO
      startGameAndAdvanceCountdown(catchFoodGame)
      catchFoodGame.gameStartedTime = 1000
      const createPlayerRanksSpy = jest.spyOn(CatchFoodGame.prototype as any, 'createPlayerRanks')
         // finish game
         for (let i = 0; i < 4; i++) {
          catchFoodGame.playerHasCompletedObstacle('1', i)
          catchFoodGame.playerHasCompletedObstacle('2', i)
          catchFoodGame.playerHasCompletedObstacle('3', i)
          catchFoodGame.playerHasCompletedObstacle('4', i)
      }

      catchFoodGame.runForward('1', TRACKLENGTH)
      catchFoodGame.runForward('2', TRACKLENGTH)
      catchFoodGame.runForward('3', TRACKLENGTH)
      catchFoodGame.runForward('4', TRACKLENGTH)

        expect(createPlayerRanksSpy).toHaveBeenCalled()
        // expect(createPlayerRanksSpy).toHaveReturnedWith({})
    })

})
