export enum GameEventTypes {
    InitialGameStateInfoUpdate = 'INITIAL_GAME_STATE_INFO_UPDATE',
    GameHasStarted = 'GAME_HAS_STARTED',
    GameHasPaused = 'GAME_HAS_PAUSED',
    GameHasResumed = 'GAME_HAS_RESUMED',
    GameHasStopped = 'GAME_HAS_STOPPED',
    GameHasFinished = 'GAME_HAS_FINISHED',
    PlayerHasDisconnected = 'PLAYER_HAS_DISCONNECTED',
    PlayerHasReconnected = 'PLAYER_HAS_RECONNECTED',

    ObstacleReached = 'OBSTACLE_REACHED',
    ApproachingSkippableObstacle = 'APPROACHING_SKIPPABLE_OBSTACLE',
    PlayerHasFinished = 'PLAYER_HAS_FINISHED',
    PlayerIsDead = 'PLAYER_IS_DEAD',
    PlayerIsStunned = 'PLAYER_IS_STUNNED',
    ChasersWerePushed = 'CHASERS_WERE_PUSHED',
    PlayerIsUnstunned = 'PLAYER_IS_UNSTUNNED',
}
