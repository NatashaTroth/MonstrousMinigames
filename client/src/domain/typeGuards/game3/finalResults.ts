import { MessageTypesGame3 } from '../../../utils/constants';
import { MessageDataGame3 } from './MessageDataGame3';

export interface Result {
    photographerId: string;
    points: number;
    rank: number;
}

export interface FinalResultsMessage {
    type: MessageTypesGame3.finalResults;
    roomId: string;
    results: Result[];
}

export const finalResultsTypeGuard = (data: MessageDataGame3): data is FinalResultsMessage => {
    return (data as FinalResultsMessage).type === MessageTypesGame3.finalResults;
};
