import { MessageTypesGame3 } from '../../../utils/constants';
import { MessageDataGame3 } from './MessageDataGame3';

export interface NewRoundMessage {
    type: MessageTypesGame3.newRound;
    roomId: string;
    roundIdx: number;
}

export const newRoundTypeGuard = (data: MessageDataGame3): data is NewRoundMessage => {
    return (data as NewRoundMessage).type === MessageTypesGame3.newRound;
};
