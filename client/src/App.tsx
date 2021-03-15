import React from 'react'
import SocketContextProvider from './contexts/SocketContextProvider'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AppContainer } from './App.sc'
import { isMobileOnly } from 'react-device-detect'
import PlayerContextProvider from './contexts/PlayerContextProvider'
import Impressum from './components/common/Impressum'
import GameContextProvider from './contexts/GameContextProvider'
import StartGameScreen from './components/Controller/StartGameScreen'
import { ConnectScreen as ControllerConnectScreen } from './components/Controller/ConnectScreen'
import { ConnectScreen as ScreenConnectScreen } from './components/Screen/ConnectScreen'
import ClickObstacle from './components/Controller/ClickObstacle'
import ShakeInstruction from './components/Controller/ShakeInstruction'
import { FinishedScreen as ControllerFinishedScreen } from './components/Controller/FinishedScreen'
import { FinishedScreen as ScreenFinishedScreen } from './components/Screen/FinishedScreen'
import Lobby from './components/Screen/Lobby'
import Game from './components/Screen/Game'

function App() {
    return (
        <Router>
            <AppContainer className="App">
                <PlayerContextProvider>
                    <GameContextProvider>
                        <SocketContextProvider>
                            <Switch>
                                <Route path="/impressum" component={Impressum} exact />
                                <Route path="/controller/start-game" component={StartGameScreen} exact />
                                <Route path="/controller/game1" component={ShakeInstruction} exact />
                                <Route path="/controller/game1-obstacle" component={ClickObstacle} exact />
                                <Route path="/controller/finished" component={ControllerFinishedScreen} exact />

                                <Route path="/screen/lobby" component={Lobby} exact />
                                <Route path="/screen/game1" component={Game} exact />
                                <Route path="/screen/finished" component={ScreenFinishedScreen} exact />

                                <Route
                                    path="/"
                                    component={isMobileOnly ? ControllerConnectScreen : ScreenConnectScreen}
                                    exact
                                />
                            </Switch>
                        </SocketContextProvider>
                    </GameContextProvider>
                </PlayerContextProvider>
            </AppContainer>
        </Router>
    )
}

export default App
