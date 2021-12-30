import { useMovementListener } from '../../domain/game1/controller/gameState/addMovementListener';
import { useApproachingObstacleHandler } from '../../domain/game1/controller/gameState/approachingObstacleHandler';
import { useDiedHandler } from '../../domain/game1/controller/gameState/diedHandler';
import { useExceededMaxChaserPushesHandler } from '../../domain/game1/controller/gameState/exceededMaxChaserPushesHandler';
import { useObstacleHandler } from '../../domain/game1/controller/gameState/obstacleHandler';
import { useStunnablePlayersHandler } from '../../domain/game1/controller/gameState/stunnablePlayersHandler';
import { useStunnedHandler } from '../../domain/game1/controller/gameState/stunnedHandler';
import { useUnstunnedHandler } from '../../domain/game1/controller/gameState/unstunnedHandler';
import { Socket } from '../../domain/socket/Socket';

export const useGame1Handler = (socket: Socket, permission: boolean) => {
    useObstacleHandler(socket);
    useStunnedHandler(socket);
    useUnstunnedHandler(socket);
    useStunnablePlayersHandler(socket);
    useDiedHandler(socket);
    useApproachingObstacleHandler(socket);
    useExceededMaxChaserPushesHandler(socket);
    useMovementListener(socket, permission);
};
