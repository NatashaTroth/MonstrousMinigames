export enum OBSTACLES {
    treeStump = 'TREE-STUMP',
}

export enum GAMESTATE {
    created = 'CREATED',
    started = 'STARTED',
    stopped = 'STOPPED',
    finished = 'FINISHED',
}

export enum TOUCHEVENT {
    panLeft = 'panleft',
    panRight = 'panright',
}

export enum MESSAGETYPES {
    userInit = 'userInit',
    connectedUsers = 'connectedUsers',
    backToLobby = 'backToLobby',
    gameHasFinished = 'gameHasFinished',
    gameHasReset = 'gameHasReset',
    gameHasStopped = 'gameHasStopped',
    gameHasTimedOut = 'gameHasTimedOut',
    gameHasPaused = 'gameHasPaused',
    gameHasResumed = 'gameHasResumed',
    pauseResume = 'pauseResume',
    stopGame = 'stopGame',
}

export const localDevelopment = true;
