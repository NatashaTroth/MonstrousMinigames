export enum Obstacles {
    treeStump = 'TreeStump',
    spider = 'Spider',
    hole = 'Hole',
    stone = 'Stone',
}

export enum ObstacleRoutes {
    treeStump = 'treestump',
    spider = 'spider',
    hole = 'hole',
    stone = 'stone',
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
    screenAdmin = 'screenAdmin',
    selectCharacter = 'selectCharacter',
    userReady = 'userReady',

    gameHasFinished = 'gameHasFinished',
    gameHasReset = 'gameHasReset',
    gameHasStopped = 'gameHasStopped',
    gameHasTimedOut = 'gameHasTimedOut',
    gameHasPaused = 'gameHasPaused',
    gameHasResumed = 'gameHasResumed',

    pauseResume = 'pauseResume',
    stopGame = 'stopGame',

    error = 'error',

    runForward = 'game1/runForward',
    obstacle = 'game1/obstacle', //obstacle reached
    playerFinished = 'game1/playerFinished',
    started = 'game1/hasStarted',
    gameState = 'game1/gameState',
    playerDied = 'game1/playerDied',
    playerStunned = 'game1/playerStunned',
}

export const localDevelopment = false; //the one in constants.ts on the server

export const localBackend = 'http://localhost:5000/';
