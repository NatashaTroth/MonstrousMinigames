import * as React from 'react'
import { io, Socket } from 'socket.io-client'
import { ENDPOINT } from '../utils/config'

interface ISocketContext {
    screenSocket: Socket | undefined
    controllerSocket: Socket | undefined
    setControllerSocket: (val: Socket | undefined) => void
}

export const SocketContext = React.createContext<ISocketContext>({
    screenSocket: undefined,
    controllerSocket: undefined,
    setControllerSocket: () => {
        // do nothing
    },
})

interface IUserInitMessage {
    name: string
    type: string
    userId: 'userInit'
    roomId: string
}

interface IObstacleMessage {
    type: 'game1/obstacle'
    obstacleType: 'TREE-STUMP'
}

const SocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [screenSocket, setScreenSocket] = React.useState<Socket | undefined>(undefined)
    const [controllerSocket, setControllerSocket] = React.useState<Socket | undefined>(undefined)

    React.useEffect(() => {
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
    }, [])

    controllerSocket?.on('message', (data: IUserInitMessage | IObstacleMessage) => {
        // eslint-disable-next-line no-console
        console.log(data)
        switch (data.type) {
            case 'userInit':
                sessionStorage.setItem('userId', data.userId)
                sessionStorage.setItem('name', data.name)
                sessionStorage.setItem('roomId', data.roomId)

                break
            case 'game1/obstacle':
                // eslint-disable-next-line no-console
                console.log('obstacle')
                break
            default:
                break
        }
    })

    const content = {
        screenSocket,
        controllerSocket,
        setControllerSocket,
    }
    return <SocketContext.Provider value={content}>{children}</SocketContext.Provider>
}

export default SocketContextProvider
