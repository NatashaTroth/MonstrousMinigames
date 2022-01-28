export enum MessageTypes {
    USER_INIT = 'userInit',
    USER_READY = 'userReady',
    CONNECTED_USERS = 'connectedUsers',
    BACK_TO_LOBBY = 'backToLobby',
    PAUSE_RESUME = 'pauseResume',
    START = 'startGame',
    STOP_GAME = 'stopGame',
    // PHASER_LOADED = 'phaserLoaded',
    GAME_HAS_RESET = 'gameHasReset',
    GAME_HAS_STOPPED = 'gameHasStopped',
    GAME_HAS_FINISHED = 'gameHasFinished',
    GAME_HAS_PAUSED = 'gameHasPaused',
    GAME_HAS_RESUMED = 'gameHasResumed',
    ERROR = 'error',
    SCREEN_ADMIN = 'screenAdmin',
    SELECT_CHARACTER = 'selectCharacter',
    PLAYER_HAS_DISCONNECTED = 'playerHasDisconnected',
    PLAYER_HAS_RECONNECTED = 'playerHasReconnected',
    SCREEN_STATE = 'screenState',
    CHOOSE_GAME = 'chooseGame',
    GAME_SET = 'gameSet',
    CREATE = 'createGame',
    LEADERBOARD_STATE = 'leaderboardState',
}
