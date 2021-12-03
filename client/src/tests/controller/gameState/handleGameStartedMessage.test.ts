import { createMemoryHistory } from "history";

import { GameNames } from "../../../config/games";
import {
    handleGameStartedMessage
} from "../../../domain/commonGameState/controller/handleGameStartedMessage";
import {
    controllerGame1Route, controllerGame2Route, controllerGame3Route
} from "../../../utils/routes";

describe('gameHasStarted function', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();
    const game = GameNames.game1;
    const countdownTime = 3000;

    it('handed setGameStarted should be called with true', () => {
        const withDependencies = handleGameStartedMessage({
            setGameStarted,
            history,
            setCountdownTime: jest.fn(),
        });

        withDependencies({ roomId, game, countdownTime });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });

    it('when game is game1, history should redirect to game1', () => {
        const history = createMemoryHistory();
        const game = GameNames.game1;

        const withDependencies = handleGameStartedMessage({
            setGameStarted,
            history,
            setCountdownTime: jest.fn(),
        });

        withDependencies({ roomId, game, countdownTime });

        expect(history.location).toHaveProperty('pathname', controllerGame1Route(roomId));
    });

    it('when game is game2, history should redirect to game2', () => {
        const history = createMemoryHistory();
        const game = GameNames.game2;

        const withDependencies = handleGameStartedMessage({
            setGameStarted,
            history,
            setCountdownTime: jest.fn(),
        });

        withDependencies({ roomId, game, countdownTime });

        expect(history.location).toHaveProperty('pathname', controllerGame2Route(roomId));
    });

    it('when game is game3, history should redirect to game3', () => {
        const history = createMemoryHistory();
        const game = GameNames.game3;

        const withDependencies = handleGameStartedMessage({
            setGameStarted,
            history,
            setCountdownTime: jest.fn(),
        });

        withDependencies({ roomId, game, countdownTime });

        expect(history.location).toHaveProperty('pathname', controllerGame3Route(roomId));
    });
});
