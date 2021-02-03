import * as React from 'react'
import { io, Socket } from 'socket.io-client'
import { ENDPOINT } from '../utils/config'

interface ISocketContext {
    socket: Socket | undefined
    controllerSocket: Socket | undefined
    setControllerSocket: (val: Socket | undefined) => void
}

export const SocketContext = React.createContext<ISocketContext>({
    socket: undefined,
    controllerSocket: undefined,
    setControllerSocket: () => {
        // do nothing
    },
})

const SocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [socket, setSocket] = React.useState<Socket | undefined>(undefined)
    const [controllerSocket, setControllerSocket] = React.useState<Socket | undefined>(undefined)

    React.useEffect(() => {
        const socketClient = io(ENDPOINT, {
            secure: true,
            reconnection: true,
            rejectUnauthorized: false,
            reconnectionDelayMax: 10000,
            transports: ['websocket'],
        })

        socketClient.on('connect', () => {
            if (socketClient) {
                // eslint-disable-next-line no-console
                console.log('Socket connected')
                setSocket(socketClient)
            }
        })
    }, [])

    const content = {
        socket,
        controllerSocket,
        setControllerSocket,
    }
    return <SocketContext.Provider value={content}>{children}</SocketContext.Provider>
}

export default SocketContextProvider
