import * as React from 'react'
import { OBSTACLES } from '../utils/constants'

interface IPlayerContext {
    obstacle: undefined | OBSTACLES
    setObstacle: (val: OBSTACLES | undefined) => void
    playerFinished: boolean
    setPlayerFinished: (val: boolean) => void
    playerRank: number | undefined
    setPlayerRank: (val: number) => void
    isPlayerAdmin: boolean
    setIsPlayerAdmin: (val: boolean) => void
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
    playerRank: undefined,
    setPlayerRank: (val: number) => {
        // do nothing
    },
    isPlayerAdmin: false,
    setIsPlayerAdmin: (val: boolean) => {
        // do nothing
    },
})

const PlayerContextProvider: React.FunctionComponent = ({ children }) => {
    const [obstacle, setObstacle] = React.useState<undefined | OBSTACLES>(undefined)
    const [playerFinished, setPlayerFinished] = React.useState<boolean>(false)
    const [playerRank, setPlayerRank] = React.useState<undefined | number>(undefined)
    const [isPlayerAdmin, setIsPlayerAdmin] = React.useState<boolean>(false)

    const content = {
        obstacle,
        setObstacle,
        playerFinished,
        setPlayerFinished,
        playerRank,
        setPlayerRank,
        isPlayerAdmin,
        setIsPlayerAdmin,
    }
    return <PlayerContext.Provider value={content}>{children}</PlayerContext.Provider>
}

export default PlayerContextProvider
