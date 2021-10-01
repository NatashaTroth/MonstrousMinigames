import { createMemoryHistory } from "history";

import { GameNames } from "../../../utils/games";
import { handleGameStartedMessage } from "./handleGameStartedMessage";

describe('gameHasStarted function', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();
    const gameId = GameNames.game3;

    it('handed setGameStarted should be called with true', () => {
        handleGameStartedMessage({ roomId, gameId, dependencies: { setGameStarted, history } });

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });
});
