export enum Obstacles {
    treeStump = 'TREE-STUMP',
    spider = 'SPIDER',
}

export enum ObstacleRoutes {
    treeStump = 'tree_stump',
    spider = 'spider',
}

export enum GameState {
    created = 'CREATED',
    started = 'STARTED',
    stopped = 'STOPPED',
    finished = 'FINISHED',
}

export enum TouchEvent {
    panLeft = 'panleft',
    panRight = 'panright',
}

export enum MessageTypes {
    userInit = 'userInit',
    connectedUsers = 'connectedUsers',
    backToLobby = 'backToLobby',
    gameHasFinished = 'gameHasFinished',
    gameHasReset = 'gameHasReset',
    gameHasStopped = 'gameHasStopped',
    gameHasTimedOut = 'gameHasTimedOut',
    gameHasPaused = 'gameHasPaused',
    gameHasResumed = 'gameHasResumed',
}

export const localDevelopment = false;
