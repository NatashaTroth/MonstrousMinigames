import { MessageTypesGame2 } from '../../../../utils/constants';
import { Socket } from '../../../socket/Socket';

export default function handleStartGame2(screenSocket: Socket) {
    screenSocket?.emit({
        type: MessageTypesGame2.startPhaserGame,
        roomId: sessionStorage.getItem('roomId'),
        userId: sessionStorage.getItem('userId'),
    });
}
