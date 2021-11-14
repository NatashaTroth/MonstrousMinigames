import { GameState } from '../../enums';
import { IGameStateBase } from '../../interfaces/IGameStateBase';
import Sheep from '../classes/Sheep';
import { PlayerStateForClient } from './PlayerStateForClient';

export interface GameStateInfo extends IGameStateBase {
    roomId: string;
    gameState: GameState;
    playersState: Array<PlayerStateForClient>;
    sheep: Array<Sheep>;
    lengthX: number;
    lengthY: number;
    round: number;
    phase: string;
}
