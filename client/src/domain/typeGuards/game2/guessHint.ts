import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface GuessHintMessage {
    type: MessageTypesGame2.guessHint;
    hint: string;
}

export const guessHintTypeGuard = (data: MessageDataGame2): data is GuessHintMessage =>
    (data as GuessHintMessage).type === MessageTypesGame2.guessHint;
