import { createMemoryHistory } from "history";

import {
    gameFinishedHandler
} from "../../../domain/commonGameState/controller/gameFinishedHandler";
import { InMemorySocketFake } from "../../../domain/socket/InMemorySocketFake";
import { GameHasFinishedMessage } from "../../../domain/typeGuards/finished";
import { GameState, MessageTypes } from "../../../utils/constants";
import { controllerFinishedRoute } from "../../../utils/routes";

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('gameFinishedHandler', () => {
    const roomId = 'ADEW';
    const playerRank = 1;
    const playerRanks = [
        {
            id: '1',
            name: 'Test',
            rank: 1,
            finished: true,
            totalTimeInMs: 123,
            positionX: 0,
            isActive: true,
            dead: false,
        },
    ];
    const message: GameHasFinishedMessage = {
        type: MessageTypes.gameHasFinished,
        data: {
            gameState: GameState.finished,
            numberOfObstacles: 4,
            roomId,
            trackLength: 5000,
            playersState: [],
            playerRanks,
        },
    };

    it('when GameHasFinishedMessage was written, history should change to given route', async () => {
        const setPlayerRank = jest.fn();
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = gameFinishedHandler({ setPlayerRank, history, playerRank });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', controllerFinishedRoute(roomId));
    });

    it('when GameHasFinishedMessage was written, handed setPlayerRank function should be called', async () => {
        const setPlayerRank = jest.fn();
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        global.sessionStorage.setItem('userId', '1');

        const withDependencies = gameFinishedHandler({
            playerRank: undefined,
            setPlayerRank,
            history,
        });

        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setPlayerRank).toHaveBeenCalledTimes(1);
    });

    it('when GameHasFinishedMessage was written, handed setPlayerRank function should not be called if no userId is in storage', async () => {
        const setPlayerRank = jest.fn();
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const playerRanks = [
            {
                id: '1',
                name: 'Test',
                rank: undefined,
                finished: true,
                totalTimeInMs: 123,
                positionX: 0,
                isActive: true,
                dead: false,
            },
        ];

        const withDependencies = gameFinishedHandler({
            playerRank: undefined,
            setPlayerRank,
            history,
        });

        withDependencies(socket, roomId);

        await socket.emit({ ...message, playerRanks });

        expect(setPlayerRank).toHaveBeenCalledTimes(0);
    });

    it('when GameHasFinishedMessage was written, stoneTimeoutId should be remove from sessionStorage', async () => {
        const setPlayerRank = jest.fn();
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        global.sessionStorage.setItem('windmillTimeoutId', '1');

        const withDependencies = gameFinishedHandler({
            playerRank: undefined,
            setPlayerRank,
            history,
        });

        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(global.sessionStorage.getItem('windmillTimeoutId')).toBe(null);
    });
});
