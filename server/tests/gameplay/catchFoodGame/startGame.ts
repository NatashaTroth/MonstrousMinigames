import { CatchFoodGame } from '../../../src/gameplay';

export function startGame(catchFoodGameInstance: CatchFoodGame) {
    catchFoodGameInstance.startGame()
    //run countdown
    jest.advanceTimersByTime(3000)
}
