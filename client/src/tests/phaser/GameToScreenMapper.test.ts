// eslint-disable-next-line simple-import-sort/imports
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';
import { GameToScreenMapper } from '../../domain/phaser/game1/GameToScreenMapper';

afterEach(cleanup);

describe('GameToScreenMapper Game1', () => {
    it('handleStartGame should emit startGame to socket', () => {
        const mapper = new GameToScreenMapper(10, 500);
        // (result should be value * (1/x) * center --> 25 * value

        expect(mapper.mapGameMeasurementToScreen(200)).toEqual(5000);
    });
});
