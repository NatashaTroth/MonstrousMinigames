import { Vote } from '../../../../contexts/game3/Game3ContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { voteForPhotoMessageTypeGuard } from '../../../typeGuards/game3/voteForPhotos';

interface Dependencies {
    setVoteForPhotoMessage: (val: Vote) => void;
}

export const voteForPhotoHandler = messageHandler(
    voteForPhotoMessageTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setVoteForPhotoMessage({ photoUrls: message.photoUrls, countdownTime: message.countdownTime });
    }
);
