import * as React from 'react'
import { useHistory } from 'react-router'

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
    permission: boolean
    setPermissionGranted: (val: boolean) => void
    resetPlayer: () => void
}

export const PlayerContext = React.createContext<IPlayerContext>({
    obstacle: undefined,
    setObstacle: () => {
        // do nothing
    },
    playerFinished: false,
    setPlayerFinished: () => {
        // do nothing
    },
    playerRank: undefined,
    setPlayerRank: () => {
        // do nothing
    },
    isPlayerAdmin: false,
    setIsPlayerAdmin: () => {
        // do nothing
    },
    permission: false,
    setPermissionGranted: () => {
        // do nothing
    },
    resetPlayer: () => {
        // do nothing
    },
})

const PlayerContextProvider: React.FunctionComponent = ({ children }) => {
    const [obstacle, setObstacle] = React.useState<undefined | OBSTACLES>(undefined)
    const [playerFinished, setPlayerFinished] = React.useState<boolean>(false)
    const [playerRank, setPlayerRank] = React.useState<undefined | number>(undefined)
    const [isPlayerAdmin, setIsPlayerAdmin] = React.useState<boolean>(false)
    const [permission, setPermissionGranted] = React.useState<boolean>(false)
    const history = useHistory()

    const content = {
        obstacle,
        setObstacle: (val: undefined | OBSTACLES) => {
            setObstacle(val)
            if (val) {
                history.push('/controller/game1-obstacle')
            } else {
                history.push('/controller/game1')
            }
        },
        playerFinished,
        setPlayerFinished: (val: boolean) => {
            setPlayerFinished(val)
            history.push('/controller/finished')
        },
        playerRank,
        setPlayerRank,
        isPlayerAdmin,
        setIsPlayerAdmin,
        permission,
        setPermissionGranted,
        resetPlayer: () => {
            setPlayerFinished(false), setPlayerRank(undefined)
        },
    }
    return <PlayerContext.Provider value={content}>{children}</PlayerContext.Provider>
}

export default PlayerContextProvider
