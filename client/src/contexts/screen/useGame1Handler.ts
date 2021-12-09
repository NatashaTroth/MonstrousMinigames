
import { useStartPhaserGameHandler } from '../../domain/game1/screen/gameState/startPhaserGameHandler';
import { Socket } from '../../domain/socket/Socket';

export const useGame1Handler = (socket: Socket) => {
    useStartPhaserGameHandler(socket);
};
