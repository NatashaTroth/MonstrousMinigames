import { IMessage } from '../../../interfaces/messages';

export interface IMessagePhotoVote extends IMessage {
    voterId: string;
    photographerId: string;
}
