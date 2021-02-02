import * as React from 'react'
import { io, Socket } from 'socket.io-client'
import { ENDPOINT } from '../utils/config'

interface ISocketContext {
    socket: Socket | undefined
}

export const SocketContext = React.createContext<ISocketContext>({ socket: undefined })

const SocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [socket, setSocket] = React.useState<Socket | undefined>(undefined)

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

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export default SocketContextProvider
