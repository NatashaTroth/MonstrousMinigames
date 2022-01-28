import { useChooseResponseHandler } from '../../domain/game2/controller/gameState/chooseResponseHandler';
import { useGuessHintHandler } from '../../domain/game2/controller/gameState/guessHintHandler';
import { usePhaseChangedHandler } from '../../domain/game2/controller/gameState/phaseChangeHandler';
import { useRemainingKillsHandler } from '../../domain/game2/controller/gameState/remainingKillsHandler';
import { Socket } from '../../domain/socket/Socket';

export const useGame2Handler = (socket: Socket) => {
    usePhaseChangedHandler(socket);
    useGuessHintHandler(socket);
    useChooseResponseHandler(socket);
    useRemainingKillsHandler(socket);
};
