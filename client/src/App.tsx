import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Route, Router, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { AppContainer } from './App.sc';
import Credits from './components/common/Credits';
import MasterHeader from './components/common/MasterHeader';
import PausedDialog from './components/common/PausedDialog';
import Settings from './components/common/Settings';
import ControllerSocketContextProvider from './contexts/ControllerSocketContextProvider';
import FirebaseContextProvider from './contexts/FirebaseContextProvider';
import GameContextProvider from './contexts/GameContextProvider';
import PlayerContextProvider from './contexts/PlayerContextProvider';
import ScreenSocketContextProvider from './contexts/ScreenSocketContextProvider';
import ChooseCharacter from './domain/controller/components/ChooseCharacter';
import { ConnectScreen as ControllerConnectScreen } from './domain/controller/components/ConnectScreen';
import { FinishedScreen as ControllerFinishedScreen } from './domain/controller/components/FinishedScreen';
import Spider from './domain/controller/components/game1/obstacles/Spider';
import Stone from './domain/controller/components/game1/obstacles/Stone';
import Trash from './domain/controller/components/game1/obstacles/Trash';
import TreeTrunk from './domain/controller/components/game1/obstacles/TreeTrunk';
import PlayerDead from './domain/controller/components/game1/PlayerDead';
import PlayerStunned from './domain/controller/components/game1/PlayerStunned';
import ShakeInstruction from './domain/controller/components/game1/ShakeInstruction';
import Windmill from './domain/controller/components/game1/Windmill';
import TakePicture from './domain/controller/components/game2/TakePhoto';
import { Lobby as ControllerLobbyScreen } from './domain/controller/components/Lobby';
import { NoPermissions } from './domain/controller/components/NoPermissions';
import history from './domain/history/history';
import { navigator } from './domain/navigator/NavigatorAdapter';
import ChooseGame from './domain/screen/components/ChooseGame';
import { ConnectScreen as ScreenConnectScreen } from './domain/screen/components/ConnectScreen';
import { FinishedScreen as ScreenFinishedScreen } from './domain/screen/components/FinishedScreen';
import Game from './domain/screen/components/Game';
import GameIntro from './domain/screen/components/GameIntro';
import { Lobby as ScreenLobbyScreen } from './domain/screen/components/Lobby';
import PlayersGetReady from './domain/screen/components/PlayersGetReady';
import ScreenWrapper from './domain/screen/components/ScreenWrapper';
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
                                        <ScreenSocketContextProvider>
                                            <ControllerSocketContextProvider
                                                permission={!(!micPermission || !motionPermission)}
                                            >
                                                <FirebaseContextProvider>
                                                    {!isMobileOnly && <MasterHeader history={history} />}
                                                    <PausedDialog>
                                                        <Switch>
                                                            <Route path={Routes.credits} component={Credits} exact />
                                                            <Route path={Routes.settings} component={Settings} exact />
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
                                                                    <ShakeInstruction sessionStorage={sessionStorage} />
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
                                                            <Route path={Routes.screenGame1} component={Game} exact />
                                                            {/*----------------- Game 2 -----------------*/}
                                                            <Route
                                                                path={Routes.controllerGame2}
                                                                component={TakePicture}
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
