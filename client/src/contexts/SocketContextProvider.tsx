import * as React from 'react'
import { isMobile } from 'react-device-detect'
import { io, Socket } from 'socket.io-client'
import { ENDPOINT } from '../utils/config'
import { OBSTACLES } from '../utils/constants'
import { PlayerContext } from './PlayerContextProvider'

export interface IObstacleMessage {
    type: 'game1/obstacle'
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
}

const SocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket | undefined>(undefined)
    const [controllerSocket, setControllerSocket] = React.useState<Socket | undefined>(undefined)
    const { setObstacle, setPlayerFinished } = React.useContext(PlayerContext)

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

    controllerSocket?.on('message', (data: IUserInitMessage | IObstacleMessage) => {
        let obstacleData
        switch (data.type) {
            case 'userInit':
                sessionStorage.setItem('userId', data.userId || '')
                sessionStorage.setItem('name', data.name || '')
                sessionStorage.setItem('roomId', data.roomId || '')

                break
            case 'game1/obstacle':
                obstacleData = data as IObstacleMessage
                // eslint-disable-next-line no-console
                console.log('obstacle')
                setObstacle(obstacleData?.obstacleType)
                break
            case 'game1/playerFinished':
                // eslint-disable-next-line no-console
                console.log('Player Finished')
                setPlayerFinished(true)
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
