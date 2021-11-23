import { ScreenStates } from '../../config/screenStates';
import { ScreenStateMessage, screenStateTypeGuard } from '../../domain/typeGuards/screenState';
import { MessageTypes } from '../../utils/constants';

describe('screenState TypeGuard', () => {
    it('when type is screenState, it should return true', () => {
        const data: ScreenStateMessage = {
            type: MessageTypes.screenState,
            state: ScreenStates.getReady,
        };

        expect(screenStateTypeGuard(data)).toEqual(true);
    });
});
