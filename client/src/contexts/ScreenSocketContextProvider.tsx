import { stringify } from 'query-string'
import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { GAMESTATE, MESSAGETYPES, OBSTACLES } from '../utils/constants'
import { GameContext, IPlayerState } from './GameContextProvider'

export interface IObstacleMessage {
    type: string
    obstacleType?: OBSTACLES
}

interface IScreenSocketContext {
    screenSocket: SocketIOClient.Socket | undefined
    setScreenSocket: (val: SocketIOClient.Socket | undefined, roomId: string) => void
    isScreenConnected: boolean
    handleSocketConnection: (val: string) => void
}

export const defaultValue = {
    screenSocket: undefined,
    setScreenSocket: () => {
        // do nothing
    },
    isScreenConnected: false,
    handleSocketConnection: () => {
        // do nothing
    },
}

export const ScreenSocketContext = React.createContext<IScreenSocketContext>(defaultValue)

export interface IPlayerRank {
    id: number
    name: string
    rank: number
    finished: boolean
    totalTimeInMs: number
    positionX: number
}
interface IGameStateData {
    gameState: GAMESTATE
    numberOfObstacles: number
    roomId: string
    trackLength: number
    playersState?: IPlayerState[]
    playerRanks?: IPlayerRank[]
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
    const [screenSocket, setScreenSocket] = React.useState<SocketIOClient.Socket | undefined>(undefined)
    const [messageData, setMessageData] = React.useState<IGameState | IConnectedUsers | undefined>()
    const history = useHistory()

    const {
        setPlayers,
        setPlayerRanks,
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
                case MESSAGETYPES.gameHasFinished:
                    data = messageData as IGameState
                    setFinished(true)
                    setPlayerRanks(data.data!.playerRanks!)
                    history.push(`/screen/${roomId}/finished`)
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

                if (messageData.data.playersState) {
                    setPlayers(messageData.data.playersState)
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
        setPlayerRanks,
        setPlayers,
        setRoomId,
        setTrackLength,
        trackLength,
    ])

    function handleSocketConnection(roomId: string) {
        const screenSocket = io(
            `${process.env.REACT_APP_BACKEND_URL}screen?${stringify({
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

    function handleSetScreenSocket(val: SocketIOClient.Socket | undefined, roomId: string) {
        setScreenSocket(val)
        history.push(`/screen/${roomId}/lobby`)
    }

    const content = {
        screenSocket,
        setScreenSocket: (val: SocketIOClient.Socket | undefined, roomId: string) => handleSetScreenSocket(val, roomId),
        isScreenConnected: screenSocket ? true : false,
        handleSocketConnection,
    }
    return <ScreenSocketContext.Provider value={content}>{children}</ScreenSocketContext.Provider>
}

export default ScreenSocketContextProvider
