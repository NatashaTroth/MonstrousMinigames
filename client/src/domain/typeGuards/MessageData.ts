import { ConnectedUsersMessage } from './connectedUsers';
import { ErrorMessage } from './error';
import { GameHasFinishedMessage } from './finished';
import { GameStateInfoMessage } from './gameStateInfo';
import { ObstacleMessage } from './obstacle';
import { GameHasPausedMessage } from './paused';
import { PlayerDiedMessage } from './playerDied';
import { PlayerFinishedMessage } from './playerFinished';
import { PlayerStunnedMessage } from './playerStunned';
import { GameHasResetMessage } from './reset';
import { GameHasResumedMessage } from './resumed';
import { ScreenAdminMessage } from './screenAdmin';
import { GameHasStartedMessage } from './started';
import { StartPhaserGameMessage } from './startPhaserGame';
import { GameHasStoppedMessage } from './stopped';
import { UserInitMessage } from './userInit';

export type MessageData =
    | UserInitMessage
    | ObstacleMessage
    | GameHasFinishedMessage
    | ErrorMessage
    | PlayerFinishedMessage
    | GameHasPausedMessage
    | StartPhaserGameMessage
    | GameHasStartedMessage
    | GameHasResumedMessage
    | GameHasStoppedMessage
    | GameHasResetMessage
    | ConnectedUsersMessage
    | GameHasFinishedMessage
    | GameStateInfoMessage
    | ScreenAdminMessage
    | ConnectedUsersMessage
    | PlayerDiedMessage
    | PlayerStunnedMessage
    | undefined;
