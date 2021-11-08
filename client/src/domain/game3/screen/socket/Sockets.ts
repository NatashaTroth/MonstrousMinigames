import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import { InitialGameStateMessage, initialGameStateTypeGuard } from '../../../typeGuards/game3/initialGameState';
import { NewPhotoTopicMessage, newPhotoTopicTypeGuard } from '../../../typeGuards/game3/newPhotoTopic';
import { VoteForPhotoMessage, voteForPhotoMessageTypeGuard } from '../../../typeGuards/game3/voteForPhotos';

export interface HandleSetSocket3Dependencies {
    setTopicMessage: (val: { topic: string; countdownTime: number }) => void;
    setTimeIsUp: (val: boolean) => void;
}

export function handleSetScreenSocketGame3(socket: Socket, dependencies: HandleSetSocket3Dependencies) {
    const initialGameStateSocket = new MessageSocket(initialGameStateTypeGuard, socket);
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);

    const { setTopicMessage, setTimeIsUp } = dependencies;
    initialGameStateSocket.listen((data: InitialGameStateMessage) => {
        // TODO
    });

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        setTopicMessage({ topic: data.topic, countdownTime: data.countdownTime });
        setTimeIsUp(false);
    });
    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
        const { roomId, countdownTime, photoUrls } = data;
        //
        setTimeIsUp(true);
    });
}
