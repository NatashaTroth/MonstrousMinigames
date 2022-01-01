import { GameState } from '../../enums';
import { IGameStateBase } from '../../interfaces/IGameStateBase';
import { PlayerStateForClient } from './';

export interface InitialGameStateInfo extends IGameStateBase {
    roomId: string;
    playersState: Array<PlayerStateForClient>;
    gameState: GameState;
}
