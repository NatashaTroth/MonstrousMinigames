import { stringify } from 'query-string'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

import { ENDPOINT } from '../utils/config'
import { GAMESTATE, MESSAGETYPES, OBSTACLES } from '../utils/constants'
import { GameContext, IPlayerState } from './GameContextProvider'

export interface IObstacleMessage {
    type: string
    obstacleType?: OBSTACLES
}

interface IScreenSocketContext {
    screenSocket: Socket | undefined
    setScreenSocket: (val: Socket | undefined, roomId: string) => void
    isScreenConnected: boolean
    handleSocketConnection: (val: string) => void
}

export const ScreenSocketContext = React.createContext<IScreenSocketContext>({
    screenSocket: undefined,
    setScreenSocket: () => {
        // do nothing
    },
    isScreenConnected: false,
    handleSocketConnection: () => {
        // do nothing
    },
})

interface IGameStateData {
    gameState: GAMESTATE
    numberOfObstacles: number
    roomId: string
    trackLength: number
    playersState: IPlayerState[]
}

interface IGameState {
    data?: IGameStateData
    type: string
}

export interface IUser {
    id: string
    name: string
    roomId: string
}

interface IGameStarted {
    type: string
    countdownTime: number
}

interface IConnectedUsers {
    type: string
    users: IUser[]
}
const ScreenSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket | undefined>(undefined)
    const [messageData, setMessageData] = React.useState<IGameState | IConnectedUsers | undefined>()
    const history = useHistory()

    const {
        setPlayers,
        setTrackLength,
        finished,
        setFinished,
        trackLength,
        setGameStarted,
        roomId,
        setRoomId,
        setConnectedUsers,
        setCountdownTime,
    } = React.useContext(GameContext)

    React.useEffect(() => {
        if (messageData) {
            let data

            switch (messageData.type) {
                case 'game1/gameState':
                    handleGameState(messageData as IGameState)
                    break
                case MESSAGETYPES.connectedUsers:
                    data = messageData as IConnectedUsers
                    if (data.users) {
                        setConnectedUsers(data.users)
                    }
                    break
                case 'game1/hasStarted':
                    data = messageData as IGameStarted
                    setCountdownTime(data.countdownTime)
                    setGameStarted(true)
                    history.push(`/screen/${roomId}/game1`)
                    break
                case MESSAGETYPES.gameHasReset:
                    history.push(`/screen/${roomId}/lobby`)
                    break
            }
        }

        function handleGameState(messageData: IGameState) {
            if (messageData.data) {
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
                        history.push(`/screen/${roomId}/finished`)
                    }
                }
            }
        }
    }, [
        finished,
        history,
        messageData,
        roomId,
        setConnectedUsers,
        setCountdownTime,
        setFinished,
        setGameStarted,
        setPlayers,
        setRoomId,
        setTrackLength,
        trackLength,
    ])

    function handleSocketConnection(roomId: string) {
        const screenSocket = io(
            `${ENDPOINT}screen?${stringify({
                roomId: roomId,
            })}`,
            {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
            }
        )
        setRoomId(roomId)

        screenSocket.on('connect', () => {
            if (screenSocket) {
                handleSetScreenSocket(screenSocket, roomId)
            }
        })
    }

    screenSocket?.on('message', (data: IGameState | IConnectedUsers) => {
        setMessageData(data)
    })

    function handleSetScreenSocket(val: Socket | undefined, roomId: string) {
        setScreenSocket(val)
        history.push(`/screen/${roomId}/lobby`)
    }

    const content = {
        screenSocket,
        setScreenSocket: (val: Socket | undefined, roomId: string) => handleSetScreenSocket(val, roomId),
        isScreenConnected: screenSocket ? true : false,
        handleSocketConnection,
    }
    return <ScreenSocketContext.Provider value={content}>{children}</ScreenSocketContext.Provider>
}

export default ScreenSocketContextProvider
