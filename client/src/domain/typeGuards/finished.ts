import { Obstacle } from '../../contexts/game1/Game1ContextProvider';
import { PlayerRank } from '../../contexts/screen/ScreenSocketContextProvider';
import { GameState, MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

interface PlayerState {
    id: string;
    name: string;
    positionX: number;
    obstacles: Obstacle[];
    atObstacle: boolean;
    finished: boolean;
    finishedTimeMs: number;
    rank: number;
    isActive: boolean;
}

interface GameStateData {
    gameState: GameState;
    numberOfObstacles: number;
    roomId: string;
    trackLength: number;
    playersState: PlayerState[];
    playerRanks: PlayerRank[];
}

export interface GameHasFinishedMessage {
    type: MessageTypes.gameHasFinished;
    data: GameStateData;
}

export const finishedTypeGuard = (data: MessageData): data is GameHasFinishedMessage =>
    (data as GameHasFinishedMessage).type === MessageTypes.gameHasFinished;
