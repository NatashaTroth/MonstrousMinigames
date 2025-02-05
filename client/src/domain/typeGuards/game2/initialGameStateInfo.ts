import { MessageTypesGame2 } from '../../../utils/constants';
import { GameData } from '../../phaser/game2/gameInterfaces/GameData';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface InitialGameStateInfoMessage {
    type: MessageTypesGame2.initialGameState;
    data: GameData;
}

export const initialGameStateInfoTypeGuard = (data: MessageDataGame2): data is InitialGameStateInfoMessage =>
    (data as InitialGameStateInfoMessage).type === MessageTypesGame2.initialGameState;
