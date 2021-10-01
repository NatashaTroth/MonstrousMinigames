import { ConnectedUsersMessage } from './connectedUsers';
import { ErrorMessage } from './error';
import { GameHasFinishedMessage } from './finished';
import { AllScreensSheepGameLoadedMessage } from './game2/allScreensSheepGameLoaded';
import { GameStateInfoMessage } from './game2/gameStateInfo';
import { InitialGameStateInfoMessage } from './game2/initialGameStateInfo';
import { PhaserLoadingTimedOutMessage } from './game2/phaserLoadingTimedOut';
import { SheepGameHasStartedMessage } from './game2/started';
import { GameHasPausedMessage } from './paused';
import { GameHasResetMessage } from './reset';
import { GameHasResumedMessage } from './resumed';
import { ScreenAdminMessage } from './screenAdmin';
import { ScreenStateMessage } from './screenState';
import { StartSheepGameMessage } from './startSheepGame';
import { GameHasStoppedMessage } from './stopped';
import { UserInitMessage } from './userInit';

export type MessageDataGame2 =
    | UserInitMessage
    | GameHasFinishedMessage
    | ErrorMessage
    | GameHasPausedMessage
    | StartSheepGameMessage
    | AllScreensSheepGameLoadedMessage
    | GameHasResumedMessage
    | GameHasStoppedMessage
    | GameHasResetMessage
    | ConnectedUsersMessage
    | GameHasFinishedMessage
    | InitialGameStateInfoMessage
    | GameStateInfoMessage
    | ScreenAdminMessage
    | ConnectedUsersMessage
    | ScreenStateMessage
    | PhaserLoadingTimedOutMessage
    | SheepGameHasStartedMessage
    | undefined;
