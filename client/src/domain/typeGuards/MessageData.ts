import { AllScreensPhaserGameLoadedMessage } from './allScreensPhaserGameLoaded';
import { ApproachingSolvableObstacleOnceMessage } from './approachingSolvableObstacleOnceTypeGuard';
import { ApproachingSolvableObstacleMessage } from './approachingSolvableObstacleTypeGuard';
import { ChasersPushedMessage } from './chasersPushed';
import { ConnectedUsersMessage } from './connectedUsers';
import { ErrorMessage } from './error';
import { ExceededMaxChaserPushesMessage } from './exceededMaxChaserPushes';
import { GameHasFinishedMessage } from './finished';
import { GameStateInfoMessage } from './gameStateInfo';
import { InitialGameStateInfoMessage } from './initialGameStateInfo';
import { ObstacleMessage } from './obstacle';
import { ObstacleSkippedMessage } from './obstacleSkipped';
import { GameHasPausedMessage } from './paused';
import { PhaserLoadingTimedOutMessage } from './phaserLoadingTimedOut';
import { PlayerDiedMessage } from './playerDied';
import { PlayerFinishedMessage } from './playerFinished';
import { PlayerStunnedMessage } from './playerStunned';
import { PlayerUnstunnedMessage } from './playerUnstunned';
import { GameHasResetMessage } from './reset';
import { GameHasResumedMessage } from './resumed';
import { ScreenAdminMessage } from './screenAdmin';
import { ScreenStateMessage } from './screenState';
import { GameHasStartedMessage } from './started';
import { StartPhaserGameMessage } from './startPhaserGame';
import { GameHasStoppedMessage } from './stopped';
import { UserInitMessage } from './userInit';

export type MessageData =
    | UserInitMessage
    | ObstacleMessage
    | ObstacleSkippedMessage
    | GameHasFinishedMessage
    | ErrorMessage
    | PlayerFinishedMessage
    | GameHasPausedMessage
    | StartPhaserGameMessage
    | AllScreensPhaserGameLoadedMessage
    | PhaserLoadingTimedOutMessage
    | GameHasStartedMessage
    | GameHasResumedMessage
    | GameHasStoppedMessage
    | GameHasResetMessage
    | ConnectedUsersMessage
    | GameHasFinishedMessage
    | InitialGameStateInfoMessage
    | GameStateInfoMessage
    | ScreenAdminMessage
    | ConnectedUsersMessage
    | PlayerDiedMessage
    | PlayerStunnedMessage
    | PlayerUnstunnedMessage
    | ApproachingSolvableObstacleMessage
    | ApproachingSolvableObstacleOnceMessage
    | ScreenStateMessage
    | ExceededMaxChaserPushesMessage
    | ChasersPushedMessage
    | undefined;
