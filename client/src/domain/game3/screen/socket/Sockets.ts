import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import { NewPhotoTopicMessage, newPhotoTopicTypeGuard } from '../../../typeGuards/game3/newPhotoTopic';
import { NewRoundMessage, newRoundTypeGuard } from '../../../typeGuards/game3/newRound';
import { VoteForPhotoMessage, voteForPhotoMessageTypeGuard } from '../../../typeGuards/game3/voteForPhotos';

export interface HandleSetSocket3Dependencies {
    setTopicMessage: (val: { topic: string; countdownTime: number }) => void;
    setTimeIsUp: (val: boolean) => void;
    setRoundIdx: (roundIdx: number) => void;
}

export function handleSetScreenSocketGame3(socket: Socket, dependencies: HandleSetSocket3Dependencies) {
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);
    const newRoundSocket = new MessageSocket(newRoundTypeGuard, socket);

    const { setTopicMessage, setTimeIsUp, setRoundIdx } = dependencies;

    newRoundSocket.listen((data: NewRoundMessage) => {
        setRoundIdx(data.roundIdx);
    });

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        setTopicMessage({ topic: data.topic, countdownTime: data.countdownTime });
        setTimeIsUp(false);
    });

    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
        setTimeIsUp(true);
    });
}
