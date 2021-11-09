export enum GameOneMsgType {
    CREATE = 'game1/create',
    // INITIAL_GAME_STATE_INFO = 'game1/initialGameState',
    PHASER_GAME_LOADED = 'game1/phaserGameLoaded',
    PHASER_LOADING_TIMED_OUT = 'game1/phaserLoadingTimedOut',
    ALL_SCREENS_PHASER_GAME_LOADED = 'game1/allScreensPhaserGameLoaded',
    START_PHASER_GAME = 'game1/startPhaserGame',
    MOVE = 'game1/runForward',
    GAME_STATE = 'game1/gameState',
    OBSTACLE_SOLVED = 'game1/obstacleSolved',
    SOLVE_OBSTACLE = 'game1/solveObstacle',
    CHASERS_WERE_PUSHED = 'game1/chasersPushed',
    // PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES = 'game1/playerHasExceededMaxNumberChaserPushes',
    PLAYER_UNSTUNNED = 'game1/playerUnstunned',
    STUN_PLAYER = 'game1/stunPlayer',
    CREATE = "CREATE"
}
