import { IMessage } from '../../../interfaces/messages';

export interface IMessageStunPlayer extends IMessage {
    receivingUserId: string;
}
