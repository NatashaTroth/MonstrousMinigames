import * as React from 'react'
import { isMobileOnly } from 'react-device-detect'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { AppContainer } from './App.sc'
import Impressum from './components/common/Impressum'
import ClickObstacle from './components/Controller/ClickObstacle'
import { ConnectScreen as ControllerConnectScreen } from './components/Controller/ConnectScreen'
import { FinishedScreen as ControllerFinishedScreen } from './components/Controller/FinishedScreen'
import { Lobby as ControllerLobbyScreen } from './components/Controller/Lobby'
import ShakeInstruction from './components/Controller/ShakeInstruction'
import { ConnectScreen as ScreenConnectScreen } from './components/Screen/ConnectScreen'
import { FinishedScreen as ScreenFinishedScreen } from './components/Screen/FinishedScreen'
import Game from './components/Screen/Game'
import { Lobby as ScreenLobbyScreen } from './components/Screen/Lobby'
import ControllerSocketContextProvider from './contexts/ControllerSocketContextProvider'
import GameContextProvider from './contexts/GameContextProvider'
import PlayerContextProvider from './contexts/PlayerContextProvider'
import ScreenSocketContextProvider from './contexts/ScreenSocketContextProvider'

const App: React.FunctionComponent = () => {
    return (
        <Router>
            <AppContainer className="App">
                <PlayerContextProvider>
                    <GameContextProvider>
                        <ScreenSocketContextProvider>
                            <ControllerSocketContextProvider>
                                <Switch>
                                    <Route path="/impressum" component={Impressum} exact />
                                    <Route path="/controller/lobby" component={ControllerLobbyScreen} exact />
                                    <Route path="/controller/game1" component={ShakeInstruction} exact />
                                    <Route path="/controller/game1-obstacle" component={ClickObstacle} exact />
                                    <Route path="/controller/finished" component={ControllerFinishedScreen} exact />

                                    <Route path="/screen/lobby" component={ScreenLobbyScreen} exact />
                                    <Route path="/screen/game1" component={Game} exact />
                                    <Route path="/screen/finished" component={ScreenFinishedScreen} exact />

                                    <Route
                                        path="/"
                                        component={isMobileOnly ? ControllerConnectScreen : ScreenConnectScreen}
                                        exact
                                    />
                                </Switch>
                            </ControllerSocketContextProvider>
                        </ScreenSocketContextProvider>
                    </GameContextProvider>
                </PlayerContextProvider>
            </AppContainer>
        </Router>
    )
}

export default App
