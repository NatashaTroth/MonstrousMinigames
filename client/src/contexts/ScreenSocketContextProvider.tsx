import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { Socket } from 'socket.io-client'

import { GAMESTATE, OBSTACLES } from '../utils/constants'
import { GameContext, IPlayerState } from './GameContextProvider'

export interface IObstacleMessage {
    type: string
    obstacleType?: OBSTACLES
}
interface IScreenSocketContext {
    screenSocket: Socket | undefined
    setScreenSocket: (val: Socket | undefined, roomId: string) => void
    isScreenConnected: boolean
}

export const ScreenSocketContext = React.createContext<IScreenSocketContext>({
    screenSocket: undefined,
    setScreenSocket: () => {
        // do nothing
    },
    isScreenConnected: false,
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
    } = React.useContext(GameContext)

    React.useEffect(() => {
        if (messageData) {
            let data
            switch (messageData.type) {
                case 'game1/gameState':
                    handleGameState(messageData as IGameState)
                    break
                case 'connectedUsers':
                    data = messageData as IConnectedUsers
                    if (data.users) {
                        setConnectedUsers(data.users)
                    }
                    break
                case 'game1/hasStarted':
                    setGameStarted(true)
                    history.push(`/screen/${roomId}/game1`)
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
        setFinished,
        setGameStarted,
        setPlayers,
        setRoomId,
        setTrackLength,
        trackLength,
    ])

    screenSocket?.on('message', (data: IGameState | IConnectedUsers) => {
        setMessageData(data)
    })

    const content = {
        screenSocket,
        setScreenSocket: (val: Socket | undefined, roomId: string) => {
            setScreenSocket(val)
            history.push(`/screen/${roomId}/lobby`)
        },
        isScreenConnected: screenSocket ? true : false,
    }
    return <ScreenSocketContext.Provider value={content}>{children}</ScreenSocketContext.Provider>
}

export default ScreenSocketContextProvider
