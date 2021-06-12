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
import Hole from './components/Controller/Obstacles/Hole';
import Spider from './components/Controller/Obstacles/Spider';
import Stone from './components/Controller/Obstacles/Stone';
import TreeTrunk from './components/Controller/Obstacles/TreeTrunk';
import PlayerDead from './components/Controller/PlayerDead';
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
import { Routes } from './utils/routes';

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
                                        <Route path={Routes.credits} component={Credits} exact />
                                        <Route path={Routes.settings} component={Settings} exact />
                                        <Route
                                            path={Routes.controllerChooseCharacter}
                                            component={ChooseCharacter}
                                            exact
                                        />
                                        <Route path={Routes.controllerLobby} component={ControllerLobbyScreen} exact />
                                        <Route path={Routes.controllerGame1} component={ShakeInstruction} exact />
                                        <Route path={Routes.controllerTreeStump} component={TreeTrunk} exact />
                                        <Route path={Routes.controllerSpider} component={Spider} exact />
                                        <Route path={Routes.controllerHole} component={Hole} exact />
                                        <Route path={Routes.controllerStone} component={Stone} exact />
                                        <Route path={Routes.controllerPlayerDead} component={PlayerDead} exact />
                                        <Route
                                            path={Routes.controllerPlayerFinished}
                                            component={ControllerFinishedScreen}
                                            exact
                                        />

                                        <Route path={Routes.screenLobby} component={ScreenLobbyScreen} exact />
                                        <Route path={Routes.screenChooseGame} component={ChooseGame} exact />
                                        <Route path={Routes.screenGameIntro} component={GameIntro} exact />
                                        <Route path={Routes.screenGetReady} component={PlayersGetReady} exact />
                                        <Route path={Routes.screenGame1} component={Game} exact />
                                        <Route path={Routes.screenFinished} component={ScreenFinishedScreen} exact />

                                        <Route
                                            path={Routes.home}
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
