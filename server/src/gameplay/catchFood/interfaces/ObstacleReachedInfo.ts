import { ObstacleType } from './ObstacleType';

interface GameEventInterface {
    roomId: string
}

export interface ObstacleReachedInfo extends GameEventInterface {
    roomId: string
    userId: string
    obstacleType: ObstacleType
    obstacleId: number
}
