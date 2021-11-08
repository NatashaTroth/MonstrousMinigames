import { ScreenStates } from '../../config/screenStates';
import { ScreenStateMessage, screenStateTypeGuard } from '../../domain/typeGuards/screenState';
import { MessageTypes } from '../../utils/constants';

describe('paused TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: ScreenStateMessage = {
            type: MessageTypes.screenState,
            state: ScreenStates.getReady,
        };

        expect(screenStateTypeGuard(data)).toEqual(true);
    });
});
