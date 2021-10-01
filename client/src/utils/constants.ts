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
    screenState = 'screenState',

    gameHasStarted = 'gameHasStarted',
    gameHasFinished = 'gameHasFinished',
    gameHasReset = 'gameHasReset',
    gameHasStopped = 'gameHasStopped',
    gameHasPaused = 'gameHasPaused',
    gameHasResumed = 'gameHasResumed',

    chooseGame = 'chooseGame',
    gameSet = 'gameSet',
    createGame = 'createGame',

    pauseResume = 'pauseResume',
    startGame = 'startGame',
    stopGame = 'stopGame',

    error = 'error',
}

export enum MessageTypesGame1 {
    runForward = 'game1/runForward',
    obstacle = 'game1/obstacle', //obstacle reached
    obstacleSkipped = 'game1/obstacleSkipped',
    obstacleWillBeSolved = 'game1/obstacleWillBeSolved',
    obstacleSolved = 'game1/obstacleSolved',
    playerFinished = 'game1/playerFinished',
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
    chasersPushed = 'game1/chasersPushed',

    pushChasers = 'game1/chasersPushed',
    exceededNumberOfChaserPushes = 'game1/playerHasExceededMaxNumberChaserPushes',
    approachingSolvableObstacle = 'game1/approachingSolvableObstacle',
    approachingSolvableObstacleOnce = 'game1/approachingSolvableObstacleOnce',
    solveObstacle = 'game1/solveObstacle',
    stunnablePlayers = 'game1/stunnablePlayers',
}

export const localDevelopment = false; //the one in constants.ts on the server
export const designDevelopment = false; //so that phaser game doesn't start, but loads

export const localBackend = 'http://localhost:5000/';
