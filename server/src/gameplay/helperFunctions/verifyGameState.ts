import { GameState } from '../interfaces';

export function verifyGameState(
  currentGameState: GameState,
  requiredGameState: Array<GameState>
) : void {
  if(!requiredGameState.includes(currentGameState)){
      throw new Error(
        `Current game state is ${currentGameState}, the game state ${requiredGameState} is required to perform this action.`
      );
  }

}
