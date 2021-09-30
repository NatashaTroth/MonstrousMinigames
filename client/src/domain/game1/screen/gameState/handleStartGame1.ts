import { MessageTypesGame1 } from '../../../../utils/constants';
import { Socket } from '../../../socket/Socket';

export default function handleStartGame1(screenSocket: Socket) {
    // eslint-disable-next-line no-console
    console.log('start2');
    screenSocket?.emit({
        type: MessageTypesGame1.startPhaserGame,
        roomId: sessionStorage.getItem('roomId'),
        userId: sessionStorage.getItem('userId'),
    });
}
