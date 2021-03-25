import { CatchFoodGame } from '../../../src/gameplay';

export function startGameAndAdvanceCountdown(catchFoodGameInstance: CatchFoodGame) {
    catchFoodGameInstance.startGame()
    //run countdown
    jest.advanceTimersByTime(3000)
}
