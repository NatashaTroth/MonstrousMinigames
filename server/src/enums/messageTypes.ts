export enum MessageTypes {
    USER_INIT = 'userInit',
    CONNECTED_USERS = 'connectedUsers',
    BACK_TO_LOBBY = 'backToLobby',
    PAUSE_RESUME = 'pauseResume',
    STOP_GAME = 'stopGame',
    GAME_HAS_RESET = 'gameHasReset',
    GAME_HAS_STOPPED = 'gameHasStopped',
    GAME_HAS_TIMED_OUT = 'gameHasTimedOut',
    GAME_HAS_FINISHED = 'gameHasFinished',
    GAME_HAS_PAUSED = 'gameHasPaused',
    GAME_HAS_RESUMED = 'gameHasResumed',
    ERROR = 'error',
}
