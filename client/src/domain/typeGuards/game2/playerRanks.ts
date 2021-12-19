import { PlayerRank } from '../../../contexts/game2/Game2ContextProvider';
import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface PlayerRanksMessage {
    type: MessageTypesGame2.playerRanks;
    roomId: string;
    playerRanks: PlayerRank[];
}

export const playerRanksTypeGuard = (data: MessageDataGame2): data is PlayerRanksMessage =>
    (data as PlayerRanksMessage).type === MessageTypesGame2.playerRanks;
