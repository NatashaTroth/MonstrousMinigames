import 'reflect-metadata';

import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import GameThreePlayer from '../../../../src/gameplay/gameThree/GameThreePlayer';
import { users } from '../../mockData';

let player: GameThreePlayer;
const user = users[0];
const mockPhotoUrl = 'https://mockPhoto.com';
const roundIdx = 0;
const points = 5;

describe('Constructor', () => {
    beforeEach(() => {
        player = new GameThreePlayer(user.id, user.name, user.characterNumber);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set id', async () => {
        expect(player.id).toBe(user.id);
    });

    it('should set name', async () => {
        expect(player.name).toBe(user.name);
    });

    it('should set characterNumber', async () => {
        expect(player.characterNumber).toBe(user.characterNumber);
    });

    it('should initiate roundInfo', async () => {
        expect(player.roundInfo.length).toBe(InitialParameters.NUMBER_ROUNDS - 1);
    });

    it('should fill roundInfo with default values', async () => {
        expect(player.roundInfo[0]).toMatchObject({
            url: '',
            received: false,
            points: 0,
            voted: false,
        });
    });
});

describe('Received photo', () => {
    beforeEach(() => {
        player = new GameThreePlayer(user.id, user.name, user.characterNumber);
        player.receivedPhoto(mockPhotoUrl, roundIdx);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set url', async () => {
        expect(player.roundInfo[roundIdx].url).toBe(mockPhotoUrl);
    });

    it('should set received to true', async () => {
        expect(player.roundInfo[roundIdx].received).toBe(true);
    });
});

describe('Add points', () => {
    beforeEach(() => {
        player = new GameThreePlayer(user.id, user.name, user.characterNumber);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add points to roundIdx', async () => {
        const initialPoints = player.roundInfo[roundIdx].points;
        player.addPoints(roundIdx, points);
        expect(player.roundInfo[roundIdx].points).toBe(initialPoints + points);
    });

    it('should add points only to roundIdx', async () => {
        const initialPoints = player.roundInfo[roundIdx].points;
        player.addPoints(roundIdx, points);
        expect(player.roundInfo[roundIdx + 1].points).toBe(initialPoints);
    });
});

describe('Get total points', () => {
    beforeEach(() => {
        player = new GameThreePlayer(user.id, user.name, user.characterNumber);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return total number of points from one round', async () => {
        const initialPoints = player.roundInfo[roundIdx].points;
        player.addPoints(roundIdx, points);
        expect(player.getTotalPoints()).toBe(initialPoints + points);
    });

    it('should return total number of points from multiple rounds', async () => {
        let totalPoints = 0;
        for (let i = 0; i < player.roundInfo.length - 1; i++) {
            player.roundInfo[i].points = i * 5;
            totalPoints += i * 5;
        }

        expect(player.getTotalPoints()).toBe(totalPoints);
    });
});
