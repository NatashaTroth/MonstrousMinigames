/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import { createMemoryHistory } from 'history';

import {
    handleCollectStone,
    handleImmediateThrow,
    handleThrow,
} from '../../../domain/game1/controller/gameState/handleStoneObstacle';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('handleCollectStone', () => {
    const roomId = 'ABCD';
    const obstacle = {
        type: ObstacleTypes.stone,
        id: 1,
    };

    it('when handleCollectedStone is called, solved message should be emitted to socket', () => {
        const socket = new FakeInMemorySocket();
        const setHasStone = jest.fn();
        const setEarlySolvableObstacle = jest.fn();
        const resetBodyStyles = jest.fn();

        const history = createMemoryHistory();

        handleCollectStone({
            controllerSocket: socket,
            obstacle,
            setHasStone,
            setEarlySolvableObstacle,
            resetBodyStyles,
            history,
            roomId,
        });

        expect(socket.emitedVals).toStrictEqual([{ type: MessageTypesGame1.obstacleSolved, obstacleId: obstacle.id }]);
    });
});

describe('handleThrow', () => {
    const roomId = 'ABCD';
    const receivingUserId = '1';
    const userId = '2';

    it('when handleThrow is called, stunPlayer message should be emitted to socket', () => {
        const socket = new FakeInMemorySocket();
        const setEarlySolvableObstacle = jest.fn();
        const resetBodyStyles = jest.fn();

        const history = createMemoryHistory();

        handleThrow({
            controllerSocket: socket,
            setEarlySolvableObstacle,
            resetBodyStyles,
            history,
            roomId,
            receivingUserId,
            userId,
        });

        expect(socket.emitedVals).toStrictEqual([{ type: MessageTypesGame1.stunPlayer, receivingUserId, userId }]);
    });
});

describe('handleImmediateThrow', () => {
    const roomId = 'ABCD';
    const receivingUserId = '1';
    const userId = '2';
    const obstacle = {
        type: ObstacleTypes.stone,
        id: 1,
    };

    it('when handleImmediateThrow is called, obstacleSolved message should be emitted to socket', () => {
        const socket = new FakeInMemorySocket();
        const setEarlySolvableObstacle = jest.fn();
        const resetBodyStyles = jest.fn();

        const history = createMemoryHistory();

        handleImmediateThrow({
            controllerSocket: socket,
            setEarlySolvableObstacle,
            resetBodyStyles,
            history,
            roomId,
            receivingUserId,
            userId,
            obstacle,
        });

        expect(socket.emitedVals[0]).toStrictEqual({ type: MessageTypesGame1.obstacleSolved, obstacleId: obstacle.id });
    });
});
