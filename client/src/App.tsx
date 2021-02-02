import React from 'react'
import './App.css'
import Controller from './components/Controller'
import SocketContextProvider from './contexts/SocketContextProvider'

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <SocketContextProvider>
                    <Controller />
                </SocketContextProvider>
            </header>
        </div>
    )
}

export default App
