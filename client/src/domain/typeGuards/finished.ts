import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { GameStateData } from '../../contexts/ScreenSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface GameHasFinishedMessage {
    type: MessageTypes.gameHasFinished;
    data: GameStateData;
}

export const finishedTypeGuard = (data: MessageData): data is GameHasFinishedMessage =>
    (data as GameHasFinishedMessage).type === MessageTypes.gameHasFinished;
