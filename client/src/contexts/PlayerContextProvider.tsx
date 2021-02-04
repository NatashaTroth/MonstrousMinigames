import * as React from 'react'
import { OBSTACLES } from '../utils/constants'

interface IPlayerContext {
    obstacle: undefined | OBSTACLES
    setObstacle: (val: OBSTACLES | undefined) => void
    playerFinished: boolean
    setPlayerFinished: (val: boolean) => void
}

export const PlayerContext = React.createContext<IPlayerContext>({
    obstacle: undefined,
    setObstacle: (val: OBSTACLES | undefined) => {
        // do nothing
    },
    playerFinished: false,
    setPlayerFinished: (val: boolean) => {
        // do nothing
    },
})

const PlayerContextProvider: React.FunctionComponent = ({ children }) => {
    const [obstacle, setObstacle] = React.useState<undefined | OBSTACLES>(undefined)
    const [playerFinished, setPlayerFinished] = React.useState<boolean>(false)

    const content = {
        obstacle,
        setObstacle,
        playerFinished,
        setPlayerFinished,
    }
    return <PlayerContext.Provider value={content}>{children}</PlayerContext.Provider>
}

export default PlayerContextProvider
