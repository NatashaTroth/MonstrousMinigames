import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Route, Router, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { AppContainer } from './App.sc';
import Credits from './components/common/Credits';
import GameWrapper from './components/common/GameWrapper';
import MasterHeader from './components/common/MasterHeader';
import PausedDialog from './components/common/PausedDialog';
import Settings from './components/common/Settings';
import ChooseCharacter from './components/controller/ChooseCharacter';
import { ConnectScreen as ControllerConnectScreen } from './components/controller/ConnectScreen';
import { FinishedScreen as ControllerFinishedScreen } from './components/controller/FinishedScreen';
import { Lobby as ControllerLobbyScreen } from './components/controller/Lobby';
import { NoPermissions } from './components/controller/NoPermissions';
import ChooseGame from './components/screen/ChooseGame';
import { ConnectScreen as ScreenConnectScreen } from './components/screen/ConnectScreen';
import { FinishedScreen as ScreenFinishedScreen } from './components/screen/FinishedScreen';
import GameIntro from './components/screen/GameIntro';
import { Lobby as ScreenLobbyScreen } from './components/screen/Lobby';
import PlayersGetReady from './components/screen/PlayersGetReady';
import ScreenWrapper from './components/screen/ScreenWrapper';
import ControllerSocketContextProvider from './contexts/ControllerSocketContextProvider';
import FirebaseContextProvider from './contexts/FirebaseContextProvider';
import GameContextProvider from './contexts/GameContextProvider';
import PlayerContextProvider from './contexts/PlayerContextProvider';
import ScreenSocketContextProvider from './contexts/ScreenSocketContextProvider';
import Spider from './domain/game1/controller/components/obstacles/Spider';
import Stone from './domain/game1/controller/components/obstacles/Stone';
import Trash from './domain/game1/controller/components/obstacles/Trash';
import TreeTrunk from './domain/game1/controller/components/obstacles/TreeTrunk';
import PlayerDead from './domain/game1/controller/components/PlayerDead';
import PlayerStunned from './domain/game1/controller/components/PlayerStunned';
import ShakeInstruction from './domain/game1/controller/components/ShakeInstruction';
import Windmill from './domain/game1/controller/components/Windmill';
import Game from './domain/game1/screen/components/Game';
import Game2 from './domain/game2/screen/components/Game2';
import TakePicture from './domain/game3/controller/components/TakePicture';
import Vote from './domain/game3/controller/components/Vote';
import Game3 from './domain/game3/screen/components/Game3';
import history from './domain/history/history';
import { navigator } from './domain/navigator/NavigatorAdapter';
import { sessionStorage } from './domain/storage/SessionStorage';
import { ClickRequestDeviceMotion, getMicrophoneStream } from './domain/user/permissions';
import theme from './styles/theme';
import { Routes } from './utils/routes';

export interface RouteParams {
    id?: string;
}

const App: React.FunctionComponent = () => {
    const [micPermission, setMicPermissions] = React.useState(false);
    const [motionPermission, setMotionPermissions] = React.useState(false);

    async function getMicrophonePermission() {
        const permission = await getMicrophoneStream(navigator);
        setMicPermissions(permission);
    }

    async function getMotionPermission() {
        const permission = await ClickRequestDeviceMotion(window);
        setMotionPermissions(permission);
    }

    return (
        <Router history={history}>
            <StylesProvider injectFirst>
                <MuiThemeProvider theme={theme}>
                    <ThemeProvider theme={theme}>
                        <AppContainer className="App">
                            <ScreenWrapper>
                                <GameContextProvider>
                                    <PlayerContextProvider>
                                        <GameWrapper>
                                            <ScreenSocketContextProvider>
                                                <ControllerSocketContextProvider
                                                    permission={!(!micPermission || !motionPermission)}
                                                >
                                                    <FirebaseContextProvider>
                                                        {!isMobileOnly && <MasterHeader history={history} />}
                                                        <PausedDialog>
                                                            <Switch>
                                                                <Route
                                                                    path={Routes.credits}
                                                                    component={Credits}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.settings}
                                                                    component={Settings}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerChooseCharacter}
                                                                    component={ChooseCharacter}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerLobby}
                                                                    component={() => (
                                                                        <ControllerLobbyScreen history={history} />
                                                                    )}
                                                                    exact
                                                                />
                                                                {/*----------------- Game 1 -----------------*/}
                                                                <Route
                                                                    path={Routes.controllerGame1}
                                                                    component={() => (
                                                                        <ShakeInstruction
                                                                            sessionStorage={sessionStorage}
                                                                        />
                                                                    )}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerTreeStump}
                                                                    component={TreeTrunk}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerSpider}
                                                                    component={() => <Spider navigator={navigator} />}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerTrash}
                                                                    component={Trash}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerStone}
                                                                    component={Stone}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerPlayerDead}
                                                                    component={PlayerDead}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerPlayerStunned}
                                                                    component={PlayerStunned}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerWindmill}
                                                                    component={Windmill}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.screenGame1}
                                                                    component={Game}
                                                                    exact
                                                                />
                                                                {/*----------------- Game 2 -----------------*/}
                                                                <Route path={Routes.controllerGame2} exact />
                                                                <Route
                                                                    path={Routes.screenGame2}
                                                                    component={Game2}
                                                                    exact
                                                                />
                                                                {/*----------------- Game 3 -----------------*/}
                                                                <Route
                                                                    path={Routes.controllerGame3}
                                                                    component={TakePicture}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.controllerVote}
                                                                    component={Vote}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.screenGame3}
                                                                    component={Game3}
                                                                    exact
                                                                />
                                                                {/*----------------- General -----------------*/}
                                                                <Route
                                                                    path={Routes.controllerPlayerFinished}
                                                                    component={ControllerFinishedScreen}
                                                                    exact
                                                                />

                                                                <Route
                                                                    path={Routes.screenLobby}
                                                                    component={ScreenLobbyScreen}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.screenChooseGame}
                                                                    component={ChooseGame}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.screenGameIntro}
                                                                    component={GameIntro}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.screenGetReady}
                                                                    component={PlayersGetReady}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.screenFinished}
                                                                    component={ScreenFinishedScreen}
                                                                    exact
                                                                />
                                                                <Route
                                                                    path={Routes.home}
                                                                    component={() =>
                                                                        isMobileOnly ? (
                                                                            !micPermission || !motionPermission ? (
                                                                                <NoPermissions
                                                                                    getMotionPermission={
                                                                                        getMotionPermission
                                                                                    }
                                                                                    getMicrophonePermission={
                                                                                        getMicrophonePermission
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <ControllerConnectScreen
                                                                                    history={history}
                                                                                />
                                                                            )
                                                                        ) : (
                                                                            <ScreenConnectScreen />
                                                                        )
                                                                    }
                                                                />
                                                            </Switch>
                                                        </PausedDialog>
                                                    </FirebaseContextProvider>
                                                </ControllerSocketContextProvider>
                                            </ScreenSocketContextProvider>
                                        </GameWrapper>
                                    </PlayerContextProvider>
                                </GameContextProvider>
                            </ScreenWrapper>
                        </AppContainer>
                    </ThemeProvider>
                </MuiThemeProvider>
            </StylesProvider>
        </Router>
    );
};

export default App;
