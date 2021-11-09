interface GameEventInterface {
    roomId: string;
}

export interface ObstacleReachedInfo extends GameEventInterface {
    userId: string;
    obstacleId: number;
}
