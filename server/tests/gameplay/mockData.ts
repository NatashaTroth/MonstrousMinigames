import User from '../../src/classes/user';
import Leaderboard from '../../src/gameplay/leaderboard/Leaderboard';

// public id: string;
// public roomId: string;
// public socketId: string;
// public name: string;
// public timestamp: number;
// public active: boolean;
// public number: number;
// constructor(roomId: string, socketId: string, name: string, id: string = shortid.generate(), number = 0)

export const users: Array<User> = [
    new User('xxx', 'iii', 'Harry', '1'),
    new User('xxx', 'iii', 'Ron', '2'),
    new User('xxx', 'iii', 'James', '3'),
    new User('xxx', 'iii', 'Luna', '4'),
];

export const roomId = 'xxx';

export const leaderboard = new Leaderboard(roomId);
