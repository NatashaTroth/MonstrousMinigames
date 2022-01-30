import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { GamePhases } from '../../../contexts/game2/Game2ContextProvider';
import {
    phaseChangedHandler,
    usePhaseChangedHandler,
} from '../../../domain/game2/controller/gameState/phaseChangeHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { PhaseChangedMessage } from '../../../domain/typeGuards/game2/phaseChanged';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('phaseChangeHandler', () => {
    const roomId = 'ANES';
    const message: PhaseChangedMessage = {
        type: MessageTypesGame2.phaseChanged,
        roomId,
        phase: GamePhases.counting,
        round: 1,
    };

    it('when PhaseChangedMessage is written, setPhase should be called', async () => {
        const setPhase = jest.fn();
        const setRoundIdx = jest.fn();
        const history = createMemoryHistory();
        const socket = new FakeInMemorySocket();

        const withDependencies = phaseChangedHandler({ setPhase, setRoundIdx, history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setPhase).toHaveBeenCalledTimes(1);
    });
});

describe('usePhaseChangeHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const phaseChangeHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => usePhaseChangedHandler(socket, phaseChangeHandler));

        expect(phaseChangeHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const phaseChangeHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => usePhaseChangedHandler(socket, phaseChangeHandler));

        expect(phaseChangeHandler).toHaveBeenCalledTimes(0);
    });
});
