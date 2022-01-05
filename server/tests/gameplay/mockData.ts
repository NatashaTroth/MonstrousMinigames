/* istanbul ignore file */
import User from '../../src/classes/user';
import InitialParameters from '../../src/gameplay/gameOne/constants/InitialParameters';
import Leaderboard from '../../src/gameplay/leaderboard/Leaderboard';
import { IMessage } from '../../src/interfaces/messages';

export const users: Array<User> = [
    new User('xxx', 'iii', 'Harry', 2, '1'),
    new User('xxx', 'iii', 'Ron', 1, '2'),
    new User('xxx', 'iii', 'James', 4, '3'),
    new User('xxx', 'iii', 'Luna', 3, '4'),
];

export const usersWithNumbers: Array<User> = [
    new User('xxx', 'iii', 'Harry', 2, '1', 1),
    new User('xxx', 'iii', 'Ron', 1, '2', 2),
    new User('xxx', 'iii', 'James', 4, '3', 3),
    new User('xxx', 'iii', 'Luna', 3, '4', 4),
];

export const roomId = 'xxx';

export const leaderboard = new Leaderboard(roomId);

export const mockMessage: IMessage = {
    type: 'test',
};

export const dateNow = 1618665766156;

export const trackLength = InitialParameters.TRACK_LENGTH;

export const mockPhotoUrl = 'https://mockPhoto.com';
