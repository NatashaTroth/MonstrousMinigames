import { InitialGameStateMessage } from "./initialGameState";
import { NewPhotoTopicMessage } from "./newPhotoTopic";
import { VoteForPhotoMessage } from "./voteForPhotos";

export type MessageDataGame3 = InitialGameStateMessage | NewPhotoTopicMessage | VoteForPhotoMessage | undefined;
