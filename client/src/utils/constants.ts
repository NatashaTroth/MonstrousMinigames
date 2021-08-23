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
    sendScreenState = 'sendScreenState',

    gameHasFinished = 'gameHasFinished',
    gameHasReset = 'gameHasReset',
    gameHasStopped = 'gameHasStopped',
    gameHasPaused = 'gameHasPaused',
    gameHasResumed = 'gameHasResumed',

    pauseResume = 'pauseResume',
    startGame = 'startGame',
    stopGame = 'stopGame',

    error = 'error',

    runForward = 'game1/runForward',
    obstacle = 'game1/obstacle', //obstacle reached
    playerFinished = 'game1/playerFinished',
    started = 'game1/hasStarted',
    startPhaserGame = 'game1/startPhaserGame',
    gameState = 'game1/gameState',
    playerDied = 'game1/playerDied',
    playerStunned = 'game1/playerStunned',
    playerUnstunned = 'game1/playerUnstunned',
}

export const localDevelopment = true; //the one in constants.ts on the server

export const localBackend = 'http://localhost:5000/';
