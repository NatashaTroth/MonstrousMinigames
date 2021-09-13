import { MessageTypes } from '../../utils/constants';
import { GameData } from '../screen/phaser/gameInterfaces';
import { MessageData } from './MessageData';

export interface InitialGameStateInfoMessage {
    type: MessageTypes.initialGameState;
    data: GameData;
}

export const initialGameStateInfoTypeGuard = (data: MessageData): data is InitialGameStateInfoMessage =>
    (data as InitialGameStateInfoMessage).type === MessageTypes.initialGameState;
