import { FinalPhoto } from '../../../../contexts/game3/Game3ContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { presentFinalPhotosTypeGuard } from '../../../typeGuards/game3/presentFinalPhotos';

interface Dependencies {
    setPresentFinalPhotos: (val: FinalPhoto) => void;
}

export const presentFinalPhotosHandler = messageHandler(
    presentFinalPhotosTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setPresentFinalPhotos({
            photographerId: message.photographerId,
            name: message.name,
            photoUrls: message.photoUrls,
            countdownTime: message.countdownTime,
        });
    }
);
