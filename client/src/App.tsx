import React from 'react'
import './App.css'

import SocketContextProvider from './contexts/SocketContextProvider'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Screen from './components/Screen/Screen'
import Controller from './components/Controller/Controller'

function App() {
    return (
        <div className="App">
            <header className="App-header">
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
            </header>
        </div>
    )
}

export default App
