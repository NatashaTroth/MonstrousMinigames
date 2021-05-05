import * as React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Route, Router, Switch } from 'react-router-dom';

import { AppContainer } from './App.sc';
import Credits from './components/common/Credits';
import { ConnectScreen as ControllerConnectScreen } from './components/Controller/ConnectScreen';
import { FinishedScreen as ControllerFinishedScreen } from './components/Controller/FinishedScreen';
import { Lobby as ControllerLobbyScreen } from './components/Controller/Lobby';
import Spider from './components/Controller/Obstacles/Spider';
import TreeTrunk from './components/Controller/Obstacles/TreeTrunk';
import ShakeInstruction from './components/Controller/ShakeInstruction';
import { ConnectScreen as ScreenConnectScreen } from './components/Screen/ConnectScreen';
import { FinishedScreen as ScreenFinishedScreen } from './components/Screen/FinishedScreen';
import Game from './components/Screen/Game';
import { Lobby as ScreenLobbyScreen } from './components/Screen/Lobby';
import ControllerSocketContextProvider from './contexts/ControllerSocketContextProvider';
import GameContextProvider from './contexts/GameContextProvider';
import PlayerContextProvider from './contexts/PlayerContextProvider';
import ScreenSocketContextProvider from './contexts/ScreenSocketContextProvider';
import { ObstacleRoutes } from './utils/constants';
import history from './utils/history';

export interface IRouteParams {
    id?: string;
}

const App: React.FunctionComponent = () => {
    return (
        <Router history={history}>
            <AppContainer className="App">
                <GameContextProvider>
                    <PlayerContextProvider>
                        <ScreenSocketContextProvider>
                            <ControllerSocketContextProvider>
                                <Switch>
                                    Credits
                                    <Route path="/credits" component={Credits} exact />
                                    <Route path="/controller/:id/lobby" component={ControllerLobbyScreen} exact />
                                    <Route path="/controller/:id/game1" component={ShakeInstruction} exact />
                                    <Route
                                        path={`/controller/:id/${ObstacleRoutes.treeStump}`}
                                        component={TreeTrunk}
                                        exact
                                    />
                                    <Route path={`/controller/:id/${ObstacleRoutes.spider}`} component={Spider} exact />
                                    <Route path="/controller/:id/finished" component={ControllerFinishedScreen} exact />
                                    <Route path="/screen/:id/lobby" component={ScreenLobbyScreen} exact />
                                    <Route path="/screen/:id/game1" component={Game} exact />
                                    <Route path="/screen/:id/finished" component={ScreenFinishedScreen} exact />
                                    <Route
                                        path="/:id?"
                                        component={isMobileOnly ? ControllerConnectScreen : ScreenConnectScreen}
                                    />
                                </Switch>
                            </ControllerSocketContextProvider>
                        </ScreenSocketContextProvider>
                    </PlayerContextProvider>
                </GameContextProvider>
            </AppContainer>
        </Router>
    );
};

export default App;
