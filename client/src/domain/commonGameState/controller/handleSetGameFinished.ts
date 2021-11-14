import { FirebaseStorage } from '@firebase/storage';

import { GameNames } from '../../../config/games';
import { deleteFiles } from '../../game3/controller/gameState/handleFiles';

export function handleSetGameFinished(
    finished: boolean,
    chosenGame: GameNames | undefined,
    storage: FirebaseStorage | undefined,
    roomId: string | undefined,
    dependencies: {
        setFinished: (val: boolean) => void;
    }
) {
    document.body.style.overflow = 'visible';
    document.body.style.position = 'static';
    document.body.style.userSelect = 'auto';

    dependencies.setFinished(finished);

    if (chosenGame === GameNames.game3) {
        deleteFiles(storage, roomId);
    }
}
