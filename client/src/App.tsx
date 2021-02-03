import React from 'react'
import SocketContextProvider from './contexts/SocketContextProvider'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Screen from './components/Screen/Screen'
import Controller from './components/Controller/Controller'
import { AppContainer } from './App.sc'
import { isMobileOnly } from 'react-device-detect'

function App() {
    return (
        <AppContainer className="App">
            <SocketContextProvider>
                <Router>
                    <Switch>
                        <Route path="/">{isMobileOnly ? <Controller /> : <Screen />}</Route>
                    </Switch>
                </Router>
            </SocketContextProvider>
        </AppContainer>
    )
}

export default App
