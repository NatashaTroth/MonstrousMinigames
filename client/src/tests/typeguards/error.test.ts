import { ErrorMessage, errorTypeGuard } from '../../domain/typeGuards/error';
import { MessageTypes } from '../../utils/constants';

describe('error TypeGuard', () => {
    it('when type is error, it should return true', () => {
        const data: ErrorMessage = {
            type: MessageTypes.error,
            name: 'Error',
        };

        expect(errorTypeGuard(data)).toEqual(true);
    });
});
