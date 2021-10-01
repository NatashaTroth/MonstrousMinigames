import { MessageSocket } from "../../../socket/MessageSocket";
import { Socket } from "../../../socket/Socket";
import {
    InitialGameStateMessage, initialGameStateTypeGuard
} from "../../../typeGuards/game3/initialGameState";
import {
    NewPhotoTopicMessage, newPhotoTopicTypeGuard
} from "../../../typeGuards/game3/newPhotoTopic";

export function handleSetScreenSocketGame3(socket: Socket) {
    const initialGameStateSocket = new MessageSocket(initialGameStateTypeGuard, socket);
    const newPhotoTopicSocket = new MessageSocket(newPhotoTopicTypeGuard, socket);

    initialGameStateSocket.listen((data: InitialGameStateMessage) => {
        // TODO
    });

    newPhotoTopicSocket.listen((data: NewPhotoTopicMessage) => {
        // TODO
    });
}
