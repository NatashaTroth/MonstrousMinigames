import { MessageTypes } from '../../../../utils/constants';
import { Socket } from '../../../socket/Socket';

export default function handleStartClickedGame3(screenSocket: Socket) {
    screenSocket?.emit({
        type: MessageTypes.createGame,
        roomId: sessionStorage.getItem('roomId'),
    });
    screenSocket?.emit({
        type: MessageTypes.startGame,
        roomId: sessionStorage.getItem('roomId'),
    });
}
