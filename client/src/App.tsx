import React from 'react'
import SocketContextProvider from './contexts/SocketContextProvider'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Screen from './components/Screen/Screen'
import Controller from './components/Controller/Controller'
import { AppContainer } from './App.sc'
import { isMobileOnly } from 'react-device-detect'
import ObstacleContextProvider from './contexts/ObstacleContextProvider'
import Impressum from './components/common/Impressum'

function App() {
    return (
        <AppContainer className="App">
            <ObstacleContextProvider>
                <SocketContextProvider>
                    <Router>
                        <Switch>
                            <Route path="/impressum">
                                <Impressum />
                            </Route>
                            <Route path="/">{isMobileOnly ? <Controller /> : <Screen />}</Route>
                        </Switch>
                    </Router>
                </SocketContextProvider>
            </ObstacleContextProvider>
        </AppContainer>
    )
}

export default App
