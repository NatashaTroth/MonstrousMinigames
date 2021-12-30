import { MessageTypesGame2 } from '../../../../utils/constants';
import { Socket } from '../../../socket/Socket';

export default function handleStartGame2(screenSocket: Socket) {
    screenSocket?.emit({
        //received in backend
        type: MessageTypesGame2.startSheepGame,
        roomId: sessionStorage.getItem('roomId'),
        userId: sessionStorage.getItem('userId'),
    });
}
