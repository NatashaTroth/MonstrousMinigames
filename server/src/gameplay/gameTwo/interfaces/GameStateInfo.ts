import { SheepData } from "../interfaces";
import { GameState } from '../../enums';
import { IGameStateBase } from '../../interfaces/IGameStateBase';

import { PlayerStateForClient } from './PlayerStateForClient';

export interface GameStateInfo extends IGameStateBase {
    roomId: string;
    gameState: GameState;
    playersState: Array<PlayerStateForClient>;
    sheep: Array<SheepData>;
    lengthX: number;
    lengthY: number;
    round: number;
    phase: string;
    timeLeft: number;
    aliveSheepCounts: Array<number> | null;
    brightness: number;
}
