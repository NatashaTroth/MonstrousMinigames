import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { WrongUserIdError } from '../../../../src/gameplay/customErrors';
import { leaderboard, roomId } from '../../mockData';
import { clearTimersAndIntervals, startGameAndAdvanceCountdown } from '../gameOneHelperFunctions';
import { runForwardMessage } from '../gameOneMockData';

let gameOne: GameOne;
const USER_ID_THAT_DOES_NOT_EXIST = '50';

describe('WrongUserIdError handling tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        startGameAndAdvanceCountdown(gameOne);
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('the WrongUserIdError has a userId property', async () => {
        try {
            gameOne.receiveInput({ ...runForwardMessage, userId: USER_ID_THAT_DOES_NOT_EXIST });
        } catch (e: any) {
            expect(e.userId).toBe(USER_ID_THAT_DOES_NOT_EXIST);
        }
    });

    it('throws a WrongUserIdError when trying to disconnect a user who does not exist', async () => {
        expect(() => gameOne.disconnectPlayer(USER_ID_THAT_DOES_NOT_EXIST)).toThrow(WrongUserIdError);
    });
});
