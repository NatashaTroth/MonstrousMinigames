import { FinalPhoto, Vote } from '../../../../contexts/game3/Game3ContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { voteForFinalPhotosMessageTypeGuard } from '../../../typeGuards/game3/voteForFinalPhotos';

interface Dependencies {
    setVoteForPhotoMessage: (val: Vote) => void;
    setPresentFinalPhotos: (val: FinalPhoto) => void;
}

export const voteForFinalPhotosHandler = messageHandler(
    voteForFinalPhotosMessageTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setPresentFinalPhotos(undefined);
        dependencies.setVoteForPhotoMessage({
            photographers: message.photographers,
            countdownTime: message.countdownTime,
        });
    }
);
