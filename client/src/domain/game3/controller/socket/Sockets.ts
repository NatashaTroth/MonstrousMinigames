import { controllerVoteRoute } from '../../../../utils/routes';
import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import { NewPhotoTopicMessage, newPhotoTopicTypeGuard } from '../../../typeGuards/game3/newPhotoTopic';
import { VoteForPhotoMessage, voteForPhotoMessageTypeGuard } from '../../../typeGuards/game3/voteForPhotos';

import history from "../../../history/history";

export function handleSetControllerSocketGame3(socket: Socket) {
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);
    const voteForPhotoSocket = new MessageSocket(voteForPhotoMessageTypeGuard, socket);
    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        // TODO
    });

    voteForPhotoSocket.listen((data: VoteForPhotoMessage) => {
    
        const { roomId , countdownTime, photoUrls} = data;    
        history.push(controllerVoteRoute(roomId));
    })
}
