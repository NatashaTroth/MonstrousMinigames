import { createMemoryHistory } from "history";

import { MessageTypesGame1 } from "../../../../utils/constants";
import { InMemorySocketFake } from "../../../socket/InMemorySocketFake";
import { PlayerFinishedMessage } from "../../../typeGuards/game1/playerFinished";
import { handleSetControllerSocketGame1 } from "./Sockets";

describe('handleSetSocket', () => {
    const history = createMemoryHistory();
    const roomId = 'ABCD';

    const dependencies = {
        setPlayerFinished: jest.fn(),
        setObstacle: jest.fn(),
        setPlayerRank: jest.fn(),
        setPlayerDead: jest.fn(),
        history,
        setEarlySolvableObstacle: jest.fn(),
        setExceededChaserPushes: jest.fn(),
        setStunnablePlayers: jest.fn(),
    };

    it('when PlayerFinishedMessage was written, handed setPlayerFinished is executed', async () => {
        const message: PlayerFinishedMessage = {
            type: MessageTypesGame1.playerFinished,
            userId: '1',
            rank: 1,
        };

        const socket = new InMemorySocketFake();
        const setPlayerFinished = jest.fn();

        handleSetControllerSocketGame1(socket, roomId, false, { ...dependencies, setPlayerFinished });

        await socket.emit(message);

        expect(setPlayerFinished).toHaveBeenCalledTimes(1);
    });
});
