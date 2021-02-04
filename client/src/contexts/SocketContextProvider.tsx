import * as React from 'react'
import { isMobile } from 'react-device-detect'
import { io, Socket } from 'socket.io-client'
import { ENDPOINT } from '../utils/config'
import { OBSTACLES } from '../utils/constants'
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
}

export const SocketContext = React.createContext<ISocketContext>({
    screenSocket: undefined,
    controllerSocket: undefined,
    setControllerSocket: () => {
        // do nothing
    },
    isControllerConnected: false,
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

const SocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket | undefined>(undefined)
    const [controllerSocket, setControllerSocket] = React.useState<Socket | undefined>(undefined)
    const { setObstacle, setPlayerFinished, setPlayerRank, setIsPlayerAdmin } = React.useContext(PlayerContext)

    React.useEffect(() => {
        if (!isMobile) {
            const socketClient = io(ENDPOINT + 'screen', {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
            })

            socketClient.on('connect', () => {
                if (socketClient) {
                    // eslint-disable-next-line no-console
                    console.log('Screen Socket connected')
                    setScreenSocket(socketClient)
                }
            })
        }
    }, [])

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
            default:
                break
        }
    })

    const content = {
        screenSocket,
        controllerSocket,
        setControllerSocket,
        isControllerConnected: controllerSocket ? true : false,
    }
    return <SocketContext.Provider value={content}>{children}</SocketContext.Provider>
}

export default SocketContextProvider
