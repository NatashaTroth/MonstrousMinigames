import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';
import { GameData } from '../phaser/gameInterfaces';

export interface GameStateInfoMessage {
    type: MessageTypes.gameState;
    data: GameData;
    // roomId: string;
    // playersState: Array<PlayerState>;
    // gameState: GameState;
    // trackLength: number;
    // numwberOfObstacles: number;
}

export const gameStateInfoTypeGuard = (data: MessageData): data is GameStateInfoMessage =>
    (data as GameStateInfoMessage).type === MessageTypes.gameState;
