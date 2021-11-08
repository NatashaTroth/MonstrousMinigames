/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import React from 'react';
import { Router } from 'react-router-dom';

import {
    ControllerSocketContext,
    defaultValue as socketDefaultValue,
} from '../../../contexts/ControllerSocketContextProvider';
import { defaultValue as game1DefaultValue, Game1Context } from '../../../contexts/game1/Game1ContextProvider';
import { defaultValue as gameDefaultValue, GameContext } from '../../../contexts/GameContextProvider';
import { defaultValue as playerDefaultValue, PlayerContext } from '../../../contexts/PlayerContextProvider';
import Stone from '../../../domain/game1/controller/components/obstacles/Stone';
import { StyledStone } from '../../../domain/game1/controller/components/obstacles/Stone.sc';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import theme from '../../../styles/theme';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';
import { controllerObstacleRoute } from '../../../utils/routes';

configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('Stone', () => {
    const roomId = 'ABCD';

    it('renders availableUsers', () => {
        const userName = 'Max';
        const connectedUsers = [
            {
                id: '2',
                name: userName,
                roomId,
                number: 1,
                ready: true,
                active: true,
                characterNumber: 1,
            },
        ];
        const stunnablePlayers = ['2'];
        const history = createMemoryHistory();
        history.push(`${controllerObstacleRoute(roomId, ObstacleTypes.stone)}?choosePlayer=true`);

        const container = mount(
            <Router history={history}>
                <ThemeProvider theme={theme}>
                    <PlayerContext.Provider value={{ ...playerDefaultValue, userId: '1' }}>
                        <GameContext.Provider value={{ ...gameDefaultValue, connectedUsers }}>
                            <Game1Context.Provider value={{ ...game1DefaultValue, stunnablePlayers }}>
                                <Stone history={history} />
                            </Game1Context.Provider>
                        </GameContext.Provider>
                    </PlayerContext.Provider>
                </ThemeProvider>
            </Router>
        );
        expect(container.findWhere(node => node.text() === userName)).toBeTruthy();
    });

    it('when handleThrowStone is called, the selected userId is emmited to the socket', () => {
        const userName = 'Max';
        const receivingUserId = '2';
        const connectedUsers = [
            {
                id: receivingUserId,
                name: userName,
                roomId,
                number: 1,
                ready: true,
                active: true,
                characterNumber: 1,
            },
        ];
        const stunnablePlayers = ['2'];
        const history = createMemoryHistory();
        history.push(`${controllerObstacleRoute(roomId, ObstacleTypes.stone)}?choosePlayer=true`);
        const controllerSocket = new InMemorySocketFake();
        const userId = '1';

        const container = mount(
            <ThemeProvider theme={theme}>
                <ControllerSocketContext.Provider value={{ ...socketDefaultValue, controllerSocket }}>
                    <PlayerContext.Provider value={{ ...playerDefaultValue, userId }}>
                        <GameContext.Provider value={{ ...gameDefaultValue, connectedUsers }}>
                            <Game1Context.Provider value={{ ...game1DefaultValue, stunnablePlayers }}>
                                <Stone history={history} />
                            </Game1Context.Provider>
                        </GameContext.Provider>
                    </PlayerContext.Provider>
                </ControllerSocketContext.Provider>
            </ThemeProvider>
        );

        container
            .findWhere(node => node.text() === userName)
            .first()
            .simulate('click');

        container
            .findWhere(node => node.type() === 'button' && node.text() === 'Throw Stone')
            .first()
            .simulate('click');

        expect(controllerSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypesGame1.stunPlayer,
                userId,
                receivingUserId,
            },
        ]);
    });

    it('if no obstacle is given, nothing should be emmited to the socket', () => {
        const userName = 'Max';
        const receivingUserId = '2';
        const connectedUsers = [
            {
                id: receivingUserId,
                name: userName,
                roomId,
                number: 1,
                ready: true,
                active: true,
                characterNumber: 1,
            },
        ];
        const stunnablePlayers = ['2'];
        const history = createMemoryHistory();
        const controllerSocket = new InMemorySocketFake();
        const userId = '1';

        const container = mount(
            <ThemeProvider theme={theme}>
                <ControllerSocketContext.Provider value={{ ...socketDefaultValue, controllerSocket }}>
                    <PlayerContext.Provider value={{ ...playerDefaultValue, userId }}>
                        <GameContext.Provider value={{ ...gameDefaultValue, connectedUsers }}>
                            <Game1Context.Provider
                                value={{ ...game1DefaultValue, stunnablePlayers, obstacle: undefined }}
                            >
                                <Stone history={history} />
                            </Game1Context.Provider>
                        </GameContext.Provider>
                    </PlayerContext.Provider>
                </ControllerSocketContext.Provider>
            </ThemeProvider>
        );

        const touchContainer = container.find(StyledStone).first();

        for (let i = 0; i <= 10; i++) {
            touchContainer.simulate('touchStart');
        }

        container
            .findWhere(node => node.text() === userName)
            .first()
            .simulate('click');

        container
            .findWhere(node => node.type() === 'button' && node.text() === 'Throw Stone')
            .first()
            .simulate('click');

        expect(controllerSocket.emitedVals).toStrictEqual([]);
    });

    it('if obstacle is given, obstacleSolved should be emmited to the socket', () => {
        const userName = 'Max';
        const receivingUserId = '2';
        const connectedUsers = [
            {
                id: receivingUserId,
                name: userName,
                roomId,
                number: 1,
                ready: true,
                active: true,
                characterNumber: 1,
            },
        ];
        const stunnablePlayers = ['2'];
        const history = createMemoryHistory();
        const controllerSocket = new InMemorySocketFake();
        const userId = '1';
        const obstacle = {
            id: 1,
            type: ObstacleTypes.stone,
        };

        const container = mount(
            <ThemeProvider theme={theme}>
                <ControllerSocketContext.Provider value={{ ...socketDefaultValue, controllerSocket }}>
                    <PlayerContext.Provider value={{ ...playerDefaultValue, userId }}>
                        <GameContext.Provider value={{ ...gameDefaultValue, connectedUsers }}>
                            <Game1Context.Provider value={{ ...game1DefaultValue, stunnablePlayers, obstacle }}>
                                <Stone history={history} />
                            </Game1Context.Provider>
                        </GameContext.Provider>
                    </PlayerContext.Provider>
                </ControllerSocketContext.Provider>
            </ThemeProvider>
        );

        const touchContainer = container.find(StyledStone).first();

        for (let i = 0; i <= 10; i++) {
            touchContainer.simulate('touchStart');
        }

        container
            .findWhere(node => node.text() === userName)
            .first()
            .simulate('click');

        container
            .findWhere(node => node.type() === 'button' && node.text() === 'Throw Stone')
            .first()
            .simulate('click');

        expect(controllerSocket.emitedVals[0]).toEqual({
            type: MessageTypesGame1.obstacleSolved,
            obstacleId: obstacle.id,
        });
    });

    it('if obstacle is given and stone gets collected, obstacleSolved should be emmited to the socket', () => {
        const userName = 'Max';
        const receivingUserId = '2';
        const connectedUsers = [
            {
                id: receivingUserId,
                name: userName,
                roomId,
                number: 1,
                ready: true,
                active: true,
                characterNumber: 1,
            },
        ];
        const stunnablePlayers = ['2'];
        const history = createMemoryHistory();
        const controllerSocket = new InMemorySocketFake();
        const userId = '1';
        const obstacle = {
            id: 1,
            type: ObstacleTypes.stone,
        };

        const container = mount(
            <ThemeProvider theme={theme}>
                <ControllerSocketContext.Provider value={{ ...socketDefaultValue, controllerSocket }}>
                    <PlayerContext.Provider value={{ ...playerDefaultValue, userId }}>
                        <GameContext.Provider value={{ ...gameDefaultValue, connectedUsers }}>
                            <Game1Context.Provider value={{ ...game1DefaultValue, stunnablePlayers, obstacle }}>
                                <Stone history={history} />
                            </Game1Context.Provider>
                        </GameContext.Provider>
                    </PlayerContext.Provider>
                </ControllerSocketContext.Provider>
            </ThemeProvider>
        );

        const touchContainer = container.find(StyledStone).first();

        for (let i = 0; i <= 10; i++) {
            touchContainer.simulate('touchStart');
        }

        container
            .findWhere(node => node.text() === userName)
            .first()
            .simulate('click');

        container
            .findWhere(node => node.type() === 'button' && node.text() === 'Collect Stone')
            .first()
            .simulate('click');

        expect(controllerSocket.emitedVals[0]).toEqual({
            type: MessageTypesGame1.obstacleSolved,
            obstacleId: obstacle.id,
        });
    });
});
