import { ErrorMessage } from './error';
import { GameHasFinishedMessage } from './finished';
import { AllScreensSheepGameLoadedMessage } from './game2/allScreensSheepGameLoaded';
import { ChooseResponseMessage } from './game2/chooseResponse';
import { GameStateInfoMessage } from './game2/gameStateInfo';
import { GuessHintMessage } from './game2/guessHint';
import { InitialGameStateInfoMessage } from './game2/initialGameStateInfo';
import { PhaseChangedMessage } from './game2/phaseChanged';
import { PhaserLoadingTimedOutMessage } from './game2/phaserLoadingTimedOut';
import { PlayerRanksMessage } from './game2/playerRanks';
import { RemainingKillsMessage } from './game2/remainingKills';
import { SheepGameHasStartedMessage } from './game2/started';
import { GameHasPausedMessage } from './paused';
import { GameHasResetMessage } from './reset';
import { GameHasResumedMessage } from './resumed';
import { ScreenAdminMessage } from './screenAdmin';
import { ScreenStateMessage } from './screenState';
import { StartSheepGameMessage } from './startSheepGame';
import { GameHasStoppedMessage } from './stopped';

export type MessageDataGame2 =
    | GameHasFinishedMessage
    | ErrorMessage
    | GameHasPausedMessage
    | StartSheepGameMessage
    | AllScreensSheepGameLoadedMessage
    | GameHasResumedMessage
    | GameHasStoppedMessage
    | GameHasResetMessage
    | GameHasFinishedMessage
    | InitialGameStateInfoMessage
    | GameStateInfoMessage
    | ScreenAdminMessage
    | ScreenStateMessage
    | PhaserLoadingTimedOutMessage
    | SheepGameHasStartedMessage
    | PhaseChangedMessage
    | PlayerRanksMessage
    | GuessHintMessage
    | ChooseResponseMessage
    | RemainingKillsMessage
    | undefined;
