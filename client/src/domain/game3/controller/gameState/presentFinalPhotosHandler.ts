import { History } from 'history';

import { FinalPhoto } from '../../../../contexts/game3/Game3ContextProvider';
import { controllerPresentRoute } from '../../../../utils/routes';
import messageHandler from '../../../socket/messageHandler';
import { presentFinalPhotosTypeGuard } from '../../../typeGuards/game3/presentFinalPhotos';

interface Dependencies {
    setPresentFinalPhotos: (val: FinalPhoto) => void;
    history: History;
}
export const presentFinalPhotosHandler = messageHandler(
    presentFinalPhotosTypeGuard,
    (message, dependencies: Dependencies) => {
        const { photographerId, name, photoUrls, countdownTime, roomId } = message;

        dependencies.setPresentFinalPhotos({
            photographerId: photographerId,
            name: name,
            photoUrls: photoUrls,
            countdownTime: countdownTime,
        });
        dependencies.history.push(controllerPresentRoute(roomId));
    }
);
