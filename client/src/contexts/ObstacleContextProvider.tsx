import * as React from 'react'
import { OBSTACLES } from '../utils/constants'

interface IObstacleContext {
    obstacle: undefined | OBSTACLES
    setObstacle: (val: OBSTACLES | undefined) => void
}

export const ObstacleContext = React.createContext<IObstacleContext>({
    obstacle: undefined,
    setObstacle: (val: OBSTACLES | undefined) => {
        // do nothing
    },
})

const ObstacleContextProvider: React.FunctionComponent = ({ children }) => {
    const [obstacle, setObstacle] = React.useState<undefined | OBSTACLES>(undefined)

    const content = {
        obstacle,
        setObstacle,
    }
    return <ObstacleContext.Provider value={content}>{children}</ObstacleContext.Provider>
}

export default ObstacleContextProvider
