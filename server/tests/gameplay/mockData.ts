/* istanbul ignore file */
import User from '../../src/classes/user';
import Leaderboard from '../../src/gameplay/leaderboard/Leaderboard';
import { IMessage } from '../../src/interfaces/messages';

export const users: Array<User> = [
    new User('xxx', 'iii', 'Harry', 2, '1'),
    new User('xxx', 'iii', 'Ron', 1, '2'),
    new User('xxx', 'iii', 'James', 4, '3'),
    new User('xxx', 'iii', 'Luna', 3, '4'),
];

export const roomId = 'xxx';

export const leaderboard = new Leaderboard(roomId);

export const mockMessage: IMessage = {
    type: 'test',
};

export const dateNow = 1618665766156;
