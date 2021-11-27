import 'reflect-metadata';

import GameThreePlayer from '../../../../src/gameplay/gameThree/GameThreePlayer';
import { users } from '../../mockData';

let player: GameThreePlayer;
const user = users[0];

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
});
