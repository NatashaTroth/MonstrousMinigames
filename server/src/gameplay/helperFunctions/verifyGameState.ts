import { WrongGameStateError } from '../customErrors';
import { GameState } from '../interfaces';

export function verifyGameState(currentGameState: GameState, requiredGameState: Array<GameState>): void {
    if (!requiredGameState.includes(currentGameState)) {
        throw new WrongGameStateError(
            `Current game state is ${currentGameState}, the game state ${requiredGameState} is required to perform this action.`,
            requiredGameState
        );
    }
}
