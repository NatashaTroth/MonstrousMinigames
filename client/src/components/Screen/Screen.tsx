import * as React from 'react'

import { GameContext } from '../../contexts/GameContextProvider'
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider'
import {ConnectScreen} from './ConnectScreen'
import {FinishedScreen} from './FinishedScreen'
import {Lobby} from './Lobby'
import MainScene from "./MainScene"

    const Screen: React.FunctionComponent = () => {
        const { isScreenConnected } = React.useContext(ScreenSocketContext)
        const { finished, gameStarted } = React.useContext(GameContext)
        //const { trackLength, players } = React.useContext(GameContext)
        

          React.useEffect(() => {
            new Phaser.Game({
                parent: 'game-root',
                type: Phaser.AUTO,
                width: "100%",
                height: "100%",
                physics: {
                    default: 'arcade',
                    arcade: {
                        debug: false
                    }
                },
                scene: [MainScene],
              })
          }, [])

        return (
            <>
                {finished ? (
                    <FinishedScreen />
                ) : (
                    <>
                         {!isScreenConnected && <ConnectScreen />}
                        {isScreenConnected && !gameStarted && <Lobby />}
                        {isScreenConnected && gameStarted && (
                            <div id="game-root"></div>
                        )} 
                    </>
                )} 
                <div id="game-root"></div>
            </>
        )
    }
    
    export default Screen
  
