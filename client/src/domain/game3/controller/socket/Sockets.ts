import { controllerGame3Route, controllerVoteRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import { NewPhotoTopicMessage, newPhotoTopicTypeGuard } from '../../../typeGuards/game3/newPhotoTopic';
import {
    photoPhotographerMapper,
    VoteForPhotoMessage,
    voteForPhotoMessageTypeGuard,
} from '../../../typeGuards/game3/voteForPhotos';

export interface HandleSetSocket3ControllerDependencies {
    setVoteForPhotoMessage: (val: { photoUrls: photoPhotographerMapper[]; countdownTime: number }) => void;
}

export function handleSetControllerSocketGame3(socket: Socket, dependencies: HandleSetSocket3ControllerDependencies) {
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);

    const { setVoteForPhotoMessage } = dependencies;

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        history.push(controllerGame3Route(data.roomId));
        // TODO
    });

    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
        setVoteForPhotoMessage({ photoUrls: data.photoUrls, countdownTime: data.countdownTime });
        history.push(controllerVoteRoute(data.roomId));
    });
}
