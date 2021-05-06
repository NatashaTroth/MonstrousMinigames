export enum Obstacles {
    treeStump = 'TreeStump',
    spider = 'Spider',
}

export enum ObstacleRoutes {
    treeStump = 'treestump',
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
    obstacle = 'game1/obstacle',
    playerFinished = 'game1/playerFinished',
    started = 'game1/hasStarted',
    pauseResume = 'pauseResume',
    stopGame = 'stopGame',
    gameState = 'game1/gameState',
    error = 'error',
}

export const localDevelopment = false;
