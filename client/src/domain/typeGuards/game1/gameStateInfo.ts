import { MessageTypesGame1 } from '../../../utils/constants';
import { GameData } from '../../screen/phaser/gameInterfaces';
import { MessageData } from '../MessageData';

export interface GameStateInfoMessage {
    type: MessageTypesGame1.gameState;
    data: GameData;
}

export const gameStateInfoTypeGuard = (data: MessageData): data is GameStateInfoMessage =>
    (data as GameStateInfoMessage).type === MessageTypesGame1.gameState;
