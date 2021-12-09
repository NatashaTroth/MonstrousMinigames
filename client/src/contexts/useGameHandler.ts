
import { useConnectedUsersHandler } from '../domain/commonGameState/controller/connectedUsersHandler';
import { useGameFinishedHandler } from '../domain/commonGameState/controller/gameFinishedHandler';
import { usePlayerFinishedHandler } from '../domain/commonGameState/controller/handlePlayerFinishedMessage';
import { useResetHandler } from '../domain/commonGameState/controller/resetHandler';
import { useStartedHandler } from '../domain/commonGameState/controller/startedHandler';
import { useStopHandler } from '../domain/commonGameState/controller/stopHandler';
import { useUserInitHandler } from '../domain/commonGameState/controller/userInitHandler';
import { useGameSetHandler } from '../domain/commonGameState/gameSetHandler';
import { usePauseHandler } from '../domain/commonGameState/pauseHandler';
import { useResumeHandler } from '../domain/commonGameState/resumeHandler';
import { Socket } from '../domain/socket/Socket';

export const useGameHandler = (socket: Socket) => {
    useConnectedUsersHandler(socket);
    usePauseHandler(socket);
    useResumeHandler(socket);
    useGameSetHandler(socket);
    useStopHandler(socket);
    useStartedHandler(socket);
    useGameFinishedHandler(socket);
    useResetHandler(socket);
    usePlayerFinishedHandler(socket);
    useUserInitHandler(socket);
};
