class ScreenSocket {
    private static instance: ScreenSocket
    private socket: SocketIOClient.Socket | undefined

    private constructor(val?: SocketIOClient.Socket | undefined) {
        this.socket = val
    }

    public static getInstance(val?: SocketIOClient.Socket | undefined): ScreenSocket {
        if (!ScreenSocket.instance) {
            ScreenSocket.instance = new ScreenSocket(val)
        }

        return ScreenSocket.instance
    }
}

export default ScreenSocket
