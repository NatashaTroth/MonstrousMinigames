import { useGuessHintHandler } from '../../domain/game2/controller/gameState/guessHintHandler';
import { usePhaseChangedHandler } from '../../domain/game2/controller/gameState/phaseChangeHandler';
import { Socket } from '../../domain/socket/Socket';

export const useGame2Handler = (socket: Socket) => {
    usePhaseChangedHandler(socket);
    useGuessHintHandler(socket);
};
