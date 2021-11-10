import { controllerGame3Route, controllerVoteRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import { NewPhotoTopicMessage, newPhotoTopicTypeGuard } from '../../../typeGuards/game3/newPhotoTopic';
import { NewRoundMessage, newRoundTypeGuard } from '../../../typeGuards/game3/newRound';
import {
    photoPhotographerMapper,
    VoteForPhotoMessage,
    voteForPhotoMessageTypeGuard,
} from '../../../typeGuards/game3/voteForPhotos';

export interface HandleSetSocket3ControllerDependencies {
    setVoteForPhotoMessage: (val: { photoUrls: photoPhotographerMapper[]; countdownTime: number }) => void;
    setRoundIdx: (roundIdx: number) => void;
    setTopicMessage: (props: { topic: string; countdownTime: number }) => void;
}

export function handleSetControllerSocketGame3(socket: Socket, dependencies: HandleSetSocket3ControllerDependencies) {
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);
    const newRoundSocket = new MessageSocket(newRoundTypeGuard, socket);

    const { setTopicMessage, setVoteForPhotoMessage, setRoundIdx } = dependencies;

    newRoundSocket.listen((data: NewRoundMessage) => {
        setRoundIdx(data.roundIdx);
    });

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        // eslint-disable-next-line no-console
        console.log(data);
        setTopicMessage({ topic: data.topic, countdownTime: data.countdownTime });
        history.push(controllerGame3Route(data.roomId));
    });

    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
        setVoteForPhotoMessage({ photoUrls: data.photoUrls, countdownTime: data.countdownTime });
        history.push(controllerVoteRoute(data.roomId));
    });
}
