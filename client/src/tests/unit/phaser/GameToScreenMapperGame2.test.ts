// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';

import { GameToScreenMapper } from '../../../domain/phaser/game2/GameToScreenMapper';

afterEach(cleanup);

describe('GameToScreenMapper Game2', () => {
    it('should calculate the right mapped Game Height', () => {
        const gameWidth = 100;
        const windowWidth = 100;
        const gameHeight = 100;
        const windowHeight = 100;
        const mapper = new GameToScreenMapper(gameWidth, windowWidth, gameHeight, windowHeight);

        const paddingX = 30;
        const result = gameHeight * ((1 / gameWidth) * (windowWidth - paddingX * 2));

        expect(mapper.getMappedGameHeight()).toEqual(result);
    });
});
