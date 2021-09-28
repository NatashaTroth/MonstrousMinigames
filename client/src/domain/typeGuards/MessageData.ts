import { ConnectedUsersMessage } from './connectedUsers';
import { ErrorMessage } from './error';
import { GameHasFinishedMessage } from './finished';
import { AllScreensPhaserGameLoadedMessage } from './game1/allScreensPhaserGameLoaded';
import { ApproachingSolvableObstacleMessage } from './game1/approachingSolvableObstacleTypeGuard';
import { ChasersPushedMessage } from './game1/chasersPushed';
import { ExceededMaxChaserPushesMessage } from './game1/exceededMaxChaserPushes';
import { GameStateInfoMessage } from './game1/gameStateInfo';
import { InitialGameStateInfoMessage } from './game1/initialGameStateInfo';
import { ObstacleMessage } from './game1/obstacle';
import { ObstacleSkippedMessage } from './game1/obstacleSkipped';
import { PhaserLoadingTimedOutMessage } from './game1/phaserLoadingTimedOut';
import { PlayerDiedMessage } from './game1/playerDied';
import { PlayerFinishedMessage } from './game1/playerFinished';
import { PlayerStunnedMessage } from './game1/playerStunned';
import { PlayerUnstunnedMessage } from './game1/playerUnstunned';
import { GameHasStartedMessage } from './game1/started';
import { GameHasPausedMessage } from './paused';
import { GameHasResetMessage } from './reset';
import { GameHasResumedMessage } from './resumed';
import { ScreenAdminMessage } from './screenAdmin';
import { ScreenStateMessage } from './screenState';
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
    | ScreenStateMessage
    | ExceededMaxChaserPushesMessage
    | ChasersPushedMessage
    | undefined;
