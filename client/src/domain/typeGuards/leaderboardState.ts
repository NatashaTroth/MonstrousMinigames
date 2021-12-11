import { LeaderboardState } from '../../contexts/ScreenSocketContextProvider';
import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface LeaderboardStateMessage {
    type: MessageTypes.leaderboardState;
    leaderboardState: LeaderboardState;
}

export const leaderboardStateTypeGuard = (data: MessageData): data is LeaderboardStateMessage =>
    (data as LeaderboardStateMessage).type === MessageTypes.leaderboardState;
