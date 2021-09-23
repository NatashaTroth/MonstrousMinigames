export enum ObstacleTypes {
    treeStump = 'TREE_STUMP',
    spider = 'SPIDER',
    trash = 'TRASH',
    stone = 'STONE',
}

export enum TrashType {
    Paper = 'PAPER',
    Food = 'FOOD',
    Plastic = 'PLASTIC',
}

export enum ObstacleRoutes {
    treeStump = 'treestump',
    spider = 'spider',
    trash = 'trash',
    stone = 'stone',
}

export enum GameState {
    created = 'CREATED',
    started = 'STARTED',
    stopped = 'STOPPED',
    finished = 'FINISHED',
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
    gameHasPaused = 'gameHasPaused',
    gameHasResumed = 'gameHasResumed',

    pauseResume = 'pauseResume',
    stopGame = 'stopGame',

    error = 'error',

    runForward = 'game1/runForward',
    obstacle = 'game1/obstacle', //obstacle reached
    obstacleSolved = 'game1/obstacleSolved',
    obstacleSkipped = 'game1/obstacleSkipped',
    playerFinished = 'game1/playerFinished',
    started = 'game1/hasStarted',
    phaserLoaded = 'game1/phaserGameLoaded',
    phaserLoadingTimedOut = 'game1/phaserLoadingTimedOut',
    allScreensPhaserGameLoaded = 'game1/allScreensPhaserGameLoaded',
    startPhaserGame = 'game1/startPhaserGame',
    initialGameState = 'game1/initialGameState',
    gameState = 'game1/gameState',
    playerDied = 'game1/playerDied',
    playerStunned = 'game1/playerStunned',
    playerUnstunned = 'game1/playerUnstunned',
    stunPlayer = 'game1/stunPlayer',

    createGame = 'game1/create',
    startGame = 'game1/start',
}

export const localDevelopment = false; //the one in constants.ts on the server
export const designDevelopment = false; //so that phaser game doesn't start, but loads

export const localBackend = 'http://localhost:5000/';
