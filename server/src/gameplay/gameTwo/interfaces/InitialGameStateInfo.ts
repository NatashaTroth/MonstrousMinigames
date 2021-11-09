import { GameStateInfo } from '.';
import { GameState } from '../../enums';
import Sheep from '../classes/Sheep';
import { PlayerStateForClient } from './PlayerStateForClient';

export interface InitialGameStateInfo extends GameStateInfo {
    roomId: string;
    gameState: GameState;
    playersState: Array<PlayerStateForClient>;
    sheep: Array<Sheep>;
    lengthX: number;
    lengthY: number;
    currentRound: number;
}
