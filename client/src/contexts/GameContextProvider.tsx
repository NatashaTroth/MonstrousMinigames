import * as React from 'react'
import { OBSTACLES } from '../utils/constants'

interface IGameContext {
    trackLength?: number
    setTrackLength: (val: number) => void
    players?: IPlayerState[]
    setPlayers: (val: IPlayerState[]) => void
    finished: boolean
    setFinished: (val: boolean) => void
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
})

const GameContextProvider: React.FunctionComponent = ({ children }) => {
    const [trackLength, setTrackLength] = React.useState<undefined | number>()
    const [players, setPlayers] = React.useState<undefined | IPlayerState[]>()
    const [finished, setFinished] = React.useState<boolean>(false)

    const content = {
        trackLength,
        setTrackLength,
        players,
        setPlayers,
        finished,
        setFinished,
    }
    return <GameContext.Provider value={content}>{children}</GameContext.Provider>
}

export default GameContextProvider
