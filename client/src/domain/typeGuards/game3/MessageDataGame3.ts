import { FinalRoundCountdownMessage } from "./finalRoundCountdown";
import { NewPhotoTopicMessage } from "./newPhotoTopic";
import { NewRoundMessage } from "./newRound";
import { VoteForPhotoMessage } from "./voteForPhotos";
import { VotingResultsMessage } from "./votingResults";

export type MessageDataGame3 =
    | NewPhotoTopicMessage
    | VoteForPhotoMessage
    | NewRoundMessage
    | FinalRoundCountdownMessage
    | VotingResultsMessage
    | undefined;
