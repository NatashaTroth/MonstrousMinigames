import { CatchFoodGame } from '../../../src/gameplay';
import { users } from '../mockUsers';

export function startGameAndAdvanceCountdown(catchFoodGameInstance: CatchFoodGame) {
    catchFoodGameInstance.createNewGame(users, 500, 4)
    //run countdown
    jest.advanceTimersByTime(3000)
}
