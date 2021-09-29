import { MessageTypesGame2 } from '../../../utils/constants';
import { GameData } from '../../game2/screen/phaser/gameInterfaces/GameData';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface GameStateInfoMessage {
    type: MessageTypesGame2.gameState;
    data: GameData;
}

export const gameStateInfoTypeGuard = (data: MessageDataGame2): data is GameStateInfoMessage =>
    (data as GameStateInfoMessage).type === MessageTypesGame2.gameState;
