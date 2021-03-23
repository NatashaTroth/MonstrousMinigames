import * as React from 'react'

import { OBSTACLES } from '../utils/constants'
import { IUser } from './ControllerSocketContextProvider'

interface IGameContext {
    trackLength?: number
    setTrackLength: (val: number) => void
    players?: IPlayerState[]
    setPlayers: (val: IPlayerState[]) => void
    finished: boolean
    setFinished: (val: boolean) => void
    gameStarted: boolean
    setGameStarted: (val: boolean) => void
    roomId?: string
    setRoomId: (val?: string) => void
    connectedUsers?: IUser[]
    setConnectedUsers: (val: IUser[]) => void
}

interface IObstacle {
    positionX: number
    type: OBSTACLES
}

export interface IPlayerState {
    atObstacle: boolean
    finished: boolean
    id: string
    name: string
    obstacles: IObstacle[]
    positionX: number
    rank: number
}
export const GameContext = React.createContext<IGameContext>({
    trackLength: undefined,
    setTrackLength: () => {
        // do nothing
    },
    players: undefined,
    setPlayers: () => {
        // do nothing
    },
    finished: false,
    setFinished: () => {
        // do nothing
    },
    gameStarted: false,
    setGameStarted: () => {
        // do nothing
    },
    roomId: undefined,
    setRoomId: () => {
        // do nothing
    },
    connectedUsers: undefined,
    setConnectedUsers: () => {
        // do nothing
    },
})

const GameContextProvider: React.FunctionComponent = ({ children }) => {
    const [trackLength, setTrackLength] = React.useState<undefined | number>()
    const [players, setPlayers] = React.useState<undefined | IPlayerState[]>()
    const [finished, setFinished] = React.useState<boolean>(false)
    const [gameStarted, setGameStarted] = React.useState<boolean>(false)
    const [roomId, setRoomId] = React.useState<undefined | string>()
    const [connectedUsers, setConnectedUsers] = React.useState<undefined | IUser[]>()

    const content = {
        trackLength,
        setTrackLength,
        players,
        setPlayers,
        finished,
        setFinished: (val: boolean) => {
            setFinished(val)
            document.body.style.overflow = 'visible'
            document.body.style.position = 'static'
        },
        gameStarted,
        setGameStarted: (val: boolean) => {
            setGameStarted(val)
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
        },
        roomId,
        setRoomId,
        connectedUsers,
        setConnectedUsers,
    }
    return <GameContext.Provider value={content}>{children}</GameContext.Provider>
}

export default GameContextProvider
