import { NewPhotoTopicMessage } from './newPhotoTopic';
import { NewRoundMessage } from './newRound';
import { VoteForPhotoMessage } from './voteForPhotos';

export type MessageDataGame3 = NewPhotoTopicMessage | VoteForPhotoMessage | NewRoundMessage | undefined;
