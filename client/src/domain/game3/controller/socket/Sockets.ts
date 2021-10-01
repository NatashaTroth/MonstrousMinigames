import { MessageSocket } from "../../../socket/MessageSocket";
import { Socket } from "../../../socket/Socket";
import {
    NewPhotoTopicMessage, newPhotoTopicTypeGuard
} from "../../../typeGuards/game3/newPhotoTopic";

export function handleSetControllerSocketGame3(socket: Socket) {
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        //
    });
}
