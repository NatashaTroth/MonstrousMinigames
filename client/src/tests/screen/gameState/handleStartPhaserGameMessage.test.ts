import { createMemoryHistory } from "history";

import {
    handleStartPhaserGameMessage
} from "../../../domain/commonGameState/screen/handleStartPhaserGameMessage";
import { screenGame1Route } from "../../../utils/routes";

describe('handleStartPhaserGameMessage', () => {
    const roomId = '1234';

    it('when phaser game has started, history push should be called', () => {
        const history = createMemoryHistory();
        const setGameStarted = jest.fn();

        handleStartPhaserGameMessage({ roomId, dependencies: { history, setGameStarted } });

        expect(history.location).toHaveProperty('pathname', screenGame1Route(roomId));
    });

    it('handed setGameStarted should be called with true', () => {
        const history = createMemoryHistory();
        const setGameStarted = jest.fn();

        handleStartPhaserGameMessage({
            roomId,
            dependencies: { history, setGameStarted },
        });

        expect(setGameStarted).toHaveBeenCalledWith(true);
    });
});
