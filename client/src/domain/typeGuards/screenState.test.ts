import { ScreenStates } from '../../config/screenStates';
import { MessageTypes } from '../../utils/constants';
import { ScreenStateMessage, screenStateTypeGuard } from './screenState';

describe('paused TypeGuard', () => {
    it('when type is paused, it should return true', () => {
        const data: ScreenStateMessage = {
            type: MessageTypes.screenState,
            state: ScreenStates.getReady,
        };

        expect(screenStateTypeGuard(data)).toEqual(true);
    });
});
