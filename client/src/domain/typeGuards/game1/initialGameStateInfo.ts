import { MessageTypesGame1 } from '../../../utils/constants';
import { GameData } from '../../game1/screen/phaser/gameInterfaces';
import { MessageData } from '../MessageData';

export interface InitialGameStateInfoMessage {
    type: MessageTypesGame1.initialGameState;
    data: GameData;
}

export const initialGameStateInfoTypeGuard = (data: MessageData): data is InitialGameStateInfoMessage =>
    (data as InitialGameStateInfoMessage).type === MessageTypesGame1.initialGameState;
