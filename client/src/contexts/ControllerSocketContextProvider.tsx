import { stringify } from 'query-string'
import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { MESSAGETYPES, OBSTACLES } from '../utils/constants'
import { ClickRequestDeviceMotion } from '../utils/permissions'
import { GameContext } from './GameContextProvider'
import { PlayerContext } from './PlayerContextProvider'

export const defaultValue = {
    controllerSocket: undefined,
    setControllerSocket: () => {
        // do nothing
    },
    isControllerConnected: false,
    handleSocketConnection: () => {
        // do nothing
    },
}
export interface IObstacleMessage {
    type: string
    obstacleType: OBSTACLES
    obstacleId: number
}
interface IControllerSocketContext {
    controllerSocket: SocketIOClient.Socket | undefined
    isControllerConnected: boolean
    setControllerSocket: (val: SocketIOClient.Socket | undefined, roomId: string) => void
    handleSocketConnection: (roomId: string, name: string) => void
}

export const ControllerSocketContext = React.createContext<IControllerSocketContext>(defaultValue)

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

export interface IUser {
    id: string
    name: string
    roomId: string
}

const ControllerSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [controllerSocket, setControllerSocket] = React.useState<SocketIOClient.Socket | undefined>(undefined)
    const {
        setObstacle,
        setPlayerFinished,
        setPlayerRank,
        setIsPlayerAdmin,
        setPermissionGranted,
        playerFinished,
    } = React.useContext(PlayerContext)
    const history = useHistory()

    const { setGameStarted, roomId, setRoomId } = React.useContext(GameContext)

    controllerSocket?.on('message', (data: IUserInitMessage | IObstacleMessage | IGameFinished) => {
        let messageData

        switch (data.type) {
            case MESSAGETYPES.userInit:
                messageData = data as IUserInitMessage
                sessionStorage.setItem('userId', messageData.userId || '')
                sessionStorage.setItem('name', messageData.name || '')
                sessionStorage.setItem('roomId', messageData.roomId || '')
                setIsPlayerAdmin(messageData.isAdmin || false)
                break
            case 'game1/obstacle':
                messageData = data as IObstacleMessage
                setObstacle({ type: messageData.obstacleType, id: messageData.obstacleId })
                break
            case 'game1/playerFinished':
                messageData = data as IGameFinished
                if (!playerFinished) {
                    setPlayerFinished(true)
                    setPlayerRank(messageData.rank)
                }
                break
            case 'game1/hasStarted':
                document.body.style.overflow = 'hidden'
                document.body.style.position = 'fixed'
                setGameStarted(true)
                history.push(`/controller/${roomId}/game1`)
                break
            case MESSAGETYPES.gameHasReset:
                history.push(`/controller/${roomId}/lobby`)
                break
            default:
                break
        }
    })

    function handleSetControllerSocket(val: SocketIOClient.Socket | undefined, roomId: string) {
        setControllerSocket(val)
        history.push(`/controller/${roomId}/lobby`)
    }

    async function handleSocketConnection(roomId: string, name: string) {
        const permission = await ClickRequestDeviceMotion()
        if (permission) {
            setPermissionGranted(permission)
        }

        const controllerSocket = io(
            `${process.env.REACT_APP_BACKEND_URL}controller?${stringify({
                name: name,
                roomId: roomId,
                userId: sessionStorage.getItem('userId') || '',
            })}`,
            {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
            }
        )

        setRoomId(roomId || '')

        controllerSocket.on('connect', () => {
            if (controllerSocket) {
                handleSetControllerSocket(controllerSocket, roomId || '')
            }
        })
    }

    const content = {
        controllerSocket,
        setControllerSocket: (val: SocketIOClient.Socket | undefined, roomId: string) =>
            handleSetControllerSocket(val, roomId),
        isControllerConnected: controllerSocket ? true : false,
        handleSocketConnection,
    }
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>
}

export default ControllerSocketContextProvider
