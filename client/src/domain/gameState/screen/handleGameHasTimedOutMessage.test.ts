import { handleGameHasTimedOutMessage } from './handleGameHasTimedOutMessage';

describe('handleGameHasTimedOutMessage', () => {
    it('when message type is gameHasTimedOut, handed setHasTimedOut should be called with true', () => {
        const setHasTimedOut = jest.fn();

        handleGameHasTimedOutMessage({ dependencies: { setHasTimedOut } });

        expect(setHasTimedOut).toHaveBeenLastCalledWith(true);
    });
});
