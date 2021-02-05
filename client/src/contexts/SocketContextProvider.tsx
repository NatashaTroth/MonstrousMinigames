import * as React from 'react'
import { Socket } from 'socket.io-client'
import { finished } from 'stream'
import { GAMESTATE, OBSTACLES } from '../utils/constants'
import { GameContext, IPlayerState } from './GameContextProvider'
import { PlayerContext } from './PlayerContextProvider'

export interface IObstacleMessage {
    type: string
    obstacleType?: OBSTACLES
}
interface ISocketContext {
    screenSocket: Socket | undefined
    controllerSocket: Socket | undefined
    isControllerConnected: boolean
    setControllerSocket: (val: Socket | undefined) => void
    setScreenSocket: (val: Socket | undefined) => void
    isScreenConnected: boolean
}

export const SocketContext = React.createContext<ISocketContext>({
    screenSocket: undefined,
    controllerSocket: undefined,
    setControllerSocket: () => {
        // do nothing
    },
    setScreenSocket: () => {
        // do nothing
    },
    isControllerConnected: false,
    isScreenConnected: false,
})

interface IUserInitMessage {
    name?: string
    type?: string
    userId?: 'userInit'
    roomId?: string
    isAdmin?: boolean
}

interface IGameFinished {
    type: string
    rank: number
}

interface IGameState {
    data?: {
        gameState: GAMESTATE
        numberOfObstacles: number
        roomId: string
        trackLength: number
        playersState: IPlayerState[]
    }
    type: string
}

const SocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket | undefined>(undefined)
    const [controllerSocket, setControllerSocket] = React.useState<Socket | undefined>(undefined)
    const { setObstacle, setPlayerFinished, setPlayerRank, setIsPlayerAdmin } = React.useContext(PlayerContext)
    const { setPlayers, setTrackLength, setFinished, trackLength, setGameStarted } = React.useContext(GameContext)

    screenSocket?.on('message', (message: IGameState) => {
        if (message && message.data) {
            if (!trackLength) {
                setTrackLength(message.data.trackLength)
            }
            setPlayers(message.data.playersState)
            if (GAMESTATE.finished === message.data.gameState) {
                if (!finished) {
                    setFinished(true)
                }
            }
        }
    })

    controllerSocket?.on('message', (data: IUserInitMessage | IObstacleMessage | IGameFinished) => {
        let messageData

        switch (data.type) {
            case 'userInit':
                messageData = data as IUserInitMessage
                sessionStorage.setItem('userId', messageData.userId || '')
                sessionStorage.setItem('name', messageData.name || '')
                sessionStorage.setItem('roomId', messageData.roomId || '')
                setIsPlayerAdmin(messageData.isAdmin || false)
                break
            case 'game1/obstacle':
                messageData = data as IObstacleMessage
                setObstacle(messageData?.obstacleType)
                break
            case 'game1/playerFinished':
                messageData = data as IGameFinished
                setPlayerFinished(true)
                setPlayerRank(messageData.rank)
                break
            case 'game1/hasStarted':
                setGameStarted(true)
                break
            default:
                break
        }
    })

    const content = {
        screenSocket,
        controllerSocket,
        setControllerSocket,
        setScreenSocket,
        isControllerConnected: controllerSocket ? true : false,
        isScreenConnected: screenSocket ? true : false,
    }
    return <SocketContext.Provider value={content}>{children}</SocketContext.Provider>
}

export default SocketContextProvider
