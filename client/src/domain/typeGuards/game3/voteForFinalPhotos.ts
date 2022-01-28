import { MessageTypesGame3 } from '../../../utils/constants';
import { MessageDataGame3 } from './MessageDataGame3';

export interface Photographer {
    id: string;
    name: string;
}

export interface VoteForFinalPhotosMessage {
    type: MessageTypesGame3.voteForFinalPhotos;
    roomId: string;
    photographers: Photographer[];
    countdownTime: number;
}

export const voteForFinalPhotosMessageTypeGuard = (data: MessageDataGame3): data is VoteForFinalPhotosMessage => {
    return (data as VoteForFinalPhotosMessage).type === MessageTypesGame3.voteForFinalPhotos;
};
