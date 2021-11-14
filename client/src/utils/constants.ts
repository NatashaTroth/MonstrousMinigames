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

export enum MessageTypesGame2 {
    runForward = 'game2/runForward',
    phaserLoaded = 'game2/phaserGameLoaded',
    phaserLoadingTimedOut = 'game2/phaserLoadingTimedOut',
    allScreensSheepGameLoaded = 'game2/allScreensPhaserGameLoaded',
    startSheepGame = 'game2/startPhaserGame',
    initialGameState = 'game2/initialGameState',
    gameState = 'game2/gameState',
    movePlayer = 'game2/move',
    killSheep = 'game2/kill',
}

export const enum MessageTypesGame3 {
    newPhotoTopic = 'game3/newPhotoTopic',
    initialGameState = 'game3/initialGameState',
    photo = 'game3/photo',
    voteForPhotos = 'game3/voteForPhotos',
    photoVote = 'game3/photoVote',
    newRound = 'game3/newRound',
    finalRoundCountdown = 'game3/takeFinalPhotosCountdown',
    votingResults = 'game3/photoVotingResults',
    voteForFinalPhots = 'game3/voteForFinalPhotos',
    finalResults = 'game3/finalResults',
    presentFinalPhotos = 'game3/presentFinalPhotos',
}

export const localDevelopment = false; //the one in constants.ts on the server
export const designDevelopment = false; //so that phaser game doesn't start, but loads
export const stunnedAnimation = false; //renders stunned animation every so often

export const localBackend = 'http://localhost:5000/';
