import { FinalResultsMessage } from './finalResults';
import { FinalRoundCountdownMessage } from './finalRoundCountdown';
import { NewPhotoTopicMessage } from './newPhotoTopic';
import { NewRoundMessage } from './newRound';
import { PresentFinalPhotosMessage } from './presentFinalPhotos';
import { VoteForFinalPhotosMessage } from './voteForFinalPhotos';
import { VoteForPhotoMessage } from './voteForPhotos';
import { VotingResultsMessage } from './votingResults';

export type MessageDataGame3 =
    | NewPhotoTopicMessage
    | VoteForPhotoMessage
    | NewRoundMessage
    | FinalRoundCountdownMessage
    | VotingResultsMessage
    | VoteForFinalPhotosMessage
    | PresentFinalPhotosMessage
    | FinalResultsMessage
    | undefined;
