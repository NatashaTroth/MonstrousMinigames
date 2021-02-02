import React from 'react'
import SocketContextProvider from './contexts/SocketContextProvider'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Screen from './components/Screen/Screen'
import Controller from './components/Controller/Controller'
import { AppContainer } from './App.sc'

function App() {
    return (
        <AppContainer className="App">
            <SocketContextProvider>
                <Router>
                    <Switch>
                        <Route path="/controller">
                            <Controller />
                        </Route>
                        <Route path="/screen">
                            <Screen />
                        </Route>
                        <Route path="/">
                            <Screen />
                        </Route>
                    </Switch>
                </Router>
            </SocketContextProvider>
        </AppContainer>
    )
}

export default App
