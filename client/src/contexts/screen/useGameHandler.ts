import { useGameSetHandler } from '../../domain/commonGameState/gameSetHandler';
import { usePauseHandler } from '../../domain/commonGameState/pauseHandler';
import { useResumeHandler } from '../../domain/commonGameState/resumeHandler';
import { useConnectedUsersHandler } from '../../domain/commonGameState/screen/connectedUsersHandler';
import { useFinishedHandler } from '../../domain/commonGameState/screen/finishedHandler';
import { useLeaderboardStateHandler } from '../../domain/commonGameState/screen/leaderboardStateHandler';
import { useResetHandler } from '../../domain/commonGameState/screen/resetHandler';
import { useScreenAdminHandler } from '../../domain/commonGameState/screen/screenAdminHandler';
import { useScreenStateHandler } from '../../domain/commonGameState/screen/screenStateHandler';
import { useStartHandler } from '../../domain/commonGameState/screen/startHandler';
import { useStopHandler } from '../../domain/commonGameState/screen/stopHandler';
import { Socket } from '../../domain/socket/Socket';

export const useGameHandler = (socket: Socket) => {
    useGameSetHandler(socket);
    usePauseHandler(socket);
    useResumeHandler(socket);
    useResetHandler(socket);
    useConnectedUsersHandler(socket);
    useStopHandler(socket);
    useScreenAdminHandler(socket);
    useScreenStateHandler(socket);
    useFinishedHandler(socket);
    useStartHandler(socket);
    useLeaderboardStateHandler(socket);
};
