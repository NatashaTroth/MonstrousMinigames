import { History } from 'history';

import { Vote } from '../../../../contexts/game3/Game3ContextProvider';
import { controllerVoteRoute } from '../../../../utils/routes';
import messageHandler from '../../../socket/messageHandler';
import { voteForFinalPhotosMessageTypeGuard } from '../../../typeGuards/game3/voteForFinalPhotos';

interface Dependencies {
    setVoteForPhotoMessage: (val: Vote) => void;
    history: History;
}

export const voteForFinalPhotosHandler = messageHandler(
    voteForFinalPhotosMessageTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setVoteForPhotoMessage({
            photographers: message.photographers,
            countdownTime: message.countdownTime,
        });
        dependencies.history.push(controllerVoteRoute(message.roomId));
    }
);
