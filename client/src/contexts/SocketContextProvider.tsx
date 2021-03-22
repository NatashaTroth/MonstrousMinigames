import * as React from 'react'
import { useHistory } from 'react-router-dom'
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

export interface IUser {
    id: string
    name: string
    roomId: string
}

interface IConnectedUsers {
    type: string
    users: IUser[]
}
const SocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket | undefined>(undefined)
    const [controllerSocket, setControllerSocket] = React.useState<Socket | undefined>(undefined)
    const { setObstacle, setPlayerFinished, setPlayerRank, setIsPlayerAdmin } = React.useContext(PlayerContext)
    const history = useHistory()

    const {
        setPlayers,
        setTrackLength,
        setFinished,
        trackLength,
        setGameStarted,
        roomId,
        setRoomId,
        setConnectedUsers,
    } = React.useContext(GameContext)

    screenSocket?.on('message', (data: IGameState | IConnectedUsers) => {
        let messageData

        switch (data.type) {
            case 'game1/gameState':
                messageData = data as IGameState
                if (messageData && messageData.data) {
                    if (!trackLength) {
                        setTrackLength(messageData.data.trackLength)
                    }
                    if (!roomId) {
                        setRoomId(messageData.data.roomId)
                    }
                    setPlayers(messageData.data.playersState)
                    if (GAMESTATE.finished === messageData.data.gameState) {
                        if (!finished) {
                            setFinished(true)
                        }
                    }
                }
                break
            case 'connectedUsers':
                messageData = data as IConnectedUsers
                setConnectedUsers(messageData.users)
                break
            case 'game1/hasStarted':
                setGameStarted(true)
                history.push('/screen/game1')
                break
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
                history.push('/controller/game1')
                break
            default:
                break
        }
    })

    const content = {
        screenSocket,
        controllerSocket,
        setControllerSocket: (val: Socket | undefined) => {
            setControllerSocket(val)
            history.push('/controller/start-game')
        },
        setScreenSocket: (val: Socket | undefined) => {
            setScreenSocket(val)
            history.push('/screen/lobby')
        },
        isControllerConnected: controllerSocket ? true : false,
        isScreenConnected: screenSocket ? true : false,
    }
    return <SocketContext.Provider value={content}>{children}</SocketContext.Provider>
}

export default SocketContextProvider
