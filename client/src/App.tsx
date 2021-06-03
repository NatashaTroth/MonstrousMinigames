import * as React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Route, Router, Switch } from 'react-router-dom';

import { AppContainer } from './App.sc';
import Credits from './components/common/Credits';
import Settings from './components/common/Settings';
import ChooseCharacter from './components/Controller/ChooseCharacter';
import { ConnectScreen as ControllerConnectScreen } from './components/Controller/ConnectScreen';
import { FinishedScreen as ControllerFinishedScreen } from './components/Controller/FinishedScreen';
import { Lobby as ControllerLobbyScreen } from './components/Controller/Lobby';
import Spider from './components/Controller/Obstacles/Spider';
import Stone from './components/Controller/Obstacles/Stone';
import TreeTrunk from './components/Controller/Obstacles/TreeTrunk';
import Whole from './components/Controller/Obstacles/Whole';
import ShakeInstruction from './components/Controller/ShakeInstruction';
import ChooseGame from './components/Screen/ChooseGame';
import { ConnectScreen as ScreenConnectScreen } from './components/Screen/ConnectScreen';
import { FinishedScreen as ScreenFinishedScreen } from './components/Screen/FinishedScreen';
import Game from './components/Screen/Game';
import GameIntro from './components/Screen/GameIntro';
import { Lobby as ScreenLobbyScreen } from './components/Screen/Lobby';
import PlayersGetReady from './components/Screen/PlayersGetReady';
import AudioContextProvider from './contexts/AudioContextProvider';
import ControllerSocketContextProvider from './contexts/ControllerSocketContextProvider';
import GameContextProvider from './contexts/GameContextProvider';
import PlayerContextProvider from './contexts/PlayerContextProvider';
import ScreenSocketContextProvider from './contexts/ScreenSocketContextProvider';
import history from './domain/history/history';
import { ObstacleRoutes } from './utils/constants';

export interface IRouteParams {
    id?: string;
}

const App: React.FunctionComponent = () => {
    return (
        <Router history={history}>
            <AppContainer className="App">
                <AudioContextProvider>
                    <GameContextProvider>
                        <PlayerContextProvider>
                            <ScreenSocketContextProvider>
                                <ControllerSocketContextProvider>
                                    <Switch>
                                        <Route path="/credits" component={Credits} exact />
                                        <Route path="/settings" component={Settings} exact />
                                        <Route
                                            path="/controller/:id/choose-character"
                                            component={ChooseCharacter}
                                            exact
                                        />
                                        <Route path="/controller/:id/lobby" component={ControllerLobbyScreen} exact />
                                        <Route path="/controller/:id/game1" component={ShakeInstruction} exact />
                                        <Route
                                            path={`/controller/:id/${ObstacleRoutes.treeStump}`}
                                            component={TreeTrunk}
                                            exact
                                        />
                                        <Route
                                            path={`/controller/:id/${ObstacleRoutes.spider}`}
                                            component={Spider}
                                            exact
                                        />
                                        <Route
                                            path={`/controller/:id/${ObstacleRoutes.whole}`}
                                            component={Whole}
                                            exact
                                        />
                                        <Route
                                            path={`/controller/:id/${ObstacleRoutes.stone}`}
                                            component={Stone}
                                            exact
                                        />
                                        <Route
                                            path="/controller/:id/finished"
                                            component={ControllerFinishedScreen}
                                            exact
                                        />

                                        <Route path="/screen/:id/lobby" component={ScreenLobbyScreen} exact />
                                        <Route path="/screen/:id/choose-game" component={ChooseGame} exact />
                                        <Route path="/screen/:id/game-intro" component={GameIntro} exact />
                                        <Route path="/screen/:id/get-ready" component={PlayersGetReady} exact />
                                        <Route path="/screen/:id/game1" component={Game} exact />
                                        <Route path="/screen/:id/finished" component={ScreenFinishedScreen} exact />

                                        <Route
                                            path="/:id?"
                                            component={() =>
                                                isMobileOnly ? (
                                                    <ControllerConnectScreen history={history} />
                                                ) : (
                                                    <ScreenConnectScreen />
                                                )
                                            }
                                        />
                                    </Switch>
                                </ControllerSocketContextProvider>
                            </ScreenSocketContextProvider>
                        </PlayerContextProvider>
                    </GameContextProvider>
                </AudioContextProvider>
            </AppContainer>
        </Router>
    );
};

export default App;
