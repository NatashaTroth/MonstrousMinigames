
import { useStartSheepGameHandler } from '../../domain/game2/screen/gameState/startSheepGameHandler';
import { Socket } from '../../domain/socket/Socket';

export const useGame2Handler = (socket: Socket) => {
    useStartSheepGameHandler(socket);
};
