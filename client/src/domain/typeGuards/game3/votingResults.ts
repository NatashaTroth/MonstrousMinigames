import { MessageTypesGame3 } from '../../../utils/constants';
import { MessageDataGame3 } from './MessageDataGame3';

export interface VotingResult {
    photographerId: string;
    points: number;
}

export interface VotingResultsMessage {
    type: MessageTypesGame3.votingResults;
    roomId: string;
    results: VotingResult[];
    countdownTime: number;
}

export const votingResultsTypeGuard = (data: MessageDataGame3): data is VotingResultsMessage => {
    return (data as VotingResultsMessage).type === MessageTypesGame3.votingResults;
};
