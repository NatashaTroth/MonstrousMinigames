import { IMessage } from '../../../interfaces/messages';
import { Vote } from './';

export interface IMessagePhotoVote extends IMessage {
    votes: Vote[];
}
