import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import { InitialGameStateMessage, initialGameStateTypeGuard } from '../../../typeGuards/game3/initialGameState';
import { NewPhotoTopicMessage, newPhotoTopicTypeGuard } from '../../../typeGuards/game3/newPhotoTopic';

export interface HandleSetSocket3Dependencies {
    setTopicMessage: (val: string) => void;
}

export function handleSetScreenSocketGame3(socket: Socket, dependencies: HandleSetSocket3Dependencies) {
    const initialGameStateSocket = new MessageSocket(initialGameStateTypeGuard, socket);
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);
    const { setTopicMessage } = dependencies;
    initialGameStateSocket.listen((data: InitialGameStateMessage) => {
        // TODO
    });

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        setTopicMessage(data.topic);
    });
}
