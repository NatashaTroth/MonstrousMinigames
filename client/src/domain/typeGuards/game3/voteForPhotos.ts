import { MessageTypesGame3 } from '../../../utils/constants';
import { MessageDataGame3 } from './MessageDataGame3';

export interface PhotoUserMapper {
    photographerId: string;
    photoId: number;
    url: string;
}

export interface VoteForPhotoMessage {
    type: MessageTypesGame3.voteForPhotos;
    roomId: string;
    photoUrls: PhotoUserMapper[];
    countdownTime: number;
}

export const voteForPhotoMessageTypeGuard = (data: MessageDataGame3): data is VoteForPhotoMessage => {
    return (data as VoteForPhotoMessage).type === MessageTypesGame3.voteForPhotos;
};
