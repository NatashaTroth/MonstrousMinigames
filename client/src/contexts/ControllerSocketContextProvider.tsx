import * as React from 'react'
import { useHistory } from 'react-router-dom'
import { Socket } from 'socket.io-client'

import { OBSTACLES } from '../utils/constants'
import { GameContext } from './GameContextProvider'
import { PlayerContext } from './PlayerContextProvider'

export interface IObstacleMessage {
    type: string
    obstacleType?: OBSTACLES
}
interface IControllerSocketContext {
    controllerSocket: Socket | undefined
    isControllerConnected: boolean
    setControllerSocket: (val: Socket | undefined) => void
}

export const ControllerSocketContext = React.createContext<IControllerSocketContext>({
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

export interface IUser {
    id: string
    name: string
    roomId: string
}

const ControllerSocketContextProvider: React.FunctionComponent = ({ children }) => {
    const [controllerSocket, setControllerSocket] = React.useState<Socket | undefined>(undefined)
    const { setObstacle, setPlayerFinished, setPlayerRank, setIsPlayerAdmin } = React.useContext(PlayerContext)
    const history = useHistory()

    const { setGameStarted } = React.useContext(GameContext)

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
            case 'game1/hasStarted':
                document.body.style.overflow = 'hidden'
                document.body.style.position = 'fixed'
                setGameStarted(true)
                history.push('/controller/game1')
                break
            default:
                break
        }
    })

    const content = {
        controllerSocket,
        setControllerSocket: (val: Socket | undefined) => {
            setControllerSocket(val)
            history.push('/controller/lobby')
        },
        isControllerConnected: controllerSocket ? true : false,
    }
    return <ControllerSocketContext.Provider value={content}>{children}</ControllerSocketContext.Provider>
}

export default ControllerSocketContextProvider
