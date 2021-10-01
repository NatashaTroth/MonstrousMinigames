import { MessageTypes, MessageTypesGame3 } from "../../../../utils/constants";
import { Socket } from "../../../socket/Socket";

export default function handleStartClickedGame3(screenSocket: Socket) {
    // eslint-disable-next-line no-console
    console.log('hier');
    screenSocket?.emit({
        type: MessageTypesGame3.createGame,
        roomId: sessionStorage.getItem('roomId'),
    });
    screenSocket?.emit({
        type: MessageTypes.startGame,
        roomId: sessionStorage.getItem('roomId'),
    });
}
