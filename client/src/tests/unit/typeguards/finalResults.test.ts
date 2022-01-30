import { FinalResultsMessage, finalResultsTypeGuard } from '../../../domain/typeGuards/game3/finalResults';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('finalResults TypeGuard', () => {
    it('when type is finalResults, it should return true', () => {
        const data: FinalResultsMessage = {
            type: MessageTypesGame3.finalResults,
            roomId: 'ADFS',
            results: [],
        };

        expect(finalResultsTypeGuard(data)).toEqual(true);
    });
});
